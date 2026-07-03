# STable no-data placeholder — design

**Date:** 2026-07-03
**Component:** `components/table/sTable.vue`

## Goal

Show a placeholder when `STable` has no rows to display, with the empty-state text
being **i18n-configurable** (auto-localized) and **slot-configurable** (fully custom markup).

## Behavior

Render a placeholder inside `<tbody>` when the table is empty and not loading.

- **Emptiness signal:** `props.items.length === 0`.
- **Loading guard:** hide the placeholder while `props.loading` is true (avoid flashing
  "No data" during a fetch).
- **Markup:** a single `<tr class="s_table__row s_table__row--noData">` containing
  `<td :colspan="totalItemColumns" class="s_table__noData">`. Keeps table DOM valid and
  spans all columns.

## Text resolution precedence (highest → lowest)

1. `#noData` **slot** — full custom content (markup, icons, actions).
2. `noDataText` **prop** — string override (e.g. bound to a consumer's own `$t(...)`).
3. **i18n** `table.noData` — resolved via the global `$t` registered by `app.use(i18n)`.
4. **Fallback** `'No data'` — used when vue-i18n is not installed.

This mirrors the library's existing i18n convention: components never call `useI18n()`
directly (see `repositories/form.ts`, which takes an injected `t`, and the i18n test note
"global.t is present in both legacy and composition modes"). The global `$t` is read
defensively through `getCurrentInstance()` so an app without vue-i18n degrades to the
hardcoded fallback instead of throwing.

## Changes

1. **`constants/i18n.ts`** — add `noData` to the `table` namespace for all locales:
   - `en: 'No data'`, `ja: 'データがありません'`, `mn: 'Мэдээлэл алга'`.
2. **`definitions/props/propsTable.ts`** — add `noDataText?: string | undefined` to `PropsTable`.
3. **`components/table/sTable.vue`**:
   - Template: no-data `<tr>` before `</tbody>`.
   - Script: `showNoData` + `computedNoDataText` computeds; guarded `translate()` via
     `getCurrentInstance()`.
   - Style: `&__noData` (centered, padded, `s_getAppColor('disabled')`).
4. **`storybook/stories/table.stories.ts`** — `NoData` story rendering three tables
   (i18n default, prop override, slot override) with a `play` test asserting each.

## Testing

Storybook `play` interaction test (locale is `mn` in Storybook):

- default table: `.s_table__noData` present with non-empty text (localized via `$t`).
- prop table: `.s_table__noData` contains `"No items found"`.
- slot table: `.s_table__noData` contains the custom slot marker.

## Non-goals (YAGNI)

- No default icon/illustration — richness comes via the `#noData` slot.
- No separate "no search results vs no data" distinction.
- Pagination footer keeps its current behavior (already hidden when empty via `shouldHidePagination`).
