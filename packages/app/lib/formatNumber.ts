import { z } from 'zod'

export const formatNumber = (number: number | string) => {
  return Intl.NumberFormat().format(z.coerce.number().parse(number))
}
