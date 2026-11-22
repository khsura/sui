# Layout Components

**Import:**
```ts
import {
  SApp, SLayout, SMain,
  SAppBar, SAppBarTitle,
  SNavigationDrawer, SFooter, SBottomNavigation,
  SContainer, SRow, SColumn, SSpacer,
} from '@khsura/sui'
```

Layout parts register with a parent layout. That layout tracks app-bar height, drawer widths, and footer/bottom-nav height, and `SMain` offsets itself by them.

Types: `node_modules/@khsura/sui/@types/definitions/props/props<AppBar|NavigationDrawer|Main|Footer|BottomNavigation|Layout|Container|Row|Column>.d.ts`

---

## How layouts are linked (read this first)

- **`SApp`** is the root. It provides the app state and is itself an *app-level* layout. Wrap the whole app in it (after installing the `createSUI()` plugin). It is at least the viewport height (`100dvh`), and an `SLayout` directly inside it grows with it, so don't add your own `min-height: 100vh` wrapper. A direct child with `s_height--fill` grows the same way, so a page root with `s_display__flex s_justify__center s_align__center s_height--fill` centres its content in the viewport (see the `centered-page` recipe).
- **`SLayout`** creates a layout scope. Children find it by name:
  - SLayout without `name` → children **without `for`** join it as the **app-level** layout (inside `SApp`).
  - SLayout with `name="x"` → **every** child needs `for="x"`. A child without `for` joins the app-level layout instead, so offsets silently break.
- **App-level vs nested.** A layout is app-level when its name equals the plugin name (`'sui'` by default, so: no `name`) or when it has the `app` prop. A named layout (`name="x"` with no `app` prop on it and its children) is a *nested* layout:
  - `SNavigationDrawer` is `position: absolute` inside the layout (not fixed), and `permanent` has **no effect**.
  - `SFooter` ignores `position`. `SBottomNavigation` is not fixed unless you set `position="fixed"`.
  - `SMain` renders `<section>` with `min-height: 100%` instead of `<main>` with `100vh` (minus the app bar and footer heights).
- Without `SApp`, an unnamed `SLayout` and its children do **not** link up.
- Below the `md` breakpoint (or with `forceMobile`), a drawer becomes a mobile overlay. It does not push `SMain`, opens by swiping in from the screen edge, dims what is behind it with a scrim (the page for an app-level drawer, the layout for a nested one), and closes on an outside click or a tap on the scrim.

```vue
<!-- Recommended: app-level layout -->
<SApp>
  <SLayout>
    <SAppBar position="fixed" />
    <SNavigationDrawer v-model="drawer" />
    <SMain><RouterView /></SMain>
  </SLayout>
</SApp>
```

---

## SApp / SLayout

<!-- generated:api:start SLayout -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SLayout props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `app` | `boolean` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `name` | `string` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |

**SLayout slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SLayout events**

None.

<!-- generated:api:end SLayout -->

**SLayout notes**

- `name`: Layout name. Children link with `for` (default: plugin name (`'sui'`))
- `app`: Treat as the app-level layout (default: `true` on SApp, `false` on SLayout)
- `width` / `height` / `min*` / `max*`: SLayout only: dimensions

Slot: `default`. SLayout is a flex column, `position: relative`.

<!-- generated:api:start SApp -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SApp props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `app` | `boolean` | `true` | no | — |
| `name` | `string` | — | no | — |

**SApp slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SApp events**

None.

<!-- generated:api:end SApp -->

---

## SAppBar

Built on SToolbar. It renders a `<header>`.

<!-- generated:api:start SAppBar -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAppBar props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `app` | `boolean` | — | no | — |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `color` | `string` | `"appBar"` | no | — |
| `colorThreshold` | `number` | — | no | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `density` | `ToolbarDensityType \| null` | — | no | `comfortable`, `compact`, `default` |
| `elevateOnScroll` | `boolean` | — | no | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — |
| `extended` | `boolean \| null` | — | no | — |
| `extensionClass` | `string \| Record<string, boolean \| undefined>` | — | no | — |
| `extensionHeight` | `number \| string` | `defaultToolbarExtensionHeight` | no | — |
| `extensionStyle` | `Record<string, string>` | — | no | — |
| `fixedExtension` | `boolean` | — | no | — |
| `for` | `string` | — | no | — |
| `height` | `number \| string \| null` | `defaultToolbarContentHeight` | no | — |
| `hideOnScroll` | `boolean` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `scrollBehavior` | `"auto" \| "smooth"` | — | no | `auto`, `smooth` |
| `scrollTarget` | `string \| HTMLElement` | — | no | — |
| `scrollThreshold` | `number` | `defaultToolbarContentHeight` | no | — |
| `tag` | `HtmlTagName \| null` | `"header"` | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `title` | `string \| null` | — | no | — |
| `underlined` | `boolean \| null` | — | no | — |

