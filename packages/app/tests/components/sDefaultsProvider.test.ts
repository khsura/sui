import { config, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'
import { SApp, SButton, SChip, SDefaultsProvider } from '@/app/components'
import { createSUI } from '@/app/modules'
import type { AppStateOptions, ComponentDefaultsOptions } from '@/app/definitions'

const originalPlugins = [...config.global.plugins]

const mountTree = (template: string, setup: () => object = () => ({}), options: AppStateOptions = {}) => {
  config.global.plugins = [createSUI(options)]

  return mount(
    defineComponent({
      components: { SApp, SButton, SChip, SDefaultsProvider },
      setup,
      template: `<SApp>${template}</SApp>`,
    }),
  )
}

const buttonSize = (wrapper: ReturnType<typeof mountTree>, testId: string) => {
  const classes = wrapper.get(`[data-testid="${testId}"]`).classes()

  return classes.find((name) => name.startsWith('s_button--size__'))?.replace('s_button--size__', '')
}

describe('SDefaultsProvider', () => {
  afterEach(() => {
    config.global.plugins = originalPlugins
  })

  test('renders only its slot, with no wrapper element', () => {
    const wrapper = mountTree(
      `<div class="host"><SDefaultsProvider><span class="child">x</span></SDefaultsProvider></div>`,
    )

    expect(wrapper.get('.host').element.children).toHaveLength(1)
    expect(wrapper.get('.host > .child').text()).toBe('x')
  })

  test('scopes defaults to its subtree only', () => {
    const wrapper = mountTree(`
      <SButton data-testid="outside">Out</SButton>
      <SDefaultsProvider :defaults="{ SButton: { size: 'small' } }">
        <SButton data-testid="inside">In</SButton>
      </SDefaultsProvider>
    `)

    expect(buttonSize(wrapper, 'inside')).toBe('small')
    expect(buttonSize(wrapper, 'outside')).not.toBe('small')
  })

  test('merges onto the app-level defaults instead of replacing them', () => {
    const wrapper = mountTree(
      `
      <SDefaultsProvider :defaults="{ SButton: { size: 'small' } }">
        <SButton data-testid="inside">In</SButton>
      </SDefaultsProvider>
    `,
      undefined,
      { defaults: { SButton: { variant: 'text', size: 'large' } } },
    )

    const classes = wrapper.get('[data-testid="inside"]').classes()

    expect(buttonSize(wrapper, 'inside')).toBe('small')
    expect(classes).toContain('s_button--text')
  })

  test('nested providers merge: inner wins per prop, outer props and global stay', () => {
    const wrapper = mountTree(
      `
      <SDefaultsProvider :defaults="{ SButton: { size: 'large', variant: 'text' }, global: { size: 'small' } }">
        <SButton data-testid="outer">Outer</SButton>
        <SChip data-testid="outerChip">Chip</SChip>
        <SDefaultsProvider :defaults="{ SButton: { size: 'mini' } }">
          <SButton data-testid="inner">Inner</SButton>
          <SChip data-testid="innerChip">Chip</SChip>
        </SDefaultsProvider>
      </SDefaultsProvider>
    `,
      undefined,
      { defaults: { global: { size: 'extra' } } },
    )

    expect(buttonSize(wrapper, 'outer')).toBe('large')
    expect(buttonSize(wrapper, 'inner')).toBe('mini')
    expect(wrapper.get('[data-testid="inner"]').classes()).toContain('s_button--text')
    expect(wrapper.get('[data-testid="innerChip"]').classes()).toContain('s_chip--size__small')
    expect(wrapper.get('[data-testid="outerChip"]').classes()).toContain('s_chip--size__small')
  })

  test('an explicit prop still wins over the provider', () => {
    const wrapper = mountTree(`
      <SDefaultsProvider :defaults="{ SButton: { size: 'small' } }">
        <SButton data-testid="inside" size="large">In</SButton>
      </SDefaultsProvider>
    `)

    expect(buttonSize(wrapper, 'inside')).toBe('large')
  })

  test('re-renders when its defaults change, and nested providers follow', async () => {
    const defaults = ref<ComponentDefaultsOptions>({ SButton: { size: 'small' } })

    const wrapper = mountTree(
      `
      <SDefaultsProvider :defaults="defaults">
        <SButton data-testid="outer">Outer</SButton>
        <SDefaultsProvider :defaults="{ SButton: { variant: 'text' } }">
          <SButton data-testid="inner">Inner</SButton>
        </SDefaultsProvider>
      </SDefaultsProvider>
    `,
      () => ({ defaults }),
    )

    expect(buttonSize(wrapper, 'inner')).toBe('small')

    defaults.value = { SButton: { size: 'large' } }
    await nextTick()

    expect(buttonSize(wrapper, 'outer')).toBe('large')
    expect(buttonSize(wrapper, 'inner')).toBe('large')
    expect(wrapper.get('[data-testid="inner"]').classes()).toContain('s_button--text')
  })
})
