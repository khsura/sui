import { type Mutable } from '@vueuse/core'
import { reactive } from 'vue'
import { type PropsPosition } from '@khsura/sui/definitions'
import { usePositionService } from '@khsura/sui/services/positionService'

describe('positionService', () => {
  it('can set position properly', () => {
    const props = reactive<Mutable<PropsPosition>>({ position: null })
    const service = usePositionService(props)

    expect(service.classListPosition.value).not.toHaveProperty('s_position__absolute')
    expect(service.classListPosition.value).not.toHaveProperty('s_position__fixed')
    expect(service.isAbsolutePosition.value).toBe(false)
    expect(service.isFixedPosition.value).toBe(false)

    props.position = 'fixed'

    expect(service.classListPosition.value).not.toHaveProperty('s_position__absolute')
    expect(service.classListPosition.value.s_position__fixed).toBe(true)
    expect(service.isAbsolutePosition.value).toBe(false)
    expect(service.isFixedPosition.value).toBe(true)

    props.position = 'absolute'

    expect(service.classListPosition.value.s_position__absolute).toBe(true)
    expect(service.classListPosition.value).not.toHaveProperty('s_position__fixed')
    expect(service.isAbsolutePosition.value).toBe(true)
    expect(service.isFixedPosition.value).toBe(false)
  })
})
