# Slide Group Components

**Import:** `import { SSlideGroup, SSlideItem } from '@khsura/sui'`

Horizontally scrollable group of items with optional selection.

---

## SSlideGroup

Root scrollable container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `any \| any[]` | `undefined` | Selected item value(s) |
| `centerActive` | `boolean` | `false` | Center the active item in the viewport |
| `activeClass` | `string` | `undefined` | CSS class for the active item |
| `slideStep` | `number` | `undefined` | Number of items to scroll per arrow click |
| `scrollable` | `boolean` | `false` | Enable scroll arrows |
| `mandatory` | `boolean` | `false` | At least one item must be selected |
| `multiple` | `boolean` | `false` | Allow multiple selections |

### Model

`v-model` — selected value or array of values.

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | `SSlideItem` components |
| `left` | `{ attrs, on }` | Custom left/prev scroll button |
| `right` | `{ attrs, on }` | Custom right/next scroll button |

---

## SSlideItem

Individual item in the slide group.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any` | `undefined` | Item identifier |

### Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | `{ isSelected, select }` | Item content with selection helpers |

---

## Usage

```vue
<script setup lang="ts">
const selected = ref(null)
</script>

<template>
  <!-- Basic slide group -->
  <SSlideGroup v-model="selected" scrollable mandatory>
    <SSlideItem
      v-for="item in categories"
      :key="item.id"
      :value="item.id"
    >
      <template #default="{ isSelected, select }">
        <SButton
          :color="isSelected ? 'primary' : undefined"
          :outlined="!isSelected"
          @click="select"
          class="s_ma__2"
        >
          {{ item.name }}
        </SButton>
      </template>
    </SSlideItem>
  </SSlideGroup>

  <!-- With custom navigation buttons -->
  <SSlideGroup v-model="selected" scrollable>
    <template #left="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on">
        <SIcon icon="mdi-chevron-left" />
      </SButton>
    </template>
    <SSlideItem v-for="n in 10" :key="n" :value="n">
      <SCard :width="160" class="s_ma__2">
        <SCardText>Item {{ n }}</SCardText>
      </SCard>
    </SSlideItem>
    <template #right="{ attrs, on }">
      <SButton variant="icon" v-bind="attrs" v-on="on">
        <SIcon icon="mdi-chevron-right" />
      </SButton>
    </template>
  </SSlideGroup>

  <!-- Filter chips pattern -->
  <SSlideGroup v-model="activeFilters" multiple scrollable>
    <SSlideItem
      v-for="filter in filters"
      :key="filter.value"
      :value="filter.value"
    >
      <template #default="{ isSelected, select }">
        <SChip
          :color="isSelected ? 'primary' : undefined"
          link
          class="s_ma__1"
          @click="select"
        >
          {{ filter.label }}
        </SChip>
      </template>
    </SSlideItem>
  </SSlideGroup>
</template>
```

## Notes

- Use the `isSelected` and `select` scoped slot helpers to implement custom active states.
- `centerActive` scrolls the view to center the selected item automatically.
- `mandatory` prevents deselecting the last selected item.
