# Getting Started

`as-labs` is a package for experimental AssemblyScript features that are shipped
behind normal package imports plus optional compiler transforms.

Right now the first feature is `branch-hinting`.

## Install

```sh
npm install as-labs
```

## Imports

Use the root package if you want the default experimental surface:

```ts
import { likely, unlikely } from "as-labs";
```

Or import the feature directly:

```ts
import { likely, unlikely } from "as-labs/branch-hinting";
```

## Transforms

Use the aggregate transform:

```sh
asc assembly/index.ts --transform as-labs -o build/module.wasm
```

Or the feature-specific transform:

```sh
asc assembly/index.ts --transform as-labs/branch-hinting -o build/module.wasm
```

## Current scope

- feature-scoped AssemblyScript entrypoints
- feature-scoped transforms
- a root transform that aggregates supported feature transforms

For the actual branch hinting behavior and verification notes, see
[Branch Hinting](./branch-hinting).
