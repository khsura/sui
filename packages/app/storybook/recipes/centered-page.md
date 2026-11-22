---
title: Centered page
whenToUse: A page with one card centred in the viewport and no app bar or drawer, such as a login, sign-up, error or empty-state page.
components: SCard, SCardTitle, SCardText, SForm, SInput, SButton
---

- Render the page as a **direct child of `SApp`**: App.vue is `<SApp><RouterView /></SApp>` and this component is the routed page (or put the `<div>` straight inside `<SApp>`).
- `SApp` is a flex column at least as tall as the viewport (`min-height: 100dvh`). A direct child with `s_height--fill` grows to fill it (since `@khsura/sui` 1.20.0), so `s_display__flex s_justify__center s_align__center` on that child centres the card vertically and horizontally.
- Do not add a `min-height: 100vh` wrapper: `SApp` already fills the viewport. Before 1.20.0, `s_height--fill` under `SApp` resolved to the content height and the card stuck to the top; use `style="min-height: 100dvh"` on the child there instead.
- Inside an app shell (`SLayout` / `SMain`), this pattern does not apply: `s_height--fill` only grows a **direct** child of `SApp`.
- `:max-width` plus `s_width--fill` makes the card full width on phones and capped on wider screens; `s_pa__4` keeps it off the screen edges.
