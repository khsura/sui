# Toggle Button Group Components

**Import:** `import { SToggleButtonGroup, SToggleButton } from '@khsura/sui'`

Group of mutually exclusive (or multi-select) toggle buttons.

---

## SToggleButtonGroup

Root container that manages selection state.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any \| any[]` | `undefined` | Selected button value(s) |
| `selectedColor` | `string` | `'primary'` | Color of selected button |
| `dense` | `boolean` | `false` | Compact height |
| `bordered` | `boolean` | `false` | Show border around group |
| `shrink` | `boolean` | `false` | Shrink to content width |
| `variant` | `'inset'` | `undefined` | `'inset'` for inset/pill style |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `mandatory` | `boolean` | `false` | At least one must stay selected |
| `outlined` | `boolean` | `false` | Outlined border |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Border radius |

### Model

`v-model` — single value or array (when `multiple`).

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SToggleButton` components |

---

## SToggleButton

Individual toggle option.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | **required** | Button's value |
| `disabled` | `boolean` | `false` | Disable this button |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button label/content |

---

## Usage

```vue
<script setup lang="ts">
const view = ref('list')
const fontStyles = ref(['bold'])
</script>

<template>
  <!-- Single select (view mode toggle) -->
  <SToggleButtonGroup v-model="view" mandatory>
    <SToggleButton value="list">
      <SIcon icon="mdi-view-list" />
    </SToggleButton>
    <SToggleButton value="grid">
      <SIcon icon="mdi-view-grid" />
    </SToggleButton>
    <SToggleButton value="card">
      <SIcon icon="mdi-view-dashboard" />
    </SToggleButton>
  </SToggleButtonGroup>

  <!-- Multi-select (text formatting) -->
  <SToggleButtonGroup v-model="fontStyles" multiple>
    <SToggleButton value="bold"><b>B</b></SToggleButton>
    <SToggleButton value="italic"><i>I</i></SToggleButton>
    <SToggleButton value="underline"><u>U</u></SToggleButton>
  </SToggleButtonGroup>

  <!-- Inset variant -->
  <SToggleButtonGroup v-model="size" variant="inset" mandatory>
    <SToggleButton value="sm">S</SToggleButton>
    <SToggleButton value="md">M</SToggleButton>
    <SToggleButton value="lg">L</SToggleButton>
    <SToggleButton value="xl">XL</SToggleButton>
  </SToggleButtonGroup>

  <!-- Dense + bordered -->
  <SToggleButtonGroup v-model="align" mandatory dense bordered selected-color="secondary">
    <SToggleButton value="left"><SIcon icon="mdi-format-align-left" /></SToggleButton>
    <SToggleButton value="center"><SIcon icon="mdi-format-align-center" /></SToggleButton>
    <SToggleButton value="right"><SIcon icon="mdi-format-align-right" /></SToggleButton>
  </SToggleButtonGroup>
</template>
```

## Notes

- `mandatory` prevents deselecting the active button — useful for mode/view switches.
- `multiple` turns the model into an array — always initialize with `ref([])`.
- The `selectedColor` is applied to the background of the active button.
