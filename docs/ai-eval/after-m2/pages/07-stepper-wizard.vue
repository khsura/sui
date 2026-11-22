<template>
  <SCard :max-width="640" class="s_mx__auto s_mt__4">
    <SCardTitle>Onboarding</SCardTitle>
    <SCardText>
      <SStepper v-model="step">
        <SStepperStep v-for="item in steps" :key="item.step" :step="item.step">
          {{ item.text }}
        </SStepperStep>
      </SStepper>

      <div class="s_mt__4">
        <SForm v-if="step === STEP_PROFILE" @submit.prevent="next">
          <SInput
            v-model="profile.fullName"
            label="Full name"
            autocomplete="name"
            :rules="[required]"
          />
          <SInput
            v-model="profile.company"
            label="Company"
            autocomplete="organization"
            :rules="[required]"
          />
        </SForm>

        <SForm v-else-if="step === STEP_PLAN" @submit.prevent="next">
          <p class="s_text--subtitle__1">Choose a plan</p>
          <SRadioGroup v-model="selectedPlanId" name="plan" column :rules="[required]">
            <SRadio v-for="plan in plans" :key="plan.id" :value="plan.id" :label="plan.name">
              <template #label="{ attrs }">
                <span v-bind="attrs">
                  <strong>{{ plan.name }}</strong>
                  — {{ formatPrice(plan.price) }} / month
                  <span class="s_text--caption"> ({{ plan.description }})</span>
                </span>
              </template>
            </SRadio>
          </SRadioGroup>
        </SForm>

        <div v-else>
          <p class="s_text--subtitle__1">Review your details</p>
          <dl class="summary">
            <dt>Full name</dt>
            <dd>{{ profile.fullName }}</dd>
            <dt>Company</dt>
            <dd>{{ profile.company }}</dd>
            <dt>Plan</dt>
            <dd>{{ selectedPlan?.name }} — {{ selectedPlan ? formatPrice(selectedPlan.price) : '' }} / month</dd>
          </dl>
          <p v-if="isFinished" class="s_text--body__2 s_mt__3">
            Welcome aboard, {{ profile.fullName }}! Your {{ selectedPlan?.name }} plan is active.
          </p>
        </div>
      </div>
    </SCardText>

    <SCardActions>
      <SButton variant="text" :disabled="step === STEP_PROFILE || isFinished" @click="back">
        Back
      </SButton>
      <SSpacer />
      <SButton
        v-if="step < STEP_CONFIRM"
        color="primary"
        :disabled="!isCurrentStepValid"
        @click="next"
      >
        Next
      </SButton>
      <SButton
        v-else
        color="primary"
        :loading="isSubmitting"
        :disabled="isFinished"
        @click="finish"
      >
        Finish
      </SButton>
    </SCardActions>
  </SCard>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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
  SSpacer,
  SStepper,
  SStepperStep,
} from '@khsura/sui'

interface Plan {
  id: string
  name: string
  price: number
  description: string
}

interface ProfileForm {
  fullName: string
  company: string
}

const STEP_PROFILE = 1
const STEP_PLAN = 2
const STEP_CONFIRM = 3
const SUBMIT_DELAY_MS = 600

const steps = [
  { step: STEP_PROFILE, text: 'Profile' },
  { step: STEP_PLAN, text: 'Plan' },
  { step: STEP_CONFIRM, text: 'Confirm' },
]

const plans: Plan[] = [
  { id: 'starter', name: 'Starter', price: 0, description: 'For individuals' },
  { id: 'team', name: 'Team', price: 29, description: 'Up to 10 members' },
  { id: 'business', name: 'Business', price: 99, description: 'Unlimited members' },
]

const step = ref(STEP_PROFILE)
const profile = reactive<ProfileForm>({ fullName: '', company: '' })
const selectedPlanId = ref<string | null>(null)
const isSubmitting = ref(false)
const isFinished = ref(false)

const selectedPlan = computed(() => plans.find((plan) => plan.id === selectedPlanId.value))

const required = (value: unknown) =>
  (typeof value === 'string' ? value.trim().length > 0 : value != null) || 'This field is required'

const isProfileValid = computed(
  () => profile.fullName.trim().length > 0 && profile.company.trim().length > 0,
)

const isCurrentStepValid = computed(() => {
  if (step.value === STEP_PROFILE) return isProfileValid.value
  if (step.value === STEP_PLAN) return selectedPlan.value !== undefined
  return isProfileValid.value && selectedPlan.value !== undefined
})

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const formatPrice = (price: number) => priceFormatter.format(price)

const next = () => {
  if (!isCurrentStepValid.value || step.value >= STEP_CONFIRM) return
  step.value++
}

const back = () => {
  if (step.value > STEP_PROFILE) step.value--
}

const finish = async () => {
  if (!isCurrentStepValid.value) return
  isSubmitting.value = true
  await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS))
  isSubmitting.value = false
  isFinished.value = true
}
</script>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 16px;
  margin: 0;
}

.summary dt {
  font-weight: 600;
}

.summary dd {
  margin: 0;
}
</style>
