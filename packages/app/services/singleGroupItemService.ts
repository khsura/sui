import { type ProviderName } from '@/app/constants/provider'
import { type Provider, type PropsSingleGroupItem } from '@/app/definitions'
import { useGroupCoreItemService } from '@/app/services/core/groupCoreItemService'

export const useSingleGroupItemService = (
  props: PropsSingleGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, false, injectParams)
}
