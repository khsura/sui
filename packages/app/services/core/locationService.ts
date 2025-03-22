import { computed } from 'vue'
import { type PropsLocation } from '@khsura/sui/definitions'
import { type Location } from '@khsura/sui/types'

export const useLocationService = (props: PropsLocation) => {
  const getFirstLocation = <T extends Location>(filter?: T[]): T | null => {
    const locationString = Array.isArray(props.location) ? props.location.join(' ') : (props.location ?? '')
    const locations = locationString.split(' ')

    const filteredLocations: T[] = filter
      ? (locations.filter((location) => filter.includes(location as T)) as T[])
      : ([...locations] as T[])

    return filteredLocations[0] ?? null
  }

  const computedLocationY = computed(() => {
    return getFirstLocation<'top' | 'bottom'>(['top', 'bottom'])
  })

  const computedLocationX = computed(() => {
    return getFirstLocation<'left' | 'right'>(['left', 'right'])
  })

  const computedLocation = computed(() => {
    return getFirstLocation()
  })

  const isBottom = computed(() => {
    return computedLocationY.value === 'bottom'
  })

  const isTop = computed(() => {
    return computedLocationY.value === 'top'
  })

  const isLeft = computed(() => {
    return computedLocationX.value === 'left'
  })

  const isRight = computed(() => {
    return computedLocationX.value === 'right'
  })

  return {
    isBottom,
    isTop,
    isRight,
    isLeft,
    computedLocation,
    computedLocationX,
    computedLocationY,
  }
}
