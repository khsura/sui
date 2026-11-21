<template>
  <SApp>
    <SContainer>
      <SCard :max-width="560" class="s_mx__auto s_mt__6">
        <SCardTitle>Account settings</SCardTitle>
        <SCardSubtitle>Manage your profile and preferences</SCardSubtitle>

        <SCardText>
          <SForm ref="formRef" @submit.prevent="save">
            <SInput
              v-model="form.displayName"
              label="Display name"
              :rules="[required('Display name')]"
            />

            <SInput
              v-model="form.email"
              label="Email"
              type="email"
              inputmode="email"
              :rules="[required('Email'), validEmail]"
            />

            <STextarea
              v-model="form.bio"
              label="Bio"
              :rows="4"
              autogrow
              :rules="[maxLength('Bio', BIO_MAX_LENGTH)]"
            />
            <p class="s_text--caption s_textAlign__right s_mb__3">
              {{ form.bio.length }} / {{ BIO_MAX_LENGTH }}
            </p>

            <SSelect
              v-model="form.language"
              label="Language"
              :items="languages"
              :rules="[required('Language')]"
            />

            <SSwitch
              v-model="form.emailNotifications"
              label="Enable email notifications"
              color="primary"
            />

            <SCardActions class="s_mt__4">
              <SButton outlined color="error" @click="isDeleteDialogOpen = true">
                Delete account
              </SButton>
              <SSpacer />
              <SButton type="submit" color="primary" :loading="saving">
                Save
              </SButton>
            </SCardActions>
          </SForm>
        </SCardText>
      </SCard>

      <SDialog v-model="isDeleteDialogOpen" :max-width="420" persistent>
        <SCard>
          <SCardTitle>Delete account?</SCardTitle>
          <SCardText>
            This permanently deletes your account and all associated data. This action cannot be undone.
          </SCardText>
          <SCardActions>
            <SSpacer />
            <SButton variant="text" :disabled="deleting" @click="isDeleteDialogOpen = false">
              Cancel
            </SButton>
            <SButton color="error" :loading="deleting" @click="deleteAccount">
              Delete
            </SButton>
          </SCardActions>
        </SCard>
      </SDialog>

      <SSnackbar v-model="isSnackbarOpen" :timeout="3000">
        {{ snackbarMessage }}
      </SSnackbar>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  type SelectItem,
  SApp,
  SContainer,
  SCard,
  SCardTitle,
  SCardSubtitle,
  SCardText,
  SCardActions,
  SForm,
  SInput,
  STextarea,
  SSelect,
  SSwitch,
  SButton,
  SSpacer,
  SDialog,
  SSnackbar,
} from '@khsura/sui'

const BIO_MAX_LENGTH = 200
const MOCK_REQUEST_DELAY_MS = 600
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const saving = ref(false)
const deleting = ref(false)
const isDeleteDialogOpen = ref(false)
const isSnackbarOpen = ref(false)
const snackbarMessage = ref('')

// Mock data for the current user
const form = ref({
  displayName: 'Sarah Lee',
  email: 'sarah.lee@example.com',
  bio: 'Frontend developer who loves Vue and good coffee.',
  language: 'en',
  emailNotifications: true,
})

const languages: SelectItem[] = [
  { text: 'English', value: 'en' },
  { text: 'Japanese', value: 'ja' },
  { text: 'Mongolian', value: 'mn' },
]

const required = (target: string) => (value: unknown) =>
  (value !== null && value !== undefined && String(value).trim() !== '') || `${target} is required`

const validEmail = (value: unknown) =>
  EMAIL_PATTERN.test(String(value ?? '')) || 'Enter a valid email address'

const maxLength = (target: string, max: number) => (value: unknown) =>
  String(value ?? '').length <= max || `${target} must be ${max} characters or fewer`

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const showMessage = (message: string) => {
  snackbarMessage.value = message
  isSnackbarOpen.value = true
}

const save = async () => {
  // validate() returns true when there ARE errors
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return

  saving.value = true
  try {
    await wait(MOCK_REQUEST_DELAY_MS)
    showMessage('Settings saved')
  } finally {
    saving.value = false
  }
}

const deleteAccount = async () => {
  deleting.value = true
  try {
    await wait(MOCK_REQUEST_DELAY_MS)
    isDeleteDialogOpen.value = false
    showMessage('Account deleted')
  } finally {
    deleting.value = false
  }
}
</script>
