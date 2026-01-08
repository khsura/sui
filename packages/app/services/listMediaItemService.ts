import { computed, inject } from 'vue'
import { ProviderPropsName } from '@/app/configs'
import { type PropsListMediaItem } from '@/app/definitions'

export const useListMediaItemService = (props: PropsListMediaItem, options: { componentName: string }) => {
  const listProps = inject(ProviderPropsName.listProps, null)

  const classes = computed(() => {
    return {
      [`s_${options.componentName}`]: true,
      [`s_${options.componentName}--align__center`]: props.alignCenter,
      [`s_${options.componentName}--dense`]: listProps?.dense ?? props.dense,
    }
  })

  return {
    classes,
  }
}
