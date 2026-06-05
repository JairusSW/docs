# The Lazy Slot

[Lazy fields](../guide/lazy-fields) feel like ordinary fields, but under the hood each one is replaced by a cleverly-packed `u64` — a single word that encodes *three different states* without a separate flag. This page unpacks it.

## What a lazy field lowers to

When the transform sees `@lazy owner: Owner`, it removes the field and generates:

- a **slot** — `__owner_lz: u64` — the encoded state,
- a **memo** — `__owner_val: Owner | null` — where a materialized reference value is cached,
- a get/set accessor pair named `owner`, so your code still just writes `repo.owner`,

plus one shared **`__src: string`** per object — an anchor to the original source string (more on that below).

## Three states in one `u64`

The slot is read like a tagged union (a NaN-box, in spirit):

| Slot value | Meaning |
| --- | --- |
| `0` | **absent** — the key wasn't in the input; return the field's default |
| `u64.MAX_VALUE` | **materialized** — the value lives in the memo (`__owner_val`) |
| anything else | a **slice range**, packed as `(start << 32) | end` — byte offsets into `__src`, not yet parsed |

The trick that makes this unambiguous: `start` is a live heap pointer, which on wasm32 is never anywhere near 4 GB, so its high 32 bits can never be all-ones. That frees `u64.MAX_VALUE` (`0xFFFFFFFF_FFFFFFFF`) to mean "materialized" with zero chance of colliding with a real range.

## Reading: parse once, then cache

The generated getter is the whole lazy mechanism:

```ts ignore
get owner(): Owner {
  const lz = this.__owner_lz;
  if (lz != 0 && lz != u64.MAX_VALUE) {
    // first read of a range -> parse the slice once, flip to materialized
    this.__owner_val = JSON.__deserialize<Owner>(<usize>(lz >>> 32), <usize>(<u32>lz));
    this.__owner_lz = u64.MAX_VALUE;
  }
  return this.__owner_val as Owner; // (0 -> default lives here too)
}
```

So a field you never read is never parsed; a field you read once is parsed once and cached as `materialized`.

## Packed scalars: no memo at all

For a value that fits in 32 bits — `i8`–`i32`, `bool`, `f32` — there's no need for a separate memo field, because the value itself fits in the slot. These pack directly:

| Slot | Meaning |
| --- | --- |
| `0` | absent |
| high 32 == `0xFFFFFFFF` | **materialized scalar** — value sits in the low 32 bits |
| anything else | a slice range |

On first read the range is parsed and the result is re-packed into the slot's low half — so the memo field is elided entirely for these types.

## Serializing: zero-copy passthrough

Serialization branches on the same three states, which is why lazy is so fast for forwarding:

- **range** → `memory.copy` the original source bytes straight into the output (never parsed, never re-formatted),
- **materialized** → serialize the cached value normally,
- **absent** → emit the default (or `null`).

That passthrough is the heart of the proxy / filter / forward win: an untouched field round-trips as a raw byte copy.

## Why `__src` exists

The slice ranges are absolute pointers into the source string. If that string were collected while the object still held ranges, those pointers would dangle. So each lazy object keeps a `__src` reference to the source, set at parse time — the GC keeps the bytes alive exactly as long as some object might still need to materialize from them. It's the one ongoing cost of zero-copy, and the reason the [lazy-fields guide](../guide/lazy-fields#caveats) suggests dropping long-lived objects over huge payloads once you've read what you need.
