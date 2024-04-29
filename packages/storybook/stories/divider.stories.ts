import { SDivider, SRow, SColumn } from '@sui/app/components'
import { createStoryObj } from '@sui/storybook/helpers'
import type { Meta } from '@storybook/vue3'

const divider: Meta<typeof SDivider> = {
  title: 'UI Components/Divider',
  component: SDivider,
}

export default divider

export const Divider = createStoryObj<typeof SDivider>({
  render: () => {
    return {
      components: {
        SRow,
        SColumn,
        SDivider,
      },
      template: /* html */ `
        <SRow>
          <SColumn cols=12>Tom</SColumn>
          <SColumn cols=12>
            <SDivider></SDivider>
          </SColumn>
          <SColumn cols=12>Jerry</SColumn>
        </SRow>
      `,
    }
  },
})
