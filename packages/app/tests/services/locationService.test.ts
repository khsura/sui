import { type PropsLocation } from '@khsura/sui/definitions'
import { useLocationService } from '@khsura/sui/services'

describe('useLocationService', () => {
  const props: PropsLocation = {
    location: null,
  }

  beforeEach(() => {
    props.location = null
  })

  afterEach(() => {
    props.location = null
  })

  describe('useLocationService', () => {
    test('Whether locationService can get & set location or not when props is passed as left', () => {
      props.location = 'left'
      const service = useLocationService(props)

      expect(service.isLeft.value).toBe(true)
    })
    test('Whether locationService can get & set location or not when props is passed as right', () => {
      props.location = 'right'
      const service = useLocationService(props)

      expect(service.isRight.value).toBe(true)
    })

    test('Whether locationService can get & set location or not when props is passed as top', () => {
      props.location = 'top'
      const service = useLocationService(props)

      expect(service.isTop.value).toBe(true)
    })

    test('Whether locationService can get & set location or not when props is passed as bottom', () => {
      props.location = 'bottom'
      const service = useLocationService(props)

      expect(service.isBottom.value).toBe(true)
    })

    test('Whether locationService returns the correct location when unimodal position is passed', () => {
      props.location = 'top'
      const service = useLocationService(props)

      expect(service.computedLocation.value).toEqual('top')
    })

    test('Whether locationService returns the correct location when bimodal position is passed as an Array', () => {
      props.location = ['right', 'bottom']

      const service = useLocationService(props)

      expect(service.computedLocationX.value).toEqual('right')
      expect(service.computedLocationY.value).toEqual('bottom')
    })

    test('Whether locationService return correct location at Y axis', () => {
      props.location = 'bottom'
      const service = useLocationService(props)

      expect(service.computedLocationY.value).toEqual('bottom')
    })

    test('Whether locationService return correct location at X axis', () => {
      props.location = 'left'
      const service = useLocationService(props)

      expect(service.computedLocationX.value).toEqual('left')
    })
  })
})
