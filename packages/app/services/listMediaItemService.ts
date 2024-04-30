import { ProviderPropsName } from '@sui/app/constants'
import { type PropsListMediaItem } from '@sui/app/definitions'
import { computed } from 'vue'
import { useProviderRepository } from '@sui/app/repositories'

export const useListMediaItemService = (props: PropsListMediaItem, options: { componentName: string }) => {
  const { injectParentProps } = useProviderRepository()
  const listProps = injectParentProps(ProviderPropsName.listProps)

  const classes = computed(() => {
    return {
      [`s_${options.componentName}`]: true,
      [`s_${options.componentName}--align__center`]: props.alignCenter,
      [`s_${options.componentName}--dense`]: listProps.value.dense ?? props.dense,
    }
  })

  return {
    classes,
  }
}
