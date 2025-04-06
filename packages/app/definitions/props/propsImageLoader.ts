import { type FileMimeType } from '@khsura/sui/constants'
import { type PropsFormInput } from './propsFormInput'

export type PropsImageLoader = {
  accept?: string
  multiple?: boolean
  buttonClass?: object | string | string[]
  fileTypes?: FileMimeType[]
  maxSize?: number
  maxCount?: number | null
  incremental?: boolean | null
} & PropsFormInput
