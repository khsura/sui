import { FileInputVariant } from '@/app/constants'
import { type FileInputVariantType } from '@/app/types'

/** SFileInput's icon for each variant when the `icon` prop is not set. */
export const fileInputDefaultIcons = {
  [FileInputVariant.input]: 'mdi-paperclip',
  [FileInputVariant.dropzone]: 'mdi-cloud-upload-outline',
} satisfies Record<FileInputVariantType, string>
