import { type PropsFormInput } from './propsFormInput'
import { type FileMimeType } from '@/app/constants'

export type PropsImageLoader = {
  accept?: string
  multiple?: boolean
  buttonClass?: object | string | string[]
  fileTypes?: FileMimeType[]
  maxSize?: number
  maxCount?: number | null
  incremental?: boolean | null
} & PropsFormInput
