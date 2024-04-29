interface Params {
  position: 'absolute' | 'relative' | 'fixed' | null | undefined
  app?: boolean
}

export const getIsAbsolutePosition = (params: Params) => {
  return params.position === 'absolute'
}

export const getIsFixedPosition = (params: Params, options?: { ignoreApp?: boolean }) => {
  if (getIsAbsolutePosition(params)) {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return (!options?.ignoreApp && params.app && params.position === undefined) || params.position === 'fixed'
}

export const getIsFixedOrAbsolutePosition = (params: Params, options?: { ignoreApp?: boolean }) => {
  return getIsAbsolutePosition(params) || getIsFixedPosition(params, options)
}
