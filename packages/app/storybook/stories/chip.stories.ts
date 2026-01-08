import { action } from 'storybook/actions'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { SChip, SIcon } from '@/app/index'
import { argTypesColor, argTypesSizePreset } from '@/app/storybook/argTypes'
import { createStoryObj, getSlot } from '@/app/storybook/helpers'

const chip: Meta<typeof SChip> = {
  title: 'UI Components/Chip',
  component: SChip,
  argTypes: {
    ...argTypesSizePreset,
    ...argTypesColor,
  },
}

export default chip

export const Chip = createStoryObj<typeof SChip>({
  args: {
    closable: false,
    color: undefined,
    disabled: false,
    label: false,
    link: false,
    outlined: true,
    size: null,
    default: 'required',
    close: () => /* html */ `
      <SIcon :icon="icon" size="small"></SIcon>
    `,
    onClose: action('close'),
    onClick: action('click'),
  },
  render: (args) =>
    defineComponent({
      components: {
        SChip,
        SIcon,
      },
      setup() {
        return { args, icon: 'mdi-close' }
      },
      template: `
        <SChip v-bind="args" class="s_ma__3">
        ${'default' in args && getSlot(args.default)}
        <template #close>${'close' in args && getSlot(args.close)}</template>
        </SChip>
      `,
    }),
})
