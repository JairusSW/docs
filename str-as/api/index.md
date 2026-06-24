# API

`str` mirrors the native `String` surface, grouped here by what each
operation returns.

- [Slicing & Trimming](./slicing) — ops that return a **view**: `slice`,
  `substring`, `substr`, `charAt`, `at`, `trim` / `trimStart` / `trimEnd` /
  `trimLeft` / `trimRight`, `split`.
- [Searching](./searching) — queries that return a primitive: `indexOf`,
  `lastIndexOf`, `includes`, `startsWith`, `endsWith` (each accepting a `string`
  *or* a `str` needle).
- [Transforming](./transforming) — ops that return an owned `string`: `concat`,
  `repeat`, `padStart`, `padEnd`, `replace`, `replaceAll`, `toUpperCase`,
  `toLowerCase`.
- [Comparison & Operators](./comparison) — `equals`, `equalsString`,
  `compareTo`, `localeCompare`, and the `==` / `!=` / `<` / `<=` / `>` / `>=` /
  `+` / `[]` operators.
- [Encoding](./encoding) — `str.UTF8` / `str.UTF16`, plus the static
  constructors and `MAX_LENGTH`.

## Conventions

Each operation exists in two forms (see [The View Model](../views#the-two-layers)):

```ts
v.slice(2, 5); // instance method on a view
str.slice(s, 2, 5); // free function — `s` is a string or a view
```

- **Returns a view** → another `str`, no bytes copied.
- **Returns a primitive** → `i32` / `bool`, no allocation.
- **Returns a string** → an owned `string`, allocated once.

Indices are UTF-16 code units, and out-of-range / negative arguments behave
exactly as the matching native `String` method (verified by differential
fuzzing). Convert a `string` into a view with [`str.from(s)`](./encoding#constructors).
