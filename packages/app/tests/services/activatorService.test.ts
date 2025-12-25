import { Browser } from 'happy-dom'
import { ref, shallowRef } from 'vue'
import { type PropsActivator } from '@/app/index'
import { useActivatorService } from '@/app/services'

const defaultPropsActivator: PropsActivator = {
  disabled: false,
  readonly: false,
  activator: 'string',
  preventCloseOnClick: false,
}

describe('useActivatorService', () => {
  describe('computedActivatorElement', () => {
    it('should return null if activator prop is not provided and activator Element is null', () => {
      const props = {
        ...defaultPropsActivator,
        activator: null,
      }

      const model = ref(false)
      const activatorElement = shallowRef<HTMLElement | null>(null)
      const { computedActivatorElement } = useActivatorService(props, model, activatorElement)

      expect(activatorElement.value).toBeNull()
      expect(computedActivatorElement.value).toBeNull()
    })

    it('should return the first element child if activator element is not null', () => {
      const props = {
        ...defaultPropsActivator,
      }

      const browser = new Browser()
      const page = browser.newPage()

      page.content = '<!DOCTYPE html><p id="dd"><span id="cc">Hi</span>Hello world</p>'
      const model = ref(false)
      const activatorElement = shallowRef<HTMLElement | null>(null)
      const { computedActivatorElement } = useActivatorService(props, model, activatorElement)
      const sampleNode = page.mainFrame.window.document.getElementById('dd') as unknown as HTMLElement

      activatorElement.value = sampleNode
      expect(computedActivatorElement.value?.textContent).toBe(sampleNode?.firstElementChild?.textContent)
    })

    it('should retrieve the activator from the document if activator prop is a string', () => {
      const props = {
        ...defaultPropsActivator,
        activator: '#ab',
      }

      const browser = new Browser()
      const page = browser.newPage()

      page.content = '<!DOCTYPE html><p id="dd"><span id="ab">Hi</span>Hello world</p>'
      const documentSpy = vi.spyOn(global, 'document', 'get')

      documentSpy.mockImplementation(() => page.mainFrame.window.document as unknown as Document)

      const model = ref(false)
      const { computedActivatorElement } = useActivatorService(props, model)
      const sampleNode = page.mainFrame.window.document.getElementById('ab')

      expect(computedActivatorElement.value?.textContent).toBe(sampleNode?.textContent)

      documentSpy.mockRestore()
    })
  })

  describe('getActivatorLocation', () => {
    it('should return null if no computed activator element', () => {
      const props = {
        ...defaultPropsActivator,
        activator: null,
      }

      const model = ref(false)
      const { computedActivatorElement, getActivatorLocation } = useActivatorService(props, model)
      const result = getActivatorLocation()

      expect(computedActivatorElement.value).toBeNull()
      expect(result).toBeNull()
    })

    it('should return the size and position of the computed activator element', () => {
      const props = {
        ...defaultPropsActivator,
        activator: null,
      }

      const model = ref(false)
      const activatorElement = shallowRef<HTMLElement | null>(null)
      const { getActivatorLocation } = useActivatorService(props, model, activatorElement)
      const browser = new Browser()
      const page = browser.newPage()

      page.content = '<!DOCTYPE html><body><div id="dd"><span id="cc">Hi</span>Hello world</div></body>'
      const sampleNode = page.mainFrame.window.document.getElementById('dd') as unknown as HTMLElement

      activatorElement.value = sampleNode

      const result = getActivatorLocation()

      expect(result?.bottom).toBe(0)
      expect(result?.top).toBe(0)
      expect(result?.left).toBe(0)
      expect(result?.right).toBe(0)
    })
  })

  describe('activatorOn', () => {
    it('should have click method', () => {
      const props = {
        ...defaultPropsActivator,
        activator: null,
      }

      const model = ref(false)
      const { activatorOn } = useActivatorService(props, model)

      expect('click' in activatorOn).toBe(true)
    })

    test('click method should set model value to true if no closeOnClick prop', () => {
      const props = {
        ...defaultPropsActivator,
        closeOnClick: null,
      }

      const model = ref(false)
      const { activatorOn } = useActivatorService(props, model)

      expect(model.value).toBe(false)
      activatorOn.click()
      expect(model.value).toBe(true)
    })

    test('click method should set model value to false if closeOnClick prop and model value is set', () => {
      const props = {
        ...defaultPropsActivator,
        closeOnClick: true,
      }

      const model = ref(false)
      const { activatorOn } = useActivatorService(props, model)

      expect(model.value).toBe(false)
      activatorOn.click()
      expect(model.value).toBe(true)
      activatorOn.click()
      expect(model.value).toBe(false)
    })
  })

  describe('activatorAttrs', () => {
    it('should return an object with disabled and readonly properties that match the corresponding prop values', () => {
      const props = {
        ...defaultPropsActivator,
        disabled: true,
        readonly: true,
      }

      const model = ref(false)
      const { activatorAttrs } = useActivatorService(props, model)

      expect('disabled' in activatorAttrs.value).toBe(true)
      expect('readonly' in activatorAttrs.value).toBe(true)
      expect(activatorAttrs.value.disabled).toBe(true)
      expect(activatorAttrs.value.readonly).toBe(true)
    })
  })
})
