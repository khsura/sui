declare module 'eslint-plugin-import' {
  import type { Linter } from 'eslint'

  export const configs: {
    recommended: Linter.Config
  }
}