**SAppBar slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |
| `extension` | `{}` |

**SAppBar events**

None.

<!-- generated:api:end SAppBar -->

**SAppBar notes**

- `for` / `app`: Layout link (see above)
- `position`: `SMain` adds a top margin only when `fixed` (default: `undefined` (in flow))
- `elevateOnScroll`: Shadow after scrolling (needs `fixed`/`absolute`)
- `hideOnScroll`: Hide on scroll down, show on scroll up
- `scrollTarget` / `scrollThreshold`: Scroll source and threshold (default: window / `64`)
- `height`: Bar height
- `density`: Height preset
- `extended`: Show the extension row (default: auto (`true` when `#extension` is used))
- `extensionHeight`: Extension height
- `fixedExtension`: Keep only the extension visible (fixed)
- `title`: Title text
- `color`: Background
- `elevation`, `outlined`, `underlined`, `borderRadius`, `tag`: Shared props (default: `tag: 'header'`)

**Slots:** `default`, `extension`. SAppBar does **not** forward `prepend`/`append`, so put everything in `default` and use `SSpacer`. The content keeps an inset from the bar edges (the title and any other first/last item 16px, toolbar buttons 10px); no extra padding is needed.

## SAppBarTitle

Props: `text`, `color`, `tag`. Slots: `default` (or `text`).

<!-- generated:api:start SAppBarTitle -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SAppBarTitle props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `text` | `string \| null` | — | no | — |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |

**SAppBarTitle slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |
| `text` | `{}` |

**SAppBarTitle events**

None.

<!-- generated:api:end SAppBarTitle -->

---

## SNavigationDrawer

<!-- generated:api:start SNavigationDrawer -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SNavigationDrawer props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activator` | `string \| ComponentPublicInstance \| HTMLElement \| null` | — | no | — |
| `app` | `boolean` | — | no | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — |
| `expandOnHover` | `boolean` | — | no | — |
| `for` | `string` | — | no | — |
| `forceMobile` | `boolean` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `hideOverlay` | `boolean` | — | no | — |
| `location` | `LocationRaw` | — | no | — |
| `maxWidth` | `number` | — | no | — |
| `minWidth` | `number` | — | no | — |
| `miniVariant` | `boolean` | — | no | — |
| `miniVariantWidth` | `number \| string` | — | no | — |
| `modelValue` | `boolean` | — | no | — |
| `offsetX` | `number \| null` | — | no | — |
| `offsetY` | `number \| null` | — | no | — |
| `permanent` | `boolean` | — | no | — |
| `persistent` | `boolean` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `resizable` | `boolean` | — | no | — |
| `tag` | `"div" \| "nav" \| "section" \| null` | — | no | `div`, `nav`, `section` |
| `touchless` | `boolean` | — | no | — |
| `width` | `number \| string` | — | no | — |

**SNavigationDrawer slots**

| Slot | Slot props |
| --- | --- |
| `append` | `{ class: string; }` |
| `default` | `{ on: { click: () => void; transitionend: (e: Event) => void; mouseenter: () => void; mouseleave: () => void; }; }` |
| `prepend` | `{ class: string; }` |

**SNavigationDrawer events**

| Event | Payload |
| --- | --- |
| `transitionend` | `[value: Event]` |
| `update:miniVariant` | `[value: boolean]` |
| `update:modelValue` | `[value: boolean \| undefined]` |
| `update:width` | `[value: number]` |

<!-- generated:api:end SNavigationDrawer -->

**SNavigationDrawer notes**

- `for` / `app`: Layout link
- `v-model`: Open state. At mount and on every resize it opens itself on desktop and closes itself on mobile, whatever the starting value (unless `persistent`)
- `location`: Side. `bottom` is always mobile-style (default: `'left'`)
- `permanent`: Always open on desktop (**app-level layout only**)
- `persistent`: Desktop: ignore outside clicks and resizes
- `miniVariant`: Collapsed width (`v-model:mini-variant`)
- `miniVariantWidth`: Mini width (set it, e.g. `56`) (default: `256` when not numeric)
- `expandOnHover`: Mini until hovered
- `forceMobile`: Use mobile behaviour on desktop
- `touchless`: Disable swipe and hover handlers
- `activator`: Only **excluded from click-outside**. It does **not** toggle the drawer
- `width`: Width. Use `v-model:width` with `resizable` (default: `256`)
- `resizable`: Drag handle on the inner edge (desktop, not mini). Arrow keys resize by 16px
- `minWidth` / `maxWidth`: Resize limits (default: `200` / `720`)
- `height`: Height. App-level = the drawer has `app`, or its `for` is the app's name (default: `100vh` when app-level, else `100%`)
- `position`, `elevation`: Shared props
- `tag`: Root element (default: `nav` when app-level, else `aside`)
- `hideOverlay`: Don't dim the page (or the nested layout) behind an open mobile drawer

**Slots:** `prepend`, `default` (scope `{ on }`: `click`, `transitionend`, `mouseenter`, `mouseleave` handlers), `append`.
**Events:** `update:modelValue`, `update:width` (resize end), `update:miniVariant`, `transitionend`.

A left and a right drawer can share one layout. Each one offsets its own side of `SMain`:

```vue
<SNavigationDrawer v-model="isNavOpen" />
<SNavigationDrawer v-model="isChatOpen" v-model:width="chatWidth" location="right"
  persistent resizable :min-width="320" :max-width="640" />
