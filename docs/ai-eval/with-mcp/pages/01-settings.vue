<template>
  <SApp>
    <div class="s_pa__4">
      <SCard :max-width="560" class="s_mx__auto">
        <SCardTitle>Account settings</SCardTitle>
        <SCardText>
          <SForm ref="formRef" @submit.prevent="save">
            <SInput v-model="form.displayName" label="Display name" autocomplete="nickname" :rules="[required]" />
            <SInput
              v-model="form.email"
              label="Email"
              type="email"
              autocomplete="email"
              :rules="[required, validEmail]"
            />
            <STextarea
              v-model="form.bio"
              label="Bio"
              :rows="4"
              :maxlength="BIO_MAX_LENGTH"
              :rules="[bioLength]"
            />
            <p class="s_text--caption s_mb__3">{{ form.bio.length }} / {{ BIO_MAX_LENGTH }}</p>
            <SSelect v-model="form.language" label="Language" :items="languages" grow :rules="[required]" />
            <SSwitch v-model="form.emailNotifications" label="Email notifications" />
            <SButton type="submit" color="primary" block :loading="isSaving">Save changes</SButton>
          </SForm>
          <p v-if="savedMessage" class="s_text--body__2 s_mt__3">{{ savedMessage }}</p>
        </SCardText>
      </SCard>

      <SCard :max-width="560" class="s_mx__auto s_mt__4">
        <SCardTitle>Danger zone</SCardTitle>
        <SCardText>
          <p class="s_text--body__2 s_mb__3">Deleting your account permanently removes your profile and data.</p>
          <SDialog v-model="isDeleteDialogOpen" :max-width="420">
            <template #activator="{ on, attrs }">
              <SButton color="error" outlined v-on="on" v-bind="attrs">Delete account</SButton>
            </template>
            <SCard>
              <SCardTitle>Delete account?</SCardTitle>
              <SCardText>This permanently deletes your account and all of its data. You cannot undo this.</SCardText>
              <SCardActions>
                <SSpacer />
                <SButton variant="text" @click="isDeleteDialogOpen = false">Cancel</SButton>
                <SButton color="error" @click="confirmDelete">Delete</SButton>
              </SCardActions>
            </SCard>
          </SDialog>
          <p v-if="isDeleted" class="s_text--body__2 s_mt__3">Your account has been deleted.</p>
        </SCardText>
      </SCard>
    </div>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  type SelectItem,
  SApp,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SDialog,
  SForm,
  SInput,
  SSelect,
  SSpacer,
  SSwitch,
  STextarea,
} from '@khsura/sui'

interface AccountSettingsForm {
  displayName: string
  email: string
  bio: string
  language: string | null
  emailNotifications: boolean
}

const BIO_MAX_LENGTH = 200
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const languages: SelectItem[] = [
  { text: 'English', value: 'en' },
  { text: 'Japanese', value: 'ja' },
  { text: 'Mongolian', value: 'mn' },
]

// A rule returns true to pass or an error string to fail.
const required = (value: unknown) =>
  (typeof value === 'string' ? value.trim().length > 0 : Boolean(value)) || 'This field is required'
const validEmail = (value: unknown) =>
  (typeof value === 'string' && EMAIL_PATTERN.test(value)) || 'Enter a valid email address'
const bioLength = (value: unknown) =>
  (typeof value !== 'string' || value.length <= BIO_MAX_LENGTH) || `Bio must be ${BIO_MAX_LENGTH} characters or fewer`

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const isSaving = ref(false)
const savedMessage = ref('')
const isDeleteDialogOpen = ref(false)
const isDeleted = ref(false)

// Mock current account data.
const form = ref<AccountSettingsForm>({
  displayName: 'Sarnai',
  email: 'sarnai@example.com',
  bio: '',
  language: 'en',
  emailNotifications: true,
})

const save = async () => {
  savedMessage.value = ''
  // validate() returns true when the form HAS errors.
  const hasErrors = formRef.value?.validate()

  if (hasErrors) {
    return
  }

  isSaving.value = true
  // Replace with your API call.
  await Promise.resolve()
  isSaving.value = false
  savedMessage.value = 'Settings saved.'
}

const confirmDelete = () => {
  isDeleteDialogOpen.value = false
  isDeleted.value = true
}
</script>
