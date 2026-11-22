# SToggleButtonGroup / SToggleButton

**Import:** `import { SToggleButtonGroup, SToggleButton } from '@khsura/sui'`

Row of toggle buttons with single or multiple selection.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsToggleButtonGroup.d.ts`, `propsToggleButton.d.ts`

---

## SToggleButtonGroup

<!-- generated:api:start SToggleButtonGroup -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SToggleButtonGroup props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `bordered` | `boolean` | — | no | — |
| `dense` | `boolean` | — | no | — |
| `mandatory` | `boolean` | — | no | — |
| `modelValue` | `(GroupItemValue[] & T[]) \| null` | `[]` | no | — |
| `multiple` | `boolean` | — | no | — |
| `nowrap` | `boolean` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `selectedColor` | `string` | `"primary"` | no | — |
| `shrink` | `boolean` | — | no | — |
| `underlined` | `boolean \| null` | — | no | — |
| `variant` | `"inset" \| "underlined" \| null` | — | no | `inset`, `underlined` |

**SToggleButtonGroup slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |
| `overlay` | `{}` |

**SToggleButtonGroup events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: T[] \| null]` |

<!-- generated:api:end SToggleButtonGroup -->

**SToggleButtonGroup notes**

- `modelValue` (`v-model`): Selected button identifiers — **always an array**, even for single selection
- `multiple`: Allow several selected buttons
- `mandatory`: Keep one selected (auto-selects the first button when empty)
- `selectedColor`: Color of the selected button
- `variant`: `underlined` = underline the selected button; `inset` = segmented/pill look
- `dense`: Compact (small-size) buttons
- `bordered`: Border around the group and between buttons (ignored with `inset`)
- `shrink`: Buttons size to content instead of stretching
- `outlined`: Outlined group border
- `underlined`: Underlined group border
- `borderRadius`: Group corner radius
- `default` (slot): `SToggleButton` components
- `overlay` (slot): Content laid over the group, outside the row of buttons (absolutely position it; `STabs` uses it for its scroll arrows)
- `update:modelValue` (event): Selection changed

`GroupItemValue` = `string | number | boolean | symbol`. (`nowrap` is typed but has no effect.)

---

## SToggleButton

Must be inside `SToggleButtonGroup` (throws otherwise).

<!-- generated:api:start SToggleButton -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SToggleButton props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — |
| `alignSelf` | `"auto" \| "baseline" \| "center" \| "end" \| "first baseline" \| "flex-end" \| "flex-start" \| "inherit" \| "initial" \| "last baseline" \| "normal" \| "safe center" \| "self-end" \| "self-start" \| "start" \| "stretch" \| "unsafe center" \| null` | — | no | `auto`, `baseline`, `center`, `end`, `first baseline`, `flex-end`, `flex-start`, `inherit`, `initial`, `last baseline`, `normal`, `safe center`, `self-end`, `self-start`, `start`, `stretch`, `unsafe center` |
| `cols` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `disabled` | `boolean` | — | no | — |
| `index` | `GroupItemValue \| null` | — | no | — |
| `lg` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `md` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `order` | `number \| null` | — | no | — |
| `sm` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |

**SToggleButton slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SToggleButton events**

None.

<!-- generated:api:end SToggleButton -->

**SToggleButton notes**

- `index`: Identifier stored in the group's `v-model`. Falls back to `:key`, then an auto id (default: vnode `key`)
- `disabled`: Disable this button
- `cols` / `sm` / `md` / `lg`: Grid column width of the button
- `order`: Flex order
- `alignSelf`: Alignment
- `default` (slot): Button content

There is **no `value` prop** — use `index` or `:key`.

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const view = ref<string[]>(['list'])        // single select: still an array
const fontStyles = ref<string[]>(['bold'])
</script>

<template>
  <!-- Single select -->
  <SToggleButtonGroup v-model="view" mandatory>
    <SToggleButton index="list"><SIcon icon="mdi-view-list" /></SToggleButton>
    <SToggleButton index="grid"><SIcon icon="mdi-view-grid" /></SToggleButton>
  </SToggleButtonGroup>
  <!-- current view: view[0] -->

  <!-- Multi-select -->
  <SToggleButtonGroup v-model="fontStyles" multiple shrink>
    <SToggleButton index="bold"><b>B</b></SToggleButton>
    <SToggleButton index="italic"><i>I</i></SToggleButton>
    <SToggleButton index="underline"><u>U</u></SToggleButton>
  </SToggleButtonGroup>

  <!-- From a list: :key doubles as the identifier -->
  <SToggleButtonGroup v-model="align" mandatory dense bordered selected-color="secondary">
    <SToggleButton v-for="a in ['left', 'center', 'right']" :key="a">
      <SIcon :icon="`mdi-format-align-${a}`" />
    </SToggleButton>
  </SToggleButtonGroup>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SToggleButton value="list">` | `<SToggleButton index="list">` (or `:key`) |
| `const view = ref('list')` | `const view = ref(['list'])`; read `view.value[0]` |
| `variant="inset"` in a dark theme | Inset uses a fixed light background (`#eeeef0`) — text is unreadable on dark themes; use the default or `underlined` variant there |
