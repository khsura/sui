declare module 'postcss-media-minmax' {
  import type postcss from 'postcss'
  const plugin: () => postcss.AcceptedPlugin

  export default plugin
}

declare module 'eslint-plugin-import' {
  import type { Linter } from 'eslint'

  export const configs: {
    recommended: Linter.Config
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
