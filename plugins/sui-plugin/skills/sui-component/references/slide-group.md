# SSlideGroup / SSlideItem

**Import:** `import { SSlideGroup, SSlideItem } from '@khsura/sui'`

Horizontal strip of items with prev/next arrows (or native scrolling) and optional selection.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSlideGroup.d.ts`

---

## SSlideGroup

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `GroupItemValue[] \| null` | `[]` | Selected item identifiers — **always an array**, even for single selection |
| `multiple` | `boolean` | `false` | Allow several selected items |
| `mandatory` | `boolean` | `false` | Keep at least one selected (auto-selects the first item when empty) |
| `scrollable` | `boolean \| null` | `false` | `true` = native swipe/scroll, **no arrows**. `false` = arrows (shown only when items overflow), no manual scrolling |
| `slideStep` | `number \| null` | `undefined` | Items to move per arrow click (default: one viewport width) |
| `centerActive` | `boolean` | `false` | Scroll the clicked/selected item to the center |
| `activeClass` | `string \| null` | `undefined` | Class added to selected items |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | `undefined` | Class for the inner content row |
| `contentStyle` | `StyleValue` | `undefined` | Style for the inner content row |

`GroupItemValue` = `string | number | boolean | symbol`.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | `SSlideItem` components |
| `left` | `{ attrs: { disabled }, on: { click } }` | Custom "previous" button |
| `right` | `{ attrs: { disabled }, on: { click } }` | Custom "next" button |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `GroupItemValue[]` | Selection changed |

---

## SSlideItem

Must be inside `SSlideGroup` (throws otherwise). Clicking the item toggles its selection.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `GroupItemValue \| null` | vnode `key` | Identifier stored in the group's `v-model`. Falls back to the `:key`, then to an auto id |
| `disabled` | `boolean` | `false` | Dim the item and block clicks |
| `activeClass` | `string \| null` | `undefined` | Class added when selected |

There is **no `value` prop** — use `index` or `:key`.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isSelected }` | Item content |

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

- The `right` slot's `attrs.disabled` mirrors the *previous* button's state — compute your own disabled state for a custom "next" button if needed.
- `disabled` on an item blocks clicks via CSS (`pointer-events: none`) and dims it.
