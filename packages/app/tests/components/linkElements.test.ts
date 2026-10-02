import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { SApp, SButton, SCard, SListItem } from '@/app/components'

/**
 * A component given `to` has to render a real link.
 *
 * `useLinkService` picks `router-link` for `to` and `a` for `href`, which is
 * the right split — `to` is an internal route, `href` an external URL. But
 * each component then bound *both* on the rendered element:
 *
 *     <Component :is="tagName" :href="href" :to="to">
 *
 * With `to` set, `href` is `undefined`, and `RouterLink` does not declare
 * `href` as a prop — so the undefined lands in `attrs` and is spread over the
 * `<a>` that `RouterLink` renders, removing the `href` it had just computed.
 * Vue drops an attribute whose value is `undefined`.
 *
 * The result is an `<a>` with no `href`, which is not a hyperlink: no
 * ⌘-click or middle-click into a new tab, no "copy link address", no
 * destination in the status bar, and no link semantics for assistive
 * technology. Navigation still worked, because `RouterLink`'s click handler
 * survived — so this looked fine and was reported only when somebody tried
 * to ⌘-click a menu item.
 */

const route = '/target'

const routerFor = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: route, component: { template: '<div />' } },
    ],
  })

const mountInApp = async (component: unknown, props: Record<string, unknown>, router: Router) => {
  const wrapper = mount(
    defineComponent({
      components: { SApp, comp: component as never },
      template: '<SApp><comp v-bind="$attrs">link</comp></SApp>',
      inheritAttrs: false,
    }),
    { attrs: props, global: { plugins: [router] } },
  )

  await router.isReady()

  return wrapper
}

describe('a component given `to`', () => {
  test.each([
    ['SButton', SButton],
    ['SCard', SCard],
    ['SListItem', SListItem],
  ])('%s renders an anchor carrying href', async (_name, component) => {
    const router = routerFor()
    const wrapper = await mountInApp(component, { to: route }, router)
    const anchor = wrapper.find('a')

    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe(route)
  })

  /**
   * The other half of the split, so a fix cannot trade one for the other.
   * An external URL stays an `<a href>` and must not gain a `to`.
   */
  test.each([
    ['SButton', SButton],
    ['SCard', SCard],
    ['SListItem', SListItem],
  ])('%s still renders an external href as a plain anchor', async (_name, component) => {
    const router = routerFor()
    const external = 'https://example.com/docs'
    const wrapper = await mountInApp(component, { href: external }, router)
    const anchor = wrapper.find('a')

    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe(external)
    expect(anchor.attributes('to')).toBeUndefined()
  })

  /** Neither prop: the component keeps its ordinary tag and is not a link. */
  test.each([
    ['SButton', SButton],
    ['SCard', SCard],
    ['SListItem', SListItem],
  ])('%s without either prop renders no anchor', async (_name, component) => {
    const router = routerFor()
    const wrapper = await mountInApp(component, {}, router)

    expect(wrapper.find('a').exists()).toBe(false)
  })
})
