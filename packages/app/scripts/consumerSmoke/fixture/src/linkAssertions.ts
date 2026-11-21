const findAnchorTag = (html: string, id: string) => {
  const anchorTag = new RegExp(`<a\\b[^>]*\\bid="${id}"[^>]*>`).exec(html)?.[0]

  if (!anchorTag) {
    throw new Error(`Expected an <a> with id="${id}" in the rendered HTML:\n\n${html}`)
  }

  return anchorTag
}

export const expectAnchorHref = (html: string, id: string, href: string) => {
  const anchorTag = findAnchorTag(html, id)

  if (!anchorTag.includes(`href="${href}"`)) {
    throw new Error(`Expected #${id} to link to "${href}", got: ${anchorTag}`)
  }
}

export const expectAnchorWithoutHref = (html: string, id: string) => {
  const anchorTag = findAnchorTag(html, id)

  if (anchorTag.includes('href=')) {
    throw new Error(`Expected #${id} to have no href, got: ${anchorTag}`)
  }
}

export const expectNoRouterLinkElement = (html: string) => {
  if (html.includes('<router-link')) {
    throw new Error(`Rendered an unresolved <router-link> element:\n\n${html}`)
  }
}

export const expectBreadcrumbHrefs = (html: string, hrefs: string[]) => {
  const breadcrumbs = /<nav\b[^>]*aria-label="breadcrumbs"[^>]*>[\s\S]*?<\/nav>/.exec(html)?.[0] ?? ''
  const renderedHrefs = [...breadcrumbs.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((match) => match[1])

  if (renderedHrefs.join(' ') !== hrefs.join(' ')) {
    throw new Error(`Expected breadcrumb links ${hrefs.join(', ')}, got ${renderedHrefs.join(', ')}:\n\n${breadcrumbs}`)
  }
}
