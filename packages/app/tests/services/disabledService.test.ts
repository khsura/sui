import { type ComputedRef, computed } from 'vue'
import { type PropsDisabled } from '~/definitions'
import { useDisabledService } from '~/services'

describe('useDisabledService', () => {
  describe('classListDisabled', () => {
    test('classListDisabled should apply disabled class based on prop (value)', () => {
      const props = {
        disabled: true,
        readonly: false,
      }

      const { classListDisabled } = useDisabledService(props)

      expect(classListDisabled.value).toEqual({
        s_disabled: true,
        s_readonly: false,
      })
    })

    test('classListDisabled should apply disabled class based on prop (computed)', () => {
      const disabled = computed(() => {
        return {
          disabled: true,
          readonly: false,
        }
      })

      const props: ComputedRef<PropsDisabled> = disabled
      const { classListDisabled } = useDisabledService(props)

      expect(classListDisabled.value).toEqual({
        s_disabled: true,
        s_readonly: false,
      })
    })
  })

  describe('classListTextDisabled', () => {
    test('classListTextDisabled should apply disabled class based on prop (value)', () => {
      const props = {
        disabled: true,
        readonly: false,
      }

      const { classListTextDisabled } = useDisabledService(props)

      expect(classListTextDisabled.value).toEqual({
        's_text--disabled': true,
        's_text--readonly': false,
      })
    })

    test('classListTextDisabled should apply disabled class based on prop (computed)', () => {
      const disabled = computed(() => {
        return {
          disabled: true,
          readonly: false,
        }
      })

      const props: ComputedRef<PropsDisabled> = disabled
      const { classListTextDisabled } = useDisabledService(props)

      expect(classListTextDisabled.value).toEqual({
        's_text--disabled': true,
        's_text--readonly': false,
      })
    })

    test('classListDisabled should apply disabled class based on prop (value)', () => {
      const props = {
        disabled: false,
        readonly: false,
      }

      const { classListDisabled } = useDisabledService(props)

      expect(classListDisabled.value).toEqual({
        s_disabled: false,
        s_readonly: false,
      })
    })

    test('classListDisabled should apply disabled class based on prop (computed)', () => {
      const disabled = computed(() => {
        return {
          disabled: false,
          readonly: false,
        }
      })

      const props: ComputedRef<PropsDisabled> = disabled
      const { classListDisabled } = useDisabledService(props)

      expect(classListDisabled.value).toEqual({
        s_disabled: false,
        s_readonly: false,
      })
    })
  })

  describe('classListTextDisabled', () => {
    test('classListTextDisabled should apply disabled class based on prop (value)', () => {
      const props: PropsDisabled = {
        disabled: false,
        readonly: false,
      }

      const { classListTextDisabled } = useDisabledService(props)

      expect(classListTextDisabled.value).toEqual({
        's_text--disabled': false,
        's_text--readonly': false,
      })
    })

    test('classListTextDisabled should apply disabled class based on prop (computed)', () => {
      const disabled = computed(() => {
        return {
          disabled: false,
          readonly: false,
        }
      })

      const props: ComputedRef<PropsDisabled> = disabled
      const { classListTextDisabled } = useDisabledService(props)

      expect(classListTextDisabled.value).toEqual({
        's_text--disabled': false,
        's_text--readonly': false,
      })
    })
  })
})
