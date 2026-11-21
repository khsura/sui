<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  SApp,
  SContainer,
  STabs,
  STab,
  SExpansionPanels,
  SExpansionPanel,
  SExpansionPanelHeader,
  SExpansionPanelContent,
} from '@khsura/sui'

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
      { question: 'How do I create an account?', answer: 'Click "Sign up" on the home page, enter your email and choose a password. You will get a confirmation email within a few minutes.' },
      { question: 'Is there a free trial?', answer: 'Yes. Every new workspace gets a 14-day free trial with all features unlocked. No credit card required.' },
      { question: 'How do I invite my team?', answer: 'Open Settings > Members and click "Invite". Enter their email addresses and they will receive an invitation link.' },
      { question: 'Where can I find tutorials?', answer: 'Our video tutorials and step-by-step guides are in the Learn section, available from the help menu in the top bar.' },
    ],
  },
  {
    key: 'billing',
    label: 'Billing',
    items: [
      { question: 'Which payment methods do you accept?', answer: 'We accept all major credit and debit cards, as well as bank transfer for annual plans.' },
      { question: 'How do I change my plan?', answer: 'Go to Settings > Billing and pick a new plan. Upgrades apply immediately; downgrades take effect at the next billing cycle.' },
      { question: 'Can I get an invoice?', answer: 'Invoices are generated automatically each billing period and can be downloaded from Settings > Billing > Invoices.' },
      { question: 'What is your refund policy?', answer: 'If you are not satisfied, contact us within 30 days of a payment and we will issue a full refund.' },
    ],
  },
  {
    key: 'account',
    label: 'Account',
    items: [
      { question: 'How do I reset my password?', answer: 'Click "Forgot password" on the sign-in page and follow the link we email you to set a new password.' },
      { question: 'Can I change my email address?', answer: 'Yes. Open Profile > Account details, update your email, and confirm the change from the verification email.' },
      { question: 'How do I enable two-factor authentication?', answer: 'Go to Profile > Security and turn on two-factor authentication. Scan the QR code with an authenticator app to finish.' },
      { question: 'How do I delete my account?', answer: 'Open Profile > Security and choose "Delete account". This permanently removes your data and cannot be undone.' },
    ],
  },
]

const activeTab = ref<TabKey>('getting-started')

// Open panel index per tab. SExpansionPanels without `multiple` keeps at most one panel open.
const openPanels = reactive<Record<TabKey, number[]>>({
  'getting-started': [],
  'billing': [],
  'account': [],
})
</script>

<template>
  <SApp>
    <SContainer class="s_py__8" style="max-width: 800px;">
      <h1 class="s_text--h4 s_mb__2">
        Help center
      </h1>
      <p class="s_text--subtitle__1 s_mb__6">
        Find quick answers to the most common questions about getting started, billing and managing your account.
        Pick a topic below and open a question to see its answer.
      </p>

      <STabs v-model="activeTab" bordered selected-tab-color="primary" class="s_mb__4">
        <STab v-for="section in sections" :key="section.key" :tab="section.key">
          {{ section.label }}
        </STab>
      </STabs>

      <section
        v-for="section in sections"
        v-show="activeTab === section.key"
        :key="section.key"
      >
        <SExpansionPanels v-model="openPanels[section.key]">
          <SExpansionPanel
            v-for="(item, i) in section.items"
            :key="i"
            :index="i"
          >
            <SExpansionPanelHeader>{{ item.question }}</SExpansionPanelHeader>
            <SExpansionPanelContent>{{ item.answer }}</SExpansionPanelContent>
          </SExpansionPanel>
        </SExpansionPanels>
      </section>
    </SContainer>
  </SApp>
</template>
