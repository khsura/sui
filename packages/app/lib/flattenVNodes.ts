import { Comment, Fragment, type VNode } from 'vue'

// Flattens the vnodes a slot returns (v-for and <template> produce fragments) and drops comment nodes,
// so a component can count and slice the children it was given.
export const flattenVNodes = (nodes: VNode[] | undefined): VNode[] => {
  return (nodes ?? []).flatMap((node) => {
    if (node.type === Comment) {
      return []
    }

    if (node.type === Fragment && Array.isArray(node.children)) {
      return flattenVNodes(node.children.filter((child): child is VNode => typeof child === 'object' && child !== null))
    }

    return [node]
  })
}
