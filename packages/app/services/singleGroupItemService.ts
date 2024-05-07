import { type ProviderName } from '@sui/app/constants/provider'
import { type Provider, type PropsSingleGroupItem } from '@sui/app/definitions'
import { useGroupCoreItemService } from '@sui/app/services/core/groupCoreItemService'

export const useSingleGroupItemService = (
  props: PropsSingleGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, false, injectParams)
}
