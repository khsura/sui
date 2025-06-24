import { SToggleButton, SToggleButtonGroup, AppTheme, useTheme } from '@khsura/sui/index'
import type { Meta } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import { createStoryObj } from '@khsura/storybook/helpers'

const theme: Meta = {
  title: 'Features/Theme',
}

export default theme

export const Theme = createStoryObj({
  render: () => {
    return defineComponent({
      components: {
        SToggleButton,
        SToggleButtonGroup,
      },
      setup: () => {
        const { theme, setTheme } = useTheme()

        return {
          theme,
          setTheme,
          AppTheme,
        }
      },
      template: `
        <div class="s_pa__3">
          <SToggleButtonGroup shrink :model-value="[theme]" @update:model-value="setTheme($event[0])">
            <SToggleButton :index="AppTheme.light">light</SToggleButton>
            <SToggleButton :index="AppTheme.dark">dark</SToggleButton>
          </SToggleButtonGroup>
          <div>current theme: {{ theme }}</div>
        </div>
      `,
    })
  },
})
