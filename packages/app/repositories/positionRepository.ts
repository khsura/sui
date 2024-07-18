import { ProviderName } from '@khsura/sui/constants'

interface Params {
  position: 'absolute' | 'relative' | 'fixed' | null | undefined
  app?: boolean
  name?: string
  for?: string
}

export const getIsAbsolutePosition = (params: Params) => {
  return params.position === 'absolute'
}

export const getIsFixedPosition = (params: Params, options?: { ignoreApp?: boolean }) => {
  if (getIsAbsolutePosition(params)) {
    return false
  }

  return (
    (!options?.ignoreApp &&
      (params.app === true || params.name === ProviderName.app || params.for === ProviderName.app) &&
      !params.position) ||
    params.position === 'fixed'
  )
}

export const getIsFixedOrAbsolutePosition = (params: Params, options?: { ignoreApp?: boolean }) => {
  return getIsAbsolutePosition(params) || getIsFixedPosition(params, options)
}
