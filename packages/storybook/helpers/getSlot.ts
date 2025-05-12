import type { VNodeChild } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Slot = VNodeChild | (() => any) | ((_: any) => any) | string | undefined

export const getSlot = (slot?: Slot | unknown) => {
  if (typeof slot === 'function') {
    return slot({})
  }

  return slot
}
