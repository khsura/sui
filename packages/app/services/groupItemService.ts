import { type GroupProvider, type PropsGroupItem } from '@/app/definitions'
import { useGroupCoreItemService } from '@/app/services/core/groupCoreItemService'

export const useGroupItemService = (
  props: PropsGroupItem,
  injectParams?: Parameters<GroupProvider['registerItem']>[1],
) => {
  return useGroupCoreItemService(props, true, injectParams)
}
