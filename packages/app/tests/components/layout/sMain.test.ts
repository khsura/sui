import { enableAutoUnmount, mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { SApp, SAppBar, SLayout, SMain } from '@/app/components'
import { defaultToolbarContentHeight } from '@/app/constants'

enableAutoUnmount(afterEach)

const layoutName = 'mainTest'

const NamedLayout = defineComponent({
  components: { SApp, SAppBar, SLayout, SMain },
  props: { appBarPosition: { type: String, default: undefined } },
  setup: () => ({ layoutName }),
  template: `
    <SApp>
      <SLayout :name="layoutName" height="320">
        <SAppBar :for="layoutName" :position="appBarPosition">Title</SAppBar>
        <SMain :for="layoutName">content</SMain>
      </SLayout>
    </SApp>
  `,
})

describe('SMain', () => {
  test('an app bar in the flow is left out of the main minimum height, so the layout does not overflow', async () => {
    const wrapper = mount(NamedLayout)

    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')

    expect(mainStyle).toContain(`min-height: calc(100% - ${defaultToolbarContentHeight}px)`)
    expect(mainStyle).toContain('margin-top: 0px')
  })

  test('a fixed app bar becomes the main top margin and is left out of its minimum height', async () => {
    const wrapper = mount(NamedLayout, { props: { appBarPosition: 'fixed' } })

    await nextTick()

    const mainStyle = wrapper.find('.s_main').attributes('style')
    // The fixed bar pads itself by the notch inset (0px without a safe area), so the content moves down by it too.
    // jsdom drops a `margin-top` that holds var(); the Layout/Safe Area story asserts the margin in a real browser.
    const topInset = 'var(--s-safe-area-top, env(safe-area-inset-top, 0px))'

    expect(mainStyle).toContain(`min-height: calc(100% - calc(${defaultToolbarContentHeight}px + ${topInset}))`)
  })
})
