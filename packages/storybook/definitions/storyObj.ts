import type { InputControl } from './control'
import type { ComponentPropsOrProps } from './core/vueExtract'
import type { MockApiConfig } from './mockApi'
import type { ArgsStoryFn } from '@storybook/types'
import type { StoryObj, VueRenderer } from '@storybook/vue3'

declare module '@storybook/types' {
  export interface InputType {
    options?: Array<string | number | null | undefined> | Record<string, string | number | null>
    control?: InputControl
    /** @description use this when you want to add type description */
    table?: {
      type?: { summary?: string; detail?: string }
      defaultValue?: { summary: string; detail?: string }
      disable?: boolean
    }
  }

  export interface Parameters {
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
        | {
            order?: Array<string | string[]>
            method?: string | 'alphabetical'
            locales?: string
            includeName?: boolean
          }
        | ((a: never, b: never) => number)
    }
    mockAddonConfigs?: {
      globalMockData?: MockApiConfig[]
      refreshStoryOnUpdate?: boolean
      disable?: boolean
    }
    mockData?: MockApiConfig[]
  }
}

export type StorybookObj<T> = Omit<StoryObj<T>, 'render'> & {
  render?: ArgsStoryFn<VueRenderer, ComponentPropsOrProps<T>>
}
