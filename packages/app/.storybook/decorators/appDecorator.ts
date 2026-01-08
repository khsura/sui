import { defineComponent } from 'vue'
import type { Component } from 'vue'
import type { Decorator } from '@storybook/vue3-vite'
import { SApp, SMain, SContainer } from '@/app/index'
import '@/app/styles/index.scss'

export const appDecorator = (): Decorator => {
  return (story: Component) => {
    return defineComponent({
      components: { story, SApp, SMain, SContainer },
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
