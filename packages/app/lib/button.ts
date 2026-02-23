import { ButtonType } from '@/app/constants'
import type { ButtonTypeType } from '@/app/types'

export const getButtonType = (type?: ButtonTypeType) => {
  return type ?? ButtonType.button
}
