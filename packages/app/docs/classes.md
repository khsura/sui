# SUI Utility Classes

All utility classes are prefixed with `s_`. Many support **responsive variants** — append a breakpoint infix to apply them only at that breakpoint and above.

Import styles to activate utility classes:

```typescript
import '@khsura/sui/base.css'
// or for SCSS customization:
import '@khsura/sui/style.scss'
```

---

## Breakpoints

| Infix | Min width | Breakpoint |
|-------|-----------|------------|
| *(none)* | 0 | All screens |
| `--xs` | 640px | Extra small and up |
| `--sm` | 768px | Small and up |
| `--md` | 1024px | Medium and up |
| `--lg` | 1280px | Large and up |
| `--xl` | 1536px | Extra large and up |
| `--xxl` | 1980px | Extra extra large and up |

**Responsive class pattern:** `s_{name}--{breakpoint}__{value}`

Example: `s_display--md__flex` → `display: flex` on `md` (1024px) and above.

---

## Spacing

**Base unit:** `4px` (1 step = 4px). Steps 0–10.

| Step | Value |
|------|-------|
| 0 | 0 |
| 1 | 4px |
| 2 | 8px |
| 3 | 12px |
| 4 | 16px |
| 5 | 20px |
| 6 | 24px |
| 7 | 28px |
| 8 | 32px |
| 9 | 36px |
| 10 | 40px |

### Margin classes — `s_m{direction}__{step}`

| Class | CSS property |
|-------|-------------|
| `s_ma__{0–10}` | `margin` |
| `s_mx__{0–10}` | `margin-left` + `margin-right` |
| `s_my__{0–10}` | `margin-top` + `margin-bottom` |
| `s_mt__{0–10}` | `margin-top` |
| `s_mr__{0–10}` | `margin-right` |
| `s_mb__{0–10}` | `margin-bottom` |
| `s_ml__{0–10}` | `margin-left` |
| `s_ma__auto` | `margin: auto` |
| `s_mx__auto` | `margin-left: auto; margin-right: auto` |

### Padding classes — `s_p{direction}__{step}`

| Class | CSS property |
|-------|-------------|
| `s_pa__{0–10}` | `padding` |
| `s_px__{0–10}` | `padding-left` + `padding-right` |
| `s_py__{0–10}` | `padding-top` + `padding-bottom` |
| `s_pt__{0–10}` | `padding-top` |
| `s_pr__{0–10}` | `padding-right` |
| `s_pb__{0–10}` | `padding-bottom` |
| `s_pl__{0–10}` | `padding-left` |

### Examples

```html
<!-- 16px padding all sides -->
<div class="s_pa__4">...</div>

<!-- 8px horizontal margin -->
<div class="s_mx__2">...</div>

<!-- 12px top, 8px bottom -->
<div class="s_mt__3 s_mb__2">...</div>

<!-- Auto horizontal margin (center block) -->
<div class="s_mx__auto" style="width: 200px;">...</div>

<!-- Responsive: 8px padding on mobile, 16px on md+ -->
<div class="s_pa__2 s_pa--md__4">...</div>
```

---

## Display

**Pattern:** `s_display__{value}` or `s_display--{breakpoint}__{value}`

| Class | CSS |
|-------|-----|
| `s_display__none` | `display: none` |
| `s_display__block` | `display: block` |
| `s_display__inline` | `display: inline` |
| `s_display__inlineBlock` | `display: inline-block` |
| `s_display__flex` | `display: flex` |
| `s_display__inlineFlex` | `display: inline-flex` |

### Examples

```html
<!-- Hide on mobile, show as flex on md+ -->
<div class="s_display__none s_display--md__flex">...</div>

<!-- Show on mobile only -->
<div class="s_display__block s_display--md__none">...</div>
```

---

## Flexbox

### Justify Content — `s_justify__{value}`

