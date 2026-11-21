import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createSUI } from '@khsura/sui'
import {
  expectAnchorHref,
  expectAnchorWithoutHref,
  expectBreadcrumbHrefs,
  expectNoRouterLinkElement,
} from './linkAssertions'
import { linkDemo } from './linkDemo'

// No vue-router in this app: `to` must degrade to a plain <a href>.
const html = await renderToString(createSSRApp(linkDemo).use(createSUI()))

expectNoRouterLinkElement(html)
expectAnchorHref(html, 'path-link', '/docs')
// A route given by name has no URL without the router's route table.
expectAnchorWithoutHref(html, 'named-link')
expectAnchorHref(html, 'external-link', 'https://example.com')
expectBreadcrumbHrefs(html, ['/', '/docs'])
