import { faker } from '@sui/shared'
import type { VNodeChild } from 'vue'

// TODO (Sura) improve type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const argsSlot = <T extends VNodeChild | (() => any) | ((_: object) => any) | string>(
  value: T = faker.lorem.sentence({ min: 1, max: 6 }) as T,
): { default: T } => {
  return {
    default: value,
  }
}
