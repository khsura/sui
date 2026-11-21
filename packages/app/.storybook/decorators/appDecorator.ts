import { defineComponent } from 'vue'
import type { Component } from 'vue'
import type { Decorator } from '@storybook/vue3-vite'
import { AppTheme, SApp, SMain, SContainer, useTheme } from '@/app/index'
import type { AppThemeType } from '@/app/index'
import '@/app/styles/index.scss'

const appThemes: readonly unknown[] = Object.values(AppTheme)
const isAppTheme = (value: unknown): value is AppThemeType => appThemes.includes(value)

// The `theme` global (toolbar, or `?globals=theme:dark` in the URL) drives the SUI theme store,
// so the visual regression harness can screenshot every story in light and dark.
export const appDecorator = (): Decorator => {
  return (story: Component, context) => {
    const themeGlobal: unknown = context.globals.theme

    return defineComponent({
      components: { story, SApp, SMain, SContainer },
      setup() {
        const { setTheme } = useTheme()

        if (isAppTheme(themeGlobal)) {
          setTheme(themeGlobal)
        }
      },
      template: `
        <SApp>
          <SMain>
            <SContainer fluid padless>
              <story></story>
            </SContainer>
          </SMain>
        </SApp>
      `.trim(),
    })
  }
}
