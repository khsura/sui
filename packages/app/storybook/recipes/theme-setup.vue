<template>
  <SCard :max-width="560" class="s_mx__auto">
    <SCardTitle>Appearance</SCardTitle>
    <SCardText>
      <SSwitch v-model="isDark" label="Dark mode" />
      <p class="s_text--body__2 s_mb__2">Preset colors from the active theme:</p>
      <SRow :gap="8">
        <SButton v-for="color in PRESET_COLOR_NAMES" :key="color" :color="color" size="small">{{ color }}</SButton>
      </SRow>
    </SCardText>
    <SCardActions>
      <SButton variant="text" @click="setTheme(null)">Follow system</SButton>
    </SCardActions>
  </SCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SButton, SCard, SCardActions, SCardText, SCardTitle, SRow, SSwitch, useTheme } from '@khsura/sui'

// The keys every theme's `presetColors` defines; usable as `color="…"` on components.
const PRESET_COLOR_NAMES = ['primary', 'secondary', 'success', 'info', 'warning', 'error']
// useTheme() needs app.use(createSUI()) and an <SApp> root; there is no toggleTheme().
const { theme, setTheme } = useTheme()

const isDark = computed({
  get: () => theme.value === 'dark',
  set: (dark: boolean) => setTheme(dark ? 'dark' : 'light'),
})
</script>
