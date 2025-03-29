import { type ProviderName } from '~/constants/provider'
import { type Provider, type PropsSingleGroupItem } from '~/definitions'
import { useGroupCoreItemService } from '~/services/core/groupCoreItemService'

export const useSingleGroupItemService = (
  props: PropsSingleGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, false, injectParams)
}
