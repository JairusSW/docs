# Performance

These charts were refreshed on **9 November 2026** for the 2.0 release candidate on an **Apple M4 Max (ARM64)**. The measurements use the 2.0 candidate runtime and transform. Timing batches used the shared host lock; background activity and power audits were retained. Treat these as results for this machine, not an isolated-host guarantee.

The original AssemblyScript and JavaScript harnesses are retained. Built-in JavaScript appears first; SIMD and simdjson appear at the right. Charts with wide ranges use logarithmic scaling where needed: compare axis ticks, not just bar lengths. Select a chart to open its full-size SVG.

## Classic: JSON ↔ native structs

Deserialization parses JSON into native AssemblyScript model instances. The simdjson comparison materializes **owning C++ structs**, rather than stopping at a DOM or reusing a cached JSON string. Serialization starts with those native values and produces JSON text. The json-as compatibility runs have validation and the experimental string cache disabled.

<a href="/json-as/bench/v2.0.0/classic-payload-deserialize-v8.svg"><img src="/json-as/bench/v2.0.0/classic-payload-deserialize-v8.svg" alt="Classic native-struct deserialization, V8" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/classic-payload-serialize-v8.svg"><img src="/json-as/bench/v2.0.0/classic-payload-serialize-v8.svg" alt="Classic native-struct serialization, V8" loading="lazy" decoding="async"></a>

The separate paired deserialization qualification used five alternating process pairs and exact graph checks across 16 layouts. json-as ranged from **0.954× to 2.199×** owning-struct simdjson; all layouts cleared the 90% comparison gate, while several remain slightly below full parity.

| Twitter layout | json-as | simdjson owning structs | Ratio |
| --- | ---: | ---: | ---: |
| Minified | 2.420 GB/s | 1.332 GB/s | 1.817× |
| Pretty | 2.389 GB/s | 1.719 GB/s | 1.390× |

These paired numbers are a separate measurement from the chart harness. Do not mix their samples or compare them with lazy/dynamic forwarding as if all routes materialized the same objects.

<details>
<summary>Classic results under WAVM</summary>

<a href="/json-as/bench/v2.0.0/classic-payload-deserialize-wavm.svg"><img src="/json-as/bench/v2.0.0/classic-payload-deserialize-wavm.svg" alt="Classic deserialization, WAVM" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/classic-payload-serialize-wavm.svg"><img src="/json-as/bench/v2.0.0/classic-payload-serialize-wavm.svg" alt="Classic serialization, WAVM" loading="lazy" decoding="async"></a>

</details>

## Overview and library comparisons

<a href="/json-as/bench/v2.0.0/overview-serialize.svg"><img src="/json-as/bench/v2.0.0/overview-serialize.svg" alt="Overview serialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/overview-deserialize.svg"><img src="/json-as/bench/v2.0.0/overview-deserialize.svg" alt="Overview deserialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/library-serialize.svg"><img src="/json-as/bench/v2.0.0/library-serialize.svg" alt="Library serialization comparison" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/library-deserialize.svg"><img src="/json-as/bench/v2.0.0/library-deserialize.svg" alt="Library deserialization comparison" loading="lazy" decoding="async"></a>

The overview, library, and classic charts use different workloads. Read their labels before comparing throughput between charts.

## Strings and objects by size

<a href="/json-as/bench/v2.0.0/string-serialize.svg"><img src="/json-as/bench/v2.0.0/string-serialize.svg" alt="String serialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/string-serialize-1mb.svg"><img src="/json-as/bench/v2.0.0/string-serialize-1mb.svg" alt="String serialization through 1 MB" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/string-deserialize.svg"><img src="/json-as/bench/v2.0.0/string-deserialize.svg" alt="String deserialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/string-deserialize-1mb.svg"><img src="/json-as/bench/v2.0.0/string-deserialize-1mb.svg" alt="String deserialization through 1 MB" loading="lazy" decoding="async"></a>

### One growing object across both size ranges

Both ranges start from the **same 1,024-byte row fixture**. Larger inputs add rows to one object's `records` array. Each measured operation parses or serializes that whole JSON document once; the x-axis is its actual UTF-8 size. There is no record/schema switch at 1 MiB and no batch of separate JSON documents.

