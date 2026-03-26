# API

## Host API

```ts
import { Channel, MessageType } from "wipc-js";
```

Sending:

- `send(type, payload?)`
- `sendJSON(type, msg)`

Receiving by subclass override:

- `onOpen()`
- `onClose()`
- `onCall(msg)`
- `onDataMessage(data)`
- `onPassthrough(data)`

## Guest API

```ts
import { readFrame, writeFrame, MessageType, encode, decode } from "wipc-js/assembly/channel";
```

- `writeFrame(type, payload?)`
- `readFrame(): Frame | null`
- `encode(type, payload): ArrayBuffer`
- `decode(data): Frame | null`
