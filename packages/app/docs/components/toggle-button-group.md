# Toggle Button Group Components

**Import:** `import { SToggleButtonGroup, SToggleButton } from '@khsura/sui'`

Group of single-select or multi-select toggle buttons.

---

## SToggleButtonGroup

Root container that manages selection state.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `GroupItemValue[] \| null` | `[]` | Selected button identifiers — **always an array**, even for single selection |
| `selectedColor` | `string` | `'primary'` | Color of the selected button |
| `dense` | `boolean` | `false` | Compact (small-size) buttons |
| `bordered` | `boolean` | `false` | Border around the group and between buttons (ignored with `inset`) |
| `shrink` | `boolean` | `false` | Buttons size to their content instead of stretching |
| `variant` | `'underlined' \| 'inset' \| null` | `undefined` | `'underlined'` underlines the selected button; `'inset'` is a segmented/pill look |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `mandatory` | `boolean` | `false` | Keep one selected (auto-selects the first button when the model is empty) |
| `outlined` | `boolean \| null` | `undefined` | Outlined group border |
| `underlined` | `boolean \| null` | `undefined` | Underlined group border |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Group border radius |

`GroupItemValue` = `string | number | boolean | symbol`. `nowrap` is typed but has no effect.

### Model

`v-model` — an array of the selected buttons' identifiers. With single selection it holds at most one item.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `GroupItemValue[]` | Selection changed |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SToggleButton` components |

---

## SToggleButton

Individual toggle option. Must be inside `SToggleButtonGroup` (throws otherwise).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `GroupItemValue \| null` | vnode `key` | Identifier stored in the group's `v-model`. Falls back to `:key`, then an auto-generated id |
| `disabled` | `boolean` | `false` | Disable this button |
| `cols` / `sm` / `md` / `lg` | `1–12 \| 'auto' \| 'grow'` | `undefined` | Grid column width of the button |
| `order` | `number` | `undefined` | Flex order |
| `alignSelf` | CSS `align-self` value | `undefined` | Self alignment |

There is **no `value` prop** — identify buttons with `index` or `:key`.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button label/content |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const view = ref<string[]>(['list']) // single select: still an array, read view.value[0]
const fontStyles = ref<string[]>(['bold'])
const size = ref<string[]>(['md'])
const align = ref<string[]>([])
</script>

<template>
  <!-- Single select (view mode toggle) -->
  <SToggleButtonGroup v-model="view" mandatory>
    <SToggleButton index="list">
      <SIcon icon="mdi-view-list" />
    </SToggleButton>
    <SToggleButton index="grid">
      <SIcon icon="mdi-view-grid" />
    </SToggleButton>
    <SToggleButton index="card">
      <SIcon icon="mdi-view-dashboard" />
    </SToggleButton>
  </SToggleButtonGroup>

  <!-- Multi-select (text formatting) -->
  <SToggleButtonGroup v-model="fontStyles" multiple shrink>
    <SToggleButton index="bold"><b>B</b></SToggleButton>
    <SToggleButton index="italic"><i>I</i></SToggleButton>
    <SToggleButton index="underline"><u>U</u></SToggleButton>
  </SToggleButtonGroup>

  <!-- Inset variant -->
  <SToggleButtonGroup v-model="size" variant="inset" mandatory>
    <SToggleButton index="sm">S</SToggleButton>
    <SToggleButton index="md">M</SToggleButton>
    <SToggleButton index="lg">L</SToggleButton>
  </SToggleButtonGroup>

  <!-- Dense + bordered, identified by :key -->
  <SToggleButtonGroup v-model="align" mandatory dense bordered selected-color="secondary">
    <SToggleButton v-for="a in ['left', 'center', 'right']" :key="a">
      <SIcon :icon="`mdi-format-align-${a}`" />
    </SToggleButton>
  </SToggleButtonGroup>
</template>
```

## Notes

- The model is always an array — initialize with `ref([])` / `ref(['x'])` even for single selection.
- `mandatory` prevents deselecting the last active button and selects the first button when the model is empty.
- The `selectedColor` is applied to the background of the active button.
- `variant="inset"` uses a fixed light background (`#eeeef0`) regardless of theme — text is hard to read on dark themes.
