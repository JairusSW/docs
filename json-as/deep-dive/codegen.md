# Generated Code & the Fast Path

The single most important thing about `json-as` is that it isn't a parser you call — it's a parser the compiler **writes for each of your types**. This page walks through what `@json` actually produces.

## The transform

`json-as` is an AssemblyScript [compiler transform](https://www.assemblyscript.org/compiler.html#transforms). When `asc` parses your code, the transform visits every `@json` class and splices generated methods straight into its AST before compilation continues:

- `__SERIALIZE` — used by `JSON.stringify`
- `__DESERIALIZE_FAST` / `__DESERIALIZE_SLOW` — used by `JSON.parse<T>`
- `__INITIALIZE` — sets up field defaults

Because this happens at build time against the concrete type, there's no runtime reflection, no field lookup by name, and no generic value tree to walk. Each type gets straight-line, monomorphized code. You can see it for yourself with [`JSON_WRITE`](../reference/customization#json-write).

## Serializing

`__SERIALIZE` writes directly into a shared output buffer (see [The Serialization Buffer](./buffer)). Structural text — `{`, the keys, `:`, `,`, `}` — is known at compile time, so it's emitted as **precomputed byte constants** (often a single packed `v128`/`u64` store per key) rather than character by character. Only the field *values* are computed at runtime.

So for `class Vec3 { x: f64; y: f64; z: f64 }`, the serializer is essentially: store the literal bytes `{"x":`, write `x`, store `,"y":`, write `y`, … — no formatting interpreter in sight.

## Deserializing: a tiered fast path

Parsing is where the interesting work is. `__DESERIALIZE_FAST` is built on the observation that **you already know the keys** — so you can match them by comparing whole packed words instead of scanning character by character.

### Tier 1 — the exact byte template

For minified input in canonical field order, tier 1 treats the expected text as a fixed template. Matching a key like `"id":` becomes one packed compare:

```ts ignore
// roughly what the transform emits for an `id` field at the start of an object
if (load<u64>(srcStart) != /* packed bytes of `{"id"` */) break; // bail to tier 2
srcStart += 10; // past `{"id":`
srcStart = __deserializeIntegerField<i32>(srcStart, srcEnd, dst, offsetof<this>("id"));
```

No per-character key scan, no hashing — just load, compare, advance. If any compare misses (a reordered key, whitespace, a missing field), tier 1 `break`s and the parse falls through to tier 2.

### Tier 2 — whitespace-tolerant

Pretty-printed JSON (spaces/newlines between tokens) breaks the packed template, so tier 2 re-matches the same packed key constants but calls `skipWhitespace` between every structural token. This keeps pretty input fast instead of collapsing to the general scanner — a meaningful win, since the entire object would otherwise drop to the slow path on a single stray space.

### The slow path

`__DESERIALIZE_SLOW` is the general, tolerant scanner: any key order, unknown keys, arbitrary whitespace. It's the correctness backstop the fast tiers fall through to.

## Chunking wide structs

The fast path is *unrolled* — one block of code per field. For a struct with a few hundred fields that becomes one enormous function, and the Binaryen optimizer can choke on a single function that large. So past a threshold the transform splits the per-field blocks across **chunk helper methods** (≈32 fields each); the main path calls them in order and bails the moment one signals a miss:

```ts ignore
// the main fast path just dispatches to chunks and bails on a 0 return
srcStart = this.__DESERIALIZE_FAST_chunk_0(srcStart, srcEnd, dst);
if (srcStart == 0) break;
srcStart = this.__DESERIALIZE_FAST_chunk_1(srcStart, srcEnd, dst);
if (srcStart == 0) break;
```

A pointer is never `0`, so it doubles as the bail sentinel. This keeps each generated function small enough to optimize, so the fast path stays available even on very wide schemas instead of degrading to the slow path.

## Turning the fast path off

It's on by default. [`JSON_USE_FAST_PATH=0`](../reference/customization#json-use-fast-path) emits only the slow path — smaller code, slower parse — when binary size matters more than throughput.
