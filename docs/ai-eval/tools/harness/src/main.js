// Harness: mirrors the getting-started skill (createSUI + base.css + style.css + @mdi/font + SApp root).
// Pages are told SUI is registered globally, so every S* export is registered as a global component.
import { createApp, h } from 'vue'
import * as Sui from '@khsura/sui'
import '@khsura/sui/base.css'
import '@khsura/sui/style.css'
import '@mdi/font/css/materialdesignicons.css'

const pages = import.meta.glob('../pages/*/Page.vue')
const raw = import.meta.glob('../pages/*/Page.vue', { query: '?raw', import: 'default' })
const id = new URLSearchParams(location.search).get('page')
const key = `../pages/${id}/Page.vue`

const start = async () => {
  const Page = (await pages[key]()).default
  const source = await raw[key]()
  const hasOwnSApp = /<SApp[\s>]/.test(source) || /<s-app[\s>]/.test(source)
  const Root = hasOwnSApp ? Page : { render: () => h(Sui.SApp, null, { default: () => h(Page) }) }
  const app = createApp(Root)

  app.use(Sui.createSUI())
  for (const [name, comp] of Object.entries(Sui)) {
    if (
      /^S[A-Z]/.test(name) &&
      comp &&
      typeof comp === 'object' &&
      (comp.setup || comp.render || comp.__name || comp.name)
    )
      app.component(name, comp)
  }

  app.config.errorHandler = (err) => {
    window.__evalErrors = [...(window.__evalErrors ?? []), String(err)]
    console.error(err)
  }

  app.mount('#app')
  window.__evalMounted = true
}

start()
