# Card Components

**Import:** `import { SCard, SCardTitle, SCardSubtitle, SCardText, SCardActions } from '@khsura/sui'`

A surface (`card` background, rounded corners, full width) with optional structured sections for title, subtitle, text, and actions.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsCard.d.ts`

---

## SCard

<!-- generated:api:start SCard -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCard props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "tile" \| "rounded" \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}%` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `elevation` | `"" \| 0 \| 1 \| 2 \| 22 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 23 \| 24 \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| null` | — | no | — |
| `height` | `string \| number \| null` | — | no | — |
| `href` | `string \| null` | — | no | — |
| `maxHeight` | `string \| number \| null` | — | no | — |
| `maxWidth` | `string \| number \| null` | — | no | — |
| `minHeight` | `string \| number \| null` | — | no | — |
| `minWidth` | `string \| number \| null` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `rel` | `string \| null` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `target` | `"_blank" \| "_self" \| "_parent" \| "_top"` | — | no | `_blank`, `_parent`, `_self`, `_top` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `to` | `LinkLocation \| null` | — | no | — |
| `underlined` | `boolean \| null` | — | no | — |
| `width` | `string \| number \| null` | — | no | — |

**SCard slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCard events**

None.

<!-- generated:api:end SCard -->

**SCard notes**

- `color`: Background: preset/app color name or CSS color
- `colorThreshold`: Luminance threshold used to pick light/dark text on a custom color
- `theme`: Force light/dark text styling
- `elevation`: Shadow depth (default: `undefined` (no shadow))
- `outlined`: Border
- `underlined`: Bottom border only
- `borderRadius`: Border radius override
- `tag`: Root element (ignored when `href`/`to` is set) (default: `'div'`)
- `href`: Render as `<a>`
- `to`: Render as `router-link` (takes precedence over `href`; plain `<a href>` without vue-router)
- `target`: Link target
- `rel`: Link rel
- `width` / `height`: Dimensions
- `maxWidth` / `maxHeight`: Max dimensions
- `minWidth` / `minHeight`: Min dimensions
- `default` (slot): Card content (`SCardTitle`, `SCardSubtitle`, `SCardText`, `SCardActions`, `SImage`, …)

### Events

None declared. Native listeners such as `@click` fall through to the root element.

---

## SCardTitle / SCardSubtitle / SCardText / SCardActions

Each takes only `tag` (default `'div'`) and a `default` slot. No events.

| Component | Purpose |
|-----------|---------|
| `SCardTitle` | Heading (h6 typography), flex row, padded |
| `SCardSubtitle` | Secondary line under the title, padded |
| `SCardText` | Body text area, full width, padded |
| `SCardActions` | Flex row with vertical centering for buttons. Items are **left-aligned** |

Spacing between adjacent title → subtitle → text is tightened automatically.

`SCardTitle` is a flex row (so it can hold an icon, `SSpacer` and buttons). The `s_textAlign__*` classes, responsive ones included, also set the matching `justify-content` on it, so `class="s_textAlign__center"` centres the title. `s_justify__center` works too. A long title wraps between words; a single word wider than the card is split. (Before 1.20.0 `SCardTitle` ignored `s_textAlign__*`, so use `s_justify__*` there, and split titles at any letter.)

<!-- generated:api:start SCardTitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCardTitle props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SCardTitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCardTitle events**

None.

<!-- generated:api:end SCardTitle -->

<!-- generated:api:start SCardSubtitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCardSubtitle props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SCardSubtitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCardSubtitle events**

None.

<!-- generated:api:end SCardSubtitle -->

<!-- generated:api:start SCardText -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCardText props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SCardText slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCardText events**

None.

<!-- generated:api:end SCardText -->

<!-- generated:api:start SCardActions -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SCardActions props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SCardActions slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SCardActions events**

None.

<!-- generated:api:end SCardActions -->

---

## Usage

```vue
<SCard :max-width="400" :elevation="2">
  <SCardTitle>Card Title</SCardTitle>
  <SCardSubtitle>Last active 2 hours ago</SCardSubtitle>
  <SCardText>Body content.</SCardText>
  <SCardActions>
    <SSpacer />
    <SButton variant="text">Cancel</SButton>
    <SButton color="primary">Confirm</SButton>
  </SCardActions>
</SCard>

<!-- Image card -->
<SCard :max-width="340" :elevation="2">
  <SImage src="/photo.jpg" :aspect-ratio="16/9" object-fit="cover" />
  <SCardTitle>Photo Title</SCardTitle>
  <SCardText>Description below the image.</SCardText>
</SCard>

<SCard outlined>
  <SCardTitle>Outlined</SCardTitle>
</SCard>

<!-- Whole card is a router link -->
<SCard :to="{ name: 'detail', params: { id } }" :elevation="2">
  <SCardTitle>{{ item.name }}</SCardTitle>
</SCard>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| Expecting a shadow by default | SCard has no shadow by default. Set `:elevation="2"` (or use `outlined`) |
| Expecting `SCardActions` to right-align buttons | Put `<SSpacer />` first to push buttons right |
| Adding `outlined :elevation="0"` "to remove the shadow" | No shadow is the default. `outlined` alone is enough |
