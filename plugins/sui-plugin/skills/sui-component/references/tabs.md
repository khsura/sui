# STabs

**Import:** `import { STabs, STab } from '@khsura/sui'`

Single-select tab strip, built on the toggle-button group. It renders only the tab buttons. You render the panels yourself, usually with `v-if` / `v-show` on the model. Or pair it with [SWindow](./window.md) for sliding panels.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsTabs.d.ts`, `propsTab.d.ts`

---

## STabs

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string \| number` | **required** | Active tab's `tab` value (use `v-model`) |
| `dense` | `boolean` | `false` | Compact tab height |
| `bordered` | `boolean` | `false` | Bordered strip |
| `selectedTabColor` | `string` | `'primary'` | Color of the active tab button |
| `shrink` | `boolean` | `false` | Tabs size to their content instead of stretching |
| `outlined` | `boolean \| null` | `undefined` | Outlined border on the strip |
| `underlined` | `boolean \| null` | `undefined` | Bottom-border style on the strip (not an active-tab indicator) |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string \| null` | `undefined` | Strip border radius |

Always exactly one tab active (mandatory, single-select).

### Slots

| Slot | Description |
|------|-------------|
| `default` | `STab` components |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string \| number` | Active tab changed |

---

## STab

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tab` | `string \| number` | **required** | Identifier matched against `STabs` model |
| `disabled` | `boolean` | `false` | Disable this tab |
| `cols` / `sm` / `md` / `lg` | `1–12 \| 'auto' \| 'grow'` (or string form) | `undefined` | Grid column width per breakpoint (no `xl`) |
| `order` | `number` | `undefined` | Flex order |
| `alignSelf` | CSS `align-self` value | `undefined` | Flex alignment |

| Slot | Description |
|------|-------------|
| `default` | Tab label |

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
| `underlined` to get an active underline | It styles the strip's border. Use `selectedTabColor` for the active state |
