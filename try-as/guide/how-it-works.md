# How It Works

`try-as` is a source-to-source transform.

It analyzes the AssemblyScript call graph, rewrites exception-producing code paths into helper state updates, and lowers each `try/catch/finally` into explicit control-flow checks.

## Pipeline

```text
AssemblyScript source
  -> source linker finds try blocks, throwing calls, methods, imports, and re-exports
  -> exception-aware functions/methods are marked
  -> throw/abort/unreachable are rewritten to helper state writes
  -> try/catch/finally becomes explicit do/break + catch-state checks
  -> catch receives a rebuilt Exception object
```

```text
throw / abort / unreachable
  -> __ErrorState.error / __AbortState.abort / __UnreachableState.unreachable
  -> __ExceptionState.Failures++
  -> generated break/return exits the current rewritten scope
  -> nearest transformed catch checks __ExceptionState.shouldCatch(mask)
  -> new __Exception(__ExceptionState.Type) reconstructs the caught value
```
