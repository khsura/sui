import { z } from 'zod'

/**
 * TODO: Sura - pass options as object, add more options such as isPositive etc.
 * @param {any} [options.defaultValue] - default is `null`
 */
export const getNumericValue = <
  D extends number | null = null,
  S extends boolean = false,
  R extends (S extends true ? number : D | number) = S extends true ? number : D | number,
>(
  value: number | string | null | undefined,
  options?: {
    defaultValue?: D
    allowDecimal?: boolean
    isPositive?: boolean | undefined | null
    isStrictIntCheck?: boolean
    isStrictParse?: S
    max?: number | string | undefined | string | null
    min?: number | string | undefined | string | null
  },
): R => {
  const defaultValue = options?.defaultValue ?? (null as unknown as D)
  const isInt = !options?.allowDecimal
  const isPositive = options?.isPositive ?? false
  const isStrictIntCheck = (isInt && options?.isStrictIntCheck) ?? false
  const isLooseIntCheck = isInt && !options?.isStrictIntCheck
  const parsedMin = z.preprocess((v) => v ?? undefined, z.coerce.number()).safeParse(options?.min)
  const parsedMax = z.preprocess((v) => v ?? undefined, z.coerce.number()).safeParse(options?.max)

  const baseType = (
    [
      ['int', isStrictIntCheck],
      ['positive', isPositive],
      ['min', parsedMin.success ? parsedMin.data : undefined],
      ['max', parsedMax.success ? parsedMax.data : undefined],
    ] as const
  ).reduce((acc, [type, condition]) => {
    if (type === 'min' || type === 'max') {
      return condition ? acc[type](condition) : acc
    }

    return condition ? acc[type]() : acc
  }, z.coerce.number())

  const typeCheck = z
    .preprocess((value) => {
      return value ?? defaultValue ?? undefined
    }, baseType)
    .transform((v) => {
      return isLooseIntCheck ? Math.round(v) : v
    })

  if (options?.isStrictParse) {
    return typeCheck.parse(value) as R
  }

  const result = typeCheck.safeParse(value)

  return (result.success ? result.data : defaultValue ? typeCheck.parse(defaultValue) : defaultValue) as R
}
