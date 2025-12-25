import { type ProviderName } from '@/app/constants/provider'
import { type Provider, type PropsGroupItem } from '@/app/definitions'
import { useGroupCoreItemService } from '@/app/services/core/groupCoreItemService'

export const useGroupItemService = (
  props: PropsGroupItem,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, true, injectParams)
}
