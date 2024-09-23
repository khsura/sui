import { type Plugin } from 'vue'
import { createSUI } from '@khsura/sui/modules/sUI'
import '@khsura/sui/styles/index.scss'

export const suiPlugin: Plugin = {
  install(app) {
    app.use(createSUI())
  },
}
