# SWindow

**Import:** `import { SWindow, SWindowItem } from '@khsura/sui'`

Shows one panel at a time with a slide transition, arrows and swipe. Use it for content and step panels; for image slideshows use [SCarousel](./carousel.md), which is built on it.

## SWindow props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` (`v-model`) | `string \| number \| boolean` | — | `value` of the visible `SWindowItem`. When it names no item, the first item is selected and the model is updated to its value |
| `mandatory` | `boolean` | — | Always keep an item selected |
| `continuous` | `boolean` | — | Loop from last to first and back; without it the arrows stop at the ends |
| `hideArrows` | `boolean` | — | Hide the prev/next arrows |
| `touch` | `boolean \| TouchHandlers` | — | `true` enables swipe left/right; or pass your own handlers |
| `noAnimation` | `boolean` | — | No slide transition |
| `selectedClass` | `string` | — | Class added to the visible item |
| `nextIcon` / `prevIcon` | `MaterialDesignIcon` | `'mdi-chevron-right'` / `'mdi-chevron-left'` | Arrow icons (needs `@mdi/font`) |
| `color` | `string` | — | Arrow color |
| `disabled` | `boolean` | — | Disable the arrows |
| `tag` | `string` | `'div'` | Root element |

## SWindowItem props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string \| number \| boolean` | Identifier matched against the window's `v-model` |

## Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `default` | `{ items, selected, select }` | The `SWindowItem`s. `select({ value })` or `select({ index })` changes the panel |
| `prev` | `{ icon, click, disabled }` | Replace the previous arrow. Call `click()` to go back |
| `next` | `{ icon, click }` | Replace the next arrow. Call `click()` to go forward |

The component also exposes `goNext()` and `goPrev()` through a template ref.

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SButton, SIcon, STab, STabs, SWindow, SWindowItem } from '@khsura/sui'

const step = ref('account')
</script>

<template>
  <STabs v-model="step">
    <STab tab="account">Account</STab>
    <STab tab="billing">Billing</STab>
  </STabs>

  <SWindow v-model="step" mandatory>
    <SWindowItem value="account">Account settings…</SWindowItem>
    <SWindowItem value="billing">Billing settings…</SWindowItem>

    <template #next="{ icon, click }">
      <SButton variant="icon" aria-label="Next" @click="click()">
        <SIcon :icon="icon" />
      </SButton>
    </template>
  </SWindow>
</template>
```

## Gotchas

| ❌ | ✅ |
|---|---|
| `#prev="{ attrs, on }"` | The arrow slots pass `{ icon, click }` (`prev` also `disabled`); call `click()` |
| Identify items by index or `key` | `SWindowItem` uses `value` (unlike `SToggleButton` / `SExpansionPanel`) |
| Image slideshow with `SWindow` | Use `SCarousel` + `SCarouselItem` |
| Before `@khsura/sui` 1.18, `v-model` set to a non-first item on mount was ignored and overwritten | Fixed: the initial `v-model` is respected |
