# Upgrading to 2.0

These docs describe the **2.0.0 release candidate**. The latest published npm version is still 1.6.3; the planned 1.7.0 release was never published. Until 2.0 is published, use a packed candidate from the repository to try these APIs.

## Licensing

The 2.0 candidate's project code is licensed under the **Mozilla Public License 2.0**, with the SPDX identifier `MPL-2.0`. Source files carry the license notice and copyright information. See the [full license](https://github.com/JairusSW/json-as/blob/main/LICENSE) and [third-party notices](https://github.com/JairusSW/json-as/blob/main/NOTICE); bundled dependencies and vendored helpers retain their own licenses.

For contributors, `npm run license:check` checks source notices. A dedicated CI job and the `prepublishOnly` lifecycle enforce this check. Non-code configuration and data do not need headers or sidecars. The transform build preserves headers in its generated output.

## Installation and compiler support

Keep AssemblyScript installed in your application. The 2.0 package declares `assemblyscript: ^0.28.18` as a peer dependency and bundles its `xjb-as` formatter sources. npm and pnpm consumers do not need to install `xjb-as` directly or change hoisting settings.

Both entrypoints expose the same public names:

```ts
import { JSON, JSONMode, toRaw, fromRaw, toBox } from "json-as";
// The same exports are available from "json-as/assembly".
```

Continue loading the transform with `--transform json-as` or `"transform": ["json-as"]` in `asconfig.json`.

## Reused destinations restore defaults

Each parse represents a new document. An omitted optional member returns to its declared default, even if the destination held a different value from an earlier parse.

```ts
import { JSON } from "json-as";

@json
class State {
  @optional value: i32 = 7;
  @optional other: i32 = 8;
}

const out = JSON.parse<State>('{"value":99,"other":88}');
JSON.parse<State>('{"other":2}', out);
out.value; // 7
out.other; // 2
```

Present members can still reuse eligible buffers and objects. Allocation depends on defaults, shared storage, collection growth, and custom codecs; reuse is not a guarantee of zero allocation. Always use the value returned by `parse` or `stringify`, since a destination may need to be replaced.

## Native subclasses use native storage

Undecorated `Array`, `Map`, `Set`, typed-array, and `Date` subclasses retain their built-in JSON representation. Overrides of indexing, `length`, `push`, `keys`, `values`, `set`, `add`, or `setTime` do not redefine that representation. Fresh parsing, reused parsing, and dynamic conversion use consistent native storage semantics.

Use [custom codecs](./custom-serialization) for a different wire format. Decorating a subclass opts it into generated-schema/custom-codec behavior instead.

## Numeric getters convert

`Value.get<T>()`, `Value.as<T>()`, `Obj.getAs<T>()`, and `Arr.getAs<T>()` convert stored numbers and booleans using AssemblyScript numeric casts, without allocating a wrapper. Boolean conversion compares with zero. Null produces zero/false; strings and objects are not coerced to numbers.

```ts
const number = JSON.parse<JSON.Value>("7.5");
number.get<i32>(); // 7
number.get<f32>(); // 7.5

const truth = JSON.Value.from<i32>(256);
truth.get<bool>(); // true
JSON.Box.fromValue<bool>(truth)!.value; // true
```

Use a typed `u64`/`i64` value when exact wide integers matter. Parsed dynamic numbers materialize as `f64`; converting a rounded float back to an integer cannot recover lost precision.

## Dynamic collections preserve reference sharing

`JSON.Arr` provides a dynamic array alongside `JSON.Obj`. Reading through `getAs`, or copying with `slice`, `concat`, or `copyWithin`, preserves nested reference sharing consistently, including deferred elements. Mutating a shared nested object is visible through its other references. Replacing a returned `JSON.Value` wrapper does not replace its source slot; use `set` for that.

## Parsing and diagnostics

- Compatibility mode remains the default. Enable `JSON_STRICT=true` for checked RFC parsing, including fresh/reused typed-field consistency.
- Every generated fast-reader invocation starts at tier 1, then only tiers down during that invocation. It does not remember a slower tier for the next parse.
- `JSON_DIAGNOSTICS=false` replaces library/generated failure diagnostics with Wasm traps. Checks remain; application callbacks and their errors retain their behavior. Keep diagnostics enabled when you need descriptive errors.
- `JSON_CACHE` remains off by default. Cache units are case-sensitive: lowercase `b` is bits, uppercase `B` is bytes. Use `JSON_CACHE=1048576` for exactly 1 MiB.

See [Configuration](../reference/customization), [Dynamic Types](../reference/dynamic-types), and the [full changelog](https://github.com/JairusSW/json-as/blob/main/CHANGELOG.md) for details.
