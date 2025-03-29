import { type PropsMeasurableStyles } from '~/index'
import { useMeasurableStylesService } from '~/services'

describe('useMeasurableStyleService', () => {
  describe('measurableStyles', () => {
    it('should utilize the prop values to set the measurable styles', () => {
      const props: PropsMeasurableStyles = {
        height: 120,
        width: 280,
        maxHeight: 200,
        maxWidth: 300,
        minHeight: 50,
        minWidth: 60,
      }

      const { measurableStyles } = useMeasurableStylesService(props)

      expect(measurableStyles.value).toEqual({
        height: '120px',
        width: '280px',
        maxHeight: '200px',
        maxWidth: '300px',
        minHeight: '50px',
        minWidth: '60px',
      })
    })

    it('should handle non integer string percentage values', () => {
      const props: PropsMeasurableStyles = {
        height: '120%',
        width: 280,
        maxHeight: 200,
        maxWidth: 300,
        minHeight: 50,
        minWidth: '30%',
      }

      const { measurableStyles } = useMeasurableStylesService(props)

      expect(measurableStyles.value).toEqual({
        height: '120%',
        width: '280px',
        maxHeight: '200px',
        maxWidth: '300px',
        minHeight: '50px',
        minWidth: '30%',
      })
    })
  })
})
