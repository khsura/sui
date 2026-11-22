import { config, mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { afterEach, describe, expect, test } from 'vitest'
import {
  SAutocomplete,
  SButton,
  SChip,
  SFileInput,
  SInput,
  SList,
  SListItem,
  SNumberInput,
  SSelect,
  STable,
  STextarea,
  SToolbar,
} from '@/app/components'
import { createSUI } from '@/app/modules'
import { useDensityService } from '@/app/services'
import type { ComponentDefaultsOptions } from '@/app/definitions'

const originalPlugins = [...config.global.plugins]

const useDefaults = (defaults?: ComponentDefaultsOptions) => {
  config.global.plugins = [createSUI({ defaults })]
}

const mountTemplate = (template: string) =>
  mount(
    defineComponent({
      components: { SButton, SInput, SList, SListItem, STable, SToolbar },
      template,
    }),
  )

describe('useDensityService', () => {
  test('default adds no class (today’s styles), other densities add s_density--<name>', () => {
    expect(useDensityService({ density: 'default' }).classListDensity.value).toEqual({})
    expect(useDensityService({}).classListDensity.value).toEqual({})
    expect(useDensityService({ density: 'compact' }).classListDensity.value).toEqual({ 's_density--compact': true })
    expect(useDensityService({ density: 'comfortable' }).density.value).toBe('comfortable')
  })

  test('an unknown value falls back to default', () => {
    // @ts-expect-error -- simulates an untyped template value
    expect(useDensityService({ density: 'tiny' }).density.value).toBe('default')
  })
})

describe('density through createSUI defaults', () => {
  afterEach(() => {
    config.global.plugins = originalPlugins
  })

  test('defaults.global.density reaches every density component', () => {
    useDefaults({ global: { density: 'compact' } })

    const components = {
      SAutocomplete,
      SButton,
      SChip,
      SFileInput,
      SInput,
      SList,
      SNumberInput,
      SSelect,
      STable,
      STextarea,
    }

    for (const [name, component] of Object.entries(components)) {
      const wrapper = mount(component, { props: { headers: [], items: [] } })

      expect(wrapper.find('.s_density--compact').exists(), name).toBe(true)
    }
  })

  test('without a configured density nothing changes', () => {
    useDefaults()

    const wrapper = mountTemplate('<div><SInput /><SButton>Save</SButton></div>')

    expect(wrapper.html()).not.toContain('s_density--')
  })

  test('an explicit density prop wins over the component default and the global one', () => {
    useDefaults({ global: { density: 'compact' }, SButton: { density: 'comfortable' } })

    const wrapper = mountTemplate(
      '<div><SButton class="configured">A</SButton><SButton class="explicit" density="default">B</SButton></div>',
    )

    expect(wrapper.find('.configured').classes()).toContain('s_density--comfortable')
    expect(
      wrapper
        .find('.explicit')
        .classes()
        .some((name) => name.startsWith('s_density--')),
    ).toBe(false)
  })

  test('dense stays independent: it keeps its own class and combines with the configured density', () => {
    useDefaults({ global: { density: 'compact' } })

    const wrapper = mountTemplate('<SInput dense />')

    expect(wrapper.classes()).toContain('s_input--dense')
    expect(wrapper.classes()).toContain('s_density--compact')
  })

  test('a list item follows its list unless it sets its own density', () => {
    useDefaults()

    const wrapper = mountTemplate(
      '<SList density="compact"><SListItem class="inherit">A</SListItem><SListItem class="own" density="comfortable">B</SListItem></SList>',
    )

    expect(wrapper.find('.inherit').classes()).toContain('s_density--compact')
    expect(wrapper.find('.own').classes()).toContain('s_density--comfortable')
  })

  test('SToolbar takes the global density and shrinks its content height', () => {
    useDefaults({ global: { density: 'compact' } })

    const wrapper = mountTemplate('<SToolbar>Title</SToolbar>')

    expect(wrapper.classes()).toContain('s_toolbar--density-compact')
    expect(wrapper.find('.s_toolbar__content').attributes('style')).toContain('height: 48px')
  })
})
