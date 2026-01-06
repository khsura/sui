import { type GroupProvider, type PropsSingleGroupItem } from '@/app/definitions'
import { useGroupCoreItemService } from '@/app/services/core/groupCoreItemService'

export const useSingleGroupItemService = (
  props: PropsSingleGroupItem,
  injectParams?: Parameters<GroupProvider['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, false, injectParams)
}
