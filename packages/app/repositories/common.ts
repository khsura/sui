import { appPrefix } from '@khsura/sui/constants'
import { type ComponentBlockName } from '@khsura/sui/constants/componentBlockName'

interface ClassNameParameter {
  block?: ComponentBlockName | string | null | undefined
  element?: string | null | undefined
  modifier?: string
  property?: string | number | null
}

export const createClassNamer = (presetAttrs: ClassNameParameter) => {
  const preset = { ...presetAttrs }

  return (attrs?: ClassNameParameter) => getClassName({ ...preset, ...attrs })
}

export const getClassName = (attr: ClassNameParameter) => {
  const prefixConnector = '_'
  let className = appPrefix

  if (attr.block !== null && attr.block !== undefined) {
    className += prefixConnector + attr.block
  }

  if ((attr.element !== null && attr.element) !== undefined) {
    className += (className === appPrefix ? prefixConnector : '__') + attr.element
  }

  if (attr.modifier !== undefined) {
    className += (className === appPrefix ? prefixConnector : '--') + attr.modifier
  }

  if (attr.property !== undefined) {
    className += (className === appPrefix ? prefixConnector : '__') + (attr.property ?? 'none')
  }

  return className
}