| Class | CSS |
|-------|-----|
| `s_justify__start` | `justify-content: flex-start` |
| `s_justify__end` | `justify-content: flex-end` |
| `s_justify__center` | `justify-content: center` |
| `s_justify__spaceBetween` | `justify-content: space-between` |
| `s_justify__spaceAround` | `justify-content: space-around` |

### Align Items — `s_align__{value}`

| Class | CSS |
|-------|-----|
| `s_align__start` | `align-items: flex-start` |
| `s_align__end` | `align-items: flex-end` |
| `s_align__center` | `align-items: center` |
| `s_align__baseline` | `align-items: baseline` |
| `s_align__stretch` | `align-items: stretch` |

### Align Content — `s_alignContent__{value}`

| Class | CSS |
|-------|-----|
| `s_alignContent__start` | `align-content: flex-start` |
| `s_alignContent__end` | `align-content: flex-end` |
| `s_alignContent__center` | `align-content: center` |
| `s_alignContent__spaceBetween` | `align-content: space-between` |
| `s_alignContent__spaceAround` | `align-content: space-around` |
| `s_alignContent__stretch` | `align-content: stretch` |

### Align Self — `s_alignSelf__{value}`

| Class | CSS |
|-------|-----|
| `s_alignSelf__auto` | `align-self: auto` |
| `s_alignSelf__start` | `align-self: flex-start` |
| `s_alignSelf__end` | `align-self: flex-end` |
| `s_alignSelf__center` | `align-self: center` |
| `s_alignSelf__baseline` | `align-self: baseline` |
| `s_alignSelf__stretch` | `align-self: stretch` |

### Order — `s_order__{value}`

| Class | CSS |
|-------|-----|
| `s_order__first` | `order: -1` |
| `s_order__{0–12}` | `order: 0–12` |
| `s_order__last` | `order: 13` |

All flexbox utilities support responsive variants.

### Examples

```html
<!-- Centered flex row -->
<div class="s_display__flex s_justify__center s_align__center">...</div>

<!-- Space-between on md+, stacked on mobile -->
<div class="s_display__flex s_justify--md__spaceBetween s_align__center">...</div>
```

---

## Position

**Pattern:** `s_position__{value}` (no `!important`)

| Class | CSS |
|-------|-----|
| `s_position__static` | `position: static` |
| `s_position__relative` | `position: relative` |
| `s_position__absolute` | `position: absolute` |
| `s_position__fixed` | `position: fixed` |
| `s_position__sticky` | `position: sticky` |
| `s_position__unset` | `position: unset` |

---

## Overflow

| Class | CSS |
|-------|-----|
| `s_overflow__auto` | `overflow: auto` |
| `s_overflow__hidden` | `overflow: hidden` |
| `s_overflow__visible` | `overflow: visible` |
| `s_overflowX__auto` | `overflow-x: auto` |
| `s_overflowX__hidden` | `overflow-x: hidden` |
| `s_overflowY__auto` | `overflow-y: auto` |
| `s_overflowY__hidden` | `overflow-y: hidden` |

---

## Typography

> **Naming convention note:**
> - `s_text--{variant}` (double dash) — type scale classes (font size + weight presets)
> - `s_text__{value}` (double underscore) — white-space and text-transform utilities
> - `s_textAlign__`, `s_textDecoration__`, `s_textShadow__`, `s_fontWeight__` — other text utilities

---

### Type Scale — `s_text--{variant}`

| Class | Font Size | Weight | Notes |
|-------|-----------|--------|-------|
| `s_text--h1` | 6rem | 300 | Display heading |
| `s_text--h2` | 3.75rem | 300 | Large heading |
| `s_text--h3` | 3rem | 400 | Heading |
| `s_text--h4` | 2.125rem | 400 | Sub-heading |
| `s_text--h5` | 1.5rem | 400 | Section heading |
| `s_text--h6` | 1.25rem | 500 | Card heading |
| `s_text--subtitle__1` | 1rem | 400 | Subtitle |
| `s_text--subtitle__2` | 0.875rem | 500 | Small subtitle |
| `s_text--body__1` | 1rem | 400 | Body text |
| `s_text--body__2` | 0.875rem | 400 | Secondary body text |
| `s_text--caption` | 0.75rem | 400 | Labels, hints |
| `s_text--overline` | 0.75rem | 500 | Uppercase label (text-transform: uppercase) |
| `s_text--button` | 0.875rem | 500 | Button text (text-transform: uppercase) |

