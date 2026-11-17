# Lazy Parsing Migration

Typed-field lazy slots were removed in 2.1. Lazy parsing now means compile-time access specialization, with no deferred getters or saved typed-field source ranges.

Read [Lazy parsing](../guide/lazy-fields) for the current API and [Upgrading to 2.1](../guide/upgrading-to-2-1) for migration steps. Dynamic JSON values retain their separate source-backed representation.
