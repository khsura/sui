# SButton

**Import:** `import { SButton } from '@khsura/sui'`

A versatile button component supporting multiple variants, sizes, colors, and link behavior.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Background color — preset names (`primary`, `secondary`, `error`, etc.) or any CSS color |
| `variant` | `'fab' \| 'text' \| 'icon' \| null` | `null` | Visual variant. `fab` = floating action button, `text` = no background, `icon` = circular icon button |
| `size` | `'mini' \| 'small' \| 'default' \| 'large' \| 'extra'` | `undefined` | Preset size |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `loading` | `boolean` | `false` | Show loading spinner (disables button while loading) |
| `block` | `boolean` | `false` | Full-width button |
| `rounded` | `boolean` | `false` | Rounded corners (pill shape) |
| `disabled` | `boolean` | `false` | Disable interactions |
| `elevation` | `0–24 \| ''` | `undefined` | Box shadow depth |
| `outlined` | `boolean` | `false` | Outlined/border style (transparent background) |
| `underlined` | `boolean` | `false` | Underlined text style |
| `borderRadius` | `'tile' \| 'rounded' \| number \| string` | `undefined` | Custom border radius |
| `href` | `string \| null` | `null` | Renders as `<a>` tag with this href |
| `to` | `RouteLocationRaw \| null` | `null` | Vue Router link destination |
| `target` | `'_blank' \| '_self' \| '_parent' \| '_top'` | `undefined` | Link target (when using `href`) |
| `rel` | `string \| null` | `undefined` | Link rel attribute |
| `tag` | `'button' \| 'a'` | `'button'` | Override root element tag |
| `width` / `height` | `string \| number` | `undefined` | Explicit dimensions |
| `minWidth` / `maxWidth` | `string \| number` | `undefined` | Min/max width constraints |
| `minHeight` / `maxHeight` | `string \| number` | `undefined` | Min/max height constraints |
| `value` | `any` | `undefined` | Used when inside `SBottomNavigation` group |
| `colorThreshold` | `number` | `undefined` | Threshold for auto text color contrast |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `Event` | Native click event |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Button label / content |

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
<SButton href="https://example.com" target="_blank">External Link</SButton>

<!-- Router link -->
<SButton :to="{ name: 'home' }">Home</SButton>

<!-- With submit type inside a form -->
<SButton type="submit" color="primary">Submit Form</SButton>

<!-- Disabled -->
<SButton color="primary" disabled>Unavailable</SButton>
```

## Notes

- When `href` or `to` is provided, the root element is automatically rendered as `<a>` regardless of the `tag` prop.
- Inside `SBottomNavigation`, the button participates in group selection via the `value` prop.
- Inside `SToolbar`, the button automatically inherits dark/light styling from the toolbar color.
- `loading` implicitly disables the button — no need to also set `disabled`.
