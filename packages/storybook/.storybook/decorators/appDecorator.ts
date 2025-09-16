import { SApp, SMain, SContainer } from '@khsura/sui/index'
import '@khsura/sui/styles/index.scss'
import type { Decorator } from '@storybook/vue3-vite'
import { defineComponent } from 'vue'
import type { Component } from 'vue'

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
