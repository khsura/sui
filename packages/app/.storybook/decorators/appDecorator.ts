import { defineComponent } from 'vue'
import type { Component } from 'vue'
import type { Decorator } from '@storybook/vue3-vite'
import { AppTheme, SApp, SMain, SContainer, useTheme } from '@/app/index'
import type { AppThemeType } from '@/app/index'
import '@/app/styles/index.scss'

const appThemes: readonly unknown[] = Object.values(AppTheme)
const isAppTheme = (value: unknown): value is AppThemeType => appThemes.includes(value)
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

// The `theme` global (toolbar, or `?globals=theme:dark` in the URL) drives the SUI theme store,
// so the visual regression harness can screenshot every story in light and dark.
// A story with `parameters: { appDecorator: { main: false } }` is rendered straight inside SApp, without the
// full-height SMain, so it can show how SApp itself fills the viewport.
export const appDecorator = (): Decorator => {
  return (story: Component, context) => {
    const themeGlobal: unknown = context.globals.theme
    const appDecoratorParameters: unknown = context.parameters.appDecorator
    const hasMain = !(isRecord(appDecoratorParameters) && appDecoratorParameters.main === false)

    return defineComponent({
      components: { story, SApp, SMain, SContainer },
      setup() {
        const { setTheme } = useTheme()

        if (isAppTheme(themeGlobal)) {
          setTheme(themeGlobal)
        }
      },
      template: hasMain
        ? `
        <SApp>
          <SMain>
            <SContainer fluid padless>
              <story></story>
            </SContainer>
          </SMain>
        </SApp>
      `.trim()
        : '<SApp><story></story></SApp>',
    })
  }
}
