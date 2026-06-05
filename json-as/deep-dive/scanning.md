# SWAR & SIMD Scanning

Under the [generated fast path](./codegen), the lowest-level hot loop is *scanning* — finding the next structurally-significant character: the closing `"` of a string, a `\` escape, the end of a number. Doing that one character at a time is the slow path. SWAR and SIMD do it many characters at a time, and that's where most of json-as's throughput comes from. [`JSON_MODE`](../reference/customization#json-mode) picks which one is generated.

## Everything is UTF-16

AssemblyScript strings are sequences of **16-bit code units**, not bytes. So every scanner works over `u16` *lanes*, not `u8` bytes — a detail that shapes both the SWAR magic constants and the choice of SIMD ops below.

## SWAR — 4 lanes per 64-bit word

SWAR ("SIMD Within A Register") finds a target code unit in a plain `u64` using only arithmetic. To locate a backslash (`0x5C`) in the four UTF-16 lanes of a word, json-as XORs the word with a broadcast of the target — zeroing any lane that matches — then runs the classic "is there a zero lane?" borrow trick:

```ts ignore
// 4 UTF-16 code units packed in one u64; find a lane == '\' (0x5C)
const b = block ^ 0x005c_005c_005c_005c; // matching lane becomes 0x0000
const mask = (b - 0x0001_0001_0001_0001) & ~b & 0x0080_0080_0080_0080;
// each matching lane now carries a 0x80 marker
```

Subtracting `1` from a lane only borrows across its boundary when the lane is already zero; `& ~b & 0x0080…` isolates that borrow per lane. A second mask guards against a `0x5C` landing in the *high* byte of a code unit, so only true low-byte matches count. No branches, four lanes checked at once.

## SIMD — 8 lanes per 128-bit vector

With `--enable simd`, the same idea uses real vector instructions over a `v128` of eight `u16` lanes. Compare-equal produces an all-ones lane per match, `bitmask` collapses that to one bit per lane, and `ctz` (count-trailing-zeros) gives the first match's position:

```ts ignore
const SPLAT_5C = i16x8.splat(0x5c); // broadcast '\'

const block = load<v128>(srcStart); // 8 code units
const mask = i16x8.bitmask(i16x8.eq(block, SPLAT_5C));
if (mask != 0) {
  const offset = ctz(mask) << 1; // first '\', ×2 (u16 -> bytes)
  // ...handle the escape at srcStart + offset
}
```

Eight code units per iteration, branch only when something is actually found.

## The HYBRID string copy

Deserializing a string is "copy from the source into the field, decoding escapes." json-as fuses the scan and the copy with a strategy tuned for the common case (few or no escapes):

- **Clean block** (no `\` in the 8 lanes) → store the whole `v128` to the output and advance 16 bytes. If the clean run continues, find its end with the same vector scan and `memory.copy` the entire remainder in one call — bandwidth-bound, not character-bound.
- **Escape block** → a single whole-`v128` store copies the plain prefix *for free* (it overshoots past the escape, into reserved slack), then the escape itself is decoded via a lookup table (`DESERIALIZE_ESCAPE_TABLE`) rather than a branch ladder.

```ts ignore
const mask = i16x8.bitmask(i16x8.eq(block, SPLAT_5C));
if (mask == 0) {
  store<v128>(bs.offset, block); // stream a clean block
  bs.offset += 16;
  // ...then bulk memory.copy the rest of the clean run
} else {
  store<v128>(bs.offset, block); // one store covers the plain prefix
  const laneIdx = ctz(mask) << 1; // ...decode the escape from a table
}
```

Those overshooting stores are why the string paths reserve a little extra room (`ensureSize(len + 16)`): a `v128` write near the end of the output may spill up to 15 bytes past the logical cursor, and the slack absorbs it. Serialization uses the same streaming-store idea in reverse, writing the value out in `v128`-sized chunks.

## Same result, three speeds

NAIVE, SWAR, and SIMD are bit-for-bit equivalent — they only differ in how many lanes they chew per step (1 / 4 / 8) and therefore in throughput and code size. That's the whole reason the mode is a build-time switch rather than three separate libraries.
