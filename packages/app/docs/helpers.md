# SUI SCSS Helpers

When you import `_helpers.scss` in your SCSS file, you get access to all SUI functions, mixins, and variables.

```scss
@use '@khsura/sui/helpers' as *;
// or with a namespace:
@use '@khsura/sui/helpers' as sui;
```

---

## Functions

### `s_getPresetColor($color, $isText: false)`

Returns a CSS custom property for a **preset theme color** (defined in SUI's theme configuration).

```scss
// Signature
s_getPresetColor($color, $isText: false) // → CSS var()
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$color` | `string` | — | Preset color name |
| `$isText` | `boolean` | `false` | If `true`, returns the text-contrast variant (`--text`) |

**Valid `$color` values:** `primary`, `secondary`, `success`, `info`, `warning`, `important`, `error`

```scss
.my-element {
  background-color: s_getPresetColor('primary');        // var(--s-color-primary)
  color: s_getPresetColor('primary', true);             // var(--s-color-primary--text)
  border-color: s_getPresetColor('error');              // var(--s-color-error)
}

.badge {
  background-color: s_getPresetColor('success');
  color: s_getPresetColor('success', $isText: true);
}
```

---

### `s_getAppColor($color, $isText: false)`

Returns a CSS custom property for a **theme/app-level color** (background, surface, text, border, etc.).

```scss
// Signature
s_getAppColor($color, $isText: false) // → CSS var()
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$color` | `string` | — | App color token name |
| `$isText` | `boolean` | `false` | If `true`, returns the text-contrast variant (`--text`) |

**Common `$color` values:**

| Token | Description |
|-------|-------------|
| `'text'` | Primary text color |
| `'background'` | Page background color |
| `'card'` | Card / surface background |
| `'border'` | Default border color |
| `'disabled'` | Disabled element background |

```scss
.my-card {
  background-color: s_getAppColor('card');
  color: s_getAppColor('text');
  border: 1px solid s_getAppColor('border');
}

.page {
  background-color: s_getAppColor('background');
}
```

---

### `s_getThemeColor($color, $themeName)`

Returns a CSS custom property scoped to a specific theme (`dark` or `light`). Used internally by `s_dark()` but useful when you need theme-specific values directly.

```scss
// Signature
s_getThemeColor($color, $themeName) // → CSS var()
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$color` | `string` | App color token name (`'text'`, `'card'`, etc.) |
| `$themeName` | `'dark' \| 'light'` | Which theme variant to target |

```scss
.hero {
  color: s_getThemeColor('text', 'dark');           // var(--s-app-color-text--dark)
  background-color: s_getThemeColor('card', 'dark');
}
```

---

### `s_isDark($color, $threshold: 55)`

Returns `true` if a given **Sass color value** is considered dark (lightness ≤ threshold).

```scss
// Signature
s_isDark($color, $threshold: 55) // → boolean
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$color` | `color` | — | A Sass/CSS color value (e.g. `#fff`, `red`) |
| `$threshold` | `number` | `55` | Lightness percentage threshold (0–100) |

```scss
$bg: #1a1a2e;

.text {
  @if s_isDark($bg) {
    color: white;
  } @else {
    color: black;
  }
}
```

---

### `s_getTextColor($color, $threshold: 55)`

Returns an appropriate text color (light or dark) for readable contrast against a given background color.

```scss
// Signature
s_getTextColor($color, $threshold: 55) // → CSS var()
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$color` | `color` | — | Background Sass color value |
| `$threshold` | `number` | `55` | Lightness threshold (same as `s_isDark`) |

Returns `s_getThemeColor('text', 'dark')` for dark backgrounds, or `s_getThemeColor('text', 'light')` for light backgrounds.

```scss
$brandColor: #1a1a2e;

.banner {
  background-color: $brandColor;
  color: s_getTextColor($brandColor); // auto-contrast text
}
```

---

## Mixins

### `s_breakpointUp($name, $breakpoints?)`

Wraps content in a `min-width` media query for the given breakpoint. Content is output as-is for the `none` (smallest) breakpoint.

```scss
// Signature
@mixin s_breakpointUp($name, $breakpoints: $s_gridBreakpoints)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$name` | `string` | — | Breakpoint name |
| `$breakpoints` | `map` | `$s_gridBreakpoints` | Breakpoints map |

**Breakpoint names:** `none` (0px), `xs` (640px), `sm` (768px), `md` (1024px), `lg` (1280px), `xl` (1536px), `xxl` (1980px)

```scss
.sidebar {
  display: none;

  @include s_breakpointUp('md') {
    display: block;
    width: 260px;
  }
}

.container {
  padding: 8px;

  @include s_breakpointUp('lg') {
    padding: 24px;
  }
}
```

---

### `s_typography($style)`

Applies a complete SUI type scale preset — sets `font-size`, `font-weight`, `line-height`, `letter-spacing`, and `text-transform`.

```scss
// Signature
@mixin s_typography($style)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$style` | `string` | Typography scale key |

**Valid `$style` values:**

| Key | Size | Weight | Notes |
|-----|------|--------|-------|
| `'h1'` | 6rem | 300 | line-height: 6.4rem |
| `'h2'` | 3.75rem | 300 | line-height: 3.75rem |
| `'h3'` | 3rem | 400 | line-height: 3.125rem |
| `'h4'` | 2.125rem | 400 | line-height: 2.5rem |
| `'h5'` | 1.5rem | 400 | line-height: 2rem |
| `'h6'` | 1.25rem | 500 | line-height: 2rem |
| `'subtitle__1'` | 1rem | normal | line-height: 1.75rem |
| `'subtitle__2'` | 0.875rem | 500 | line-height: 1.375rem |
| `'body__1'` | 1rem | 400 | line-height: 1.5rem |
| `'body__2'` | 0.875rem | 400 | line-height: 1.25rem |
| `'button'` | 0.875rem | 500 | uppercase, line-height: 2.25rem |
| `'caption'` | 0.75rem | 400 | line-height: 1.25rem |
| `'overline'` | 0.75rem | 500 | uppercase, line-height: 2rem |

```scss
.page-title {
  @include s_typography('h3');
}

.helper-text {
  @include s_typography('caption');
  color: s_getAppColor('text');
  opacity: 0.6;
}

.label {
  @include s_typography('overline');
}
```

---

### `s_textTruncate()`

Truncates overflowing text with an ellipsis on a single line.

```scss
@mixin s_textTruncate()
// Applies: overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
```

```scss
.card-title {
  @include s_textTruncate();
  max-width: 200px;
}
```

---

### `s_lineClamp($i)`

Clamps text to a maximum number of lines with trailing ellipsis.

```scss
// Signature
@mixin s_lineClamp($i)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `$i` | `number` | Max number of lines to show |

```scss
.description {
  @include s_lineClamp(3); // clamp to 3 lines
}

.preview {
  @include s_lineClamp(2);
}
```

---

### `s_lineClamps($child: null)`

Generates modifier classes `--lineClamp__1` through `--lineClamp__6` on the current selector. Useful for building multi-variant components.

```scss
// Signature
@mixin s_lineClamps($child: null)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$child` | `string \| null` | `null` | If set, applies clamp to a descendant class inside the modifier |

```scss
// Generates: .my-text--lineClamp__1 through .my-text--lineClamp__6
.my-text {
  @include s_lineClamps();
}

// Applies clamp to .my-text--lineClamp__2 > .inner
.my-text {
  @include s_lineClamps('inner');
}
```

---

### `s_elevation($z, $important: false)`

Applies a Material Design box shadow for the given elevation level.

```scss
// Signature
@mixin s_elevation($z, $important: false)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$z` | `0–24` | — | Elevation level (matches the `elevation` component prop) |
| `$important` | `boolean` | `false` | Add `!important` to the rule |

```scss
.floating-panel {
  @include s_elevation(8);
}

.card {
  @include s_elevation(2);
  transition: box-shadow 200ms;

  &:hover {
    @include s_elevation(6);
  }
}
```

---

### `s_elevationTransition($duration?, $easing?)`

Applies a smooth transition for box-shadow changes (pair with `s_elevation` for hover effects).

```scss
// Signature
@mixin s_elevationTransition($duration: 280ms, $easing: cubic-bezier(0.4, 0, 0.2, 1))
```

```scss
.card {
  @include s_elevation(2);
  @include s_elevationTransition();

  &:hover {
    @include s_elevation(8);
  }
}
```

---

### `s_borderRadius($r: null, $important: false)`

Applies a border radius using SUI's radius scale or a raw value.

```scss
// Signature
@mixin s_borderRadius($r: null, $important: false)
```

**Named radius values (`$s_rounded` map):**

| Key | Value |
|-----|-------|
| `0` | `0` |
| `'sm'` | `2px` (half of base) |
| `null` | `4px` (default base) |
| `'lg'` | `8px` |
| `'xl'` | `24px` |
| `'pill'` | `9999px` |
| `'circle'` | `50%` |

```scss
.chip {
  @include s_borderRadius('pill');
}

.card {
  @include s_borderRadius('lg');
}

.avatar {
  @include s_borderRadius('circle');
}

.custom {
  @include s_borderRadius(12px);  // raw value
}
```

---

### `s_tile($important: false)`

Removes border radius (sets to `0`).

```scss
// Signature
@mixin s_tile($important: false)
```

```scss
.banner {
  @include s_tile();
}
```

---

### `s_outlined($color: null, $width?)`

Applies an outlined border style. Resolves color from preset colors, app colors, or raw CSS values.

```scss
// Signature
@mixin s_outlined($color: null, $width: $s_outlined__borderWidth)
// Default $width: 1px
```

```scss
.input {
  @include s_outlined();                      // default border color
  @include s_outlined('primary');             // preset color
  @include s_outlined(#ff5722);              // raw color
}
```

---

### `s_underlined($color: null, $width?, $important: false)`

Applies a bottom border only. Resolves color from the app border token or a custom value.

```scss
// Signature
@mixin s_underlined($color: null, $width: $s_underlined__borderWidth, $important: false)
// Default $width: 3px
```

```scss
.tab {
  @include s_underlined();                    // default border color
  @include s_underlined(s_getPresetColor('primary')); // colored underline
}
```

---

### `s_dark($fillBackground: true, $isChild: false)`

Generates `.s_dark` and `.s_light` modifier rules that apply the appropriate theme colors. Used to make a component respond to theme class toggling.

```scss
// Signature
@mixin s_dark($fillBackground: true, $isChild: false)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$fillBackground` | `boolean` | `true` | Also set `background-color` from the theme card color |
| `$isChild` | `boolean` | `false` | Target `.s_dark`/`.s_light` as a child selector instead of `&.s_dark` |

```scss
// Applies theme colors when element itself has .s_dark or .s_light
.my-card {
  @include s_dark();
}

// Applies when a parent has .s_dark or .s_light
.my-card {
  @include s_dark($isChild: true);
}

// Text color only — no background fill
.my-text {
  @include s_dark($fillBackground: false);
}
```

---

### `s_disabled($isText: false)`

Applies disabled appearance: dimmed text, pointer-events none, 50% opacity, and disabled background.

```scss
// Signature
@mixin s_disabled($isText: false)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `$isText` | `boolean` | `false` | If `true`, skips background-color (text-only disabled style) |

```scss
.my-button {
  &:disabled,
  &[disabled] {
    @include s_disabled();
  }
}

.disabled-label {
  @include s_disabled($isText: true);
}
```

---

### `s_visuallyHidden()`

Hides an element visually while keeping it accessible to screen readers.

```scss
@mixin s_visuallyHidden()
```

```scss
.sr-only {
  @include s_visuallyHidden();
}

label.hidden {
  @include s_visuallyHidden();
}
```

---

## Complete Example

```scss
@use '@khsura/sui/helpers' as *;

.custom-badge {
  // Typography
  @include s_typography('caption');

  // Color
  background-color: s_getPresetColor('error');
  color: s_getPresetColor('error', true);

  // Shape
  @include s_borderRadius('pill');

  // Elevation
  @include s_elevation(2);
  @include s_elevationTransition();

  // Responsive
  @include s_breakpointUp('md') {
    @include s_typography('subtitle__2');
  }

  // Dark/light theme support
  @include s_dark($fillBackground: false);

  &:disabled {
    @include s_disabled($isText: true);
  }
}
```
