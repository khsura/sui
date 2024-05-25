import { ProviderPropsName } from '@khsura/sui/constants'
import { type PropsListMediaItem } from '@khsura/sui/definitions'
import { computed } from 'vue'
import { useProviderRepository } from '@khsura/sui/repositories'

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
