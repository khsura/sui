# SExpansionPanels

**Import:** `import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent } from '@khsura/sui'`

Accordion-style collapsible sections.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsExpansionPanels.d.ts`

---

## SExpansionPanels

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `number[] \| null` | `[]` | `index` values of open panels (use `v-model`) |
| `multiple` | `boolean` | `false` | Allow several panels open at once |
| `mandatory` | `boolean` | `false` | Keep at least one panel open. Opens the first one if the model is empty |
| `expandIcon` | `MaterialDesignIcon` | `'mdi-chevron-down'` | Header toggle icon |
| `expandIconSize` | `SizePropertyType` | `undefined` | Toggle icon size |

### Slots / Events

| Slot | Description |
|------|-------------|
| `default` | `SExpansionPanel` components |

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `number[]` | Open panels changed |

---

## SExpansionPanel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | vnode `key`, else an auto id | Panel identity, the value stored in the `v-model` array |

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isExpanded }` | `SExpansionPanelHeader` + `SExpansionPanelContent` |

## SExpansionPanelHeader

Clickable row that toggles its panel.

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ open }` | Header label |
| `actions` | `{ isExpanded }` | Replaces the expand icon |
| `top` | none | Content above the header row |

## SExpansionPanelContent

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isExpanded }` | Collapsible body |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent, SButton } from '@khsura/sui'

const items = [
  { title: 'Shipping', body: '…' },
  { title: 'Returns', body: '…' },
]
const open = ref<number[]>([0])
</script>

<template>
  <SExpansionPanels v-model="open" multiple>
    <SExpansionPanel v-for="(item, i) in items" :key="i" :index="i">
      <SExpansionPanelHeader>{{ item.title }}</SExpansionPanelHeader>
      <SExpansionPanelContent>{{ item.body }}</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>

  <SButton @click="open = items.map((_, i) => i)">Expand all</SButton>
  <SButton @click="open = []">Collapse all</SButton>

  <!-- Static panels: give each an index -->
  <SExpansionPanels v-model="open" mandatory>
    <SExpansionPanel :index="0">
      <SExpansionPanelHeader>Section 1</SExpansionPanelHeader>
      <SExpansionPanelContent>Content 1</SExpansionPanelContent>
    </SExpansionPanel>
    <SExpansionPanel :index="1">
      <SExpansionPanelHeader>Section 2</SExpansionPanelHeader>
      <SExpansionPanelContent>Content 2</SExpansionPanelContent>
    </SExpansionPanel>
  </SExpansionPanels>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SExpansionPanel>` with no `index`/`key` + `v-model="[0]"` | Set `:index="i"`. Without it the identity is an auto-generated id and the model never matches |
| Assuming the model holds DOM position | It holds each panel's `index` prop value |
| `disabled` on a panel | Not implemented for panels. Control it with `v-model` instead |
