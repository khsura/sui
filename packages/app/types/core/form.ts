export type FormInputModelValue = string | number | number[] | string[] | boolean | File[] | null | symbol
export type KFormInputModelValueValidator<T extends FormInputModelValue = FormInputModelValue> = (
  value?: T,
) => Promise<boolean>
