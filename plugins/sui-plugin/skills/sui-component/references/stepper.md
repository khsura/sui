# SStepper

**Import:** `import { SStepper, SStepperStep } from '@khsura/sui'`

Step indicator for wizards. It renders the step headers only. You render each step's content yourself with `v-if` on the step number.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsStepper.d.ts`, `propsStepperStep.d.ts`

---

## SStepper

<!-- generated:api:start SStepper -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SStepper props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `items` | `{ editable?: boolean \| undefined; step: number; text?: string \| undefined; }[]` | `[]` | no | — |
| `modelValue` | `number` | — | no | — |
| `shrink` | `boolean` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SStepper slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ value: number \| undefined; }` |

**SStepper events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: number]` |

<!-- generated:api:end SStepper -->

**SStepper notes**

- `modelValue`: Current step number (use `v-model`)
- `items`: Step definitions. Used only when the default slot is empty
- `shrink`: Shrink to content width
- `default` (slot): `SStepperStep` components. Replaces `items` rendering
- `update:modelValue` (event): Emitted when an `editable` step is clicked. Clamped to the lowest/highest registered step

`tag` exists in the type but is ignored (root is always a `div`).

---

## SStepperStep

<!-- generated:api:start SStepperStep -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SStepperStep props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | — | no | — |
| `editable` | `boolean` | — | no | — |
| `step` | `number` | — | yes | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SStepperStep slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SStepperStep events**

None.

<!-- generated:api:end SStepperStep -->

**SStepperStep notes**

- `step`: Step number (default: **required**)
- `editable`: Clicking the step jumps to it (forward or back)
- `disabled`: Disabled styling only. Does not block clicks on an `editable` step
- `default` (slot): Step label

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
