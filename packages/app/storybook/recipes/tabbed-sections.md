---
title: Tabbed sections
whenToUse: A settings, detail or help page split into a few sections the user switches between with tabs, which must still work on a 375px phone.
components: SCard, SCardText, STabs, STab
---

- Use the plain setup: `<STabs v-model="activeTab">` with one `<STab :tab="value">` per section, rendered with `v-for` from an array. Don't add `shrink`, `cols`, `SSlideGroup` or `overflow-x: auto`: `STabs` already keeps the tabs on one row.
- When the tabs do not fit (a phone, a narrow card), the row scrolls sideways. The end that hides tabs fades out, so it is visibly scrollable (swipe it) instead of looking clipped, and the selected tab is always scrolled fully into view. When every tab fits, there is no fade. Set `wrap` to flow the tabs onto several rows instead.
- `STabs` renders only the tab buttons. Render each panel yourself with `v-show="activeTab === value"` (keeps panel state when switching) and give it `role="tabpanel"`.
- Keep labels short (one or two words). Long labels still work, they just mean more scrolling on a phone; never truncate them with CSS.
- Keyboard: the selected tab is the single Tab stop; the arrow keys, Home and End move between tabs.
