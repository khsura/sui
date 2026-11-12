# SStepper

**Import:** `import { SStepper, SStepperStep } from '@khsura/sui'`

Step indicator for wizards. It renders the step headers only. You render each step's content yourself with `v-if` on the step number.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsStepper.d.ts`, `propsStepperStep.d.ts`

---

## SStepper

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number` | `undefined` | Current step number (use `v-model`) |
| `items` | `Array<{ step: number; text?: string; editable?: boolean }>` | `[]` | Step definitions. Used only when the default slot is empty |
| `shrink` | `boolean` | `false` | Shrink to content width |

`tag` exists in the type but is ignored (root is always a `div`).

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ value }` (current step) | `SStepperStep` components. Replaces `items` rendering |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number` | Emitted when an `editable` step is clicked. Clamped to the lowest/highest registered step |

---

## SStepperStep

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `step` | `number` | **required** | Step number |
| `editable` | `boolean` | `false` | Clicking the step jumps to it (forward or back) |
| `disabled` | `boolean` | `false` | Disabled styling only. Does not block clicks on an `editable` step |

| Slot | Description |
|------|-------------|
| `default` | Step label |

Steps with `step < modelValue` show a checkmark (visited). `step === modelValue` is current. Must be a child of `SStepper` (throws otherwise).

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SStepper, SStepperStep, SButton } from '@khsura/sui'

const step = ref(1)
const steps = [
  { step: 1, text: 'Account', editable: true },
  { step: 2, text: 'Details', editable: true },
  { step: 3, text: 'Review' },
]
</script>

<template>
  <SStepper v-model="step" :items="steps" />

  <div v-if="step === 1">…<SButton color="primary" @click="step++">Next</SButton></div>
  <div v-else-if="step === 2">
    <SButton @click="step--">Back</SButton>
    <SButton color="primary" @click="step++">Next</SButton>
  </div>
  <div v-else>Review…</div>

  <!-- Slot composition -->
  <SStepper v-model="step">
    <SStepperStep :step="1" editable>Account</SStepperStep>
    <SStepperStep :step="2" editable>Details</SStepperStep>
    <SStepperStep :step="3">Review</SStepperStep>
  </SStepper>
</template>
```

## Gotchas

- Step numbers are whatever you pass to `step`. 1-based is a convention, not a rule.
- The stepper never advances by itself. Only clicks on `editable` steps emit. Next/Back buttons must update the model.
- Add `editable` to every step a user may click, including future steps (it does not restrict clicks to visited steps).
- Validate in your Next handler before changing `step`. `disabled` will not stop an editable step from being clicked.
