import { createSUI } from '@/app/index'

export const sui = createSUI({
  themes: {
    light: {
      presetColors: {
        tertiary: '#545499',
      },
    },
  },
  components: {
    SSelect: { outlined: true },
  },
})
