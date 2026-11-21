<template>
  <SCard :max-width="640" class="s_mx__auto s_mt__3">
    <SCardTitle>Welcome aboard</SCardTitle>
    <SCardText>
      <SStepper v-model="step">
        <SStepperStep :step="PROFILE_STEP">Profile</SStepperStep>
        <SStepperStep :step="PLAN_STEP">Plan</SStepperStep>
        <SStepperStep :step="CONFIRM_STEP">Confirm</SStepperStep>
      </SStepper>

      <div class="wizard__body">
        <SForm v-if="step === PROFILE_STEP" @submit.prevent="next">
          <SInput v-model="profile.fullName" label="Full name" autocomplete="name" :rules="[required]" />
          <SInput v-model="profile.company" label="Company" autocomplete="organization" :rules="[required]" />
        </SForm>

        <SForm v-else-if="step === PLAN_STEP" @submit.prevent="next">
          <p class="s_text--body__2">Choose a plan</p>
          <SRadioGroup v-model="selectedPlanId" name="plan" column :rules="[required]">
            <SRadio
              v-for="plan in plans"
              :key="plan.id"
              :value="plan.id"
              :label="`${plan.name} — ${formatPrice(plan.monthlyPrice)}`"
            />
          </SRadioGroup>
        </SForm>

        <div v-else>
          <p class="s_text--body__2">Please review your details.</p>
          <dl class="wizard__summary">
            <dt>Full name</dt>
            <dd>{{ profile.fullName }}</dd>
            <dt>Company</dt>
            <dd>{{ profile.company }}</dd>
            <dt>Plan</dt>
            <dd>{{ selectedPlan ? `${selectedPlan.name} (${formatPrice(selectedPlan.monthlyPrice)})` : '—' }}</dd>
          </dl>
          <p v-if="isFinished" class="s_text--body__2 s_mt__3">
            All set, {{ profile.fullName }}! Your {{ selectedPlan?.name }} plan is active.
          </p>
        </div>
      </div>
    </SCardText>

    <SCardActions>
      <SButton :disabled="step === PROFILE_STEP || isFinished" @click="back">Back</SButton>
      <div class="wizard__spacer" />
      <SButton v-if="step < CONFIRM_STEP" color="primary" :disabled="!isCurrentStepValid" @click="next">
        Next
      </SButton>
      <SButton v-else color="primary" :disabled="isFinished" @click="finish">Finish</SButton>
    </SCardActions>
  </SCard>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SForm,
  SInput,
  SRadio,
  SRadioGroup,
  SStepper,
  SStepperStep,
} from '@khsura/sui'

interface Plan {
  id: string
  name: string
  monthlyPrice: number
}

interface ProfileForm {
  fullName: string
  company: string
}

const PROFILE_STEP = 1
const PLAN_STEP = 2
const CONFIRM_STEP = 3

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', monthlyPrice: 0 },
  { id: 'team', name: 'Team', monthlyPrice: 29 },
  { id: 'business', name: 'Business', monthlyPrice: 99 },
]

const step = ref(PROFILE_STEP)
const profile = ref<ProfileForm>({ fullName: '', company: '' })
const selectedPlanId = ref<string | undefined>(undefined)
const isFinished = ref(false)

// A rule returns true to pass or an error string to fail.
const required = (value: unknown) => Boolean(value) || 'This field is required'

const formatPrice = (monthlyPrice: number) => (monthlyPrice === 0 ? 'Free' : `$${monthlyPrice}/month`)

const selectedPlan = computed(() => plans.find((plan) => plan.id === selectedPlanId.value))

const isCurrentStepValid = computed(() => {
  if (step.value === PROFILE_STEP) {
    return profile.value.fullName.trim() !== '' && profile.value.company.trim() !== ''
  }

  if (step.value === PLAN_STEP) {
    return selectedPlan.value !== undefined
  }

  return true
})

const next = () => {
  if (!isCurrentStepValid.value || step.value >= CONFIRM_STEP) {
    return
  }

  step.value++
}

const back = () => {
  if (step.value > PROFILE_STEP) {
    step.value--
  }
}

const finish = () => {
  isFinished.value = true
}
</script>

<style scoped>
.wizard__body {
  margin-top: 24px;
}

.wizard__spacer {
  flex: 1 1 auto;
}

.wizard__summary {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
  margin: 12px 0 0;
}

.wizard__summary dt {
  font-weight: 600;
}

.wizard__summary dd {
  margin: 0;
}
</style>