The typed AssemblyScript reader reuses a native destination, as in the existing harness. Built-in JavaScript parsing constructs a fresh result. The separately labeled JSON.Obj deserialization series defers materialization; it does less work than fully materializing a native model. Untouched JSON.Obj source forwarding is excluded from the serialization charts.

These object measurements were rerun on battery with power and host-load audits retained. The fixture and input semantics changed, so the old repeated-record curves are not a runtime-regression baseline.

<a href="/json-as/bench/v2.0.0/object-serialize.svg"><img src="/json-as/bench/v2.0.0/object-serialize.svg" alt="Growing-object serialization, full range" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/object-serialize-1mb.svg"><img src="/json-as/bench/v2.0.0/object-serialize-1mb.svg" alt="Growing-object serialization through 1 MiB" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/object-deserialize.svg"><img src="/json-as/bench/v2.0.0/object-deserialize.svg" alt="Growing-object deserialization, full range" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/object-deserialize-1mb.svg"><img src="/json-as/bench/v2.0.0/object-deserialize-1mb.svg" alt="Growing-object deserialization through 1 MiB" loading="lazy" decoding="async"></a>

## Primitives and runtimes

<a href="/json-as/bench/v2.0.0/primitive-serialize.svg"><img src="/json-as/bench/v2.0.0/primitive-serialize.svg" alt="Primitive serialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/primitive-deserialize.svg"><img src="/json-as/bench/v2.0.0/primitive-deserialize.svg" alt="Primitive deserialization" loading="lazy" decoding="async"></a>

The runtime suite covers Wago, Wasmtime, WAVM, wazero, V8, and Bun. It is a separate execution comparison, not the owning-struct classic comparison above.

<a href="/json-as/bench/v2.0.0/runtimes-serialize.svg"><img src="/json-as/bench/v2.0.0/runtimes-serialize.svg" alt="Serialization across Wasm runtimes" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/runtimes-deserialize.svg"><img src="/json-as/bench/v2.0.0/runtimes-deserialize.svg" alt="Deserialization across Wasm runtimes" loading="lazy" decoding="async"></a>

## Fast readers and reuse

Generated readers start at tier 1 on **each invocation**, then only tier down as needed: packed templates, whitespace-tolerant matching, and keyed/general fallback. Strict mode additionally uses checked cursor paths where supported. See [Generated Code](../deep-dive/codegen) and [Configuration](../reference/customization).

Reuse can avoid allocations for eligible present members. It still restores omitted defaults and prevents shared writable storage from corrupting another field. Allocation depends on defaults, growth, ownership, and custom codecs; it is not guaranteed to be zero for every schema.

## Lazy and dynamic work

These routes can retain raw ranges or cached materializations. Parsing without reading deferred fields, forwarding unchanged JSON, and fully materializing native structs are different amounts of work.

<a href="/json-as/bench/v2.0.0/lazy-deserialize.svg"><img src="/json-as/bench/v2.0.0/lazy-deserialize.svg" alt="Lazy deserialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/lazy-roundtrip.svg"><img src="/json-as/bench/v2.0.0/lazy-roundtrip.svg" alt="Lazy round trip" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/lazy-serialize.svg"><img src="/json-as/bench/v2.0.0/lazy-serialize.svg" alt="Lazy serialization" loading="lazy" decoding="async"></a>

<a href="/json-as/bench/v2.0.0/lazy-access-pattern.svg"><img src="/json-as/bench/v2.0.0/lazy-access-pattern.svg" alt="Lazy access patterns" loading="lazy" decoding="async"></a>

## Running and inspecting benchmarks

The harnesses and commands live in the [repository](https://github.com/JairusSW/json-as#performance). Record the exact revision, flags, runtime, architecture, input layout, and whether allocation/reuse/materialization is included. Repeated serialization of an untouched dynamic value can forward its original source; it is not a fresh native-struct serialization comparison.

The [complete chart set](https://github.com/JairusSW/json-as/tree/docs/charts/v2.0.0) includes PNG copies. All results here use the 2.0 chart set rather than the older 1.x assets.
