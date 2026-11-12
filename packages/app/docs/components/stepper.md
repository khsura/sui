# Stepper Components

**Import:** `import { SStepper, SStepperStep } from '@khsura/sui'`

Step-by-step wizard navigation. It renders the step headers only — render each step's content yourself with `v-if` on the step number.

---

## SStepper

Root stepper container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `undefined` | Active step number |
| `items` | `StepperItem[]` | `[]` | Step definitions — used only when the default slot is empty |
| `shrink` | `boolean` | `false` | Shrink to content width |

`tag` exists in the type but is ignored (the root is always a `div`).

### StepperItem shape

```typescript
type StepperItem = {
  step: number       // Step number
  text?: string      // Step label
  editable?: boolean // Clicking the step jumps to it
}
```

### Model

`v-model` — active step number.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted only when an `editable` step is clicked; clamped to the lowest/highest registered step |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ value }` (current step) | `SStepperStep` components (replaces `items` rendering) |

---

## SStepperStep

Individual step (used when composing with slots). Must be a child of `SStepper` (throws otherwise). Steps with `step < modelValue` show a checkmark (visited); `step === modelValue` is current.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number` | **required** | Step number |
| `editable` | `boolean` | `false` | Clicking the step jumps to it (forward or back) |
| `disabled` | `boolean` | `false` | Disabled styling only — does not block clicks on an `editable` step |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Step label text |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SStepper, SStepperStep, SInput, SButton } from '@khsura/sui'

const currentStep = ref(1)
const email = ref('')
const name = ref('')
const submit = () => { /* ... */ }

const steps = [
  { step: 1, text: 'Account Info' },
  { step: 2, text: 'Personal Details' },
  { step: 3, text: 'Confirmation' },
]
</script>

<template>
  <!-- Using items prop -->
  <SStepper v-model="currentStep" :items="steps" />

  <!-- Step content -->
  <div v-if="currentStep === 1">
    <SInput v-model="email" label="Email" />
    <SButton @click="currentStep++">Next</SButton>
  </div>
  <div v-else-if="currentStep === 2">
    <SInput v-model="name" label="Name" />
    <SButton @click="currentStep--">Back</SButton>
    <SButton color="primary" @click="currentStep++">Next</SButton>
  </div>
  <div v-else>
    <p>Ready to submit!</p>
    <SButton @click="currentStep--">Back</SButton>
    <SButton color="primary" @click="submit">Submit</SButton>
  </div>

  <!-- Using slot composition -->
  <SStepper v-model="currentStep">
    <SStepperStep :step="1" editable>Account</SStepperStep>
    <SStepperStep :step="2">Details</SStepperStep>
    <SStepperStep :step="3">Review</SStepperStep>
  </SStepper>
</template>
```

## Notes

- Step numbers are whatever you pass to `step`; 1-based is a convention, not a rule.
- The stepper never advances by itself. Only clicks on `editable` steps emit; Next/Back buttons must update the model.
- `editable` lets the user jump to that step in both directions — it does not restrict clicks to visited steps.
- Validate in your Next handler before changing the step. `disabled` does not stop an editable step from being clicked.
