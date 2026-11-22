# Tab Components

**Import:** `import { STabs, STab } from '@khsura/sui'`

Single-select tab strip, built on `SToggleButtonGroup`. It renders only the tab buttons — render the panels yourself (e.g. `v-show` / `v-if` on the model).

The tabs stay on **one row**. Each tab keeps the width of its label (tabs stretch to fill spare room), and when they do not fit, the row scrolls sideways (touch, trackpad, shift+wheel) with no scrollbar. An end that hides tabs fades out, so on a phone the row visibly scrolls (swipe it) instead of looking clipped; when every tab fits there is no fade. Set `show-arrows` to also show a small scroll arrow at each end that hides tabs (click it to scroll by most of the row's width; pointer only), or `wrap` to lay the tabs out on several rows instead. The selected tab is scrolled into view on mount and whenever the selection changes. Don't wrap `STabs` in `SSlideGroup` or add `overflow-x: auto` yourself. (Older versions always wrapped the tabs onto several rows on phones; `wrap` keeps that layout.)

---

## STabs

Tab strip container.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | **required** | Active tab's `tab` value |
| `dense` | `boolean` | `false` | Compact tab height |
| `bordered` | `boolean` | `false` | Border around the strip and between tabs |
| `selectedTabColor` | `string` | `'primary'` | Background color of the active tab button |
| `shrink` | `boolean` | `false` | Shrink tabs to content width (no stretch) |
| `outlined` | `boolean \| null` | `undefined` | Outlined border on the strip |
| `underlined` | `boolean \| null` | `undefined` | Underlined border style on the strip (not an active-tab indicator) |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string \| null` | `undefined` | Strip border radius |

Exactly one tab is always active (single-select, mandatory).

### Model

`v-model` / `v-model:modelValue` — the active tab's value.

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Active tab changed |

### Slots

| Slot | Description |
|------|-------------|
| `default` | `STab` components |

---

## STab

Individual tab item.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tab` | `string \| number` | **required** | Value identifying this tab (matched against `STabs` model) |
| `disabled` | `boolean` | `false` | Disable this tab |
| `cols` / `sm` / `md` / `lg` | `1–12 \| 'auto' \| 'grow'` (or string form) | `undefined` | Grid column width per breakpoint (there is no `xl`) |
| `order` | `number` | `undefined` | Flex order |
| `alignSelf` | CSS `align-self` value | `undefined` | Self alignment |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Tab label content |

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref(0)
const activeSection = ref('overview')
</script>

<template>
  <!-- Basic tabs -->
  <STabs v-model="activeTab">
    <STab :tab="0">Overview</STab>
    <STab :tab="1">Details</STab>
    <STab :tab="2">Settings</STab>
  </STabs>

  <!-- Tab content panel (use v-show for instant switching) -->
  <div v-show="activeTab === 0">Overview content</div>
  <div v-show="activeTab === 1">Details content</div>
  <div v-show="activeTab === 2">Settings content</div>

  <!-- Styled tabs -->
  <STabs v-model="activeTab" bordered selected-tab-color="secondary" dense>
    <STab :tab="0">Tab A</STab>
    <STab :tab="1">Tab B</STab>
  </STabs>

  <!-- Shrink (tabs don't stretch) -->
  <STabs v-model="activeTab" shrink>
    <STab :tab="0">Short</STab>
    <STab :tab="1">Longer tab label</STab>
  </STabs>

  <!-- With disabled tab -->
  <STabs v-model="activeTab">
    <STab :tab="0">Active</STab>
    <STab :tab="1" disabled>Disabled</STab>
    <STab :tab="2">Also Active</STab>
  </STabs>

  <!-- String values -->
  <STabs v-model="activeSection">
    <STab tab="overview">Overview</STab>
    <STab tab="api">API</STab>
    <STab tab="examples">Examples</STab>
  </STabs>
</template>
```

## Notes

- `modelValue` must match one of the `tab` prop values of the child `STab` components.
- Use `v-show` (not `v-if`) for tab panels to preserve state when switching tabs.
- The `cols` / `sm` / `md` / `lg` props on `STab` use the grid system to control tab width at different breakpoints.
- **Mobile (375px):** use the plain `<STabs v-model><STab v-for … :tab>` setup — no `shrink`, no `cols`, no wrapper. Tabs that do not fit scroll sideways (swipe) with the edge fade described above, or set `wrap` to flow them onto several rows. Keep labels short (one or two words) so most of them fit; don't truncate labels with CSS, since a clipped label is the defect the fade exists to avoid.
- Keyboard users move between tabs with the arrow keys, Home and End, which also scroll the selected tab into view. The `show-arrows` buttons are a pointer affordance only (`aria-hidden`, out of the tab order).
