<template>
  <SApp>
    <SContainer>
      <h1 class="s_text--h5 s_mb__4">Transactions report</h1>

      <SCard>
        <SCardText>
          <SForm ref="formRef" @submit.prevent="apply">
            <!-- cols=12 stacks every control on mobile; md+ puts them on one row -->
            <SRow align="end" dense>
              <SColumn :cols="12" :md="3">
                <SDatePickerInput
                  v-model="draft.from"
                  type="date"
                  label="From"
                  block
                  :min="minSelectableDate"
                  :max="maxSelectableDate"
                />
              </SColumn>

              <SColumn :cols="12" :md="3">
                <SDatePickerInput
                  v-model="draft.to"
                  type="date"
                  label="To"
                  block
                  :min="draft.from ?? minSelectableDate"
                  :max="maxSelectableDate"
                  :rules="[toNotBeforeFrom]"
                />
              </SColumn>

              <SColumn :cols="12" :md="3">
                <SSelect v-model="draft.status" label="Status" :items="statusItems" grow />
              </SColumn>

              <SColumn :cols="12" :md="3">
                <div class="s_display__flex filter-actions">
                  <SButton type="submit" color="primary" block>Apply</SButton>
                  <SButton type="button" outlined color="secondary" block @click="reset">Reset</SButton>
                </div>
              </SColumn>
            </SRow>
          </SForm>
        </SCardText>
      </SCard>

      <p class="s_text--body__2 s_mt__3">
        <strong>Applied filters:</strong> {{ appliedSummary }}
      </p>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import {
  type SelectItem,
  datePickerModelFormats,
  SApp,
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

const REPORT_HISTORY_YEARS = 10

const statusItems: SelectItem[] = [
  { text: 'All', value: 'all' },
  { text: 'Paid', value: 'paid' },
  { text: 'Pending', value: 'pending' },
  { text: 'Failed', value: 'failed' },
]

// Wider than the default ±5 years so older transactions can be reported on
const minSelectableDate = dayjs()
  .subtract(REPORT_HISTORY_YEARS, 'year')
  .startOf('year')
  .format(datePickerModelFormats.date)
const maxSelectableDate = dayjs().format(datePickerModelFormats.date)

const createDefaultFilters = (): TransactionFilters => ({
  from: dayjs().startOf('month').format(datePickerModelFormats.date),
  to: dayjs().format(datePickerModelFormats.date),
  status: 'all',
})

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const draft = ref<TransactionFilters>(createDefaultFilters())
const applied = ref<TransactionFilters>(createDefaultFilters())

// The popup's `min` blocks earlier dates, but typed text is only format-checked — so validate the range too
const toNotBeforeFrom = (value: unknown) => {
  const from = draft.value.from
  if (typeof value !== 'string' || !value || !from) return true
  return !dayjs(value).isBefore(dayjs(from), 'day') || '"To" date must not be before the "From" date'
}

// Rules only re-run when their own field changes; re-check "to" when "from" moves
watch(
  () => draft.value.from,
  () => {
    if (draft.value.to) formRef.value?.validate()
  },
)

const apply = () => {
  // validate() returns true when there ARE errors
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return
  applied.value = { ...draft.value }
}

const reset = () => {
  draft.value = createDefaultFilters()
  applied.value = createDefaultFilters()
  formRef.value?.resetValidation()
}

const statusLabel = (status: TransactionStatus) =>
  statusItems.find((item) => typeof item !== 'string' && item.value === status)?.text ?? status

const formatDisplayDate = (date: string | null) => (date ? dayjs(date).format('MMM D, YYYY') : 'any')

const appliedSummary = computed(() => {
  const { from, to, status } = applied.value
  return `${formatDisplayDate(from)} – ${formatDisplayDate(to)} · Status: ${statusLabel(status)}`
})
</script>

<style scoped>
.filter-actions {
  gap: 8px;
}
</style>
