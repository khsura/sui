import { SToolbar, SToolbarTitle, SButton, SIcon, SCard } from '@khsura/sui/components'
import { argsColor } from '@khsura/storybook/args'
import { createStoryObj } from '@khsura/storybook/helpers'
import type { Meta } from '@storybook/vue3'
import { faker } from '@khsura/shared'

const toolbar: Meta<typeof SToolbar> = {
  title: 'UI Components/Toolbar',
  argTypes: {
    density: {
      type: 'string',
      control: 'select',
      options: [null, 'default', 'comfortable', 'compact'],
    },
    elevation: {
      type: 'number',
      control: 'select',
      options: [null, ...new Array(21).fill(0).map((_, i) => i)],
    },
  },
}

export default toolbar

export const Toolbar = createStoryObj<typeof SToolbar>({
  render: (args) => {
    return (
      <div>
        <SToolbar {...args}>
          {{
            extension: () => <SCard>Hello world</SCard>,
            default: () => {
              return (
                <div style="display: flex;">
                  <SButton variant="icon">
                    <SIcon icon="mdi-menu"></SIcon>
                  </SButton>
                  <SToolbarTitle>Hello</SToolbarTitle>
                  <SButton variant="icon">
                    <SIcon icon="mdi-heart"></SIcon>
                  </SButton>
                  <SButton variant="icon">
                    <SIcon icon="mdi-dots-vertical"></SIcon>
                  </SButton>
                </div>
              )
            },
          }}
        </SToolbar>
        <div>{faker.lorem.paragraph({ min: 20, max: 100 })}</div>
        <SToolbar {...args}>
          {{
            extension: () => <SCard>Second toolbar</SCard>,
            default: () => {
              return <div style="display: flex;">Second toolbar</div>
            },
          }}
        </SToolbar>
        <div>{faker.lorem.paragraph({ min: 20, max: 100 })}</div>
      </div>
    )
  },
  args: {
    elevation: null,
    ...argsColor,
    density: null,
    fixedExtension: false,
    extended: true,
  },
})
