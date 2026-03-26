# Exception API

```ts
import { Exception, ExceptionType } from "try-as";
```

Available members:

- `Exception.type: ExceptionType`
- `Exception.toString(): string`
- `Exception.is<T>(): bool`
- `Exception.as<T>(): T`
- `Exception.clone(): Exception`
- `Exception.rethrow(): never`

`Exception.as<T>()` supports `Error` subclasses, other managed objects, and primitive payloads like `i32`, `bool`, and `f64`.

`ExceptionType` values:

- `None`
- `Abort`
- `Throw`
- `Unreachable`
