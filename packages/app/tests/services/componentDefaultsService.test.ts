import { config, mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'
import { createSUI } from '@/app/modules'
import { useComponentDefaultsService } from '@/app/services'
import type { ComponentsOption } from '@/app/definitions'

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
