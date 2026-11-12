# Slide Group Components

**Import:** `import { SSlideGroup, SSlideItem } from '@khsura/sui'`

Horizontal strip of items with prev/next arrows (or native scrolling) and optional selection.

---

## SSlideGroup

Root container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `GroupItemValue[] \| null` | `[]` | Selected item identifiers — **always an array**, even for single selection |
| `centerActive` | `boolean` | `false` | Scroll the clicked/selected item to the center of the viewport |
| `activeClass` | `string \| null` | `undefined` | CSS class added to selected items |
| `slideStep` | `number \| null` | `undefined` | Number of items to move per arrow click (default: one viewport width) |
| `scrollable` | `boolean \| null` | `false` | `true` = native swipe/scroll and **no arrows**; `false` = arrows (shown only when items overflow) and no manual scrolling |
| `mandatory` | `boolean` | `false` | Keep at least one item selected (auto-selects the first item when empty) |
| `multiple` | `boolean` | `false` | Allow multiple selections |
| `contentClass` | `string \| string[] \| Record<string, boolean>` | `undefined` | Class for the inner content row |
| `contentStyle` | `StyleValue` | `undefined` | Style for the inner content row |

`GroupItemValue` = `string | number | boolean | symbol`.

### Model

`v-model` — array of selected item identifiers.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `GroupItemValue[]` | Selection changed |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | `SSlideItem` components |
| `left` | `{ attrs: { disabled }, on: { click } }` | Custom left/prev scroll button |
| `right` | `{ attrs: { disabled }, on: { click } }` | Custom right/next scroll button. Note: its `attrs.disabled` mirrors the *previous* button's state |

---

## SSlideItem

Individual item in the slide group. Must be inside `SSlideGroup` (throws otherwise). Clicking the item toggles its selection.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `GroupItemValue \| null` | vnode `key` | Identifier stored in the group's `v-model`. Falls back to `:key`, then an auto-generated id |
| `disabled` | `boolean` | `false` | Dim the item and block clicks |
| `activeClass` | `string \| null` | `undefined` | CSS class added when this item is selected |

There is **no `value` prop** — identify items with `index` or `:key`.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isSelected }` | Item content |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const selected = ref<string[]>([]) // single selection still uses an array
const activeFilters = ref<string[]>([])
</script>

<template>
  <!-- Basic slide group with arrows -->
  <SSlideGroup v-model="selected" mandatory center-active>
    <SSlideItem
      v-for="item in categories"
      :key="item.id"
      :index="item.id"
    >
      <template #default="{ isSelected }">
        <SButton
          :color="isSelected ? 'primary' : undefined"
          :outlined="!isSelected"
          class="s_ma__2"
        >
          {{ item.name }}
        </SButton>
      </template>
    </SSlideItem>
  </SSlideGroup>

  <!-- With custom navigation buttons -->
  <SSlideGroup>
    <template #left="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on">
        <SIcon icon="mdi-chevron-left" />
      </SButton>
    </template>
    <SSlideItem v-for="n in 10" :key="n">
      <SCard :width="160" class="s_ma__2">
        <SCardText>Item {{ n }}</SCardText>
      </SCard>
    </SSlideItem>
    <template #right="{ on }">
      <SButton variant="icon" v-on="on">
        <SIcon icon="mdi-chevron-right" />
      </SButton>
    </template>
  </SSlideGroup>

  <!-- Filter chips pattern, swipeable -->
  <SSlideGroup v-model="activeFilters" multiple scrollable>
    <SSlideItem
      v-for="filter in filters"
      :key="filter.value"
      :index="filter.value"
    >
      <template #default="{ isSelected }">
        <SChip :color="isSelected ? 'primary' : undefined" class="s_ma__1">
          {{ filter.label }}
        </SChip>
      </template>
    </SSlideItem>
  </SSlideGroup>
</template>
```

## Notes

- The model is always an array — `ref('a')` would be spread into characters; use `ref(['a'])`.
- The item toggles itself on click; the slot only exposes `isSelected` (there is no `select`).
- `scrollable` is inverted from what the name suggests for arrows: arrows appear only when `scrollable` is off and the items overflow.
- `centerActive` scrolls the view to center the selected item automatically.
- `mandatory` prevents deselecting the last selected item.
