# SSheet

**Import:** `import { SSheet } from '@khsura/sui'`

A plain surface with the app `card` background. It supports color, elevation, border, and size, and has no internal structure or padding. Use it for colored or elevated containers. For title/text/actions structure, use `SCard` ([cards.md](./cards.md)).

Types: `node_modules/@khsura/sui/@types/definitions/props/propsSheet.d.ts`

<!-- generated:api:start SSheet -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSheet props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `underlined` | `boolean \| null` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |

**SSheet slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SSheet events**

None.

<!-- generated:api:end SSheet -->

**SSheet notes**

- `color`: Background: preset/app color name or CSS color
- `colorThreshold`: Luminance threshold used to pick light/dark text on a custom color
- `theme`: Force light/dark text styling
- `elevation`: Shadow depth (default: `undefined` (no shadow))
- `outlined`: Border
- `underlined`: Bottom border only
- `borderRadius`: Border radius
- `tag`: Root element (default: `'div'`)
- `width` / `height`: Dimensions
- `maxWidth` / `maxHeight`: Max dimensions
- `minWidth` / `minHeight`: Min dimensions
- `default` (slot): Sheet content

## Usage

```vue
<SSheet color="primary" :elevation="2" class="s_pa__4">
  Content on a colored surface
</SSheet>

<SSheet outlined class="s_pa__4">Outlined sheet</SSheet>

<SSheet :width="320" :height="200" :elevation="4" class="s_pa__4">
  Fixed size surface
</SSheet>

<SSheet color="secondary" border-radius="tile">Tile sheet</SSheet>

<SSheet tag="section" :elevation="1">
  <h2>Section heading</h2>
</SSheet>
```

## Gotchas

- SSheet has no padding. Add it yourself (e.g. the `s_pa__4` utility class).
- SSheet has no `href`/`to`. For a clickable surface, use `SCard` with `to`/`href`.
