# Getting Started

## Install

Add `as-str` to an AssemblyScript project:

```bash
npm install as-str
# or
pnpm add as-str
```

For manual use, import the `str` class directly:

```ts
import { str } from "as-str";
```

The encoding namespaces (`str.UTF8` / `str.UTF16`) are powered by
[`utf-as`](https://github.com/JairusSW/utf-as), pulled in automatically as a
bundled runtime dependency. A separate consumer installation of `utf-as` is
not required, including with pnpm's isolated layout.

## Manual mode

### Create your first view

Wrap a real `string` with `str.from`, then slice, search, and trim without
copying its characters. Wrapping and each view-producing operation allocate
a small object. Materialize back to a `string` with `.toString()` when you need
one:

```ts
const real = "  the quick brown fox  ";

const v = str.from(real).trim(); // view -> "the quick brown fox"
const word = v.slice(4, 9); // view -> "quick"

word.length; // 5
word.toString(); // "quick" — copies the selected characters into a native string
```

`str` is a callable converter with static helpers and a type alias for `Str`.
The uppercase class is also exported, as are `Str8` and `str8` for UTF-8:

```ts
const v: str = str.from("hello");
```

### Call operations

Every operation is available as an **instance method** on a view and as a
**free function** that takes a `string` *or* a `str`:

```ts
// instance
str.from("hello, world").slice(7).toString(); // "world"

// free function — first arg is a string or a view
str.slice("hello, world", 7).toString(); // "world"
str.indexOf("hello, world", "world"); // 7
```

`str` is also callable as a **converter** — turn any value into a view:

```ts
str(42).toString(); // "42"
str(someValue); // anything with a .toString()
```

## Automatic mode

Use `as-str/auto` to let the transform migrate safe internal `string` values
to zero-copy `str` views automatically:

```bash
--transform as-str/auto
```

Or add it to `asconfig.json`:

```json
{ "options": { "transform": ["as-str/auto"] } }
```

Your source can continue to use native `string` types:

```ts
function compactLabel(value: string): string {
  return value.trim().slice(0, 12);
}

export function formatLabel(value: string): string {
  return compactLabel(value);
}
```

After optimization, the relevant source shape is:

```ts
import { str } from "as-str";

function compactLabel(value: str): str {
  return value.trim().slice(0, 12);
}

export function formatLabel(value: string): string {
  return compactLabel(str.from(value)).toString();
}
```

This is an illustrative view-based lowering; the optimizer may instead use
scalar lengths or packed spans with retained backing owners. The exported
function keeps its native `string` signature. The transform leaves values native around
unsafe pointer casts, raw loads, explicit assertions, native-string call
parameters, and other boundaries it cannot prove safe.

## Global mode

By default you import `str` where you use it. If you'd rather use `str`
**without an import in every file**, use `as-str/global`. This transform only
injects imports; it does not optimize native strings.

1. Add the transform to your `asc` command or `asconfig.json`:

   ```bash
   --transform as-str/global
   ```

   ```json
   { "options": { "transform": ["as-str/global"] } }
   ```

2. Add the ambient typings so your editor resolves the globals — extend
   str's preset in `assembly/tsconfig.json`:

   ```json
   {
     "extends": [
       "assemblyscript/std/assembly.json",
       "as-str/globals.json"
     ],
     "include": ["./**/*.ts"]
   }
   ```

   The preset re-points `typeRoots` (AssemblyScript's std config sets
   `typeRoots: ["types"]`, which would otherwise block resolving the globals from
   `node_modules`). Use the same preset with npm and pnpm; it includes the
   uppercase `Str` type/value and the encoding namespace types.

Now this compiles with no import:

```ts
export function method(line: string): string {
  return str.slice(line, 0, line.indexOf(" ")).toString();
}
```

The transform only injects names a file actually uses and doesn't already
import, and never rewrites the library's own sources — so explicit imports keep
working and the two styles mix freely.

The `globals/index.d.ts` typings are editor-only. The transform injects the
matching imports at compile time, so the editor globals cannot collide with
generated declarations. Existing application bindings, including `@global`
declarations, take precedence over injected names. Import `str8` / `Str8`
explicitly when using UTF-8 views.

## Single-pass mode

`as-str/single` optimizes safe operations inside functions while retaining their
parameter and return signatures. `as-str/auto` can also optimize internal
function boundaries. Both inject the UTF-16 helpers where needed:

```json
{ "options": { "transform": ["as-str/single"] } }
```

Choose one transform per compilation: `global`, `single`, or `auto`.

## Programmatic compiler use

The transform entry points support direct ESM imports and dynamic imports:

```js
import asc from "assemblyscript/asc";
import AutoTransform from "as-str/auto";

const result = await asc.main(["assembly/index.ts", "--outFile", "build/app.wasm"], {
  transforms: [new AutoTransform()],
});
if (result.error) throw result.error;
```

Use `as-str/global` or `as-str/single` in the same way. Keep explicit runtime
imports on the public package path (`import { str } from "as-str"`) when mixing
them with injected imports, including in linked workspaces.

## SIMD

The scanning hot paths (`indexOf`, `includes`, `compare`) ship a SWAR kernel by
default and a SIMD kernel when you compile with:

```bash
--enable simd
```

With SIMD off, the v128 code is dead-code-eliminated — you only pay for the tier
you build. Nothing else changes; results are identical.

## UTF-8 views

If your text is already UTF-8 bytes (files, network, JSON), reach for
[`str8`](./str8) — the byte-indexed UTF-8 sibling of `str` — and slice/search it
without transcoding to UTF-16. Bridge between the two with `.toStr()` /
`.toStr8()`.

## Next

- [The View Model](./views) — the data layout, materialization, and GC safety.
- [API](./api/) — the full method surface, grouped by what it returns.
