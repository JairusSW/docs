# Runtime Behavior

A few internals worth knowing about — none are required for everyday use.

## The shared serialization buffer

`JSON.stringify` writes into a single shared, growable byte buffer (`bs`) to avoid intermediate concatenations, then returns an owning output string. Fresh serialization still allocates its result; eligible explicit output destinations can reuse storage. Do not treat the internal scratch buffer as public storage. This is why serialization is allocation-light: the buffer is reused across calls and only grows when an output needs more room.

Typed string fields receive their decoded values, including copies for unescaped strings. Dynamic values can retain source ranges instead. Lazy parsing of typed classes scans unused fields without saving those ranges.

## `JSON.internal`

`JSON.internal.stringify(...)` and `JSON.internal.parse(...)` are buffer-aware variants used **inside** custom serializers and deserializers. When your `@serializer` / `@deserializer` calls `JSON.stringify` / `JSON.parse`, the transform rewrites nested calls bound to the json-as runtime to the `internal` versions so they save and restore the outer operation's buffer state instead of corrupting it.

You normally don't call these directly — write plain `JSON.stringify` / `JSON.parse` in custom methods and let the transform route them. See [Custom Serialization](../guide/custom-serialization).

## `JSON.Memory.shrink()`

The buffer tracks a typical output size (an exponential moving average) and can grow large for an occasional big payload. If you've serialized something unusually large and want to hand that memory back, call:

```ts
import { JSON } from "json-as";

JSON.stringify<i32[]>([1, 2, 3]);
JSON.Memory.shrink(); // release buffer capacity back toward the typical size
```

It's a manual hint; you rarely need it, and never for correctness — only to trim peak memory after a one-off large serialize.
