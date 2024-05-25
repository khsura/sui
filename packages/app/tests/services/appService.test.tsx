import { AppTheme } from '@khsura/sui/constants'
import { useAppProviderService, useAppService } from '@khsura/sui/services'
import { useTheme } from '@khsura/sui/index'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SApp } from '@khsura/sui/components'
import portalVue from 'portal-vue'

describe('app', () => {
  const app = mount(
    defineComponent({
      components: { SApp },
      setup: () => {
        const { config } = useAppProviderService()
        const { styles } = useAppService({ app: true, name: null })
        const { setTheme, theme } = useTheme()

        return { config, setTheme, styles, theme }
      },
      template: `<SApp></SApp>`,
    }),
    {
      global: {
        plugins: [portalVue],
      },
    },
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
