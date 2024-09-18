interface Params {
  position: 'absolute' | 'relative' | 'fixed' | null | undefined | 'sticky' | 'static'
  app?: boolean
  name?: string
  for?: string
}

export const getIsAbsolutePosition = (params: Params) => {
  return params.position === 'absolute'
}

export const getIsFixedPosition = (params: Params) => {
  if (getIsAbsolutePosition(params)) {
    return false
  }

  return params.position === 'fixed'
}

export const getIsFixedOrAbsolutePosition = (params: Params) => {
  return getIsAbsolutePosition(params) || getIsFixedPosition(params)
}