### Text State / Helpers

| Class | Effect |
|-------|--------|
| `s_text--disabled` | Disabled text color (uses theme disabled color) |
| `s_text--truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |

### Text Alignment — `s_textAlign__{value}`

Supports responsive variants: `s_textAlign--{breakpoint}__{value}` (e.g. `s_textAlign--md__center`)

| Class | CSS |
|-------|-----|
| `s_textAlign__left` | `text-align: left` |
| `s_textAlign__right` | `text-align: right` |
| `s_textAlign__center` | `text-align: center` |
| `s_textAlign__justify` | `text-align: justify` |
| `s_textAlign__start` | `text-align: start` |
| `s_textAlign__end` | `text-align: end` |

### Text Decoration — `s_textDecoration__{value}`

| Class | CSS |
|-------|-----|
| `s_textDecoration__lineThrough` | `text-decoration: line-through` |
| `s_textDecoration__none` | `text-decoration: none` |
| `s_textDecoration__overline` | `text-decoration: overline` |
| `s_textDecoration__underline` | `text-decoration: underline` |

### White Space — `s_text__{value}`

| Class | CSS |
|-------|-----|
| `s_text__wrap` | `white-space: normal` |
| `s_text__noWrap` | `white-space: nowrap` |
| `s_text__pre` | `white-space: pre` |
| `s_text__preLine` | `white-space: pre-line` |
| `s_text__preWrap` | `white-space: pre-wrap` |
| `s_text__breakword` | `overflow-wrap: break-word; word-break: break-word` |

### Text Transform — `s_text__{value}`

| Class | CSS |
|-------|-----|
| `s_text__capitalize` | `text-transform: capitalize` |
| `s_text__lowercase` | `text-transform: lowercase` |
| `s_text__uppercase` | `text-transform: uppercase` |

### Font Weight — `s_fontWeight__{value}`

| Class | CSS |
|-------|-----|
| `s_fontWeight__bold` | `font-weight: 700` |

### Text Shadow — `s_textShadow__{0–3}`

| Class | Effect |
|-------|--------|
| `s_textShadow__0` | No shadow |
| `s_textShadow__1` | Subtle 1px shadow |
| `s_textShadow__2` | Medium 8px shadow |
| `s_textShadow__3` | Strong 16px shadow |

### Examples

```html
<!-- Headings -->
<h1 class="s_text--h1">Display</h1>
<h2 class="s_text--h2">Large Heading</h2>
<h3 class="s_text--h3">Heading</h3>
<h4 class="s_text--h4">Sub-heading</h4>
<h5 class="s_text--h5">Section</h5>
<h6 class="s_text--h6">Card Title</h6>

<!-- Body / labels -->
<p class="s_text--body__1">Primary body text</p>
<p class="s_text--body__2">Secondary body text</p>
<span class="s_text--caption">Helper text / label</span>
<span class="s_text--overline">OVERLINE LABEL</span>
<span class="s_text--subtitle__1">Subtitle</span>
<span class="s_text--subtitle__2">Small subtitle</span>

<!-- Helpers -->
<span class="s_text--disabled">Disabled text</span>
<p class="s_text--truncate" style="max-width: 200px;">Very long text that gets cut off...</p>

<!-- Alignment -->
<p class="s_textAlign__center">Centered</p>
<p class="s_textAlign--md__right">Right on md+</p>

<!-- White space -->
<p class="s_text__noWrap">Won't wrap</p>
<pre class="s_text__pre">Preserves whitespace</pre>

<!-- Transform -->
<span class="s_text__uppercase">uppercase text</span>
<span class="s_text__capitalize">capitalize each word</span>

