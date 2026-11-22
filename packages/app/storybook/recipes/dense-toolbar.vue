<template>
  <SCard :max-width="720" class="s_mx__auto">
    <SCardText>
      <!-- One provider makes the whole toolbar dense; nothing inside repeats size or dense. -->
      <SDefaultsProvider :defaults="denseDefaults">
        <div class="dense-toolbar__actions">
          <SButton color="primary">New order</SButton>
          <SButton>Export</SButton>
          <SButton outlined>Archive</SButton>
        </div>
        <SForm @submit.prevent="apply">
          <SFormRow>
            <SInput v-model="filters.query" label="Search" placeholder="Search orders" hide-details />
            <SSelect v-model="filters.status" label="Status" placeholder="Any status" :items="statuses" hide-details />
            <SButton type="submit" color="primary">Apply</SButton>
            <SButton outlined @click="reset">Reset</SButton>
          </SFormRow>
        </SForm>
      </SDefaultsProvider>
      <p class="s_text--body__2">{{ summary }}</p>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type ComponentDefaultsOptions,
  type SelectItem,
  SButton,
  SCard,
  SCardText,
  SDefaultsProvider,
  SForm,
  SFormRow,
  SInput,
  SSelect,
} from '@khsura/sui'

interface Filters {
  query: string
  status: string | null
}

// global.size reaches every component that takes a preset size (buttons, inputs, chips…);
// SSelect has no size, so its dense padding is set per component.
const denseDefaults: ComponentDefaultsOptions = {
  global: { size: 'small' },
  SInput: { dense: true },
  SSelect: { dense: true },
}

const statuses: SelectItem[] = [
  { text: 'Open', value: 'open' },
  { text: 'Closed', value: 'closed' },
]

const emptyFilters = (): Filters => ({ query: '', status: null })
const filters = ref<Filters>(emptyFilters())
const applied = ref<Filters | null>(null)

const summary = computed(() =>
  applied.value ? `Showing "${applied.value.query || 'all'}" · ${applied.value.status ?? 'any status'}` : 'All orders',
)

const apply = () => {
  // Replace with your API call.
  applied.value = { ...filters.value }
}

const reset = () => {
  filters.value = emptyFilters()
  applied.value = null
}
</script>

<style scoped>
.dense-toolbar__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
