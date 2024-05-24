import { SOverlay } from '@sui/app/components'
import { type PropsOverlay } from '@sui/app/definitions'
import { mount } from '@vue/test-utils'
import portalVue, { Portal, PortalTarget } from 'portal-vue'

describe('SOverlay', () => {
  const slotId = 'one'
  const slotContent = `<div id="${slotId}">main content</div>`
  const defaultProps: Partial<PropsOverlay> = { value: false, disabled: false, scrim: false, position: null }

  const overlayWrapper = mount(SOverlay, {
    props: defaultProps,
    slots: { default: slotContent },
    global: {
      plugins: [portalVue],
      components: {
        Portal,
        PortalTarget,
      },
    },
  })

  beforeEach(async () => {
    await overlayWrapper.setProps(defaultProps)
  })

  it('do not display slot if value is false and disabled is false', () => {
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('slot will be sent to other places if it is not disabled', async () => {
    await overlayWrapper.setProps({ value: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('display slot when value is true', async () => {
    await overlayWrapper.setProps({ value: true, disabled: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(true)
  })

  it('display overlay/scrim if scrim is true', async () => {
    await overlayWrapper.setProps({ value: true, disabled: true, scrim: true })
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(true)
  })

  it('do not display overlay/scrim flags are not set', async () => {
    await overlayWrapper.setProps({ value: true, disabled: true })
    console.log(overlayWrapper.html())
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(false)
  })
})
