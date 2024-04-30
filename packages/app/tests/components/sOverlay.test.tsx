import { SOverlay } from '@sui/app/components'
import { type PropsOverlay } from '@sui/app/definitions'
import { mount } from '@vue/test-utils'
import { type Mutable } from '@vueuse/core'
import portalVue from 'portal-vue'

describe('SOverlay', () => {
  const slotId = 'one'
  const slotContent = `<div id="${slotId}">main content</div>`
  const defaultProps: Partial<PropsOverlay> = { value: false, disabled: false, scrim: false, position: null }

  const getWrapper = (props: Mutable<Partial<PropsOverlay>>) =>
    mount(SOverlay, {
      props,
      slots: { default: slotContent },
      global: {
        plugins: [portalVue],
      },
    })

  beforeEach(() => {
    // create teleport target
    const el = document.createElement('div')

    el.className = 's_overlayContainer'
    document.body.appendChild(el)
  })

  it('do not display slot if value is false and disabled is false', () => {
    const overlayWrapper = getWrapper(defaultProps)

    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('slot will be sent to other places if it is not disabled', async () => {
    const overlayWrapper = getWrapper(defaultProps)

    await overlayWrapper.setProps({ value: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('display slot when value is true', async () => {
    const overlayWrapper = getWrapper(defaultProps)

    await overlayWrapper.setProps({ value: true, disabled: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(true)
  })

  it('display overlay/scrim if scrim is true', async () => {
    const overlayWrapper = getWrapper(defaultProps)

    await overlayWrapper.setProps({ value: true, disabled: true, scrim: true })
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(true)
  })

  it('do not display overlay/scrim flags are not set', async () => {
    const overlayWrapper = getWrapper(defaultProps)

    await overlayWrapper.setProps({ value: true, disabled: true })
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(false)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
})
