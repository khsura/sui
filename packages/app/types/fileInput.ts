import { type FileInputDisplay, type FileInputVariant } from '@/app/constants'

/** How SFileInput shows its files: `'names'`, `'chips'` or `'count'`. */
export type FileInputDisplayType = `${FileInputDisplay}`

/** The look of SFileInput: `'input'` or `'dropzone'`. */
export type FileInputVariantType = `${FileInputVariant}`

/** The error texts `getFileInputRules` returns; each has an English default. */
export type FileInputRuleMessages = {
  /** No file chosen while `required` is on. */
  required?: (() => string) | undefined
  /** A file is larger than `maxSize`; `maxSizeText` is the formatted limit, such as `5 MB`. */
  tooLarge?: ((file: File, maxSizeText: string) => string) | undefined
  /** A file matches no entry of `accept`. */
  wrongType?: ((file: File, accept: string) => string) | undefined
  /** More files than `maxFiles` are chosen. */
  tooMany?: ((count: number, maxFiles: number) => string) | undefined
}

/** What `getFileInputRules` checks. Every option is optional; give only the checks you need. */
export type FileInputRuleOptions = {
  /** At least one file must be chosen. */
  required?: boolean | undefined
  /** The largest allowed file, in bytes: `5 * 1024 * 1024` for 5 MB. */
  maxSize?: number | undefined
  /** The allowed types, in the `accept` attribute format: `.csv,.xlsx` or `image/*`. */
  accept?: string | undefined
  /** The most files allowed with `multiple`. */
  maxFiles?: number | undefined
  messages?: FileInputRuleMessages | undefined
}
