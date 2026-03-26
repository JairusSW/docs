# Architecture

```text
  ┌───────────────┐
  │      FFI      │
  └───────────────┘
          │
┌────────────────────┐    stdin / stdout (WIPC)   ┌───────────────────────┐
│        Host        │  <──────────────────────>  │     Guest / Child     │
└────────────────────┘                            └───────────────────────┘
          │
  ┌───────────────┐
  │  passthrough  │
  └───────────────┘
```

WIPC frames and regular stdout can coexist on the same stream. The channel parser separates them and forwards non-frame bytes to `onPassthrough()`.
