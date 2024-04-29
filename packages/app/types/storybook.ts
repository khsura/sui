import { type Meta } from '@storybook/vue3'

export type StoryBookConfig = Meta

/** @deprecated use StoryObject from '@storybook/types' instead */
export interface StoryBookParameterType {
  controls?: {
    include?: RegExp | string[]
    exclude?: RegExp | string[]
    sort?: 'requiredFirst' | 'alpha'
    matchers?: {
      color: RegExp
      date: RegExp
    }
    expanded?: boolean
  }
  options?: {
    storySort?:
      | string[]
      | { order?: Array<string | string[]>; method?: string | 'alphabetical'; locales?: string; includeName?: boolean }
      | ((a: never, b: never) => number)
  }
}
