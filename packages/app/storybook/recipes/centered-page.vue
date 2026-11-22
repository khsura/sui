<template>
  <div class="s_display__flex s_justify__center s_align__center s_height--fill s_pa__4">
    <SCard :max-width="420" :elevation="4" class="s_width--fill">
      <SCardTitle>Sign in</SCardTitle>
      <SCardText>
        <SForm @submit.prevent="submit">
          <SInput
            v-model="form.email"
            label="Email"
            type="text"
            inputmode="email"
            autocomplete="email"
            :rules="[required]"
          />
          <SInput
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="current-password"
            :rules="[required]"
          />
          <SButton type="submit" color="primary" block class="s_mt__2">Sign in</SButton>
        </SForm>
        <p v-if="signedInEmail" class="s_text--body__2 s_mt__3" role="status">Signed in as {{ signedInEmail }}.</p>
      </SCardText>
    </SCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { SButton, SCard, SCardText, SCardTitle, SForm, SInput } from '@khsura/sui'

// A rule returns true to pass or an error string to fail.
const required = (value: unknown) => Boolean(value) || 'This field is required'
const form = reactive({ email: '', password: '' })
const signedInEmail = ref('')

const submit = () => {
  if (form.email && form.password) {
    signedInEmail.value = form.email
  }
}
</script>
