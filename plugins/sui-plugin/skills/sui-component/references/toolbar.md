# SToolbar

**Import:** `import { SToolbar, SToolbarTitle, SSpacer } from '@khsura/sui'`

Toolbar / app bar with an optional extension row. `SToolbarItem` is also exported but renders an empty element (see Gotchas).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsToolbar.d.ts`, `propsToolbarTitle.d.ts`

---

## SToolbar

<!-- generated:api:start SToolbar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SToolbar props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — | — |
| `contentStyle` | `StyleValue` | — | no | — | — |
| `density` | `DensityType \| null` | — | no | `comfortable`, `compact`, `default` | Vertical density: `default` (today's look), `comfortable` (one step tighter) or `compact` (two steps). Set it once for the app with `createSUI({ defaults: { global: { density } } })` instead of overriding heights or paddings per component. |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — | — |
| `extended` | `boolean \| null` | — | no | — | — |
| `extensionClass` | `string \| Record<string, boolean \| undefined>` | — | no | — | — |
| `extensionHeight` | `number \| string` | `defaultToolbarExtensionHeight` | no | — | — |
| `extensionStyle` | `Record<string, string>` | — | no | — | — |
| `height` | `number \| string \| null` | `defaultToolbarContentHeight` | no | — | — |
| `outlined` | `boolean \| null` | — | no | — | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `title` | `string \| null` | — | no | — | — |
| `underlined` | `boolean \| null` | — | no | — | — |

**SToolbar slots**

| Slot | Slot props |
| --- | --- |
| `append` | `{}` |
| `default` | `{}` |
| `extension` | `{}` |
| `prepend` | `{}` |

**SToolbar events**

None.

<!-- generated:api:end SToolbar -->

**SToolbar notes**

- `color`: Background color (preset or CSS). Child `SButton`s and `SToolbarTitle` adapt to it
- `colorThreshold`: Contrast threshold for the dark/light text decision
- `elevation`: Shadow depth
- `density`: Reduces the main row by 0 / 8 / 16 px and the extension by 0 / 4 / 8 px
- `height`: Main row height
- `extended`: Show the extension row
- `extensionHeight`: Extension row height
- `extensionClass`: Class for the extension row
- `extensionStyle`: Style for the extension row
- `contentClass` / `contentStyle`: Class/style for the main content row
- `position`: CSS position
- `outlined` / `underlined`: Border styles
- `borderRadius`: Border radius
- `tag`: Root HTML element (default: `'div'`)
- `default` (slot): Main row content (horizontal flex)
- `prepend` (slot): Separate **row above** the main row
- `append` (slot): Separate **row below** the main row (and below the extension)
- `extension` (slot): Extension row. Only shown with `extended`

`title` is declared but **never rendered**. Use `SToolbarTitle`.

### Slots

The toolbar root is a column flexbox, so `prepend` / `append` are rows, **not** left/right items.

No events.

---

## SToolbarTitle

<!-- generated:api:start SToolbarTitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SToolbarTitle props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `text` | `string \| null` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SToolbarTitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |
| `text` | `{}` |

**SToolbarTitle events**

None.

<!-- generated:api:end SToolbarTitle -->

**SToolbarTitle notes**

- `text`: Title text (if no slot)
- `tag`: Root element (default: `'div'`)
- `default` (slot): Title content
- `text` (slot): Alternative to the default slot

Renders nothing when it has no slot content and no `text`. Its color comes from the parent toolbar.

---

## Usage

```vue
<template>
  <SToolbar color="primary">
    <SButton variant="icon" @click="toggleDrawer"><SIcon icon="mdi-menu" /></SButton>
    <SToolbarTitle>Dashboard</SToolbarTitle>
    <SSpacer />
    <SButton variant="icon"><SIcon icon="mdi-account" /></SButton>
  </SToolbar>

  <!-- Extension row with tabs -->
  <SToolbar color="primary" extended>
    <SToolbarTitle text="Page title" />
    <template #extension>
      <STabs v-model="tab" style="width: 100%">
        <STab :tab="0">Tab 1</STab>
        <STab :tab="1">Tab 2</STab>
      </STabs>
    </template>
  </SToolbar>

  <SToolbar color="surface" density="compact" outlined>
    <SToolbarTitle>Compact bar</SToolbarTitle>
  </SToolbar>
</template>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SToolbar title="Dashboard">` | `<SToolbarTitle>Dashboard</SToolbarTitle>` |
| `#prepend` / `#append` for left/right icons | Put items in the default slot and use `<SSpacer />` to push right |
| `#extension` without `extended` | Add `extended`, or the row is not rendered |
| `<SToolbarItem><SButton/></SToolbarItem>` | `SToolbarItem` has no slot, so its children are dropped. Place items directly |
| `tag` default `'header'` assumed | Default is `div`. Pass `tag="header"` for semantics |
