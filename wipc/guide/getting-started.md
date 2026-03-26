# Getting Started

## Install

```sh
npm install wipc-js
```

## Host example

```ts
import { Channel, MessageType } from "wipc-js";
import { spawn } from "node:child_process";

const child = spawn("wasmtime", ["./build/test.wasm"], {
  stdio: ["pipe", "pipe", "inherit"],
});

class Echo extends Channel {
  onDataMessage(data: Buffer) {
    console.log("<-", data.toString("utf8"));
  }

  onPassthrough(data: Buffer) {
    process.stderr.write(data);
  }
}

const ch = new Echo(child.stdout!, child.stdin!);
ch.send(MessageType.DATA, Buffer.from("hello"));
```

## Guest example

```ts
import { readFrame, writeFrame, MessageType, Frame } from "wipc-js/assembly/channel";

while (true) {
  const frame: Frame | null = readFrame();
  if (frame === null) break;
  writeFrame(frame.type, frame.payload);
  if (frame.type == MessageType.CLOSE) break;
}
```
