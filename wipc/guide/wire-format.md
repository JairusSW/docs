# Wire Format

WIPC uses a 9-byte header followed by the payload.

```text
0       4      5         9        9+N
┌───────┬──────┬─────────┬─────────┐
│ WIPC  │ type │ length  │ payload │
└───────┴──────┴─────────┴─────────┘
  4 B     1 B     u32 LE     N B
```

| Offset | Size | Field   | Description          |
| ------ | ---- | ------- | -------------------- |
| 0      | 4    | MAGIC   | ASCII `WIPC`         |
| 4      | 1    | TYPE    | Message type         |
| 5      | 4    | LENGTH  | Payload size, u32 LE |
| 9      | N    | PAYLOAD | Opaque bytes         |

## Message types

| Value | Name  | Purpose                |
| ----- | ----- | ---------------------- |
| 0x00  | OPEN  | Channel initialization |
| 0x01  | CLOSE | Graceful shutdown      |
| 0x02  | CALL  | RPC / request-response |
| 0x03  | DATA  | Raw data transfer      |

Payload encoding is intentionally unspecified. Use JSON, protobuf, raw bytes, or anything else that fits your protocol.
