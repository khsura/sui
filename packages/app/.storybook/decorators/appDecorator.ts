import type { Decorator } from '@storybook/vue3'
import { defineComponent } from 'vue'
import type { Component } from 'vue'
import { SApp, SMain, SContainer } from '~/index'

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
