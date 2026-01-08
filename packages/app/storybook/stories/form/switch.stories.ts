import type { Meta } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { SSwitch } from '@/app/index'
import { createStoryObj } from '@/app/storybook/helpers'

const switcher: Meta<typeof SSwitch> = {
  title: 'UI Components/Switch',
  component: SSwitch,
  argTypes: {
    color: {
      control: {
        type: 'text',
      },
    },
  },
}

export default switcher

export const Switcher = createStoryObj<typeof SSwitch>({
  render: (args) => {
    return {
      components: { SSwitch },
      setup() {
        const value = ref(false)

        return {
          value,
          args,
        }
      },
      template: /* html */ `
        <div class="s_pa__4">
          <SSwitch v-bind="args" v-model="value"></SSwitch>
          <p>{{ value }}</p>
        </div>
      `,
    }
  },
  args: {
    id: 'switch',
    label: 'switch',
    disabled: false,
    color: '',
  },
})
