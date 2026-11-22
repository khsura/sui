<script setup lang="ts">
import { ref } from 'vue'

type SectionId = 'getting-started' | 'billing' | 'account'

interface FaqItem {
  question: string
  answer: string
}

interface HelpSection {
  id: SectionId
  label: string
  faqs: FaqItem[]
}

const sections: HelpSection[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    faqs: [
      { question: 'How do I create an account?', answer: 'Click "Sign up" on the home page, enter your email and choose a password. We will send you a confirmation link.' },
      { question: 'Is there a free trial?', answer: 'Yes. Every new workspace gets a 14-day free trial with all features unlocked.' },
      { question: 'How do I invite my team?', answer: 'Open Settings > Members and click "Invite". Teammates receive an email with a join link.' },
      { question: 'Which browsers are supported?', answer: 'The latest versions of Chrome, Firefox, Safari and Edge are fully supported.' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    faqs: [
      { question: 'Which payment methods do you accept?', answer: 'We accept all major credit and debit cards, as well as bank transfer on annual plans.' },
      { question: 'How do I download an invoice?', answer: 'Go to Settings > Billing > Invoices and click the download icon next to any invoice.' },
      { question: 'Can I change my plan later?', answer: 'Yes. Upgrades apply immediately; downgrades take effect at the start of the next billing cycle.' },
      { question: 'Do you offer refunds?', answer: 'Annual plans can be refunded in full within 30 days of purchase. Contact support to request one.' },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    faqs: [
      { question: 'How do I reset my password?', answer: 'Click "Forgot password" on the sign-in page and follow the link we email to you.' },
      { question: 'How do I change my email address?', answer: 'Open Profile > Account details, enter the new address and confirm it from your inbox.' },
      { question: 'Can I enable two-factor authentication?', answer: 'Yes. Go to Profile > Security and turn on two-factor authentication with an authenticator app.' },
      { question: 'How do I delete my account?', answer: 'Go to Profile > Danger zone and click "Delete account". This permanently removes your data.' },
    ],
  },
]

const activeTab = ref<SectionId>('getting-started')

// One open-panel model per tab; no `multiple`, so only one panel opens at a time.
const openPanels = ref<Record<SectionId, number[]>>({
  'getting-started': [],
  billing: [],
  account: [],
})
</script>

<template>
  <SContainer narrow>
    <h1 class="s_text--h4 s_mb__2">Help center</h1>
    <p class="s_text--body__1 s_mb__6">
      Find quick answers to the most common questions about getting started, billing and managing
      your account. Pick a topic below and open a question to see the answer.
    </p>

    <STabs v-model="activeTab" class="s_mb__4">
      <STab v-for="section in sections" :key="section.id" :tab="section.id">
        {{ section.label }}
      </STab>
    </STabs>

    <SWindow v-model="activeTab" mandatory hide-arrows>
      <SWindowItem v-for="section in sections" :key="section.id" :value="section.id">
        <SExpansionPanels v-model="openPanels[section.id]">
          <SExpansionPanel v-for="(faq, i) in section.faqs" :key="faq.question" :index="i">
            <SExpansionPanelHeader>{{ faq.question }}</SExpansionPanelHeader>
            <SExpansionPanelContent>{{ faq.answer }}</SExpansionPanelContent>
          </SExpansionPanel>
        </SExpansionPanels>
      </SWindowItem>
    </SWindow>
  </SContainer>
</template>
