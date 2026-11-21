import type { AxeBuilder } from '@axe-core/playwright'

// axe-core's `Result`, read through @axe-core/playwright so the harness does not depend on axe-core directly.
export type A11yViolation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number]
