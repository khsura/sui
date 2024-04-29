import { type InputModeTypeText, type InputTypeText } from '@sui/app/types'
import { type PropType } from 'vue'
import { propsFormInput } from './formInputProps'
import { propsSizePreset } from './sizeProps'

export const propsInput = () => {
  return {
    placeholder: {
      type: String,
      default: null,
    },
    type: {
      type: String as PropType<InputTypeText>,
      default: 'text',
    },
    inputmode: {
      type: String as PropType<InputModeTypeText>,
      default: 'text',
    },
    label: {
      type: String,
      default: null,
    },
    inputBackground: {
      type: String,
      default: null,
    },
    placeholderBackground: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    max: {
      type: [String, Number] as PropType<string | number>,
      default: null,
    },
    min: {
      type: [String, Number] as PropType<string | number>,
      default: null,
    },
    spellcheck: {
      type: Boolean,
      default: false,
    },
    autocapitalize: {
      type: String as PropType<'on' | 'off'>,
      default: null,
    },
    autocomplete: {
      type: String,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    pattern: {
      type: String,
      default: null,
    },
    suffix: {
      type: String,
      default: null,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    appendOuter: {
      type: String,
      default: null,
    },
    textRight: {
      type: Boolean,
      default: false,
    },
    positive: {
      type: Boolean,
      default: false,
    },
    usePreviousValueWhenExceeded: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    minlength: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    maxlength: {
      type: [String, Number] as PropType<string | number>,
      default: undefined,
    },
    ariaLabelledby: {
      type: String as PropType<string>,
      default: undefined,
    },
    name: {
      type: String as PropType<string>,
      default: undefined,
    },
    isPasteDisabled: {
      type: Boolean,
      default: false,
    },
    ...propsSizePreset(),
    ...propsFormInput<string | number | null>(),
  } as const
}
