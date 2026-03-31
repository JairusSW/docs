# Number Matchers

Number-oriented matchers work on integer and float values unless noted otherwise.

## Comparisons

```ts
expect(score).toBeGreaterThan(10);
expect(score).toBeGreaterOrEqualTo(10);
expect(score).toBeLessThan(20);
expect(score).toBeLessThanOrEqualTo(20);
```

Available methods:

- `toBeGreaterThan(value)`
- `toBeGreaterOrEqualTo(value)`
- `toBeLessThan(value)`
- `toBeLessThanOrEqualTo(value)`

## Approximate Equality

`toBeCloseTo(expected, precision = 2)` compares by decimal precision.

```ts
expect(3.14159).toBeCloseTo(3.14, 2);
```

## Numeric Type Checks

```ts
expect(total).toBeNumber();
expect(count).toBeInteger();
expect(ratio).toBeFloat();
expect(ratio).toBeFinite();
```

Available methods:

- `toBeNumber()`
- `toBeInteger()`
- `toBeFloat()`
- `toBeFinite()`

`toBeFinite()` is intended for numeric values and fails for non-finite values.
