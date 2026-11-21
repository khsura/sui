# SExpansionPanels

**Import:** `import { SExpansionPanels, SExpansionPanel, SExpansionPanelHeader, SExpansionPanelContent } from '@khsura/sui'`

Accordion-style collapsible sections.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsExpansionPanels.d.ts`

---

## SExpansionPanels

<!-- generated:api:start SExpansionPanels -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SExpansionPanels props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `expandIcon` | `string` | — | no | — |
| `expandIconSize` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` |
| `mandatory` | `boolean` | — | no | — |
| `modelValue` | `(number[] & GroupItemValue[])` | `[]` | no | — |
| `multiple` | `boolean` | — | no | — |

**SExpansionPanels slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SExpansionPanels events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: GroupItemValue[]]` |

<!-- generated:api:end SExpansionPanels -->

**SExpansionPanels notes**

- `modelValue`: `index` values of open panels (use `v-model`)
- `multiple`: Allow several panels open at once
- `mandatory`: Keep at least one panel open. Opens the first one if the model is empty
- `expandIcon`: Header toggle icon (default: `'mdi-chevron-down'`)
- `expandIconSize`: Toggle icon size
- `default` (slot): `SExpansionPanel` components
- `update:modelValue` (event): Open panels changed

---

## SExpansionPanel

<!-- generated:api:start SExpansionPanel -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SExpansionPanel props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — |
| `disabled` | `boolean` | — | no | — |
| `index` | `number \| null` | — | no | — |

**SExpansionPanel slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ isExpanded: boolean; }` |

**SExpansionPanel events**

None.

<!-- generated:api:end SExpansionPanel -->

**SExpansionPanel notes**

- `index`: Panel identity, the value stored in the `v-model` array (default: vnode `key`, else an auto id)
- `default` (slot): `SExpansionPanelHeader` + `SExpansionPanelContent`

## SExpansionPanelHeader

Clickable row that toggles its panel. Its text starts at the same 16px inset as `SExpansionPanelContent`, and the chevron sits 16px from the right edge, so header and content line up without extra padding classes. (Older versions indented the header text 8px more than the content.)

<!-- generated:api:start SExpansionPanelHeader -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SExpansionPanelHeader props**

None.

**SExpansionPanelHeader slots**

| Slot | Slot props |
| --- | --- |
| `actions` | `{ isExpanded: boolean \| null; }` |
| `default` | `{ open: boolean \| null; }` |
| `top` | `{}` |

**SExpansionPanelHeader events**

None.

<!-- generated:api:end SExpansionPanelHeader -->

**SExpansionPanelHeader notes**

- `default` (slot): Header label
- `actions` (slot): Replaces the expand icon
- `top` (slot): Content above the header row

## SExpansionPanelContent

<!-- generated:api:start SExpansionPanelContent -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SExpansionPanelContent props**

None.

**SExpansionPanelContent slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ isExpanded: boolean \| null; }` |

**SExpansionPanelContent events**

None.

<!-- generated:api:end SExpansionPanelContent -->

**SExpansionPanelContent notes**

- `default` (slot): Collapsible body

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
