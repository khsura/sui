<template>
  <SApp>
    <div class="s_display__flex s_justify__center s_align__center s_height--fill s_pa__4">
      <SCard :max-width="420" :elevation="4" class="s_width--fill">
        <SCardTitle class="s_justify__center">
          <h1 class="s_text--h5 s_textAlign__center s_width--fill">{{ APP_NAME }}</h1>
        </SCardTitle>
        <SCardText>
          <p class="s_text--body__2 s_textAlign__center s_mb__4">Sign in to your account</p>
          <SForm ref="formRef" v-model:error="hasErrors" novalidate @submit.prevent="submit">
            <SInput
              v-model="form.email"
              label="Email"
              type="text"
              name="email"
              inputmode="email"
              autocomplete="email"
              autocapitalize="off"
              :spellcheck="false"
              :rules="[required, email]"
            />
            <SInput
              v-model="form.password"
              label="Password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              :rules="[required]"
            >
              <template #suffix>
                <SButton
                  variant="icon"
                  size="small"
                  :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="isPasswordVisible"
                  @click="isPasswordVisible = !isPasswordVisible"
                >
                  <SIcon :icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'" />
                </SButton>
              </template>
            </SInput>
            <div class="s_display__flex s_justify__spaceBetween s_align__center s_mt__1">
              <SCheckbox v-model="form.rememberMe" label="Remember me" hide-error />
              <SButton variant="text" color="primary" size="small" href="#" @click.prevent="forgotPassword">
                Forgot password?
              </SButton>
            </div>
            <SButton
              type="submit"
              color="primary"
              block
              class="s_mt__4"
              :loading="isSubmitting"
              :disabled="submitAttempted && hasErrors"
            >
              Sign in
            </SButton>
          </SForm>
          <p v-if="statusMessage" class="s_text--body__2 s_textAlign__center s_mt__3" role="status">
            {{ statusMessage }}
          </p>
        </SCardText>
      </SCard>
    </div>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SApp, SButton, SCard, SCardText, SCardTitle, SCheckbox, SForm, SIcon, SInput } from '@khsura/sui'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const APP_NAME = 'Acme Workspace'
const SIGN_IN_DELAY_MS = 1500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// A rule returns true to pass or an error string to fail.
const required = (value: unknown) => Boolean(value) || 'This field is required'
const email = (value: unknown) => (typeof value === 'string' && EMAIL_PATTERN.test(value)) || 'Enter a valid email'

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const form = ref<LoginForm>({ email: '', password: '', rememberMe: false })
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
// Kept in sync by SForm (v-model:error): true while any field shows an error.
const hasErrors = ref(false)
const submitAttempted = ref(false)
const statusMessage = ref('')

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const forgotPassword = () => {
  statusMessage.value = 'Password reset instructions would be sent to your email.'
}

const submit = async () => {
  submitAttempted.value = true
  statusMessage.value = ''

  // validate() returns true when the form HAS errors.
  if (formRef.value?.validate()) {
    return
  }

  isSubmitting.value = true
  // Mock sign-in request.
  await wait(SIGN_IN_DELAY_MS)
  isSubmitting.value = false
  statusMessage.value = `Signed in as ${form.value.email}${form.value.rememberMe ? ' (remembered)' : ''}.`
}
</script>
