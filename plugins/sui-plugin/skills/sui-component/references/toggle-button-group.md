# SToggleButtonGroup / SToggleButton

**Import:** `import { SToggleButtonGroup, SToggleButton } from '@khsura/sui'`

Row of toggle buttons with single or multiple selection.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsToggleButtonGroup.d.ts`, `propsToggleButton.d.ts`

---

## SToggleButtonGroup

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `GroupItemValue[] \| null` | `[]` | Selected button identifiers — **always an array**, even for single selection |
| `multiple` | `boolean` | `false` | Allow several selected buttons |
| `mandatory` | `boolean` | `false` | Keep one selected (auto-selects the first button when empty) |
| `selectedColor` | `string` | `'primary'` | Color of the selected button |
| `variant` | `'underlined' \| 'inset' \| null` | `undefined` | `underlined` = underline the selected button; `inset` = segmented/pill look |
| `dense` | `boolean` | `false` | Compact (small-size) buttons |
| `bordered` | `boolean` | `false` | Border around the group and between buttons (ignored with `inset`) |
| `shrink` | `boolean` | `false` | Buttons size to content instead of stretching |
| `outlined` | `boolean \| null` | `undefined` | Outlined group border |
| `underlined` | `boolean \| null` | `undefined` | Underlined group border |
| `borderRadius` | `'tile' \| 'rounded' \| number \| '<n>px' \| ...` | `undefined` | Group corner radius |

`GroupItemValue` = `string | number | boolean | symbol`. (`nowrap` is typed but has no effect.)

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SToggleButton` components |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `GroupItemValue[]` | Selection changed |

---

## SToggleButton

Must be inside `SToggleButtonGroup` (throws otherwise).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `GroupItemValue \| null` | vnode `key` | Identifier stored in the group's `v-model`. Falls back to `:key`, then an auto id |
| `disabled` | `boolean` | `false` | Disable this button |
| `cols` / `sm` / `md` / `lg` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Grid column width of the button |
| `order` | `number` | `undefined` | Flex order |
| `alignSelf` | CSS `align-self` value | `undefined` | Alignment |

There is **no `value` prop** — use `index` or `:key`.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button content |

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
