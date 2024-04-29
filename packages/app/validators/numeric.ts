import { getNumericCssAttribute } from '@sui/app/lib'

export const validatorNumericCssAttribute = (value: string | number | null | undefined) => {
  return value === undefined || value === null || value === '' || getNumericCssAttribute(value) !== ''
}
