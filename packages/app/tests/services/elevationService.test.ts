import { type PropsElevation } from '@sui/app/definitions/props'
import { useElevationService } from '@sui/app/services'

describe('useElevationService', () => {
  describe('classListElevation', () => {
    test('class list elevation should produce modifier class from a number', () => {
      const props: PropsElevation = {
        elevation: 1,
      }

      const { classListElevation } = useElevationService(props)

      expect(classListElevation.value).toEqual({ s_elevation__1: true })
    })

    test('if prop elevation is not provided then no class wil be provided', () => {
      const { classListElevation } = useElevationService({ elevation: null })

      expect(classListElevation.value).toEqual({})
    })

    test('if prop elevation is higher than 24 then it will be ignored', () => {
      const { classListElevation } = useElevationService({ elevation: 25 })

      expect(classListElevation.value).toEqual({})
    })
  })
})
