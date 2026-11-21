import { createApp } from 'vue'
import { createSUI } from '@khsura/sui'
import { linkDemo } from './linkDemo'
import '@khsura/sui/style.css'

// A client app with no vue-router installed. `vite build` failing here is the bug this smoke test guards.
createApp(linkDemo).use(createSUI()).mount('#app')
