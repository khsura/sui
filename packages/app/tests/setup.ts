import { config } from '@vue/test-utils'
import { createSUI } from '@sui/app/modules'

// use this if common setup is needed
config.global.plugins = [createSUI()]
