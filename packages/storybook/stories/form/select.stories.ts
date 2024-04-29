import { SSelect, SForm } from '@sui/app/components'
import SIcon from '@sui/app/components/sIcon.vue'
import { argsSelect } from '@sui/storybook/args'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent, ref } from 'vue'
import type { Meta } from '@storybook/vue3'

const select: Meta<typeof SSelect> = {
  title: 'UI Components/Form/Select',
}

export default select

export const Select = createStoryObj<typeof SSelect>({
  args: argsSelect,
  render: (args) =>
    defineComponent({
      components: {
        SForm,
        SSelect,
        SIcon,
      },
      setup() {
        const value = ref(null)

        return {
          value,
          args,
        }
      },
      template: `
        <SForm>
          <SSelect v-bind="args" v-model="value" id="select1">
            <template v-slot:dropdownIcon="slotProps">
              <SIcon icon="mdi-chevron-down"
                :color="slotProps.color"
                size="small"
                class="expandIcon"
                :rotated="slotProps.value"
              ></SIcon>
            </template>
          </SSelect>

          <SSelect v-bind="args" v-model="value" id="select2">
            <template #activator="{ item }">
              <strong v-if="item?.text">☆{{ item.text }}☆</strong>
            </template>
          </SSelect>
        </SForm>
      `,
    }),
})
