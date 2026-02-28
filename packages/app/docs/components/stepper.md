# Stepper Components

**Import:** `import { SStepper, SStepperStep } from '@khsura/sui'`

Step-by-step wizard navigation.

---

## SStepper

Root stepper container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `undefined` | Active step number (1-based) |
| `items` | `StepperItem[]` | `undefined` | Step definitions (alternative to slots) |
| `shrink` | `boolean` | `false` | Shrink to content width |
| `tag` | `string` | `'div'` | Root HTML element |

### StepperItem shape

```typescript
type StepperItem = {
  step: number       // Step number
  text: string       // Step label
  editable?: boolean // Allow going back to this step
}
```

### Model

`v-model` — active step number (1-based).

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Active step changed |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SStepperStep` components (when not using `items` prop) |

---

## SStepperStep

Individual step (used when composing with slots).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number` | **required** | Step number |
| `editable` | `boolean` | `false` | Allow clicking to go back to this step |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Step label text |

---

## Usage

```vue
<script setup lang="ts">
const currentStep = ref(1)

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

- Steps are 1-based (`modelValue` starts at `1`).
- `editable` steps allow the user to click back to that step after passing it.
- Manage step validation before advancing by checking `currentStep` in your click handlers.
