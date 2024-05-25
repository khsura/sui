import { type ProviderName } from '@khsura/sui/constants/provider'
import { type Provider, type PropsSingleGroupItem } from '@khsura/sui/definitions'
import { useGroupCoreItemService } from '@khsura/sui/services/core/groupCoreItemService'

export const useSingleGroupItemService = (
  props: PropsSingleGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, false, injectParams)
}
