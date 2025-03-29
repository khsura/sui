import { SCard, SCardTitle, SIcon, SRow, SButton, SImage, SDroppable } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3'
import { ref } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const droppable: Meta<typeof SDroppable> = {
  title: 'UI Components/Droppable',
}

export default droppable

const components = { SDroppable, SCard, SCardTitle, SRow, SIcon, SButton, SImage }

export const Droppable = createStoryObj<typeof SDroppable>({
  render: (args) => {
    return {
      template: /* html */ `
        <SCard max-width="400px" class="s_mx__auto k_my__2" color="warning" outlined>
          <SCardTitle class="s_justify__center">Drop</SCardTitle>
          <SDroppable v-bind="args" @drop="onDrop" v-slot="{ isDraggingOver, supportsDragAndDrop }" class="s_pa__2">
            <SCard class="s_pa__10" color="transparent" outlined v-if="!image">
              <SRow justify="center" no-gutters>
                <SIcon :icon="supportsDragAndDrop ? 'mdi-vector-arrange-below' : 'mdi-camera-outline'" size="extra"></SIcon>
              </SRow>
              <SRow justify="center" no-gutters class="s_text--body__2">
                Drag/Drop
              </SRow>
            </SCard>
            <SCard v-else outlined class="s_pa__2">
              <SImage :src="image" alt="sample image" max-height="300px" object-fit="contain" :aspect-ratio="16/9"></SImage>
            </SCard>
          </SDroppable>
        </SCard>
      `,
      components,
      setup() {
        const image = ref<string | null>(null)

        const onDrop = (event: DragEvent) => {
          const file = event.dataTransfer?.files.item(0)

          if (!file || !/^image/.test(file.type ?? '')) {
            return
          }

          const reader = new FileReader()

          reader.onload = (ev) => {
            image.value = (ev.target?.result as string) ?? null
          }

          reader.readAsDataURL(file)
        }

        return {
          onDrop,
          image,
          args,
        }
      },
    }
  },
  args: {
    disabled: false,
  },
})
