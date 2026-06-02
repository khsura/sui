import { defineComponent, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '@/app/index'
import { __resetThemeColorModeRegistry } from '@/app/helpers/themeColorMode'
import { mountWithApp } from '@/app/tests/_helpers'

const mountTheme = () =>
  mountWithApp(
    defineComponent({
      setup: () => {
        const { theme, preference, setTheme } = useTheme()

        return { theme, preference, setTheme }
      },
      template: `<div></div>`,
    }),
  )

describe('useThemeService', () => {
  beforeEach(() => {
    localStorage.clear()
    __resetThemeColorModeRegistry()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('defaults to auto preference, resolving to light when OS prefers light', () => {
    const app = mountTheme()

    expect(app.vm.preference).toBe('auto')
    expect(app.vm.theme).toBe('light') // matchMedia mock: matches=false
  })

  it('setTheme("dark") forces dark and updates the resolved theme synchronously', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')

    expect(app.vm.preference).toBe('dark')
    expect(app.vm.theme).toBe('dark')
  })

  it('setTheme persists the preference to localStorage', async () => {
    const app = mountTheme()

    app.vm.setTheme('dark')
    await nextTick() // useStorage write is flush: 'pre' — await one tick

    expect(localStorage.getItem('sui-theme')).toBe('dark')
  })

  it('setTheme(null) resets the preference to auto', () => {
    const app = mountTheme()

    app.vm.setTheme('dark')
    app.vm.setTheme(null)

    expect(app.vm.preference).toBe('auto')
  })

  it('never lets the resolved theme become "auto"', () => {
    const app = mountTheme()

    app.vm.setTheme('auto')

    expect(app.vm.preference).toBe('auto')
    expect(['light', 'dark']).toContain(app.vm.theme)
  })

  it('writes the resolved value to <html data-theme>', async () => {
    const app = mountTheme()

    app.vm.setTheme('dark')
    await nextTick() // useColorMode's attribute watcher is flush: 'post' — await one tick

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})
