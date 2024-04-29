import { getNumericValue } from '@sui/app/lib/getNumericValue'

import { type PropType } from 'vue'

export const propsElevation = (defaults?: { elevation?: number }) => {
  return {
    elevation: {
      type: [String, Number] as PropType<string | number | undefined | null>,
      default: defaults?.elevation ?? null,
      validator(v: string | number) {
        const number = getNumericValue(v, false)

        return !(number === null || !Number.isInteger(number) || number < 0 || number > 24)
      },
    },
  } as const
}