<!-- Decoration -->
<span class="s_textDecoration__underline">underlined</span>
<span class="s_textDecoration__lineThrough">struck through</span>

<!-- Shadow -->
<h2 class="s_text--h2 s_textShadow__2">Shadowed heading</h2>
```

---

## Elevation

**Pattern:** `s_elevation__{0–24}`

Adds a Material Design box shadow. Maps to the same values as the `elevation` component prop.

```html
<div class="s_elevation__2">Card-like shadow</div>
<div class="s_elevation__8">Floating panel</div>
<div class="s_elevation__0">Flat</div>
```

---

## Border / Shape

| Class | Description |
|-------|-------------|
| `s_tile` | Remove border radius (`border-radius: 0`) |
| `s_rounded` | Apply default border radius |
| `s_outlined` | Border outline |
| `s_underlined` | Bottom border only |

---

## State

| Class | Description |
|-------|-------------|
| `s_disabled` | Disabled appearance (opacity + pointer-events: none) |
| `s_text--disabled` | Disabled text color only |
| `s_readonly` | Pointer-events: none, no opacity change |
| `s_linkElement` | Reset anchor styles (`color: inherit`, `text-decoration: none`, cursor: pointer) |

---

## Sizing Helpers

| Class | CSS |
|-------|-----|
| `s_height--fill` | `height: 100%` |
| `s_width--fill` | `width: 100%` |

---

---

## List Style

| Class | Description |
|-------|-------------|
| `s_list--asterisk` | List with `※` as the list marker |

---

## Transitions (Vue named transitions)

Use these as the `name` prop on Vue `<Transition>`:

| Name | Effect |
|------|--------|
| `s_transition--fade` | Opacity fade in/out |
| `s_transition--appear` | Fade + scale appear |
| `s_transition--bounce` | Scale bounce in, scale-out leave |

```vue
<Transition name="s_transition--fade">
  <div v-if="show">Content</div>
</Transition>

<Transition name="s_transition--bounce">
  <SBadge v-if="hasNotifications" ... />
</Transition>
```

---

## Complete Class Quick Reference

```html
<!-- Spacing -->
s_pa__4        s_px__2        s_py__3
s_mt__4        s_mb__2        s_ml__3        s_mr__1
s_mx__auto     s_ma__0

<!-- Display -->
s_display__flex         s_display__none
s_display__block        s_display__inlineBlock
s_display--md__flex     s_display--md__none

<!-- Flex -->
s_justify__center       s_justify__spaceBetween
s_align__center         s_align__start
s_alignSelf__end

<!-- Position -->
s_position__relative    s_position__absolute

<!-- Overflow -->
s_overflow__hidden      s_overflowY__auto

<!-- Typography: type scale (s_text--) -->
s_text--h1    s_text--h2    s_text--h3    s_text--h4    s_text--h5    s_text--h6
s_text--subtitle__1    s_text--subtitle__2
s_text--body__1        s_text--body__2
s_text--caption        s_text--overline       s_text--button
s_text--disabled       s_text--truncate

<!-- Typography: alignment -->
s_textAlign__left      s_textAlign__right     s_textAlign__center
s_textAlign__justify   s_textAlign__start     s_textAlign__end

<!-- Typography: decoration -->
s_textDecoration__underline   s_textDecoration__lineThrough
s_textDecoration__overline    s_textDecoration__none

<!-- Typography: white-space (s_text__) -->
s_text__wrap    s_text__noWrap  s_text__pre    s_text__preLine  s_text__preWrap
s_text__breakword

<!-- Typography: transform (s_text__) -->
s_text__uppercase    s_text__lowercase    s_text__capitalize

<!-- Typography: weight & shadow -->
s_fontWeight__bold
s_textShadow__0    s_textShadow__1    s_textShadow__2    s_textShadow__3

<!-- Elevation -->
s_elevation__2          s_elevation__8

<!-- Shape & State -->
s_rounded               s_tile
s_disabled              s_readonly
s_height--fill          s_width--fill
```
