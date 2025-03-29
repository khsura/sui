import { config } from '@vue/test-utils'
import { createSUI } from '~/modules'

// use this if common setup is needed
config.global.plugins = [createSUI()]
