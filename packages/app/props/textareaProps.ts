import { type PropType } from 'vue'
import { propsFormInput } from './formInputProps'
import { propsSizePreset } from './sizeProps'

export const propsTextarea = () => {
  return {
    cols: {
      type: Number,
      default: 20,
    },
    rows: {
      type: Number,
      default: 2,
    },
    label: {
      type: String,
      default: null,
    },
    resize: {
      type: Boolean,
      default: false,
    },
    autocapitalize: {
      type: String as PropType<'on' | 'off'>,
      default: null,
    },
    autogrow: {
      type: Boolean,
      default: false,
    },
    autocomplete: {
      type: String,
      default: null,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    spellcheck: {
      type: Boolean,
      default: false,
    },
    simple: {
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
    dense: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    inputBackground: {
      type: String,
      default: null,
    },
    placeholderBackground: {
      type: String as PropType<string | null | undefined>,
      default: null,
    },
    ...propsSizePreset(),
    ...propsFormInput<string>(),
  } as const
}
