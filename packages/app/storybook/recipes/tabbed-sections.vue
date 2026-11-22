<template>
  <div class="s_pa__4">
    <SCard :max-width="720">
      <STabs v-model="activeSection">
        <STab v-for="section in sections" :key="section.value" :tab="section.value">{{ section.label }}</STab>
      </STabs>
      <SCardText>
        <div v-for="section in sections" v-show="activeSection === section.value" :key="section.value" role="tabpanel">
          <h2 class="s_text--h6 s_mb__2">{{ section.label }}</h2>
          <p class="s_text--body__2">{{ section.description }}</p>
        </div>
      </SCardText>
    </SCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SCard, SCardText, STab, STabs } from '@khsura/sui'

const sections = [
  { value: 'getting-started', label: 'Getting started', description: 'Create a workspace and invite your team.' },
  { value: 'billing', label: 'Billing', description: 'Plans, invoices and payment methods.' },
  { value: 'account', label: 'Account', description: 'Your profile, password and sign-in methods.' },
  { value: 'notifications', label: 'Notifications', description: 'Choose which emails and alerts you receive.' },
  { value: 'security', label: 'Security', description: 'Two-factor authentication and active sessions.' },
]

const activeSection = ref('getting-started')
</script>
