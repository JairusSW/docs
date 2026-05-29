# Numbers

Numeric matchers accept any integer or float type. Using them on a non-numeric value is a compile-time error.

## Comparisons

```ts
expect(10).toBeGreaterThan(2);
expect(10).toBeGreaterOrEqualTo(10);
expect(2).toBeLessThan(10);
expect(2).toBeLessThanOrEqualTo(2);
```

| Matcher | Asserts |
| --- | --- |
| `toBeGreaterThan(n)` | `value > n` |
| `toBeGreaterOrEqualTo(n)` | `value >= n` |
| `toBeLessThan(n)` | `value < n` |
| `toBeLessThanOrEqualTo(n)` | `value <= n` |

## Approximate equality

Floating-point math is rarely exact. `toBeCloseTo` compares within a tolerance set by `precision` (number of decimal places, default `2`):

```ts
expect(0.1 + 0.2).toBeCloseTo(0.3);        // precision 2
expect(3.14159).toBeCloseTo(3.14159, 5);   // tighter tolerance
```

The assertion passes when the difference is smaller than `0.5 / 10 ** precision`.

## Numeric type and finiteness checks

These check the value's compile-time type and runtime finiteness:

```ts
expect(value).toBeNumber();   // integer or float
expect(value).toBeInteger();  // integer type
expect(value).toBeFloat();    // float type
expect(value).toBeFinite();   // not NaN, not Infinity
```

| Matcher | Passes when |
| --- | --- |
| `toBeNumber()` | The value is an integer or float type. |
| `toBeInteger()` | The value is an integer type. |
| `toBeFloat()` | The value is a float type. |
| `toBeFinite()` | The value is neither `NaN` nor `±Infinity`. |

`toBeNumber`, `toBeInteger`, and `toBeFloat` are type-level checks resolved at compile time — they confirm the static type of the expression, not a runtime tag.
