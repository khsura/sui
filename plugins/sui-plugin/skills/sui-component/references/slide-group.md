# SSlideGroup / SSlideItem

**Import:** `import { SSlideGroup, SSlideItem } from '@khsura/sui'`

Horizontal strip of items with prev/next arrows (or native scrolling) and optional selection.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSlideGroup.d.ts`

---

## SSlideGroup

<!-- generated:api:start SSlideGroup -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSlideGroup props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — | — |
| `centerActive` | `boolean` | — | no | — | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — | — |
| `contentStyle` | `StyleValue` | — | no | — | — |
| `mandatory` | `boolean` | — | no | — | — |
| `modelValue` | `GroupItemValue[]` | `[]` | no | — | — |
| `multiple` | `boolean` | — | no | — | — |
| `nextAriaLabel` | `string` | `"Next"` | no | — | Accessible name of the next arrow button. Defaults to `'Next'`. |
| `prevAriaLabel` | `string` | `"Previous"` | no | — | Accessible name of the previous arrow button. Defaults to `'Previous'`. |
| `scrollable` | `boolean \| null` | — | no | — | — |
| `slideStep` | `number \| null` | — | no | — | — |

**SSlideGroup slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |
| `left` | `{ attrs: { disabled: boolean; }; on: { click: () => Promise<void>; }; }` |
| `right` | `{ attrs: { disabled: boolean; }; on: { click: () => Promise<void>; }; }` |

**SSlideGroup events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: GroupItemValue[]]` |

<!-- generated:api:end SSlideGroup -->

**SSlideGroup notes**

- `modelValue` (`v-model`): Selected item identifiers — **always an array**, even for single selection
- `multiple`: Allow several selected items
- `mandatory`: Keep at least one selected (auto-selects the first item when empty)
- `scrollable`: `true` = native swipe/scroll, **no arrows**. `false` = arrows (shown only when items overflow), no manual scrolling
- `slideStep`: Items to move per arrow click (default: one viewport width)
- `centerActive`: Scroll the clicked/selected item to the center
- `activeClass`: Class added to selected items
- `contentClass`: Class for the inner content row
- `contentStyle`: Style for the inner content row
- `default` (slot): `SSlideItem` components
- `left` (slot): Custom "previous" button
- `right` (slot): Custom "next" button
- `update:modelValue` (event): Selection changed

`GroupItemValue` = `string | number | boolean | symbol`.

---

## SSlideItem

Must be inside `SSlideGroup` (throws otherwise). Clicking the item toggles its selection.

<!-- generated:api:start SSlideItem -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSlideItem props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — |
| `disabled` | `boolean` | — | no | — |
| `index` | `GroupItemValue \| null` | — | no | — |

**SSlideItem slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ isSelected: boolean; }` |

**SSlideItem events**

None.

<!-- generated:api:end SSlideItem -->

**SSlideItem notes**

- `index`: Identifier stored in the group's `v-model`. Falls back to the `:key`, then to an auto id (default: vnode `key`)
- `disabled`: Dim the item and block clicks
- `activeClass`: Class added when selected
- `default` (slot): Item content

There is **no `value` prop** — use `index` or `:key`.

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>([])        // single selection still uses an array
const activeFilters = ref<string[]>([])
</script>

<template>
  <!-- Single selection with arrows -->
  <SSlideGroup v-model="selected" mandatory center-active>
    <SSlideItem v-for="item in categories" :key="item.id" :index="item.id">
      <template #default="{ isSelected }">
        <SButton :color="isSelected ? 'primary' : undefined" :outlined="!isSelected">
          {{ item.name }}
        </SButton>
      </template>
    </SSlideItem>
  </SSlideGroup>

  <!-- Custom arrows -->
  <SSlideGroup>
    <template #left="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on"><SIcon icon="mdi-chevron-left" /></SButton>
    </template>
    <SSlideItem v-for="n in 10" :key="n">
      <SCard :width="160"><SCardText>Item {{ n }}</SCardText></SCard>
    </SSlideItem>
    <template #right="{ on }">
      <SButton variant="icon" v-on="on"><SIcon icon="mdi-chevron-right" /></SButton>
    </template>
  </SSlideGroup>

  <!-- Filter chips, swipeable -->
  <SSlideGroup v-model="activeFilters" multiple scrollable>
    <SSlideItem v-for="filter in filters" :key="filter.value" :index="filter.value">
      <template #default="{ isSelected }">
        <SChip :color="isSelected ? 'primary' : undefined">{{ filter.label }}</SChip>
      </template>
    </SSlideItem>
  </SSlideGroup>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `const selected = ref('a')` | `const selected = ref(['a'])` — a bare string is spread into characters |
| `<SSlideItem :value="id">` | `<SSlideItem :index="id">` (or rely on `:key`) |
| `#default="{ isSelected, select }"` + `@click="select"` | Only `isSelected` exists; the item itself toggles on click |
| `scrollable` to get arrows | Arrows appear when `scrollable` is **off** and items overflow |

- Each slot's `attrs.disabled` is `true` only at that arrow's own edge, so `v-bind="attrs"` is enough for a custom arrow. Before 1.20.0 the `right` slot's `attrs.disabled` mirrored the *previous* button's state; there, compute your own disabled state for a custom "next" button.
- `disabled` on an item blocks clicks via CSS (`pointer-events: none`) and dims it.
