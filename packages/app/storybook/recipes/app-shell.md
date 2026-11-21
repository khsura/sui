---
title: App shell
whenToUse: A page frame with a top app bar, a side navigation drawer (beside the content on desktop, sliding over it on mobile), the main content area and a footer.
components: SLayout, SAppBar, SAppBarTitle, SNavigationDrawer, SMain, SFooter, SList, SListItem, SButton, SIcon, SSpacer, SContainer
---

- Wrap the app in `<SApp>` once (App.vue) after `app.use(createSUI())`; this shell goes inside it.
- `SLayout name="shell"` is a named layout, so **every** child needs `for="shell"`. A child without `for` joins the app-level layout and the offsets silently break.
- Give the named layout a height (`height="100vh"` for a full page). Its drawer is `position: absolute` inside it.
- Below the `md` breakpoint the drawer is temporary: it slides over the content, opens on an edge swipe and closes on an outside click. From `md` up it pushes `SMain`.
- `activator` on the drawer only excludes the toggle button from outside-click handling; toggle `v-model` yourself.
- `SAppBar` needs `position="fixed"` for `SMain` to get a top offset. It has no `prepend`/`append` slots; use `SSpacer` to push items apart.
- Icon-only buttons need an `aria-label`.
