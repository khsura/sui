import { type EmitModelValue, type FormInputModelValue } from './core'

export type EmitActivator<ModelName extends string = 'modelValue'> = EmitModelValue<
  boolean | undefined | null,
  ModelName
>

export type EmitDialog = EmitActivator

export interface EmitFormInput<T extends FormInputModelValue = FormInputModelValue> {
  change: [T]
  'update:error': [boolean]
  'update:errors': [string[]]
  'update:dirty': [boolean]
}

export interface EmitFormTextInput<T extends FormInputModelValue = FormInputModelValue> extends EmitFormInput<T> {
  blur: [Event]
  focus: [Event]
  input: [Event]
  keydown: [KeyboardEvent]
  paste: [ClipboardEvent]
  autocomplete: [HTMLInputElement | null]
}
