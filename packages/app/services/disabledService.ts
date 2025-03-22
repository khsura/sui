import { computed, isRef } from 'vue'
import { type ComputedRef } from 'vue'
import { type PropsDisabled } from '@khsura/sui/definitions'

export const useDisabledService = (props: PropsDisabled | ComputedRef<PropsDisabled>) => {
  const getValue = (key: keyof PropsDisabled) => {
    if (isRef(props)) {
      return props.value[key] ?? false
    }

    return props[key] ?? false
  }

  const classListDisabled = computed(() => {
    return {
      s_disabled: getValue('disabled'),
      s_readonly: getValue('readonly'),
    }
  })

  const classListTextDisabled = computed(() => {
    return {
      's_text--disabled': getValue('disabled'),
      's_text--readonly': getValue('readonly'),
    }
  })

  return {
    classListDisabled,
    classListTextDisabled,
  }
}
