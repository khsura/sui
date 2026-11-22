---
title: Dialog, menu, tooltip and snackbar
whenToUse: A button that opens a confirm dialog, a dropdown menu, a hover tooltip or a toast notification.
components: SDialog, SMenu, STooltip, SSnackbar, SButton, SCard, SCardTitle, SCardText, SCardActions, SList, SListItem, SIcon, SRow, SSpacer
---

- `SDialog`, `SMenu` and `SSnackbar` pass `{ on, attrs }` to `#activator`. Bind **both** `v-on="on"` and `v-bind="attrs"` on the activator element; missing either breaks opening, `disabled` or accessibility.
- `STooltip`'s `#activator` passes **no** slot props. Put the element in the slot as is; do not write `#activator="{ on, attrs }"` for a tooltip.
- Always set `location` on `SMenu` and `STooltip`; without it the popup covers its activator.
- `SMenu` stays open on content clicks unless you add `close-on-content-click`.
- `SDialog` has no background of its own; put an `SCard` inside. It has no Escape-key handling.
- `SSnackbar` has no `color` prop. Without `timeout` it stays until `v-model` turns `false`, so give it a close action.
- The snackbar is dark (`#424242`) in both themes. Give a text action button **no** `color`: it takes the snackbar's light text colour and is readable. Since 1.20.0 a preset `color` (`warning`, `primary`, ...) on a snackbar action uses a variant tuned to reach 4.5:1 on the snackbar, but it adds nothing over the default. A CSS colour (`color="#1976d2"`) is used as is, so pick a light one (`color="#ffffff"`). Before 1.20.0 an action without `color` kept the page's dark text colour and `primary`, `secondary`, `success`, `info` and `error` were below 4.5:1, so use `color="warning"` or a light CSS colour there.
- All four teleport into the container `<SApp>` renders; they do not appear without it.
