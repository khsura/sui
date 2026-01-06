import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp } from '@/app/components'
import { AppTheme } from '@/app/constants'
import { useTheme } from '@/app/index'
import { useAppProviderService, useAppService } from '@/app/services'

describe('app', () => {
  const app = mount(
    defineComponent({
      components: { SApp },
      setup: () => {
        const { styles } = useAppService({ app: true, name: undefined })
        const { config } = useAppProviderService()
        const { setTheme, theme } = useTheme()

        return { config, setTheme, styles, theme }
      },
      template: `<SApp></SApp>`,
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
    app.vm.setTheme('dark')

    expect(app.vm.theme).toBe(AppTheme.dark)
  })

  // TODO: getter and config should be synced but this test is not doing that
  it('theme config getter should work', () => {
    app.vm.config.theme = AppTheme.dark

    expect(app.vm.config.theme).toBe(AppTheme.dark)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })
})
