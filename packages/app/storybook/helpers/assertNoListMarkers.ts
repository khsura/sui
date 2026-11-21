// SList, SListItemGroup, SBreadcrumbs and menu lists must never show a list marker (•, 1.), whatever tag they render.
// A marker is drawn for an element whose display is `list-item`, so every such element inside a list component
// must have `list-style-type: none`. Throws, so it can run inside a `waitFor` callback that retries.
const listRootSelector = '.s_list, .s_listItemGroup, .s_breadcrumbs'

export const assertNoListMarkers = (root: ParentNode) => {
  const lists = [...root.querySelectorAll(listRootSelector)]

  if (lists.length === 0) {
    throw new Error('no list found to check for list markers')
  }

  for (const list of lists) {
    for (const element of [list, ...list.querySelectorAll('*')]) {
      const style = getComputedStyle(element)

      if (style.display === 'list-item' && style.listStyleType !== 'none') {
        throw new Error(`"${element.textContent?.trim() ?? ''}" shows a list marker (${style.listStyleType})`)
      }
    }
  }
}
