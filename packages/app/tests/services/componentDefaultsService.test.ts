import { config, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, provide, shallowRef } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'
import { createSUI } from '@/app/modules'
import { useComponentDefaultsService } from '@/app/services'
import { ProviderName } from '@/app/configs'
import type { AppState, AppStateOptions, ComponentDefaultsOptions, ComponentsOption } from '@/app/definitions'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'

const STest = defineComponent({
  name: 'STest',
  props: {
    label: { type: String, default: 'vue-default' },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: 'small' },
  },
  setup(rawProps) {
    const props = useComponentDefaultsService('STest', rawProps)

    return () =>
      h('div', {
        class: 's-test',
        'data-label': props.label,
        'data-disabled': String(props.disabled),
        'data-size': props.size,
      })
  },
})

const originalPlugins = [...config.global.plugins]

const mountWithComponents = (componentsCfg?: ComponentsOption, parentProps: Record<string, unknown> = {}) => {
  config.global.plugins = [createSUI({ components: componentsCfg })]

  return mount(STest, { props: parentProps })
}

describe('useComponentDefaultsService with withDefaults', () => {
  afterEach(() => {
    config.global.plugins = originalPlugins
  })

  test('falls back to withDefaults value when neither parent nor appState provide it', () => {
    const wrapper = mountWithComponents()

    expect(wrapper.attributes('data-label')).toBe('vue-default')
    expect(wrapper.attributes('data-disabled')).toBe('false')
    expect(wrapper.attributes('data-size')).toBe('small')
  })

  test('appState default wins over withDefaults default when parent omits the prop', () => {
    const wrapper = mountWithComponents({ STest: { label: 'config-default', size: 'large' } })

    expect(wrapper.attributes('data-label')).toBe('config-default')
    expect(wrapper.attributes('data-size')).toBe('large')
  })

  test('parent-supplied prop wins over appState default', () => {
    const wrapper = mountWithComponents({ STest: { label: 'config-default' } }, { label: 'parent' })

    expect(wrapper.attributes('data-label')).toBe('parent')
  })

  test('parent boolean false wins over appState true (boolean coercion edge)', () => {
    const wrapper = mountWithComponents({ STest: { disabled: true } }, { disabled: false })

    expect(wrapper.attributes('data-disabled')).toBe('false')
  })

  test('appState true applies when parent omits the boolean, even though withDefaults default is false', () => {
    const wrapper = mountWithComponents({ STest: { disabled: true } })

    expect(wrapper.attributes('data-disabled')).toBe('true')
  })

  test('falls back to underlying value when appState has no entry for the component', () => {
    const wrapper = mountWithComponents({ SOther: { label: 'other-default' } })

    expect(wrapper.attributes('data-label')).toBe('vue-default')
  })

  test('falls back to underlying value when appState entry lacks the specific key', () => {
    const wrapper = mountWithComponents({ STest: { size: 'large' } })

    expect(wrapper.attributes('data-label')).toBe('vue-default')
    expect(wrapper.attributes('data-size')).toBe('large')
  })

  test('only string keys are intercepted (Symbol/non-string access bypasses Proxy logic)', () => {
    config.global.plugins = [createSUI({ components: { STest: { label: 'config' } } })]
    const wrapper = mount(STest)

    expect(wrapper.attributes('data-label')).toBe('config')
    expect(wrapper.exists()).toBe(true)
  })
})

const captured: { appState?: AppState } = {}

// Registered under real component names so the `global` target list applies to them.
const createStyledComponent = (componentName: string) =>
  defineComponent({
    name: `Fake${componentName}`,
    props: {
      size: { type: String, default: 'default' },
      color: { type: String, default: undefined },
      elevation: { type: [String, Number], default: undefined },
      ariaLabel: { type: String, default: undefined },
    },
    setup(rawProps) {
      const props = useComponentDefaultsService(componentName, rawProps)

      captured.appState = useAppProviderRepository().appState

      return () =>
        h('div', {
          'data-size': props.size,
          'data-color': String(props.color),
          'data-elevation': String(props.elevation),
          'data-aria-label': String(props.ariaLabel),
        })
    },
  })

const FakeButton = createStyledComponent('SButton')
const FakeCheckbox = createStyledComponent('SCheckbox')

const ColorOnly = defineComponent({
  props: { color: { type: String, default: undefined } },
  setup(rawProps) {
    const props = useComponentDefaultsService('SChip', rawProps)

    return () => h('div', { 'data-size': String(Reflect.get(props, 'size')), 'data-color': String(props.color) })
  },
})

