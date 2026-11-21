---
title: Responsive grid
whenToUse: Cards or panels that stack on phones and sit side by side on wider screens.
components: SContainer, SRow, SColumn, SCard, SCardTitle, SCardText, SImage, SButton
---

- The 12-column grid is `SContainer` > `SRow` > `SColumn`. The column component is `SColumn`; there is no `SCol` and no `xl` prop.
- `cols` applies at every width; `sm`, `md` and `lg` override it from that breakpoint up. `:cols="12" :md="6"` = full width on phones, half from `md`.
- `cols` also takes `'auto'` (fit content) and `'grow'`.
- `SRow justify` values are camelCase: `spaceBetween`, `spaceAround`. `align` is the cross axis.
- Use `gap`, `dense` or `no-gutters` on `SRow` to change spacing instead of overriding margins.
- Equal-height cards: columns in one `SRow` line already share a height, so give each `SCard` `height="100%"`. Do not make the card `display: flex; flex-direction: column` to stretch it: `SImage` is `height: 100%` by default and shrinks in a flex column, so the images end up with different heights. Give `SImage` `:aspect-ratio` and `height="auto"` so it keeps its ratio.
- Two or more `block` buttons in one flex row overflow: `block` is `width: 100%` and does not shrink. Put each in its own `SColumn` instead.
- `SContainer` adds side padding only. Add top and bottom spacing yourself (`class="s_py__4"`) so the first card is not flush with the top of the viewport.
