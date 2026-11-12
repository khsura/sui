# Expansion Panel Components

**Import:** `import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent } from '@khsura/sui'`

Accordion-style collapsible sections.

---

## SExpansionPanels

Root container that manages the expanded state.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number[] \| null` | `[]` | `index` values of the currently expanded panels |
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously |
| `mandatory` | `boolean` | `false` | At least one panel must always be open (opens the first panel if the model is empty) |
| `expandIcon` | `MaterialDesignIcon` | `'mdi-chevron-down'` | Expand/collapse icon |
| `expandIconSize` | `SizePropertyType` | `undefined` | Icon size |

### Model

`v-model` — `number[]` array holding the `index` prop of each open panel. Emits `update:modelValue`.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SExpansionPanel` components |

---

## SExpansionPanel

Single collapsible panel.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | vnode `key`, else an auto-generated id | Panel identity — the value stored in the `v-model` array |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isExpanded }` | `SExpansionPanelHeader` + `SExpansionPanelContent` |

---

## SExpansionPanelHeader

Clickable header row that triggers collapse/expand.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ open }` | Header label/content |
| `actions` | `{ isExpanded }` | Replaces the expand icon |
| `top` | — | Content above the header row |

---

## SExpansionPanelContent

Collapsible body content.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isExpanded }` | Panel body content |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent, SButton } from '@khsura/sui'

const items = [
  { title: 'Shipping', body: 'Shipping details' },
  { title: 'Returns', body: 'Return policy' },
  { title: 'Warranty', body: 'Warranty terms' },
]
const expanded = ref<number[]>([0]) // panel with :index="0" open by default
</script>

<template>
  <!-- Basic accordion -->
  <SExpansionPanels v-model="expanded">
    <SExpansionPanel :index="0">
      <SExpansionPanelHeader>Section 1</SExpansionPanelHeader>
      <SExpansionPanelContent>
        Content for section 1.
      </SExpansionPanelContent>
    </SExpansionPanel>

    <SExpansionPanel :index="1">
      <SExpansionPanelHeader>Section 2</SExpansionPanelHeader>
      <SExpansionPanelContent>
        Content for section 2.
      </SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Allow multiple panels open -->
  <SExpansionPanels v-model="expanded" multiple>
    <SExpansionPanel v-for="(item, i) in items" :key="i" :index="i">
      <SExpansionPanelHeader>{{ item.title }}</SExpansionPanelHeader>
      <SExpansionPanelContent>{{ item.body }}</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Always keep one open (mandatory) -->
  <SExpansionPanels v-model="expanded" mandatory>
    <SExpansionPanel :index="0">
      <SExpansionPanelHeader>Always one open</SExpansionPanelHeader>
      <SExpansionPanelContent>This stays open if it's the only one.</SExpansionPanelContent>
    </SExpansionPanel>
    <SExpansionPanel :index="1">
      <SExpansionPanelHeader>Another panel</SExpansionPanelHeader>
      <SExpansionPanelContent>Content.</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Programmatic control -->
  <SButton @click="expanded = [0, 1, 2]">Expand All</SButton>
  <SButton @click="expanded = []">Collapse All</SButton>
  <SExpansionPanels v-model="expanded" multiple>
    <SExpansionPanel v-for="(item, i) in items" :key="i" :index="i">
      <SExpansionPanelHeader>{{ item.title }}</SExpansionPanelHeader>
      <SExpansionPanelContent>{{ item.body }}</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>
</template>
```

## Notes

- `modelValue` holds each open panel's `index` prop value, not its DOM position. Without `index` (or a numeric `key`) a panel gets an auto-generated id and a model like `[0]` never matches it — with `v-for`, set `:index="i"`.
- A `disabled` attribute on a panel has no effect; control open state through `v-model`.
- `mandatory` + `multiple="false"` ensures exactly one panel is always open (standard accordion behavior).
- `mandatory` + `multiple="true"` ensures at least one is always open.
