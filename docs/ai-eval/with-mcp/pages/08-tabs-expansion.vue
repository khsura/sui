<script setup lang="ts">
import { ref } from 'vue'

type TabKey = 'getting-started' | 'billing' | 'account'

interface FaqItem {
  question: string
  answer: string
}

interface FaqSection {
  key: TabKey
  label: string
  items: FaqItem[]
}

const sections: FaqSection[] = [
  {
    key: 'getting-started',
    label: 'Getting started',
    items: [
      { question: 'How do I create an account?', answer: 'Click "Sign up" on the home page, enter your email and choose a password. We will send you a confirmation link.' },
      { question: 'Is there a free trial?', answer: 'Yes. Every new workspace gets a 14-day free trial with all features unlocked.' },
      { question: 'How do I invite my team?', answer: 'Open Settings > Members and click "Invite". Teammates receive an email with a join link.' },
      { question: 'Which browsers are supported?', answer: 'We support the latest two versions of Chrome, Firefox, Safari and Edge.' },
    ],
  },
  {
    key: 'billing',
    label: 'Billing',
    items: [
      { question: 'Which payment methods do you accept?', answer: 'We accept all major credit cards and bank transfers for annual plans.' },
      { question: 'When will I be charged?', answer: 'You are charged at the start of each billing cycle, monthly or yearly depending on your plan.' },
      { question: 'Can I get a refund?', answer: 'Annual plans can be refunded within 30 days of purchase. Monthly plans are not refundable.' },
      { question: 'Where can I download invoices?', answer: 'Go to Settings > Billing > Invoices to view and download every past invoice as a PDF.' },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    items: [
      { question: 'How do I reset my password?', answer: 'Click "Forgot password" on the sign-in page and follow the link we email you.' },
      { question: 'Can I change my email address?', answer: 'Yes. Open Profile settings, enter a new email and confirm it from your inbox.' },
      { question: 'How do I enable two-factor authentication?', answer: 'Go to Profile > Security and turn on two-factor authentication with an authenticator app.' },
      { question: 'How do I delete my account?', answer: 'Contact support from Profile > Danger zone. Deletion is permanent after a 7-day grace period.' },
    ],
  },
]

const activeTab = ref<TabKey>('getting-started')

// One open-panel model per tab; without `multiple`, only one panel can be open at a time.
const openPanels = ref<Record<TabKey, number[]>>({
  'getting-started': [],
  billing: [],
  account: [],
})
</script>

<template>
  <SApp>
    <SContainer class="s_py__8">
      <h1 class="s_text--h4 s_mb__2">Help center</h1>
      <p class="s_text--body__1 s_mb__6">
        Find quick answers to common questions about getting started, billing and managing your account.
        Pick a topic below and open a question to see the answer.
      </p>

      <STabs v-model="activeTab" bordered>
        <STab v-for="section in sections" :key="section.key" :tab="section.key">
          {{ section.label }}
        </STab>
      </STabs>

      <section
        v-for="section in sections"
        v-show="activeTab === section.key"
        :key="section.key"
        class="s_mt__4"
      >
        <SExpansionPanels v-model="openPanels[section.key]">
          <SExpansionPanel v-for="(item, i) in section.items" :key="i" :index="i">
            <SExpansionPanelHeader>{{ item.question }}</SExpansionPanelHeader>
            <SExpansionPanelContent>{{ item.answer }}</SExpansionPanelContent>
          </SExpansionPanel>
        </SExpansionPanels>
      </section>
    </SContainer>
  </SApp>
</template>
