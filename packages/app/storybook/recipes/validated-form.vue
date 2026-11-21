<template>
  <SCard :max-width="560" class="s_mx__auto">
    <SCardTitle>Create account</SCardTitle>
    <SCardText>
      <SForm ref="formRef" @submit.prevent="submit">
        <SInput v-model="form.name" label="Full name" :rules="[required]" />
        <SInput v-model="form.email" label="Email" type="email" autocomplete="email" :rules="[required, email]" />
        <SSelect v-model="form.role" label="Role" :items="roles" grow :rules="[required]" />
        <SDatePickerInput v-model="form.startDate" label="Start date" type="date" block :rules="[required]" />
        <SCheckbox v-model="form.acceptTerms" label="I accept the terms" :rules="[mustAccept]" />
        <SButton type="submit" color="primary" block :loading="isSubmitting">Create account</SButton>
      </SForm>
      <p v-if="submittedName" class="s_text--body__2 s_mt__3">Account created for {{ submittedName }}.</p>
    </SCardText>
  </SCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  type SelectItem,
  SButton,
  SCard,
  SCardText,
  SCardTitle,
  SCheckbox,
  SDatePickerInput,
  SForm,
  SInput,
  SSelect,
} from '@khsura/sui'

interface AccountForm {
  name: string
  email: string
  role: string | null
  startDate: string
  acceptTerms: boolean
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const roles: SelectItem[] = [
  { text: 'Admin', value: 'admin' },
  { text: 'Editor', value: 'editor' },
  { text: 'Viewer', value: 'viewer' },
]

// A rule returns true to pass or an error string to fail; returning false shows no message.
const required = (value: unknown) => Boolean(value) || 'This field is required'
const email = (value: unknown) => (typeof value === 'string' && EMAIL_PATTERN.test(value)) || 'Enter a valid email'
const mustAccept = (value: unknown) => value === true || 'You must accept the terms'
const formRef = ref<InstanceType<typeof SForm> | null>(null)
const isSubmitting = ref(false)
const submittedName = ref('')
const form = ref<AccountForm>({ name: '', email: '', role: null, startDate: '', acceptTerms: false })

const submit = async () => {
  // validate() returns true when the form HAS errors.
  const hasErrors = formRef.value?.validate()

  if (hasErrors) {
    return
  }

  isSubmitting.value = true
  // Replace with your API call.
  await Promise.resolve()
  submittedName.value = form.value.name
  isSubmitting.value = false
}
</script>
