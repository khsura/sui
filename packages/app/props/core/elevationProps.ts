import { type PropType } from 'vue'
import { getNumericValue } from '~/lib/getNumericValue'

export const propsElevation = (defaults?: { elevation?: number }) => {
  return {
    elevation: {
      type: [String, Number] as PropType<string | number | undefined | null>,
      default: defaults?.elevation ?? null,
      validator(v: string | number) {
        const number = getNumericValue(v, { min: 0, max: 24 })

        return number !== null
      },
    },
  } as const
}
