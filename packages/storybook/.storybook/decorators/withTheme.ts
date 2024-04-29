/* eslint-disable no-console */
import { SApp, SMain, SContainer } from '@sui/app/components'
import { AppTheme } from '@sui/app/constants'
import { addons } from '@storybook/manager-api'
import { DARK_MODE_EVENT_NAME, UPDATE_DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'
import { reactive, defineComponent, computed } from 'vue'
import type { Decorator } from '@storybook/vue3'
import type { Component } from 'vue'

const store = reactive({
  isDark: false,
})

const setDark = (value: boolean) => {
  console.info('isDark', value)
  store.isDark = value
}

console.info('decorator is loaded')
const channel = addons.getChannel()

// TODO (Sura) seems events are not working now
channel.removeAllListeners()
channel.addListener(DARK_MODE_EVENT_NAME, setDark)
channel.addListener(UPDATE_DARK_MODE_EVENT_NAME, setDark)

export const withTheme = (): Decorator => {
  return (story: Component) => {
    return defineComponent({
      components: { story, SApp, SMain, SContainer },
      setup() {
        const theme = computed(() => {
          return store.isDark ? AppTheme.dark : AppTheme.light
        })

        return {
          theme,
        }
      },
      template: `
        <SApp :theme="theme">
          <SMain>
            <SContainer fluid padless>
              <story></story>
            </SContainer>
          </SMain>
        </SApp>
      `,
    })
  }
}
