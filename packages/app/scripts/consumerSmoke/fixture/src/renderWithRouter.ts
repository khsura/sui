import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createSUI } from '@khsura/sui'
import { expectAnchorHref, expectBreadcrumbHrefs, expectNoRouterLinkElement } from './linkAssertions'
import { linkDemo } from './linkDemo'

const page = { render: () => null }

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: page },
    { path: '/docs', name: 'docs', component: page },
  ],
})

await router.push('/')
await router.isReady()

const html = await renderToString(createSSRApp(linkDemo).use(router).use(createSUI()))

expectNoRouterLinkElement(html)
expectAnchorHref(html, 'path-link', '/docs')
// Only RouterLink can turn a route name into a URL, so this proves `to` rendered a router-link.
expectAnchorHref(html, 'named-link', '/docs')
expectAnchorHref(html, 'external-link', 'https://example.com')
expectBreadcrumbHrefs(html, ['/', '/docs'])
