# The View Model

A `str` is three fields:

```ts
class str {
  data: string; // the backing string — the GC owner of the bytes
  start: usize; // byte pointer to the first UTF-16 code unit
  end: usize; // byte pointer one past the last code unit (exclusive)
}
```

Every view-producing operation returns a new `str` whose `data` is the
**original** backing string and whose `start`/`end` bound a sub-range. No
characters move. A view costs one small object; the bytes are shared.

## When bytes are copied

Bytes are copied only when you leave the view world:

- **`toString()`** allocates a fresh `string` and copies the view's range into
  it.
- **Allocating ops** — `concat`, `repeat`, `padStart`, `padEnd`, `replace`,
  `replaceAll`, `toUpperCase`, `toLowerCase` — return an owned `string` and so
  allocate their result (in a single pass, directly from the view).

Everything else — `slice`, `substring`, `substr`, `charAt`, `at`, `trim*`,
`split`, and all the queries (`length`, `indexOf`, `compare`, …) — moves
pointers or returns a primitive. A view op is one allocation (the result view);
a query is zero.

```ts
const v = str.from("hello, world");
const w = v.slice(7); // view "world" — 1 small alloc, 0 bytes copied
w.length; // 5         — 0 allocs
w.indexOf("rl"); // 2  — 0 allocs
w.toString(); // "world" — 1 alloc, 10 bytes copied
```

## Views of views

Slicing a view produces another view anchored to the **same original** backing
string, not to the intermediate. Long chains never pin intermediate
allocations.

```ts
const a = str.from("xx the quick brown fox xx");
const b = a.slice(3); // "the quick brown fox xx"
const c = b.slice(4, 9); // "quick"
c.data === a.data; // true — both reference the original string
```

## GC safety

Because a view holds `data` (a managed `string` reference), the AssemblyScript
GC keeps the backing string alive for as long as any view of it is reachable.
You can safely return a `str` from a function, store it in a field, or build
one over a freshly computed string — the bytes won't be collected out from under
it.

```ts
function firstWord(line: string): str {
  return str.slice(line, 0, line.indexOf(" ")); // safe: holds `line`
}
```

## Code-unit semantics

Offsets and lengths are **UTF-16 code units**, matching native `String`. A view
boundary can fall between the two halves of a surrogate pair (again, exactly as
`String#slice` would) — `str` mirrors `String`'s behavior here rather than
guarding against it.

## The two layers

The same surface is reachable two ways:

| Layer            | Call                          | First arg          |
| ---------------- | ----------------------------- | ------------------ |
| Instance methods | `v.slice(7)`                  | the view (`this`)  |
| Free functions   | `str.slice(s, 7)`         | `string` or `str` |

The free functions read their argument's bounds in place (no wrapper view is
allocated for a `string`), then funnel into the same implementation as the
instance methods. Use whichever reads better; they compile to the same work.
