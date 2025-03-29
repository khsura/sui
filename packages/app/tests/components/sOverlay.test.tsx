import { mount } from '@vue/test-utils'
import { SOverlay } from '~/components'
import { overlaysContainerId, type PropsOverlay } from '~/index'

describe('SOverlay', () => {
  const slotId = 'one'
  const slotContent = `<div id="${slotId}">main content</div>`
  const defaultProps: Partial<PropsOverlay> = { value: false, disabled: false, scrim: false, position: null }

  beforeEach(() => {
    const el = document.createElement('div')

    el.id = overlaysContainerId
    document.body.appendChild(el)
  })

  afterEach(() => {
    // clean up
    document.body.innerHTML = ''
  })

  it('do not display slot if value is false and disabled is false', () => {
    const overlayWrapper = mount(SOverlay, {
      props: defaultProps,
      slots: { default: slotContent },
    })

    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('slot will be sent to other places if it is not disabled', async () => {
    const overlayWrapper = mount(SOverlay, {
      props: defaultProps,
      slots: { default: slotContent },
    })

    await overlayWrapper.setProps({ value: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(false)
  })

  it('display slot when value is true', async () => {
    const overlayWrapper = mount(SOverlay, {
      props: defaultProps,
      slots: { default: slotContent },
    })

    await overlayWrapper.setProps({ value: true, disabled: true })
    expect(overlayWrapper.find(`#${slotId}`).exists()).toBe(true)
  })

  it('display overlay/scrim if scrim is true', async () => {
    const overlayWrapper = mount(SOverlay, {
      props: defaultProps,
      slots: { default: slotContent },
    })

    await overlayWrapper.setProps({ value: true, disabled: true, scrim: true })
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(true)
  })

  it('do not display overlay/scrim flags are not set', async () => {
    const overlayWrapper = mount(SOverlay, {
      props: defaultProps,
      slots: { default: slotContent },
    })

    await overlayWrapper.setProps({ value: true, disabled: true })
    expect(overlayWrapper.find('.s_overlay').exists()).toBe(false)
  })
})
