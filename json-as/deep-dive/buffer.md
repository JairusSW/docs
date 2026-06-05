# The Serialization Buffer

`JSON.stringify` is allocation-light not by accident but by design: every serialize writes into one shared, reused byte buffer. This page explains how that buffer (`bs`) works and why round-tripping can hit **zero allocation** in steady state.

## One buffer, reused

There's a single module-level output buffer. `JSON.stringify` doesn't allocate a fresh string and append to it — it writes bytes into this buffer at a moving `offset`, then hands back a string view of the written region. Because the buffer persists across calls, the common case allocates nothing for the buffer itself; it only ever *grows*, never churns.

The structural bytes a serializer writes (keys, `{`, `,`) are compile-time constants emitted as packed stores — see [Generated Code](./codegen#serializing) — so the buffer just receives wide writes.

## Sizing: propose, then ensure

Two operations manage capacity:

- **`proposeSize(n)`** — called once at the top of a struct's serializer with a compile-time estimate of its output size, reserving roughly that much up front so most serializes never reallocate mid-write.
- **`ensureSize(n)`** — called before a write whose size isn't known until runtime (a string value, a lazy passthrough). If the buffer would overflow, it grows.

Growth is **geometric** (≈2×, with a minimum chunk), so a long serialize amortizes to a small constant number of reallocations rather than one per field. The estimate just keeps the common case off the growth path entirely.

::: tip A subtlety the estimate hides
Because the upfront estimate normally covers everything, fixed-size structural writes (keys, commas) can skip their own bounds check and rely on it. Code paths where the estimate *can't* be trusted — lazy passthrough, which copies an arbitrary slice — must `ensureSize` before the writes that follow, or a large value can overrun what the estimate reserved.
:::

## Reuse: zero-alloc round-trips

Both entry points take an optional target to write *into*:

- `JSON.stringify(value, out)` overwrites the existing `out` string in place (or `__renew`s it only when the length changes) instead of minting a new one.
- `JSON.parse<T>(data, out)` fills an existing object graph — nested structs threaded through as the destination, arrays keeping their capacity, strings renewed only when their byte length differs.

Run the same shape through a loop and, after the first iteration, both directions settle into reusing every allocation — the heap delta drops to **0**. This is what makes json-as suitable for hot encode/decode loops over a fixed schema.

## Deserialize avoids copies too

On the way in, the scanners work against the source string directly: a string field that contains no escapes is copied straight from the source into the field, skipping any scratch round-trip; only escaped strings take a decode detour through scratch space. (Lazy fields take this further — they don't copy at all until read; see [The Lazy Slot](./lazy-slot).)

## Adaptive shrinking

A buffer that grew for one giant payload would otherwise stay big forever. So it tracks a *typical* output size with an exponential moving average and periodically trims back toward it. You can also force it:

```ts
import { JSON } from "json-as";

JSON.stringify<i32[]>([1, 2, 3]);
JSON.Memory.shrink(); // hand oversized buffer capacity back
```

You rarely need to — it's never required for correctness, only to reclaim peak memory after an unusually large one-off serialize. See [Runtime Behavior](../reference/runtime-behavior#json-memory-shrink).
