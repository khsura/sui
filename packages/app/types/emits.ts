import { type TableItem, type EmitModelValue, type FormInputModelValue } from './core'

export type EmitActivator<ModelName extends string = 'modelValue'> = EmitModelValue<
  boolean | undefined | null,
  ModelName
>

export type EmitDialog = EmitActivator

export interface EmitFormInput<T extends FormInputModelValue> {
  (event: 'update:modelValue', value: T): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'change', value: T): void
  (event: 'update:dirty', value: boolean): void
}

export interface EmitFormTextInput<T extends FormInputModelValue> extends EmitFormInput<T> {
  (event: 'blur', value: Event): void
  (event: 'focus', value: Event): void
  (event: 'input', value: Event): void
  (event: 'keydown', value: KeyboardEvent): void
  (event: 'paste', value: ClipboardEvent): void
  (event: 'autocomplete', value: HTMLInputElement | null): void
}
