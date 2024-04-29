import { FileMimeType } from '@sui/app/constants'
import { type PropType } from 'vue'
import { propsFormInput } from './formInputProps'

export const propsImageLoader = (defaults?: { accept?: string }) => {
  return {
    accept: {
      type: String,
      default: defaults?.accept ?? '.jpg, .jpeg, .png, .gif',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: [Object, String, Array],
      default: null,
    },
    fileTypes: {
      type: Array as PropType<FileMimeType[]>,
      default: () => [FileMimeType.jpeg, FileMimeType.png, FileMimeType.gif],
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024,
    },
    maxCount: {
      type: Number as PropType<number | null | undefined>,
      default: null,
    },
    incremental: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    ...propsFormInput<File[] | null>(),
  }
}
