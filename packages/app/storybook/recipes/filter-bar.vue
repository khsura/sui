<template>
  <SCard :max-width="720" class="s_mx__auto">
    <SCardText>
      <SForm ref="formRef" @submit.prevent="search">
        <SFormRow>
          <SInput v-model="filters.query" label="Search" :rules="[required]" />
          <SButton type="submit" color="primary">Search</SButton>
        </SFormRow>
        <SFormRow>
          <SDatePickerInput v-model="filters.from" label="From" type="date" />
          <SDatePickerInput v-model="filters.to" label="To" type="date" />
          <SSelect v-model="filters.status" label="Status" :items="statuses" />
          <SButton color="primary" outlined @click="reset">Reset</SButton>
        </SFormRow>
      </SForm>
      <p class="s_text--body__2">{{ summary }}</p>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type SelectItem,
  SButton,
  SCard,
  SCardText,
  SDatePickerInput,
  SForm,
  SFormRow,
  SInput,
  SSelect,
} from '@khsura/sui'

interface Filters {
  query: string
  from: string | null
  to: string | null
  status: string | null
}

const statuses: SelectItem[] = [
  { text: 'Open', value: 'open' },
  { text: 'Closed', value: 'closed' },
]

const emptyFilters = (): Filters => ({ query: '', from: null, to: null, status: null })
// A rule returns true to pass or an error string to fail.
const required = (value: unknown) => Boolean(value) || 'Enter a search term'
const formRef = ref<InstanceType<typeof SForm> | null>(null)
const filters = ref<Filters>(emptyFilters())
const searchedFor = ref('')
const summary = computed(() => (searchedFor.value ? `Results for "${searchedFor.value}"` : 'No search yet'))

const search = () => {
  // validate() returns true when the form HAS errors.
  if (formRef.value?.validate()) {
    return
  }

  // Replace with your API call.
  searchedFor.value = filters.value.query
}

const reset = () => {
  filters.value = emptyFilters()
  searchedFor.value = ''
  formRef.value?.resetValidation()
}
</script>
