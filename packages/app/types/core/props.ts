import { type HTMLAttributes } from 'vue'

export interface PropsContent {
  contentClass?: string | string[] | Record<string, boolean> | undefined
  contentStyle?: HTMLAttributes['style'] | undefined
}
