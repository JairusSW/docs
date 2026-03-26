# Getting Started

## Installation

```bash
npm install try-as
```

Add the transform to your build and keep it last:

```bash
asc assembly/index.ts --transform try-as
```

Or in `asconfig.json`:

```json
{
  "options": {
    "transform": ["try-as"]
  }
}
```

If you use multiple transforms, keep `try-as` last.

## Basic usage

```ts
import { Exception } from "try-as";

try {
  throw new Error("boom");
} catch (e) {
  const err = e as Exception;
  console.log(err.toString());
}
```
