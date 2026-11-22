<template>
  <SContainer class="s_py__4">
    <SCard outlined>
      <SCardText>
        <h1 class="s_text--h6">Transactions report</h1>

        <SForm @submit.prevent="apply">
          <!-- Phones: every control takes a full row (stacked). From md up: one row. -->
          <SRow align="center" dense>
            <SColumn :cols="12" md="grow">
              <SDatePickerInput
                v-model="draft.from"
                type="date"
                placeholder="From date"
                block
                hide-details
              />
            </SColumn>
            <SColumn :cols="12" md="grow">
              <SDatePickerInput
                v-model="draft.to"
                type="date"
                placeholder="To date"
                :min="draft.from ?? undefined"
                :error="isRangeInvalid"
                block
                hide-details
              />
            </SColumn>
            <SColumn :cols="12" md="grow">
              <SSelect
                v-model="draft.status"
                :items="statusItems"
                aria-label="Status"
                placeholder="Status"
                grow
                hide-details
              />
            </SColumn>
            <SColumn :cols="12" md="auto">
              <SButton type="submit" color="primary" block :disabled="isRangeInvalid">Apply</SButton>
            </SColumn>
            <SColumn :cols="12" md="auto">
              <SButton type="button" color="primary" outlined block @click="reset">Reset</SButton>
            </SColumn>
          </SRow>
        </SForm>

        <SAlert v-if="isRangeInvalid" color="error" dense class="s_mt__3">
          The "to" date cannot be before the "from" date.
        </SAlert>

        <p class="s_text--body__2 s_mt__3">{{ summary }}</p>
      </SCardText>
    </SCard>
  </SContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type SelectItem,
  SAlert,
  SButton,
  SCard,
  SCardText,
  SColumn,
  SContainer,
  SDatePickerInput,
  SForm,
  SRow,
  SSelect,
} from '@khsura/sui'

type TransactionStatus = 'all' | 'paid' | 'pending' | 'failed'

interface TransactionFilters {
  from: string | null
  to: string | null
  status: TransactionStatus
}

const statusItems: SelectItem[] = [
  { text: 'All', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Pending', value: 'pending' },
  { text: 'Failed', value: 'failed' },
]

const emptyFilters = (): TransactionFilters => ({ from: null, to: null, status: 'all' })

const draft = ref<TransactionFilters>(emptyFilters())
const applied = ref<TransactionFilters>(emptyFilters())

// Dates are YYYY-MM-DD strings, so string comparison orders them correctly.
const isRangeInvalid = computed(() => {
  const { from, to } = draft.value
  return Boolean(from && to && to < from)
})

const statusLabel = (status: TransactionStatus) =>
  statusItems.find((item) => item.value === status)?.text ?? 'All'

const summary = computed(() => {
  const { from, to, status } = applied.value
  const fromText = from ?? 'any date'
  const toText = to ?? 'any date'
  return `Showing transactions from ${fromText} to ${toText} · Status: ${statusLabel(status)}`
})

const apply = () => {
  if (isRangeInvalid.value) {
    return
  }
  applied.value = { ...draft.value }
}

const reset = () => {
  draft.value = emptyFilters()
  applied.value = emptyFilters()
}
</script>
