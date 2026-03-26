# Performance

The current README measurements describe WIPC as mostly framing overhead plus stream behavior:

- small encode paths in the millions of ops/s
- decode as a zero-copy view
- copy paths close to memcpy speed
- round-trip throughput limited more by Node stream backpressure than by framing itself

Run the repo benchmarks directly:

```sh
npm run bench
```
