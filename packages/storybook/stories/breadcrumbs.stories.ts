import { SBreadcrumbs } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { defineComponent } from 'vue'
import { argsBreadcrumbs } from '@khsura/storybook/args'
import { argTypesBreadcrumbs } from '@khsura/storybook/argTypes'
import { createStoryObj } from '@khsura/storybook/helpers'

const breadcrumbs: Meta<typeof SBreadcrumbs> = {
  title: 'UI Components/Breadcrumbs',
  argTypes: argTypesBreadcrumbs,
  parameters: {
    controls: {
      sort: 'alpha',
    },
  },
}

export default breadcrumbs

export const Breadcrumbs = createStoryObj<typeof SBreadcrumbs>({
  args: argsBreadcrumbs(),
  render: (args) => {
    return defineComponent({
      components: { SBreadcrumbs },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SBreadcrumbs v-bind="args"></SBreadcrumbs>`,
    })
  },
})

export const BreadcrumbsWithCustomDivider = createStoryObj<typeof SBreadcrumbs>({
  args: argsBreadcrumbs({ 'custom-divider': encodeURI('<div class="s_mx__2">・</div>') }),
  render: (args) => {
    return defineComponent({
      components: { SBreadcrumbs },
      setup() {
        return { args }
      },
      template: /* html */ `
        <SBreadcrumbs v-bind="args">
          <template #custom-divider><div v-html="decodeURI(args['custom-divider'])"></div></template>
        </SBreadcrumbs>`,
    })
  },
})
