<template>
  <SApp>
    <SContainer>
      <SCard :max-width="640" :elevation="2" class="wizard">
        <SCardTitle>Welcome aboard</SCardTitle>

        <SStepper v-model="step">
          <SStepperStep v-for="item in steps" :key="item.step" :step="item.step">
            {{ item.text }}
          </SStepperStep>
        </SStepper>

        <SDivider />

        <SCardText>
          <!-- Step 1: Profile -->
          <SForm v-if="step === PROFILE_STEP" @submit.prevent="next">
            <SInput v-model="profile.fullName" label="Full name" :rules="[required('Full name')]" />
            <SInput v-model="profile.company" label="Company" :rules="[required('Company')]" />
          </SForm>

          <!-- Step 2: Plan -->
          <div v-else-if="step === PLAN_STEP">
            <p class="wizard__hint">Choose the plan that fits your team.</p>
            <SRadioGroup v-model="selectedPlanId" column mandatory color="primary">
              <SRadio
                v-for="plan in plans"
                :key="plan.id"
                :value="plan.id"
                :label="`${plan.name} — ${formatPrice(plan.price)} / month`"
              />
            </SRadioGroup>
          </div>

          <!-- Step 3: Confirm -->
          <div v-else>
            <p v-if="finished" class="wizard__done">
              All set, {{ profile.fullName }}! Your {{ selectedPlan?.name }} plan is now active.
            </p>
            <template v-else>
              <p class="wizard__hint">Please review your details before finishing.</p>
              <dl class="wizard__summary">
                <dt>Full name</dt>
                <dd>{{ profile.fullName }}</dd>
                <dt>Company</dt>
                <dd>{{ profile.company }}</dd>
                <dt>Plan</dt>
                <dd>{{ selectedPlan?.name }}</dd>
                <dt>Price</dt>
                <dd>{{ selectedPlan ? `${formatPrice(selectedPlan.price)} / month` : '' }}</dd>
              </dl>
            </template>
          </div>
        </SCardText>

        <SCardActions>
          <SButton type="button" variant="text" :disabled="step === PROFILE_STEP || finished" @click="back">
            Back
          </SButton>
          <SSpacer />
          <SButton
            v-if="!isLastStep"
            type="button"
            color="primary"
            :disabled="!isCurrentStepValid"
            @click="next"
          >
            Next
          </SButton>
          <SButton
            v-else
            type="button"
            color="primary"
            :disabled="finished"
            :loading="submitting"
            @click="finish"
          >
            Finish
          </SButton>
        </SCardActions>
      </SCard>
    </SContainer>
  </SApp>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  SApp,
  SButton,
  SCard,
  SCardActions,
  SCardText,
  SCardTitle,
  SContainer,
  SDivider,
  SForm,
  SInput,
  SRadio,
  SRadioGroup,
  SSpacer,
  SStepper,
  SStepperStep,
} from '@khsura/sui'

interface Plan {
  id: string
  name: string
  price: number
}

const PROFILE_STEP = 1
const PLAN_STEP = 2
const CONFIRM_STEP = 3
const FAKE_SUBMIT_DELAY_MS = 600

const steps = [
  { step: PROFILE_STEP, text: 'Profile' },
  { step: PLAN_STEP, text: 'Plan' },
  { step: CONFIRM_STEP, text: 'Confirm' },
]

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', price: 9 },
  { id: 'team', name: 'Team', price: 29 },
  { id: 'enterprise', name: 'Enterprise', price: 99 },
]

const step = ref(PROFILE_STEP)
const profile = ref({ fullName: '', company: '' })
const selectedPlanId = ref<string | null>(null)
const submitting = ref(false)
const finished = ref(false)

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatPrice = (price: number) => priceFormatter.format(price)

const required = (field: string) => (value: unknown) =>
  (typeof value === 'string' ? value.trim().length > 0 : !!value) || `${field} is required`

const selectedPlan = computed(() => plans.find((plan) => plan.id === selectedPlanId.value) ?? null)

const isProfileValid = computed(
  () => profile.value.fullName.trim().length > 0 && profile.value.company.trim().length > 0,
)

const isCurrentStepValid = computed(() => {
  if (step.value === PROFILE_STEP) return isProfileValid.value
  if (step.value === PLAN_STEP) return selectedPlan.value !== null
  return isProfileValid.value && selectedPlan.value !== null
})

const isLastStep = computed(() => step.value === CONFIRM_STEP)

const next = () => {
  // The stepper never advances by itself, and steps are not editable,
  // so this handler is the only way forward — guard it with validation.
  if (!isCurrentStepValid.value || isLastStep.value) return
  step.value++
}

const back = () => {
  if (step.value > PROFILE_STEP) step.value--
}

const finish = async () => {
  if (!isCurrentStepValid.value) return
  submitting.value = true
  try {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, FAKE_SUBMIT_DELAY_MS))
    finished.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.wizard {
  margin: 32px auto;
}

.wizard__hint {
  margin-bottom: 12px;
  opacity: 0.75;
}

.wizard__summary {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 24px;
  margin: 0;
}

.wizard__summary dt {
  font-weight: 600;
}

.wizard__summary dd {
  margin: 0;
}

.wizard__done {
  font-weight: 600;
}
</style>
