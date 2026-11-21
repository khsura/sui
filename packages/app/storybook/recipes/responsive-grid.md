---
title: Responsive grid
whenToUse: Cards or panels that stack on phones and sit side by side on wider screens.
components: SContainer, SRow, SColumn, SCard, SButton
---

- The 12-column grid is `SContainer` > `SRow` > `SColumn`. The column component is `SColumn`; there is no `SCol` and no `xl` prop.
- `cols` applies at every width; `sm`, `md` and `lg` override it from that breakpoint up. `:cols="12" :md="6"` = full width on phones, half from `md`.
- `cols` also takes `'auto'` (fit content) and `'grow'`.
- `SRow justify` values are camelCase: `spaceBetween`, `spaceAround`. `align` is the cross axis.
- Use `gap`, `dense` or `no-gutters` on `SRow` to change spacing instead of overriding margins.
