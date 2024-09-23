import { createApp } from 'vue'
import App from './app.vue'
import { router, suiPlugin } from './plugins'

const app = createApp(App)

app.use(suiPlugin)
app.use(router)

app.mount('#app')
