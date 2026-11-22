# SSkeletonLoader

**Import:** `import { SSkeletonLoader } from '@khsura/sui'`

A placeholder that draws grey "bones" in the shape of the content that is still loading, then swaps in that content. It renders a `<div>`; while the skeleton shows, the div is one `role="status"` with `aria-busy="true"`, and the bones inside are `aria-hidden`.

Live examples: [SSkeletonLoader in Storybook](https://sui.surakh.com/?path=/docs/ui-components-skeletonloader--docs)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Presets joined by commas, each with an optional `@N` repeat count: `'avatar, text@3'`. See [Presets](#presets) |
| `loading` | `boolean` | `false` | Shows the skeleton while `true` and the default slot once `false`. Without a default slot the skeleton always shows |
| `boilerplate` | `boolean` | `false` | Still bones, without the shimmer |
| `loadingText` | `string` | `'Loading…'` | Accessible name of the status while the skeleton shows |
| `width`, `maxWidth`, `minWidth`, `height`, `maxHeight`, `minHeight` | `string \| number` | `undefined` | Size of the root; a number is in px. The root is full width by default |
| `theme` | `AppThemeType` | `undefined` | Per-component theme override |

## Presets

| Preset | Draws | Size |
|--------|-------|------|
| `text` | One line of text. The last of several lines is 70% wide | 12px high, full width |
| `heading` | A title | 24px high, half width |
| `avatar` | A circle | 40px, the standard SAvatar size |
| `button` | A button | 36px high (SButton's default), 88px wide |
| `image` | A picture | 200px high, full width |
| `card` | `image`, `heading` and two `text` lines, with SCard's 16px padding | — |
| `list-item` | One `text` line in a row | 48px min height (SListItem) |
| `list-item-avatar` | An `avatar` beside two `text` lines | 56px min height |
| `table-row` | Four cells in a row | 48px high (STable's row) |
| `table` | Five `table-row`s | — |

Join presets with commas and repeat one with `@N`: `type="heading, text@4, button"`. Spaces are ignored, an unknown preset is dropped, and a repeat is capped at 50. The presets match SUI's real sizes, so the layout does not jump when the content replaces the skeleton.

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| `default` | — | The real content, shown once `loading` is `false` |

## Events

None.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { SCard, SCardTitle, SSkeletonLoader } from '@khsura/sui'

const isLoading = ref(true)
</script>

<template>
  <!-- Wraps the content and swaps it in when loading ends -->
  <SSkeletonLoader type="card" :loading="isLoading">
    <SCard>
      <SCardTitle>Order #1024</SCardTitle>
    </SCard>
  </SSkeletonLoader>

  <!-- Compose presets with commas and @N -->
  <SSkeletonLoader type="list-item-avatar@3" :loading="isLoading">
    <SList>…</SList>
  </SSkeletonLoader>

  <!-- Standalone: no slot, so the skeleton always shows; toggle it yourself -->
  <SSkeletonLoader v-if="isLoading" type="table" />
  <STable v-else :headers="headers" :items="items" />
</template>
```

## Accessibility

- While the skeleton shows, the root is `role="status"`, `aria-busy="true"` and named by `loadingText` (`Loading…` by default). Translate or specialise it: `loading-text="Loading orders"`.
- The bones are `aria-hidden="true"`, so a screen reader announces one status instead of many empty shapes.
- When `loading` turns `false`, the status attributes are removed and the content is read as usual.
- No keyboard interaction: the skeleton has no Tab stop.
- The shimmer stops for users who ask for `prefers-reduced-motion: reduce`, and with `boilerplate`.

## Notes

- **Dark mode needs nothing extra.** The bones are tinted from the text colour, so they follow the app theme, the `theme` prop, and a dark parent.
- **A bound `loading` needs content inside.** `<SSkeletonLoader :loading="isLoading" />` with no slot never hides, because there is nothing to swap in. Put the content inside, or use `v-if` / `v-else`. The SUI MCP validator warns about it (`skeleton-loader-never-hides`).
- **Vuetify presets do not exist.** `paragraph`, `sentences`, `article`, `list-item-two-line`, `chip`, `actions`, `table-tbody` and the like are ignored. Use `text@3`, `heading, text@3`, `list-item-avatar`, `button@2`, `table-row@5`. The validator reports them as an error (`skeleton-loader-unknown-preset`) with the SUI replacement.
- **No `color`, `elevation` or `size`.** Size the root with `width` / `maxWidth` / `height`; tint it by putting it on a themed surface.
- The root is full width, so `text` bones do not collapse inside a flex row. Give it `width` or `max-width` to make it narrower.
