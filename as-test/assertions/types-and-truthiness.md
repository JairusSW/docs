# Types And Truthiness

These matchers are useful when the exact value matters less than the kind of value.

## Type Matchers

```ts
expect(label).toBeString();
expect(flag).toBeBoolean();
expect(items).toBeArray();
```

Available methods:

- `toBeString()`
- `toBeBoolean()`
- `toBeArray()`

## Truthiness

```ts
expect(result).toBeTruthy();
expect(optionalValue).toBeFalsy();
```

Available methods:

- `toBeTruthy()`
- `toBeFalsy()`

Truthiness follows the runtime helper behavior:

- `false` is falsy
- empty strings are falsy
- `0` and `0.0` are falsy
- `NaN` is falsy
- `null` is falsy
- other managed values are truthy
