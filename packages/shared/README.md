# @khsura/shared

Small helpers shared across the `sui` monorepo (tests, storybook, apps).

## What's inside

- `faker` — test-data generator re-export
- `wait(ms)` — promise-based sleep for storybook and test fixtures
- other internal utilities imported by `@khsura/sui` tests and stories

## Usage

```ts
import { faker, wait } from '@khsura/shared'

await wait(300)
const name = faker.person.fullName()
```

## Status

Internal workspace package (`"private": true`, not published). It is bundled into `@khsura/sui-mcp` at build time and used by the other packages' tooling and tests — no external API stability is guaranteed.
