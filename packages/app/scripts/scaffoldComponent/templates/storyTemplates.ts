import { STORY_TITLE_PREFIX } from '../constants'
import type { ComponentNames } from '../types'

/**
 * storybook/stories/x.stories.ts: an args-driven playground story and one `visual` stress story whose `play`
 * checks the layout, so the story doubles as an interaction test (docs/visual-testing.md).
 */
export const renderStoryFile = (
  names: ComponentNames,
): string => `import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { expect, waitFor } from 'storybook/test'
import { ${names.component} } from '@/app/index'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj } from '@/app/storybook/helpers'

const ${names.camel}: Meta<typeof ${names.component}> = {
  title: '${STORY_TITLE_PREFIX}${names.base}',
  component: ${names.component},
  // TODO(scaffold): add argTypes for the component's own enum props.
  argTypes: {
    ...argTypesColor,
    ...argTypesSizePreset,
  },
}

export default ${names.camel}

export const ${names.base} = createStoryObj<typeof ${names.component}>({
  args: {
    color: undefined,
    size: null,
    text: '${names.component}',
  },
  render: (args) =>
    defineComponent({
      components: { ${names.component} },
      setup() {
        return { args }
      },
      template: /* html */ \`<${names.component} v-bind="args"></${names.component}>\`,
    }),
})

// Sub-pixel rounding allowed in the geometry checks.
const pixelTolerance = 1
const longText = 'A very long label that keeps going to check how the component wraps or truncates on a phone'

// Stress cases in one story, so the visual harness stays fast. TODO(scaffold): add the cases AI code gets wrong
// for this component (long text, empty content, every size, colours, inside a flex row, …).
// A plain object literal, so Storybook's static indexer reads the \`visual\` tag.
export const ${names.base}Stress = {
  tags: ['visual'],
  render: () => ({
    components: { ${names.component} },
    setup() {
      return { longText }
    },
    template: /* html */ \`
      <div class="s_pa__4" style="display: flex; flex-direction: column; gap: 16px">
        <${names.component} text="Default"></${names.component}>
        <${names.component} color="primary" text="Primary"></${names.component}>
        <${names.component} size="small" text="Small"></${names.component}>
        <${names.component} size="large" text="Large"></${names.component}>
        <${names.component} :text="longText"></${names.component}>
      </div>
    \`,
  }),
  play: async ({ canvasElement }) => {
    const root = canvasElement.ownerDocument.documentElement

    await waitFor(() => expect(canvasElement.querySelectorAll('.${names.cssBlock}').length).toBeGreaterThan(0))
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + pixelTolerance)
  },
} satisfies StoryObj<typeof ${names.component}>
`
