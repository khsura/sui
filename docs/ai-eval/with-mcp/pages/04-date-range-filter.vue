<template>
  <SContainer>
    <SCard class="s_pa__4" outlined>
      <h1 class="s_text--h6 s_mb__3">Transactions report</h1>
      <SForm ref="formRef" @submit.prevent="applyFilters">
        <SRow align="start">
          <SColumn :cols="12" :md="3">
            <SDatePickerInput v-model="draft.from" label="From" type="date" block />
          </SColumn>
          <SColumn :cols="12" :md="3">
            <SDatePickerInput
              v-model="draft.to"
              label="To"
              type="date"
              block
              :min="draft.from || undefined"
              :rules="[toNotBeforeFrom]"
            />
          </SColumn>
          <SColumn :cols="12" :md="3">
            <SSelect v-model="draft.status" label="Status" :items="statusItems" grow />
          </SColumn>
          <SColumn :cols="12" :md="3">
            <SRow dense no-outer-gutters>
              <SColumn :cols="6">
                <SButton type="submit" color="primary" block>Apply</SButton>
              </SColumn>
              <SColumn :cols="6">
                <SButton type="button" outlined block @click="resetFilters">Reset</SButton>
              </SColumn>
            </SRow>
          </SColumn>
        </SRow>
      </SForm>
    </SCard>

    <p class="s_text--body__2 s_mt__3">{{ appliedSummary }}</p>
  </SContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type SelectItem,
  SButton,
  SCard,
  SColumn,
  SContainer,
  SDatePickerInput,
  SForm,
  SRow,
  SSelect,
} from '@khsura/sui'

type TransactionStatus = 'all' | 'paid' | 'pending' | 'failed'

interface TransactionFilters {
  from: string
  to: string
  status: TransactionStatus
}

const statusItems: SelectItem[] = [
  { text: 'All', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Pending', value: 'pending' },
  { text: 'Failed', value: 'failed' },
]

const createDefaultFilters = (): TransactionFilters => ({ from: '', to: '', status: 'all' })

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const draft = ref<TransactionFilters>(createDefaultFilters())
const applied = ref<TransactionFilters>(createDefaultFilters())

// Dates are 'YYYY-MM-DD', so string comparison matches calendar order.
const toNotBeforeFrom = (value: unknown) => {
  if (typeof value !== 'string' || !value || !draft.value.from) {
    return true
  }

  return value >= draft.value.from || '"To" date cannot be before the "From" date'
}

const applyFilters = () => {
  // validate() returns true when the form HAS errors.
  const hasErrors = formRef.value?.validate()

  if (hasErrors) {
    return
  }

  applied.value = { ...draft.value }
}

const resetFilters = () => {
  draft.value = createDefaultFilters()
  applied.value = createDefaultFilters()
}

const appliedSummary = computed(() => {
  const { from, to, status } = applied.value
  const statusLabel = statusItems.find((item) => item.value === status)?.text ?? 'All'
  let range = 'all dates'

  if (from && to) {
    range = `${from} to ${to}`
  } else if (from) {
    range = `from ${from}`
  } else if (to) {
    range = `up to ${to}`
  }

  return `Showing ${statusLabel.toLowerCase()} transactions for ${range}.`
})
</script>
