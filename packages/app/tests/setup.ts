import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createSUI } from '@/app/modules'

// happy-dom does not implement matchMedia; useColorMode (via usePreferredDark) needs it.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false, // default: OS prefers light
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// use this if common setup is needed
config.global.plugins = [createSUI()]
