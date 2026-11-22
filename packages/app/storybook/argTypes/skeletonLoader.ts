import type { ArgTypes } from '@storybook/vue3'
import { skeletonLoaderPresets } from '@/app/configs'
import type { PropsSkeletonLoader } from '@/app/definitions'

// The single presets plus a few compositions, so the select shows what `,` and `@N` do.
const typeExamples = [...skeletonLoaderPresets, 'avatar, text@3', 'heading, text@4, button', 'list-item-avatar@3']

export const argTypesSkeletonLoader: ArgTypes<Pick<PropsSkeletonLoader, 'type'>> = {
  type: {
    options: typeExamples,
    control: { type: 'select' },
    description: 'Presets joined by commas, each with an optional `@N` repeat count.',
    table: {
      defaultValue: { summary: "'text'" },
      type: { summary: 'string', detail: skeletonLoaderPresets.join(' | ') },
    },
  },
}
