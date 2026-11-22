# STabs

**Import:** `import { STabs, STab } from '@khsura/sui'`

Single-select tab strip, built on the toggle-button group. It renders only the tab buttons. You render the panels yourself, usually with `v-if` / `v-show` on the model. Or pair it with [SWindow](./window.md) for sliding panels.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTabs.d.ts`, `propsTab.d.ts`

The tabs stay on **one row**. Each tab keeps the width of its label (tabs stretch to fill spare room), and when they do not fit, the row scrolls sideways (touch, trackpad, shift+wheel) with no scrollbar. An end that hides tabs fades out, so on a phone the row visibly scrolls (swipe it) instead of looking clipped; when every tab fits there is no fade. `show-arrows` adds a scroll arrow at each end that hides tabs (pointer only); `wrap` lays the tabs out on several rows instead. The selected tab is scrolled into view on mount and whenever the selection changes. Don't wrap `STabs` in `SSlideGroup` or add `overflow-x: auto` yourself. (Older versions always wrapped the tabs onto several rows on phones; `wrap` keeps that layout.)

---

## STabs

<!-- generated:api:start STabs -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**STabs props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `bordered` | `boolean` | — | no | — | — |
| `dense` | `boolean` | — | no | — | — |
| `modelValue` | `number \| string` | — | yes | — | — |
| `outlined` | `boolean \| null` | — | no | — | — |
| `selectedTabColor` | `string` | `"primary"` | no | — | — |
| `showArrows` | `boolean` | — | no | — | Show a scroll arrow at each end of the row that hides tabs (pointer only; the row still swipes). Ignored with `wrap`. |
| `shrink` | `boolean` | — | no | — | — |
| `underlined` | `boolean \| null` | — | no | — | — |
| `wrap` | `boolean` | — | no | — | Lay the tabs out on several rows when they do not fit, instead of one row that scrolls sideways. |

**STabs slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**STabs events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: string \| number]` |

<!-- generated:api:end STabs -->

**STabs notes**

- `modelValue`: Active tab's `tab` value (use `v-model`) (default: **required**)
- `dense`: Compact tab height
- `bordered`: Bordered strip
- `selectedTabColor`: Color of the active tab button
- `shrink`: Tabs size to their content instead of stretching
- `outlined`: Outlined border on the strip
- `underlined`: Bottom-border style on the strip (not an active-tab indicator)
- `borderRadius`: Strip border radius
- `default` (slot): `STab` components
- `update:modelValue` (event): Active tab changed

Always exactly one tab active (mandatory, single-select).

---

## STab

<!-- generated:api:start STab -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**STab props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `alignSelf` | `"auto" \| "baseline" \| "center" \| "end" \| "first baseline" \| "flex-end" \| "flex-start" \| "inherit" \| "initial" \| "last baseline" \| "normal" \| "safe center" \| "self-end" \| "self-start" \| "start" \| "stretch" \| "unsafe center" \| null` | — | no | `auto`, `baseline`, `center`, `end`, `first baseline`, `flex-end`, `flex-start`, `inherit`, `initial`, `last baseline`, `normal`, `safe center`, `self-end`, `self-start`, `start`, `stretch`, `unsafe center` |
| `cols` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `disabled` | `boolean` | — | no | — |
| `lg` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `md` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `order` | `number \| null` | — | no | — |
| `sm` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `tab` | `number \| string` | — | yes | — |

**STab slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**STab events**

None.

<!-- generated:api:end STab -->

**STab notes**

- `tab`: Identifier matched against `STabs` model (default: **required**)
- `disabled`: Disable this tab
- `cols` / `sm` / `md` / `lg`: Grid column width per breakpoint (no `xl`)
- `order`: Flex order
- `alignSelf`: Flex alignment
- `default` (slot): Tab label

---

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { STabs, STab } from '@khsura/sui'

const active = ref<'overview' | 'api'>('overview')
</script>

<template>
  <STabs v-model="active" bordered dense selected-tab-color="secondary">
    <STab tab="overview">Overview</STab>
    <STab tab="api">API</STab>
    <STab tab="examples" disabled>Examples</STab>
  </STabs>

  <!-- v-show keeps panel state; v-if unmounts hidden panels -->
  <section v-show="active === 'overview'">Overview content</section>
  <section v-show="active === 'api'">API content</section>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<STab value="a">` / `<STab :index="0">` | `<STab tab="a">`. The identifier prop is `tab` |
| `<STabs>` without `v-model` | `modelValue` is required |
| Panels that slide between tabs | Bind the same model to [SWindow](./window.md) with `SWindowItem value` = the `STab tab` |
| Many tabs on a phone wrapping onto several rows | By default the row scrolls sideways (swipe); set `wrap` to keep the several-row layout. Keep labels short either way |
| `shrink`, `cols`, a wrapper or CSS truncation to fit tabs on a 375px phone | The plain `<STabs v-model><STab v-for … :tab>` setup: tabs that do not fit scroll sideways with an edge fade (or set `wrap` for several rows). See the `tabbed-sections` recipe |
| `underlined` to get an active underline | It styles the strip's border. Use `selectedTabColor` for the active state |
