import { type PropsDensity } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PropsSizePreset } from './propsSizePreset'
import { type FileInputDisplayType, type FileInputVariantType } from '@/app/types'

export type PropsFileInput = {
  /** Visible label above the field, tied to the file input. With `hideDetails` it is hidden and becomes the `aria-label`, as in SInput. */
  label?: string | undefined
  /** Text shown in the field while no file is chosen. */
  placeholder?: string | undefined
  /** Accessible name when there is no visible `label`; wins over `label`. */
  ariaLabel?: string | undefined
  /** Id of the element that names the file input. */
  ariaLabelledby?: string | undefined
  /** The native input's `name`, so a plain `<form>` submit sends the files. */
  name?: string | undefined
  /** Allow several files. The model is always a `File[]` (or `null` when empty), even for one file. */
  multiple?: boolean | undefined
  /** Allowed types in the native format: `.csv,.xlsx`, `image/*`, `application/pdf`. Dropped files that do not match are rejected (the `reject` event). */
  accept?: string | undefined
  /** How the chosen files are shown: their names, one chip each, or a count such as `3 files`. */
  display?: FileInputDisplayType | undefined
  /** `input`: a text-field box. `dropzone`: a large area that also takes dragged files. */
  variant?: FileInputVariantType | undefined
  /** Show a button that clears the chosen files. */
  clearable?: boolean | undefined
  /** Accessible name of the clear button. */
  clearAriaLabel?: string | undefined
  /** Show each file's size next to its name. */
  showSize?: boolean | undefined
  /** Show a spinner and block picking, e.g. while the chosen file uploads or is parsed. */
  loading?: boolean | undefined
  /** Accessible name of the loading spinner. */
  loadingAriaLabel?: string | undefined
  /** The `count` display text for several files; `{count}` is replaced by the number. */
  countText?: string | undefined
  /** The `dropzone` variant's call to action. */
  dropText?: string | undefined
  /** Material Design icon before the selection (`input`) or above the text (`dropzone`); `''` hides it. */
  icon?: string | undefined
  /** Smaller paddings, as SInput's `dense`. */
  dense?: boolean | undefined
} & PropsDensity &
  PropsSizePreset &
  PropsFormInput
