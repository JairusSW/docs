# Getting Started

## Install

Add `str` to an AssemblyScript project:

```bash
npm install as-str
```

There is **no transform** — `str` is a plain library. Import the `str`
class:

```ts
import { str } from "as-str";
```

The encoding namespaces (`str.UTF8` / `str.UTF16`) are powered by
[`utf-as`](https://github.com/JairusSW/utf-as), pulled in automatically as a
dependency.

## Create your first view

Wrap a real `string` with `str.from`, then slice, search, and trim without
allocating. Materialize back to a `string` with `.toString()` only when you need
one:

```ts
const real = "  the quick brown fox  ";

const v = str.from(real).trim(); // view -> "the quick brown fox"
const word = v.slice(4, 9); // view -> "quick"

word.length; // 5
word.toString(); // "quick" — the only allocation here
```

`str` is a class, so it is also the type — annotate with `str`:

```ts
const v: str = str.from("hello");
```

## Two ways to call everything

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

## Working with UTF-8

If your text is already UTF-8 bytes (files, network, JSON), reach for
[`str8`](./str8) — the byte-indexed UTF-8 sibling of `str` — and slice/search it
without transcoding to UTF-16. Bridge between the two with `.toStr()` /
`.toStr8()`.

## Enable SIMD (optional)

The scanning hot paths (`indexOf`, `includes`, `compare`) ship a SWAR kernel by
default and a SIMD kernel when you compile with:

```bash
--enable simd
```

With SIMD off, the v128 code is dead-code-eliminated — you only pay for the tier
you build. Nothing else changes; results are identical.

## Global mode (optional)

By default you import `str` where you use it. If you'd rather use `str`
**without an import in every file**, opt into the transform — it injects the
import at compile time.

1. Add the transform to your `asc` command or `asconfig.json`:

   ```bash
   --transform as-str/transform
   ```

   ```json
   { "options": { "transform": ["as-str/transform"] } }
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
   `node_modules`). For pnpm or other non-hoisted layouts, drop a copy of
   `node_modules/as-str/globals/index.d.ts` into your assembly directory instead
   — any `.d.ts` in the project is picked up by the editor.

Now this compiles with no import:

```ts
export function method(line: string): string {
  return str.slice(line, 0, line.indexOf(" ")).toString();
}
```

The transform only injects names a file actually uses and doesn't already
import, and never rewrites the library's own sources — so explicit imports keep
working and the two styles mix freely.

> How it works: the transform runs in `afterParse`, prepends an
> `import { … } from "as-str/assembly/index"` to each user source that needs it
> (computing the specifier the same way json-as does), and force-parses the
> `str` module so the import resolves even when nothing else imports it. The
> `globals/index.d.ts` typings are editor-only — asc never loads them, so they
> can't collide with the injected import.

## Next

- [The View Model](./views) — the data layout, materialization, and GC safety.
- [API](./api/) — the full method surface, grouped by what it returns.
