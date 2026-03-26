# Custom Serialization

Use `@serializer(...)` and `@deserializer(...)` when a type needs a custom wire format.

## Rules

- Custom serializers and deserializers must always speak valid JSON.
- Custom deserializers should always instantiate and return a new object.
- The optional decorator argument declares the JSON shape used by the custom type.
- If omitted, the shape defaults to `any`.

Supported shape hints:

- `any`
- `string`
- `number`
- `boolean`
- `object`
- `array`
- nullable forms like `string | null`

## Example

```ts
function hexDigit(value: u8): string {
  return String.fromCharCode(value < 10 ? 48 + value : 87 + value);
}

function parseHexNibble(code: u16): u8 {
  if (code >= 48 && code <= 57) return <u8>(code - 48);
  if (code >= 97 && code <= 102) return <u8>(code - 87);
  return <u8>(code - 55);
}

@json
class HexBytes extends Uint8Array {
  constructor(length: i32 = 0) {
    super(length);
  }

  @serializer("string")
  serializer(self: HexBytes): string {
    let out = "";
    for (let i = 0; i < self.length; i++) {
      const value = unchecked(self[i]);
      out += hexDigit(value >> 4);
      out += hexDigit(value & 0x0f);
    }
    return JSON.stringify(out);
  }

  @deserializer("string")
  deserializer(data: string): HexBytes {
    const raw = JSON.parse<string>(data);
    const out = new HexBytes(raw.length >> 1);
    for (let i = 0, j = 0; i < raw.length; i += 2, j++) {
      const hi = parseHexNibble(<u16>raw.charCodeAt(i));
      const lo = parseHexNibble(<u16>raw.charCodeAt(i + 1));
      unchecked((out[j] = <u8>((hi << 4) | lo)));
    }
    return out;
  }
}
```

## Internal helpers

When custom serializers or deserializers call `JSON.stringify(...)` or `JSON.parse(...)` internally, the transform rewrites those nested calls to `JSON.internal.stringify(...)` and `JSON.internal.parse(...)` so shared buffer state stays scoped correctly.