```

---

## SMain

Props: `for`, `app`, `tag` (default `main` at app level, `section` otherwise). Slot: `default`. Margins follow the drawers (left/right), a `fixed` app bar (top), and the bottom navigation (app level) or footer (nested).

<!-- generated:api:start SMain -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SMain props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `app` | `boolean` | — | no | — |
| `for` | `string` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |

**SMain slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SMain events**

None.

<!-- generated:api:end SMain -->

## SFooter

<!-- generated:api:start SFooter -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SFooter props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `app` | `boolean` | — | no | — |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `elevation` | `"" \| "1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| "13" \| "14" \| "15" \| "16" \| "17" \| "18" \| "19" \| "20" \| "21" \| "22" \| "23" \| "24" \| 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12 \| 13 \| 14 \| 15 \| 16 \| 17 \| 18 \| 19 \| 20 \| 21 \| 22 \| 23 \| 24 \| null` | — | no | — |
| `for` | `string` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `inset` | `boolean` | `false` | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `padless` | `boolean` | `false` | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `tag` | `"div" \| "footer" \| null` | `"footer"` | no | `div`, `footer` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `width` | `number \| string \| null` | — | no | — |

**SFooter slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SFooter events**

None.

<!-- generated:api:end SFooter -->

**SFooter notes**

- `for` / `app`: Layout link
- `position`: Applied only in an app-level layout
- `inset` / `padless`: Inset / no padding
- `color`, `elevation`, `height`, `width`, `min*`/`max*`: Shared props
- `tag`: Root element

Slot: `default`. Its width tracks the drawers.

## SBottomNavigation

<!-- generated:api:start SBottomNavigation -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SBottomNavigation props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `activeClass` | `string` | — | no | — |
| `app` | `boolean` | — | no | — |
| `borderRadius` | `` number \| "rounded" \| "tile" \| `${number}%` \| `${number}em` \| `${number}px` \| `${number}rem` \| `${number}vh` \| `${number}vw` \| null `` | — | no | — |
| `bordered` | `boolean` | — | no | — |
| `continuous` | `boolean` | — | no | — |
| `dense` | `boolean` | — | no | — |
| `for` | `string` | — | no | — |
| `grow` | `boolean` | — | no | — |
| `height` | `number \| string \| null` | — | no | — |
| `hideOnScroll` | `boolean` | — | no | — |
| `horizontal` | `boolean` | — | no | — |
| `inputValue` | `boolean` | — | no | — |
| `mandatory` | `boolean` | — | no | — |
| `maxHeight` | `number \| string \| null` | — | no | — |
| `maxWidth` | `number \| string \| null` | — | no | — |
| `minHeight` | `number \| string \| null` | — | no | — |
| `minWidth` | `number \| string \| null` | — | no | — |
| `modelValue` | `GroupItemValue` | — | no | — |
| `outlined` | `boolean \| null` | — | no | — |
| `position` | `Position` | — | no | `absolute`, `fixed`, `relative`, `static`, `sticky` |
| `scrollBehavior` | `"auto" \| "smooth"` | — | no | `auto`, `smooth` |
| `scrollTarget` | `string \| HTMLElement` | — | no | — |
| `scrollThreshold` | `number` | — | no | — |
| `shift` | `boolean` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `underlined` | `boolean \| null` | — | no | — |
| `width` | `number \| string \| null` | — | no | — |

