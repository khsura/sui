# SButton

**Import:** `import { SButton } from '@khsura/sui'`

A versatile button component supporting multiple variants, sizes, colors, and link behavior.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color — preset names (`primary`, `secondary`, `error`, etc.) or any CSS color |
| `variant` | `'fab' \| 'text' \| 'icon' \| null` | `undefined` | Visual variant. `fab` = floating action button, `text` = no background, `icon` = circular icon button. No other values exist |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `loading` | `boolean` | `false` | Replaces the content with a spinner and disables the button |
| `block` | `boolean` | `false` | Full-width button |
| `rounded` | `boolean` | `false` | Pill shape (ignored for `variant="icon"`) |
| `disabled` | `boolean` | `false` | Disable interactions |
| `elevation` | `0–24 \| '' \| null` | `undefined` | Box shadow depth |
| `outlined` | `boolean` | `false` | Outlined/border style, text-colored (transparent background) |
| `underlined` | `boolean` | `false` | Underlined text style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom border radius (`8`, `'8px'`, `'1rem'`, ...) |
| `href` | `string \| null` | `undefined` | Renders as `<a>` tag with this href |
| `to` | `RouteLocationRaw \| null` | `undefined` | Renders a `router-link` (needs vue-router). Wins over `href` if both are set |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Link target (only applied with `href`) |
| `rel` | `string \| null` | `undefined` | Link rel attribute (only applied with `href`) |
| `tag` | `'button' \| 'a'` | `'button'` | Root element tag when neither `href` nor `to` is set |
| `theme` | `AppThemeType` | `undefined` | Theme override |
| `width` / `height` | `string \| number` | `undefined` | Explicit dimensions |
| `minWidth` / `maxWidth` | `string \| number` | `undefined` | Min/max width constraints |
| `minHeight` / `maxHeight` | `string \| number` | `undefined` | Min/max height constraints |
| `value` | `string \| number \| boolean` | `undefined` | Selection value when used inside `SBottomNavigation` |
| `colorThreshold` | `number` | `undefined` | Luminance threshold for automatic light/dark text |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `Event` | Native click event |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Button label / content (hidden while `loading`) |

## Usage

```vue
<!-- Basic -->
<SButton color="primary">Submit</SButton>

<!-- Loading state -->
<SButton color="primary" :loading="isSubmitting" @click="submit">
  Save
</SButton>

<!-- Outlined + rounded -->
<SButton outlined rounded color="secondary">Cancel</SButton>

<!-- Icon button -->
<SButton variant="icon" color="primary">
  <SIcon icon="mdi-plus" />
</SButton>

<!-- FAB -->
<SButton variant="fab" color="primary">
  <SIcon icon="mdi-pencil" />
</SButton>

<!-- Text button -->
<SButton variant="text" color="primary">Learn more</SButton>

<!-- Block (full-width) -->
<SButton block color="primary">Full Width</SButton>

<!-- Link -->
<SButton href="https://example.com" target="_blank" rel="noopener">External Link</SButton>

<!-- Router link -->
<SButton :to="{ name: 'home' }">Home</SButton>

<!-- With submit type inside a form -->
<SButton type="submit" color="primary">Submit Form</SButton>

<!-- Disabled -->
<SButton color="primary" disabled>Unavailable</SButton>
```

## Notes

- When `to` is provided the root renders as `router-link`; when `href` is provided it renders as `<a>` — regardless of the `tag` prop. Pass one of them, not both.
- There is no `icon` prop — nest `<SIcon icon="..." />` inside. `SIcon` renders nothing unless the app loads `@mdi/font`.
- `outlined` is a boolean prop, not a `variant` value.
- Inside `SBottomNavigation`, the button participates in group selection via the `value` prop.
- Inside `SToolbar`, the button automatically inherits dark/light styling from the toolbar color.
- `loading` implicitly disables the button — no need to also set `disabled`.
