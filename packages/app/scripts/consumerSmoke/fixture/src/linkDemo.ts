import { h } from 'vue'
import { SApp, SBreadcrumbs, SButton } from '@khsura/sui'

/** The same small page in every check: internal links (`to`), an external link (`href`) and breadcrumbs. */
export const linkDemo = {
  render: () =>
    h(SApp, null, () => [
      h(SButton, { id: 'path-link', to: '/docs' }, () => 'Docs'),
      h(SButton, { id: 'named-link', to: { name: 'docs' } }, () => 'Docs by name'),
      h(SButton, { id: 'external-link', href: 'https://example.com' }, () => 'External'),
      h(SBreadcrumbs, {
        items: [{ text: 'Home', to: '/' }, { text: 'Docs', to: '/docs' }, { text: 'Here' }],
      }),
    ]),
}
