<template>
  <SApp>
    <div class="login-page s_display__flex s_justify__center s_align__center">
      <SCard :max-width="420" width="100%" :elevation="4">
        <SCardTitle tag="h1" class="s_display__flex s_justify__center s_text--h5">{{ APP_NAME }}</SCardTitle>
        <SCardSubtitle class="s_textAlign__center">Sign in to your account</SCardSubtitle>
        <SCardText>
          <SForm ref="formRef" @submit.prevent="submit">
            <SInput
              v-model="form.email"
              label="Email"
              type="email"
              name="email"
              autocomplete="email"
              :rules="[required, email]"
            />
            <SInput
              v-model="form.password"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              name="password"
              autocomplete="current-password"
              :rules="[required]"
            >
              <template #suffix>
                <SButton
                  type="button"
                  variant="text"
                  size="small"
                  :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                  :aria-pressed="isPasswordVisible"
                  @click="togglePasswordVisibility"
                >
                  {{ isPasswordVisible ? 'Hide' : 'Show' }}
                </SButton>
              </template>
            </SInput>
            <div class="s_display__flex s_justify__spaceBetween s_align__center s_mb__4">
              <SCheckbox v-model="form.rememberMe" label="Remember me" hide-details />
              <SButton variant="text" size="small" tag="a" href="#forgot-password" color="primary">
                Forgot password?
              </SButton>
            </div>
            <SButton type="submit" color="primary" block :loading="isSubmitting">Sign in</SButton>
          </SForm>
          <p v-if="signedInEmail" class="s_text--body__2 s_textAlign__center s_mt__3">
            Signed in as {{ signedInEmail }}.
          </p>
        </SCardText>
      </SCard>
    </div>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  SApp,
  SButton,
  SCard,
  SCardSubtitle,
  SCardText,
  SCardTitle,
  SCheckbox,
  SForm,
  SInput,
} from '@khsura/sui'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const APP_NAME = 'Acme Portal'
const SUBMIT_DELAY_MS = 1500
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// A rule returns true to pass or an error string to fail.
const required = (value: unknown) => Boolean(value) || 'This field is required'
const email = (value: unknown) => (typeof value === 'string' && EMAIL_PATTERN.test(value)) || 'Enter a valid email'

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const form = ref<LoginForm>({ email: '', password: '', rememberMe: false })
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)
const signedInEmail = ref('')

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const submit = async () => {
  // validate() returns true when the form HAS errors.
  const hasErrors = formRef.value?.validate()

  if (hasErrors || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  signedInEmail.value = ''
  // Replace with your sign-in API call.
  await wait(SUBMIT_DELAY_MS)
  signedInEmail.value = form.value.email
  isSubmitting.value = false
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 16px;
  box-sizing: border-box;
}
</style>