**SBottomNavigation slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SBottomNavigation events**

| Event | Payload |
| --- | --- |
| `update:modelValue` | `[value: GroupItemValue \| undefined]` |

<!-- generated:api:end SBottomNavigation -->

**SBottomNavigation notes**

- `v-model`: `value` of the selected child `SButton`
- `height`: **Set it.** Without it the bar collapses and SMain gets no bottom offset
- `activeClass`: Class added to the selected button. **There is no active styling without it**
- `mandatory`: Always keep one selected
- `grow` / `shift` / `horizontal` / `dense` / `bordered`: Layout variants
- `hideOnScroll`: Hide on scroll. It also overwrites `v-model` with a boolean, so avoid combining it with selection
- `position`: Set `fixed` in a nested layout (default: fixed at app level)
- `for` / `app`, `tag`, `width`, border props: Shared props

Slot: `default`. Use `SButton`s with a `value`.

```vue
<SBottomNavigation v-model="tab" :height="56" active-class="s_textColor__primary" grow>
  <SButton value="home"><SIcon icon="mdi-home" /><span>Home</span></SButton>
  <SButton value="search"><SIcon icon="mdi-magnify" /><span>Search</span></SButton>
</SBottomNavigation>
```

---

## Grid: SContainer / SRow / SColumn / SSpacer

The column component is **`SColumn`**. There is no `SCol`.

**SContainer:** `fluid`, `narrow`, `wide`, `padless`, `fill` (color applies to the outer box), `color`, `tag`. Slot `default`.

**SRow:**

<!-- generated:api:start SRow -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SRow props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `align` | `GridAlignPropertyType \| null` | — | no | `baseline`, `center`, `end`, `start`, `stretch` |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `dense` | `boolean \| null` | — | no | — |
| `fillHeight` | `boolean \| null` | — | no | — |
| `gap` | `number \| string \| null` | — | no | — |
| `justify` | `GridJustifyPropertyType \| null` | — | no | `center`, `end`, `spaceAround`, `spaceBetween`, `start` |
| `noGutters` | `boolean \| null` | — | no | — |
| `noOuterGutters` | `boolean \| null` | — | no | — |

**SRow slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SRow events**

None.

<!-- generated:api:end SRow -->

**SRow notes**

- `align`: Cross-axis
- `justify`: Main-axis (**camelCase**)
- `noGutters` / `noOuterGutters` / `dense` / `fillHeight`: Gutters / height
- `gap`: Custom gap (replaces gutters)
- `contentClass` / `contentStyle`: Inner wrapper class/style

**SColumn:** `cols`, `sm`, `md`, `lg` (`1`–`12 \| 'auto' \| 'grow'`), `order` (number), `alignSelf`, `contentClass`/`contentStyle`. There is no `xl`.

**SSpacer:** `flex-grow: 1`, with no props.

```vue
<SContainer>
  <SRow justify="spaceBetween" align="center">
    <SColumn :cols="12" :md="6">Left</SColumn>
    <SColumn :cols="12" :md="6">Right</SColumn>
  </SRow>
</SContainer>
```

<!-- generated:api:start SContainer -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SContainer props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `color` | `string` | — | no | — |
| `colorThreshold` | `number` | — | no | — |
| `fill` | `boolean` | — | no | — |
| `fluid` | `boolean` | — | no | — |
| `narrow` | `boolean` | — | no | — |
| `padless` | `boolean` | — | no | — |
| `tag` | `HtmlTagName \| null` | — | no | `a`, `abbr`, `acronym`, `address`, `applet`, `area`, `article`, `aside`, `audio`, `b`, `base`, `basefont`, `bdi`, `bdo`, `big`, `blockquote`, `body`, `br`, `button`, `canvas`, `caption`, `center`, `cite`, `code`, `col`, `colgroup`, `data`, `datalist`, `dd`, `del`, `details`, `dfn`, `dialog`, `dir`, `div`, `dl`, `dt`, `em`, `embed`, `fieldset`, `figcaption`, `figure`, `font`, `footer`, `form`, `frame`, `frameset`, `h1`, `h1> to <h6`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `i`, `iframe`, `img`, `input`, `ins`, `kbd`, `label`, `legend`, `li`, `link`, `main`, `map`, `mark`, `meta`, `meter`, `nav`, `noframes`, `noscript`, `object`, `ol`, `optgroup`, `option`, `output`, `p`, `param`, `picture`, `pre`, `progress`, `q`, `rp`, `rt`, `ruby`, `s`, `samp`, `script`, `section`, `select`, `small`, `source`, `span`, `strike`, `strong`, `style`, `sub`, `summary`, `sup`, `svg`, `table`, `tbody`, `td`, `template`, `textarea`, `tfoot`, `th`, `thead`, `time`, `title`, `tr`, `track`, `tt`, `u`, `ul`, `var`, `video`, `wbr` |
| `theme` | `AppThemeType` | — | no | `dark`, `light` |
| `wide` | `boolean` | — | no | — |

