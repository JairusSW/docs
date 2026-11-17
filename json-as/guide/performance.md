# Performance

These charts were refreshed on **17 November 2026** for **2.1.0**, on an **Apple M4 Max (arm64)** with AC power. Timing batches used the shared host lock. Results describe the recorded machine, engine, schema, and harness; they are not a universal speed guarantee.

The original AssemblyScript and JavaScript harnesses are retained. Series follow JS, NAIVE, SWAR, SIMD, Obj, Lazy and simdjson where present. Deserialization charts use linear axes. Serialization charts with wide ranges use logarithmic scaling where needed: compare axis ticks, not just bar lengths. Select a chart to open its full-size SVG.

## Classic: JSON ↔ native structs

Deserialization parses JSON into native AssemblyScript model instances. The simdjson comparison materializes **owning C++ structs**, rather than stopping at a DOM or reusing a cached JSON string. Serialization starts with those native values and produces JSON text. The json-as compatibility runs have validation and the experimental string cache disabled.

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-deserialize-v8.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-deserialize-v8.svg" alt="Classic native-struct deserialization, V8" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-serialize-v8.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-serialize-v8.svg" alt="Classic native-struct serialization, V8" loading="lazy" decoding="async"></a>

<details>
<summary>Classic results under WAVM</summary>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-deserialize-wavm.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-deserialize-wavm.svg" alt="Classic deserialization, WAVM" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-serialize-wavm.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/classic-payload-serialize-wavm.svg" alt="Classic serialization, WAVM" loading="lazy" decoding="async"></a>

</details>

## Overview and library comparisons

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/overview-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/overview-serialize.svg" alt="Overview serialization" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/overview-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/overview-deserialize.svg" alt="Overview deserialization" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/library-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/library-serialize.svg" alt="Library serialization comparison" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/library-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/library-deserialize.svg" alt="Library deserialization comparison" loading="lazy" decoding="async"></a>

The overview, library, and classic charts use different workloads. Read their labels before comparing throughput between charts.

## Strings and objects by size

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/string-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/string-serialize.svg" alt="String serialization" loading="lazy" decoding="async"></a>


<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/string-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/string-deserialize.svg" alt="String deserialization" loading="lazy" decoding="async"></a>


### One growing object, ten sizes

The combined chart has **ten document sizes from about 100 KiB to 8 MiB**, all built from the **same 1,024-byte row fixture**. Larger inputs add rows to one object's `records` array. Each measured operation parses or serializes that whole JSON document once; the x-axis is its actual UTF-8 size. There is no record/schema switch at 1 MiB and no batch of separate JSON documents.

The typed AssemblyScript reader reuses a native destination, as in the existing harness. Built-in JavaScript parsing constructs a fresh result. The separately labeled JSON.Obj deserialization series defers materialization; it does less work than fully materializing a native model. Untouched JSON.Obj source forwarding is excluded from the serialization charts.

These object and string measurements were rerun on arm64 with AC power, with power and host-load audits retained. String samples use the same ten targets, measured by their encoded JSON size. The fixture and input semantics changed, so the old repeated-record curves are not a runtime-regression baseline.

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/object-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/object-serialize.svg" alt="Growing-object serialization, ten document sizes" loading="lazy" decoding="async"></a>


<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/object-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/object-deserialize.svg" alt="Growing-object deserialization, ten document sizes" loading="lazy" decoding="async"></a>


All charts use the same overview typography and a 1.6.1-style single-line sidebar showing the recorded date, release, engine version, branch and CPU model. Hardware models come from the captured benchmark host information. Companion `.metadata.json` files retain the detailed source, runtime and output-policy records.

The simdjson reference serializes owning native fields into a fresh output string on every operation. It does not cache serialized JSON or use DOM minification. Benchmark warm-up warms executable code; each measured call still reconstructs its output. The owning-writer regression also changes fields between calls and verifies the new output.

## Primitives and runtimes

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/primitive-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/primitive-serialize.svg" alt="Primitive serialization" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/primitive-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/primitive-deserialize.svg" alt="Primitive deserialization" loading="lazy" decoding="async"></a>

The runtime suite covers Wago, Wasmtime, WAVM, wazero, V8, and Bun. It is a separate execution comparison, not the owning-struct classic comparison above.

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/runtimes-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/runtimes-serialize.svg" alt="Serialization across Wasm runtimes" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/runtimes-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/runtimes-deserialize.svg" alt="Deserialization across Wasm runtimes" loading="lazy" decoding="async"></a>

## Fast readers and reuse

Generated readers start at tier 1 on **each invocation**, then only tier down as needed: packed templates, whitespace-tolerant matching, and keyed/general fallback. Strict mode additionally uses checked cursor paths where supported. See [Generated Code](../deep-dive/codegen) and [Configuration](../reference/customization).

Reuse can avoid allocations for eligible present members. It still restores omitted defaults and prevents shared writable storage from corrupting another field. Allocation depends on defaults, growth, ownership, and custom codecs; it is not guaranteed to be zero for every schema.

## Lazy and dynamic work

These routes can retain raw ranges or cached materializations. Parsing without reading deferred fields, forwarding unchanged JSON, and fully materializing native structs are different amounts of work.

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-deserialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-deserialize.svg" alt="Lazy deserialization" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-roundtrip.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-roundtrip.svg" alt="Lazy round trip" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-serialize.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-serialize.svg" alt="Lazy serialization" loading="lazy" decoding="async"></a>

<a href="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-access-pattern.svg"><img src="https://raw.githubusercontent.com/JairusSW/json-as/refs/heads/docs/charts/v2.1.0/lazy-access-pattern.svg" alt="Lazy access patterns" loading="lazy" decoding="async"></a>

## Running and inspecting benchmarks

The harnesses and commands live in the [repository](https://github.com/JairusSW/json-as#performance). Record the exact revision, flags, runtime, architecture, input layout, and whether allocation/reuse/materialization is included. Repeated serialization of an untouched dynamic value can forward its original source; it is not a fresh native-struct serialization comparison.

The [complete 2.1 chart set](https://github.com/JairusSW/json-as/tree/docs/charts/v2.1.0) includes PNG copies.

## Reproducing and interpreting 2.1 results

[Browse all 2.1 charts and metadata](https://github.com/JairusSW/json-as/tree/docs/charts/v2.1.0). Companion metadata identifies source revisions, engine versions, and output policies. The runtime capture uses Wago PR #1054 at `7da95a9edc3404b68bac582444a3e47739d20546`, alongside wasmtime, WAVM, wazero, v8, and Bun.

For parsing, GB/s counts input UTF-8 bytes; for serialization, it counts output bytes. Native owning models, dynamic deferred values, and partial field reads are distinct workloads. Compare matching series and phases.

Use `@json({ nolazy })` with no explicit lazy fields when measuring complete eager materialization against another native-model parser. A partial-read specialization benchmark should instead report which fields it observes. Regular serialization creates fresh output unless an eligible destination is explicitly supplied; it does not cache the full JSON string.

From the repository, `npm run bench:all` runs the benchmark groups and `npm run charts:build` renders captured results. Runtime comparisons use `npm run bench:runtimes`. Timing runs on a shared machine must acquire its benchmark lock; chart rendering alone is not a throughput measurement.
