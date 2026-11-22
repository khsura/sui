# SWindow

**Import:** `import { SWindow, SWindowItem } from '@khsura/sui'`

Shows one panel at a time with a slide transition, arrows and swipe. Use it for content and step panels; for image slideshows use [SCarousel](./carousel.md), which is built on it.

<!-- generated:api:start SWindow -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SWindow props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `continuous` | `boolean` | — | no | — |
| `disabled` | `boolean \| null` | — | no | — |
| `hideArrows` | `boolean` | — | no | — |
| `mandatory` | `boolean` | — | no | — |
| `modelValue` | `GroupItemValue` | — | no | — |
| `nextIcon` | `string` | `"mdi-chevron-right"` | no | — |
| `noAnimation` | `boolean` | — | no | — |
| `prevIcon` | `string` | `"mdi-chevron-left"` | no | — |
| `readonly` | `boolean \| null` | — | no | — |
| `selectedClass` | `string` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `touch` | `boolean \| TouchHandlers` | — | no | — |

**SWindow slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{ items: { value: GroupItemValue; readonly element: HTMLElement \| null; }[]; selected: { value: GroupItemValue \| undefined; id: number; }; select: (options: { value: GroupItemValue; index?: undefined; } \| { index: number; value?: undefined; }) => void; }` |
| `next` | `{ icon: string; click: () => void; }` |
| `prev` | `{ icon: string; click: () => void; disabled: boolean \| null \| undefined; }` |

**SWindow events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: GroupItemValue \| undefined]` |

<!-- generated:api:end SWindow -->

**SWindow notes**

- `modelValue` (`v-model`): `value` of the visible `SWindowItem`. When it names no item, the first item is selected and the model is updated to its value
- `mandatory`: Always keep an item selected
- `continuous`: Loop from last to first and back; without it the arrows stop at the ends
- `hideArrows`: Hide the prev/next arrows
- `touch`: `true` enables swipe left/right; or pass your own handlers
- `noAnimation`: No slide transition
- `selectedClass`: Class added to the visible item
- `nextIcon` / `prevIcon`: Arrow icons (needs `@mdi/font`) (default: `'mdi-chevron-right'` / `'mdi-chevron-left'`)
- `color`: Arrow color
- `disabled`: Disable the arrows
- `tag`: Root element (default: `'div'`)
- `default` (slot): The `SWindowItem`s. `select({ value })` or `select({ index })` changes the panel
- `prev` (slot): Replace the previous arrow. Call `click()` to go back
- `next` (slot): Replace the next arrow. Call `click()` to go forward

<!-- generated:api:start SWindowItem -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SWindowItem props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — |
| `selected` | `boolean` | — | no | — |
| `value` | `string \| number \| boolean` | — | no | — |

**SWindowItem slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SWindowItem events**

None.

<!-- generated:api:end SWindowItem -->

**SWindowItem notes**

- `value`: Identifier matched against the window's `v-model`

**Sizing**

- Without a `height`, `SWindow` takes the height of the active `SWindowItem`, so tab panels need no height. Set `height` only when every panel must be the same size (for example a fixed-height slideshow).
- `@khsura/sui` 1.19.0 and earlier rendered a window without `height` at 0 height (all items were absolutely positioned). On those versions set a `height`, or use `v-show` panels instead.

## Template ref

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
