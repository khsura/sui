# Expansion Panel Components

**Import:** `import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent } from '@khsura/sui'`

Accordion-style collapsible sections.

---

## SExpansionPanels

Root container that manages the expanded state.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number[]` | `[]` | Indexes of currently expanded panels |
| `multiple` | `boolean` | `false` | Allow multiple panels open simultaneously |
| `mandatory` | `boolean` | `false` | At least one panel must always be open |
| `expandIcon` | `MaterialDesignIcon` | `'mdi-chevron-down'` | Expand/collapse icon |
| `expandIconSize` | `SizePropertyType` | `undefined` | Icon size |

### Model

`v-model` — `number[]` array of open panel indexes.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SExpansionPanel` components |

---

## SExpansionPanel

Single collapsible panel.

### Slots

| Slot | Description |
|------|-------------|
| `default` | `SExpansionPanelHeader` + `SExpansionPanelContent` |

---

## SExpansionPanelHeader

Clickable header row that triggers collapse/expand.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Header label/content |

---

## SExpansionPanelContent

Collapsible body content.

### Slots

| Slot | Description |
|------|-------------|
| `default` | Panel body content |

---

## Usage

```vue
<script setup lang="ts">
const expanded = ref([0]) // First panel open by default
</script>

<template>
  <!-- Basic accordion -->
  <SExpansionPanels v-model="expanded">
    <SExpansionPanel>
      <SExpansionPanelHeader>Section 1</SExpansionPanelHeader>
      <SExpansionPanelContent>
        Content for section 1.
      </SExpansionPanelContent>
    </SExpansionPanel>

    <SExpansionPanel>
      <SExpansionPanelHeader>Section 2</SExpansionPanelHeader>
      <SExpansionPanelContent>
        Content for section 2.
      </SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Allow multiple panels open -->
  <SExpansionPanels v-model="expanded" multiple>
    <SExpansionPanel v-for="(item, i) in items" :key="i">
      <SExpansionPanelHeader>{{ item.title }}</SExpansionPanelHeader>
      <SExpansionPanelContent>{{ item.body }}</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Always keep one open (mandatory) -->
  <SExpansionPanels v-model="expanded" mandatory>
    <SExpansionPanel>
      <SExpansionPanelHeader>Always one open</SExpansionPanelHeader>
      <SExpansionPanelContent>This stays open if it's the only one.</SExpansionPanelContent>
    </SExpansionPanel>
    <SExpansionPanel>
      <SExpansionPanelHeader>Another panel</SExpansionPanelHeader>
      <SExpansionPanelContent>Content.</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <!-- Programmatic control -->
  <SButton @click="expanded = [0, 1, 2]">Expand All</SButton>
  <SButton @click="expanded = []">Collapse All</SButton>
  <SExpansionPanels v-model="expanded" multiple>
    <!-- ... -->
  </SExpansionPanels>
</template>
```

## Notes

- `modelValue` contains the **indexes** (0-based) of open panels, not panel identifiers.
- `mandatory` + `multiple="false"` ensures exactly one panel is always open (standard accordion behavior).
- `mandatory` + `multiple="true"` ensures at least one is always open.