const mountWithOptions = (
  component: ReturnType<typeof createStyledComponent> | typeof ColorOnly,
  options: AppStateOptions,
  parentProps: Record<string, unknown> = {},
) => {
  config.global.plugins = [createSUI(options)]

  return mount(component, { props: parentProps })
}

describe('useComponentDefaultsService resolution order (defaults + global)', () => {
  afterEach(() => {
    config.global.plugins = originalPlugins
  })

  const layered: ComponentDefaultsOptions = {
    SButton: { size: 'large' },
    global: { size: 'small', color: 'primary', elevation: 0 },
  }

  test('built-in default applies when nothing is configured', () => {
    const wrapper = mountWithOptions(FakeButton, {})

    expect(wrapper.attributes('data-size')).toBe('default')
    expect(wrapper.attributes('data-color')).toBe('undefined')
  })

  test('global wins over the built-in default', () => {
    const wrapper = mountWithOptions(FakeButton, { defaults: { global: { size: 'small' } } })

    expect(wrapper.attributes('data-size')).toBe('small')
  })

  test('component default wins over global', () => {
    const wrapper = mountWithOptions(FakeButton, { defaults: layered })

    expect(wrapper.attributes('data-size')).toBe('large')
    expect(wrapper.attributes('data-color')).toBe('primary')
    expect(wrapper.attributes('data-elevation')).toBe('0')
  })

  test('explicit prop wins over component default and global', () => {
    const wrapper = mountWithOptions(FakeButton, { defaults: layered }, { size: 'mini', color: 'error' })

    expect(wrapper.attributes('data-size')).toBe('mini')
    expect(wrapper.attributes('data-color')).toBe('error')
  })

  test('typed defaults win over the legacy components option', () => {
    const wrapper = mountWithOptions(FakeButton, {
      components: { SButton: { size: 'extra', color: 'secondary' } },
      defaults: { SButton: { size: 'large' } },
    })

    expect(wrapper.attributes('data-size')).toBe('large')
    expect(wrapper.attributes('data-color')).toBe('secondary')
  })

  test('legacy components option still wins over global', () => {
    const wrapper = mountWithOptions(FakeButton, {
      components: { SButton: { size: 'extra' } },
      defaults: { global: { size: 'small' } },
    })

    expect(wrapper.attributes('data-size')).toBe('extra')
  })

  test('global is ignored for a component that is not a target of the prop', () => {
    // SCheckbox's size scale is 'default' | 'large', so a global 'small' must not reach it.
    const wrapper = mountWithOptions(FakeCheckbox, { defaults: { global: { size: 'small', color: 'primary' } } })

    expect(wrapper.attributes('data-size')).toBe('default')
    expect(wrapper.attributes('data-color')).toBe('undefined')
  })

  test('global never adds a prop the component does not declare', () => {
    const wrapper = mountWithOptions(ColorOnly, { defaults: { global: { size: 'small', color: 'primary' } } })

    expect(wrapper.attributes('data-size')).toBe('undefined')
    expect(wrapper.attributes('data-color')).toBe('primary')
  })

  test('a kebab-case explicit prop still wins over the configured default', () => {
    config.global.plugins = [createSUI({ components: { SButton: { ariaLabel: 'configured' } } })]
    const wrapper = mount(FakeButton, { attrs: { 'aria-label': 'explicit' } })

    expect(wrapper.attributes('data-aria-label')).toBe('explicit')
  })

  test('re-renders when the app-level defaults change', async () => {
    const wrapper = mountWithOptions(FakeButton, { defaults: { global: { size: 'small' } } })

    if (!captured.appState) {
      throw new Error('app state was not captured')
    }

    captured.appState.defaults.global = { size: 'large' }
    await nextTick()

    expect(wrapper.attributes('data-size')).toBe('large')
  })

  test('a provided defaults layer replaces the app-level one and stays reactive', async () => {
    const scoped = shallowRef<ComponentDefaultsOptions>({ global: { size: 'mini' } })

    const Scope = defineComponent({
      setup() {
        provide(ProviderName.componentDefaults, scoped)

        return () => h(FakeButton)
      },
    })

    config.global.plugins = [createSUI({ defaults: { global: { size: 'small' } } })]
    const wrapper = mount(Scope)

    expect(wrapper.attributes('data-size')).toBe('mini')

    scoped.value = { SButton: { size: 'extra' } }
    await nextTick()

    expect(wrapper.attributes('data-size')).toBe('extra')
  })
})