**SContainer slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SContainer events**

None.

<!-- generated:api:end SContainer -->

<!-- generated:api:start SColumn -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SColumn props**

| Prop | Type | Default | Required | Values |
| --- | --- | --- | --- | --- |
| `alignSelf` | `"auto" \| "baseline" \| "center" \| "end" \| "first baseline" \| "flex-end" \| "flex-start" \| "inherit" \| "initial" \| "last baseline" \| "normal" \| "safe center" \| "self-end" \| "self-start" \| "start" \| "stretch" \| "unsafe center" \| null` | — | no | `auto`, `baseline`, `center`, `end`, `first baseline`, `flex-end`, `flex-start`, `inherit`, `initial`, `last baseline`, `normal`, `safe center`, `self-end`, `self-start`, `start`, `stretch`, `unsafe center` |
| `cols` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `contentClass` | `string \| Record<string, boolean> \| string[]` | — | no | — |
| `contentStyle` | `StyleValue` | — | no | — |
| `lg` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `md` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |
| `order` | `number \| null` | — | no | — |
| `sm` | `"1" \| "2" \| "3" \| "4" \| "5" \| "6" \| "7" \| "8" \| "9" \| "10" \| "11" \| "12" \| ColumnNumber \| null` | — | no | — |

**SColumn slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SColumn events**

None.

<!-- generated:api:end SColumn -->

<!-- generated:api:start SSpacer -->
<!-- Generated from sui-api.json by `yarn sync:skills` (packages/app). Do not edit by hand. -->

**SSpacer props**

None.

**SSpacer slots**

| Slot | Slot props |
| --- | --- |
| `default` | `{}` |

**SSpacer events**

None.

<!-- generated:api:end SSpacer -->

---

## Full example

```vue
<SApp>
  <SLayout>
    <SAppBar position="fixed" elevate-on-scroll>
      <SButton variant="icon" @click="drawer = !drawer"><SIcon icon="mdi-menu" /></SButton>
      <SAppBarTitle>My App</SAppBarTitle>
      <SSpacer />
      <SButton variant="icon"><SIcon icon="mdi-account" /></SButton>
    </SAppBar>
    <SNavigationDrawer v-model="drawer">
      <SList dense>
        <SListItem :to="{ name: 'home' }">
          <SListItemContent><SListItemTitle>Home</SListItemTitle></SListItemContent>
        </SListItem>
      </SList>
    </SNavigationDrawer>
    <SMain><SContainer><RouterView /></SContainer></SMain>
  </SLayout>
</SApp>
```

## Gotchas

| ❌ | ✅ |
|----|----|
| `<SLayout name="app">` + `<SMain>` (no `for`) | Add `for="app"` to every child, or drop `name` |
| `<SNavigationDrawer permanent>` in a named layout | `permanent` works only at app level (no `name`, or `app` on the layout and its children) |
| `<SNavigationDrawer activator="#btn">` with no `v-model` | Bind `v-model` and toggle it from the button |
| `<SAppBar><template #prepend>…` | Not forwarded. Put content in `default` |
| `<SRow justify="space-between">` | `justify="spaceBetween"` |
| `<SCol>` | `<SColumn>` |
| `<SBottomNavigation v-model="tab">` with no `height`/`active-class` | Set `:height` and `active-class` |
| `<SAppBar elevate-on-scroll>` with no position | Add `position="fixed"` |
| `padding-top: env(safe-area-inset-top)` on a fixed `SAppBar` / `SBottomNavigation` / mobile drawer, or `padding-left: env(safe-area-inset-left)` on a `permanent` drawer / `SMain` | They pad by the iPhone safe areas themselves; only add `viewport-fit=cover` to the viewport meta (getting-started skill). Your own `env()` padding doubles the inset |
