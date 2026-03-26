# Examples

## Catch abort and throw

```ts
import { Exception, ExceptionType } from "try-as";

try {
  abort("fatal");
} catch (e) {
  const err = e as Exception;
  if (err.type == ExceptionType.Abort) {
    console.log(err.toString());
  }
}
```

## Type-safe custom errors

```ts
import { Exception } from "try-as";

class MyError extends Error {
  constructor(message: string) {
    super(message);
  }
}

try {
  throw new MyError("typed");
} catch (e) {
  const err = e as Exception;
  if (err.is<MyError>()) {
    const typed = err.as<MyError>();
    console.log(typed.message);
  }
}
```

## Throwing non-Error values

```ts
import { Exception } from "try-as";

class PlainThing {
  constructor(public label: string) {}
}

try {
  throw new PlainThing("plain");
} catch (e) {
  const err = e as Exception;
  if (err.is<PlainThing>()) {
    const value = err.as<PlainThing>();
    console.log(value.label);
  }
}
```

## Selective catch kinds

```ts
import { Exception } from "try-as";

try {
  // @try-as: throw,abort
  try {
    abort("selected");
  } catch (e) {
    console.log((e as Exception).toString());
  }
} catch (_) {
}
```
