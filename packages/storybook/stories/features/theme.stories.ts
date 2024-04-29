import { SToggleButton, SToggleButtonGroup } from '@sui/app/components'
import { AppTheme } from '@sui/app/constants'
import { useThemeService } from '@sui/app/services'
import { createStoryObj } from '@sui/storybook/helpers'
import { defineComponent } from 'vue'
import type { Meta } from '@storybook/vue3'

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
        const { theme, setTheme } = useThemeService()

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
