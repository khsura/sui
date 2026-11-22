import {
  fileAcceptExtensionPrefix,
  fileAcceptSeparator,
  fileAcceptWildcardSuffix,
  fileSizeFractionDigits,
  fileSizeUnits,
  fileSizeUnitStep,
} from '@/app/constants'
import { escapeHtml } from '@/app/lib'
import type { FileInputRuleOptions, FormInputModelValue, FormInputModelValueRule } from '@/app/types'

/** A byte count as a short text: `512 B`, `1.5 KB`, `5 MB`. */
export const formatFileSize = (bytes: number) => {
  let size = Math.max(0, bytes)
  let unitIndex = 0

  while (size >= fileSizeUnitStep && unitIndex < fileSizeUnits.length - 1) {
    size /= fileSizeUnitStep
    unitIndex += 1
  }

  const text = unitIndex === 0 || Number.isInteger(size) ? size.toString() : size.toFixed(fileSizeFractionDigits)

  return `${text.replace(/\.0$/, '')} ${fileSizeUnits[unitIndex]}`
}

/**
 * Whether a file matches an `accept` string, the way the browser's picker filters: an extension (`.csv`), a MIME
 * type (`application/pdf`) or a MIME family (`image/*`). An empty or missing `accept` accepts every file.
 */
export const getIsFileAccepted = (file: File, accept?: string | null) => {
  const entries = (accept ?? '')
    .split(fileAcceptSeparator)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  if (entries.length === 0) {
    return true
  }

  const fileName = file.name.toLowerCase()
  const fileType = file.type.toLowerCase()

  return entries.some((entry) => {
    if (entry.startsWith(fileAcceptExtensionPrefix)) {
      return fileName.endsWith(entry)
    }

    if (entry.endsWith(fileAcceptWildcardSuffix)) {
      return fileType.startsWith(entry.slice(0, -1))
    }

    return fileType === entry
  })
}

/** The files held by a form value: SFileInput's `File[]`, or nothing for any other value. */
export const getFilesOfValue = (value?: FormInputModelValue | null): File[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is File => entry instanceof File)
}

const defaultMessages = {
  required: () => 'Choose a file.',
  tooLarge: (file: File, maxSizeText: string) => `${file.name} is larger than ${maxSizeText}.`,
  wrongType: (file: File, accept: string) => `${file.name} is not an accepted file type (${accept}).`,
  tooMany: (count: number, maxFiles: number) => `Choose at most ${maxFiles} files (${count} chosen).`,
}

/**
 * Validation rules for SFileInput's `rules` prop: required, a size limit, an `accept` type check (a dropped file
 * skips the picker's filter) and a file count limit. Pure: no i18n, pass `messages` to translate the texts.
 * The texts that name a file are HTML-escaped, because the error line renders HTML and a file name is user input.
 *
 * @example <SFileInput v-model="files" accept=".csv,.xlsx" :rules="getFileInputRules({ maxSize: 5 * 1024 * 1024, accept: '.csv,.xlsx' })" />
 */
export const getFileInputRules = (options: FileInputRuleOptions): FormInputModelValueRule[] => {
  const messages = {
    required: options.messages?.required ?? defaultMessages.required,
    tooLarge: options.messages?.tooLarge ?? defaultMessages.tooLarge,
    wrongType: options.messages?.wrongType ?? defaultMessages.wrongType,
    tooMany: options.messages?.tooMany ?? defaultMessages.tooMany,
  }

  const rules: FormInputModelValueRule[] = []
  const { accept, maxFiles, maxSize } = options

  if (options.required) {
    rules.push((value) => getFilesOfValue(value).length > 0 || messages.required())
  }

  if (maxSize !== undefined) {
    rules.push((value) => {
      const tooLargeFile = getFilesOfValue(value).find((file) => file.size > maxSize)

      return tooLargeFile ? escapeHtml(messages.tooLarge(tooLargeFile, formatFileSize(maxSize))) : true
    })
  }

  if (accept) {
    rules.push((value) => {
      const wrongTypeFile = getFilesOfValue(value).find((file) => !getIsFileAccepted(file, accept))

      return wrongTypeFile ? escapeHtml(messages.wrongType(wrongTypeFile, accept)) : true
    })
  }

  if (maxFiles !== undefined) {
    rules.push((value) => {
      const count = getFilesOfValue(value).length

      return count <= maxFiles || messages.tooMany(count, maxFiles)
    })
  }

  return rules
}
