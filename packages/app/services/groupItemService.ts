import { type ProviderName } from '@sui/app/constants/provider'
import { type PropsGroupItem } from '@sui/app/definitions'
import { useGroupCoreItemService } from '@sui/app/services/core/groupCoreItemService'
import { type Provider } from '@sui/app/types'

export const useGroupItemService = (
  props: PropsGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, true, injectParams)
}
