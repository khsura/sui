import { type ProviderName } from '~/constants/provider'
import { type Provider, type PropsGroupItem } from '~/definitions'
import { useGroupCoreItemService } from '~/services/core/groupCoreItemService'

export const useGroupItemService = (
  props: PropsGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, true, injectParams)
}
