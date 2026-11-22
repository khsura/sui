# SButton

**Import:** `import { SButton } from '@khsura/sui'`

Button with variants, preset sizes, colors, loading state and link behavior.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsButton.d.ts`

<!-- generated:api:start SButton -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SButton props**

| Prop | Type | Default | Required | Values | Description |
| --- | --- | --- | --- | --- | --- |
| `activeClass` | `string \| null` | — | no | — | — |
| `block` | `boolean` | — | no | — | — |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — | — |
| `color` | `string` | — | no | — | — |
| `colorThreshold` | `number` | — | no | — | — |
| `density` | `DensityType \| null` | — | no | `comfortable`, `compact`, `default` | Vertical density: `default` (today's look), `comfortable` (one step tighter) or `compact` (two steps). Set it once for the app with `createSUI({ defaults: { global: { density } } })` instead of overriding heights or paddings per component. |
| `disabled` | `boolean \| null` | — | no | — | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — | — |
| `height` | `number \| string \| null` | — | no | — | — |
| `href` | `string \| null` | — | no | — | — |
| `loading` | `boolean` | — | no | — | — |
| `maxHeight` | `number \| string \| null` | — | no | — | — |
| `maxWidth` | `number \| string \| null` | — | no | — | — |
| `minHeight` | `number \| string \| null` | — | no | — | — |
| `minWidth` | `number \| string \| null` | — | no | — | — |
| `outlined` | `boolean \| null` | — | no | — | — |
| `readonly` | `boolean \| null` | — | no | — | — |
| `rel` | `string \| null` | — | no | — | — |
| `rounded` | `boolean` | — | no | — | — |
| `selected` | `boolean` | — | no | — | — |
| `size` | `SizePropertyType` | — | no | `default`, `extra`, `large`, `mini`, `small` | — |
| `tag` | `"a" \| "button" \| null` | `"button"` | no | `a`, `button` | — |
| `target` | `"_blank" \| "_parent" \| "_self" \| "_top"` | — | no | `_blank`, `_parent`, `_self`, `_top` | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` | — |
| `to` | `LinkLocation \| null` | — | no | — | — |
| `type` | `ButtonTypeType` | — | no | `button`, `reset`, `submit` | — |
| `underlined` | `boolean \| null` | — | no | — | — |
| `value` | `boolean \| number \| string` | — | no | — | — |
| `variant` | `"fab" \| "icon" \| "text" \| null` | — | no | `fab`, `icon`, `text` | — |
| `width` | `number \| string \| null` | — | no | — | — |

**SButton slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SButton events**

| Event | Payload |
| --- | --- |
| `click` | `[value: Event]` |

<!-- generated:api:end SButton -->

**SButton notes**

- `color`: Preset name (`primary`, `secondary`, `error`, ...) or any CSS color
- `colorThreshold`: Luminance threshold for automatic light/dark text
- `variant`: `fab` = floating action button, `text` = no background, `icon` = circular icon button. No other values exist
- `size`: Preset size
- `type`: HTML button `type` (default: `'button'` (when unset))
- `loading`: Replaces the content with a spinner and disables the button
- `block`: Full width. A block button does not shrink, so two block buttons side by side in one flex row overflow — put each in its own `SColumn`
- `rounded`: Pill shape (ignored for `variant="icon"`)
- `disabled`: Disable interaction
- `elevation`: Shadow depth
- `outlined`: Border style, text-colored
- `underlined`: Underlined style
- `borderRadius`: Custom radius (`8`, `'8px'`, `'1rem'`, ...)
- `href`: Renders an `<a href>`
- `to`: Renders a `router-link` when the app uses vue-router; without it, a plain `<a href>` (a route given by `name` gets no `href`, so pass a path)
- `target`: Only applied with `href`
- `rel`: Only applied with `href`
- `tag`: Root tag when neither `href` nor `to` is set
- `width` / `height`: Dimensions
- `minWidth` / `maxWidth` / `minHeight` / `maxHeight`: Constraints
- `value`: Selection value when used inside `SBottomNavigation`
- `click` (event): Native click
- `default` (slot): Label / content (hidden while `loading`)

## Usage

```vue
<SButton color="primary" :loading="isSaving" @click="save">Save</SButton>
<SButton outlined rounded color="secondary">Cancel</SButton>
<SButton variant="text" color="primary">Learn more</SButton>
<SButton block color="primary" type="submit">Submit</SButton>

<!-- Icon / FAB: put an SIcon inside -->
<SButton variant="icon"><SIcon icon="mdi-plus" /></SButton>
<SButton variant="fab" color="primary"><SIcon icon="mdi-pencil" /></SButton>

<!-- Links -->
<SButton :to="{ name: 'home' }">Home</SButton>
<SButton href="https://example.com" target="_blank" rel="noopener">External</SButton>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `variant="outlined"` / `variant="flat"` | `outlined` is a boolean prop; `variant` is only `fab \| text \| icon` |
| `:loading="x" :disabled="x"` | `loading` already disables the button |
| `href="/a" :to="{...}"` together | Pass one: `to` → `router-link`, `href` → `<a>`. `to` wins if both are set |
| `<SButton icon="mdi-plus" />` | There is no `icon` prop — nest `<SIcon icon="mdi-plus" />` |

- `SIcon` renders nothing unless the app loads `@mdi/font` (e.g. `import '@mdi/font/css/materialdesignicons.css'`).
- Inside `SToolbar` the button picks up dark styling from the toolbar color automatically.
