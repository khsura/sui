import { type ProviderName } from '@khsura/sui/constants/provider'
import { type Provider, type PropsGroupItem } from '@khsura/sui/definitions'
import { useGroupCoreItemService } from '@khsura/sui/services/core/groupCoreItemService'

export const useGroupItemService = (
  props: PropsGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, true, injectParams)
}
