export const isOptionalNumeric = (options?: { min?: number; max?: number; whitelist?: Array<string | number> }) => {
  const isIn = ({ value, min, max }: { value: number; min?: number; max?: number }) => {
    if (min !== undefined && value < min) {
      return false
    }

    if (max !== undefined && value > max) {
      return false
    }

    return true
  }

  return (possiblyNumeric: number | string | null) => {
    if (!possiblyNumeric) {
      return true
    }

    if (options?.whitelist?.includes(possiblyNumeric)) {
      return true
    }

    const number = Number(possiblyNumeric)

    return !Number.isNaN(number) && isIn({ value: number, ...options })
  }
}

export const orderValidator = (options?: { min?: number; max?: number }) => (value: string | number | null) => {
  const numericValidator = isOptionalNumeric(options)

  return numericValidator(value) || ['last', 'first'].includes(value as string)
}
