import { type PropsContent } from '@sui/app/definitions'
import { computed } from 'vue'

export const useContentService = (props: PropsContent) => {
  const classes = computed(() => {
    return {
      ...(typeof props.contentClass === 'string'
        ? { [props.contentClass]: true }
        : Array.isArray(props.contentClass)
          ? { [props.contentClass.join(' ')]: true }
          : props.contentClass),
    }
  })

  const styles = computed(() => {
    return {
      ...(typeof props.contentStyle === 'string'
        ? { [props.contentStyle]: true }
        : Array.isArray(props.contentStyle)
          ? { [props.contentStyle.join(' ')]: true }
          : props.contentStyle),
    }
  })

  return {
    classes,
    styles,
  }
}
