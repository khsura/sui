import { defineComponent, inject } from 'vue'
import { AppTheme, ProviderName, useTheme } from '@/app/index'
import { mountWithApp } from '@/app/tests/_helpers'

describe('app', () => {
  const app = mountWithApp(
    defineComponent({
      setup: () => {
        const config = inject(ProviderName.app)
        const { setTheme, theme } = useTheme()

        return { config, setTheme, theme }
      },
      template: `<div></div>`,
    }),
  )

  beforeEach(() => {
    // create teleport target
    const el = document.createElement('div')

    el.className = 's_overlayContainer'
    document.body.appendChild(el)
    app.vm.setTheme(AppTheme.light)
  })

  it('by default light theme will be used', () => {
    expect(app.vm.theme).toBe(AppTheme.light)
  })

  it('can change theme', () => {
    app.vm.setTheme(AppTheme.dark)
    expect(app.vm.theme).toBe(AppTheme.dark)
  })

  it('theme getter works', () => {
    app.vm.config.theme = AppTheme.dark
    expect(app.vm.theme).toBe(AppTheme.dark)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
})
