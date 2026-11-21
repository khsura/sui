<template>
  <SApp>
    <div class="login-page s_display__flex s_justify__center s_align__center s_pa__4">
      <SCard class="s_width--fill" :max-width="420" :elevation="4">
        <SCardTitle class="s_textAlign__center s_text--h5">{{ appName }}</SCardTitle>
        <SCardSubtitle class="s_textAlign__center">Sign in to your account</SCardSubtitle>

        <SCardText>
          <SForm ref="formRef" @submit.prevent="submit">
            <SInput
              v-model="form.email"
              label="Email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="you@example.com"
              :rules="[required('Email'), email]"
            />

            <SInput
              v-model="form.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :rules="[required('Password')]"
            >
              <template #suffix>
                <SButton
                  variant="icon"
                  type="button"
                  size="small"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  @click="showPassword = !showPassword"
                >
                  <SIcon :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" />
                </SButton>
              </template>
            </SInput>

            <div class="s_display__flex s_justify__spaceBetween s_align__center s_mb__4">
              <SCheckbox v-model="form.rememberMe" label="Remember me" hide-details />
              <SButton variant="text" color="primary" size="small" href="#" @click.prevent="forgotPassword">
                Forgot password?
              </SButton>
            </div>

            <SButton type="submit" color="primary" block :loading="submitting">Sign in</SButton>
          </SForm>
        </SCardText>
      </SCard>
    </div>
  </SApp>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SApp, SButton, SCard, SCardSubtitle, SCardText, SCardTitle, SCheckbox, SForm, SIcon, SInput } from '@khsura/sui'

const SUBMIT_DELAY_MS = 1500

const appName = 'Acme Portal'

const formRef = ref<InstanceType<typeof SForm> | null>(null)
const submitting = ref(false)
const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
  rememberMe: false,
})

const required = (field: string) => (v: unknown) => (typeof v === 'string' ? v.trim().length > 0 : !!v) || `${field} is required`
const email = (v: unknown) => (typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'Enter a valid email address'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const forgotPassword = () => {
  // Mock: in a real app this would navigate to the password reset flow
}

const submit = async () => {
  // validate() returns true when there ARE errors
  const hasErrors = formRef.value?.validate()
  if (hasErrors) return

  submitting.value = true
  try {
    await wait(SUBMIT_DELAY_MS)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style>
