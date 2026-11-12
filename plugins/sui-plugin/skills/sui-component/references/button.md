# SButton

**Import:** `import { SButton } from '@khsura/sui'`

Button with variants, preset sizes, colors, loading state and link behavior.

Types: `node_modules/@khsura/sui/@types/definitions/props/propsButton.d.ts`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Preset name (`primary`, `secondary`, `error`, ...) or any CSS color |
| `colorThreshold` | `number` | `undefined` | Luminance threshold for automatic light/dark text |
| `variant` | `'fab' \| 'text' \| 'icon' \| null` | `undefined` | `fab` = floating action button, `text` = no background, `icon` = circular icon button. No other values exist |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` (when unset) | HTML button `type` |
| `loading` | `boolean` | `false` | Replaces the content with a spinner and disables the button |
| `block` | `boolean` | `false` | Full width |
| `rounded` | `boolean` | `false` | Pill shape (ignored for `variant="icon"`) |
| `disabled` | `boolean` | `false` | Disable interaction |
| `elevation` | `0–24 \| '' \| null` | `undefined` | Shadow depth |
| `outlined` | `boolean` | `false` | Border style, text-colored |
| `underlined` | `boolean` | `false` | Underlined style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom radius (`8`, `'8px'`, `'1rem'`, ...) |
| `href` | `string \| null` | `undefined` | Renders an `<a href>` |
| `to` | `RouteLocationRaw \| null` | `undefined` | Renders a `router-link` (needs vue-router) |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Only applied with `href` |
| `rel` | `string \| null` | `undefined` | Only applied with `href` |
| `tag` | `'button' \| 'a'` | `'button'` | Root tag when neither `href` nor `to` is set |
| `width` / `height` | `string \| number` | `undefined` | Dimensions |
| `minWidth` / `maxWidth` / `minHeight` / `maxHeight` | `string \| number` | `undefined` | Constraints |
| `value` | `string \| number \| boolean` | `undefined` | Selection value when used inside `SBottomNavigation` |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `Event` | Native click |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Label / content (hidden while `loading`) |

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
