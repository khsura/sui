import { SBreadcrumbs } from '@sui/app/components'
import { argsBreadcrumbs } from '@sui/storybook/args'
import { argTypesBreadcrumbs } from '@sui/storybook/argTypes'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent } from 'vue'
import type { Meta } from '@storybook/vue3'

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
