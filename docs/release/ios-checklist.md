# Real-iOS release checklist

Playwright's WebKit is not iOS Safari. Focus zoom, the on-screen keyboard, the visual viewport, safe-area insets and
rubber-band scrolling only behave for real on an iPhone, and several shipped bugs (the DatePicker input height and
width, the page that stopped scrolling after the mobile drawer met a resize) showed up only there.

Run this checklist **before merging every minor release PR** (the release-please PR that bumps `1.x.0`). It takes
about 15 minutes. Patch releases need it only when they touch a component listed below.

## Before you start

- **Device:** a real iPhone with the current iOS and Safari. A notched / Dynamic Island model is best, because it has
  safe-area insets. BrowserStack Live (real iOS device) is acceptable when no iPhone is at hand.
- **Target (primary): the Netlify deploy preview of the PR that is being released.** Netlify builds the Storybook for
  every PR at `https://deploy-preview-<PR number>--sui-surakh-com.netlify.app/` (for example PR #163 →
  <https://deploy-preview-163--sui-surakh-com.netlify.app/>). To find it, open the PR's **Checks** list (or the
  checks box at the bottom of the conversation), find `netlify/sui-surakh-com/deploy-preview` and click **Details**.
  For a milestone release, use the preview of the milestone PR into `main`. It has every story in this list.
- **Released docs:** <https://sui.surakh.com/> only shows what is already on `main`.
- **Fallback (no preview):** run Storybook from the branch and open it from the phone on the same network:
  `yarn workspace @khsura/sui storybook:dev --host 0.0.0.0`, then `http://<your-mac-ip>:6006/`.
- **Open stories full-page.** The links below use `iframe.html?id=<story-id>`, which shows one story without the
  Storybook sidebar, so the page behaves like a real app. They point at `https://sui.surakh.com/`: replace that origin
  with the deploy preview origin (keep the `/iframe.html?id=…` part).
- Stories under **UI Components/Form/Stress** and **UI Components/Layout/Stress** are not on the released docs until
  the M2 hardening work ships, so test them on the deploy preview.
- Test in **portrait** unless a step says otherwise. Use **Settings > Safari > Clear History and Website Data** first if
  a previous run left the page zoomed.
- Copy this list into the release PR as a comment and tick it there. Any unchecked item blocks the release: open a
  bug with the iOS version, device model, story link and a screen recording.

## 1. Form inputs (about 4 min)

- [ ] **No focus zoom.**
  Story: [Form/Input — Inputs](https://sui.surakh.com/iframe.html?id=ui-components-form-input--inputs),
  [Form/Textarea](https://sui.surakh.com/iframe.html?id=ui-components-form-textarea--textarea),
  [Form/Stress — Text field sizes](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--text-field-sizes).
  Steps: tap into each field, including the smallest size.
  Expected: Safari does **not** zoom the page on focus (input text is at least 16px). After you tap outside, the page
  is at its normal scale.

- [ ] **Keyboard does not cover the focused field.**
  Story: [Form/Stress — Form layout](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--form-layout).
  Steps: scroll to the last field near the bottom and tap it; then use the keyboard's up/down arrows to move between
  fields.
  Expected: the focused field and its label scroll into view above the keyboard. Nothing fixed (app bar, footer) jumps
  over the field. Closing the keyboard leaves no blank gap at the bottom.

- [ ] **Field size and alignment.**
  Story: [Form/Stress — Text field states](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--text-field-states).
  Steps: look at every state (empty, filled, error, disabled) without focusing.
  Expected: all fields have the same height, stay inside the screen width, and labels and hints do not overlap.

## 2. Overlays near the bottom of the screen (about 4 min)

- [ ] **Select near the bottom.**
  Story: [Form/Stress — Select near bottom](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--select-near-bottom).
  Steps: tap the select, pick an option, open it again.
  Expected: the menu opens fully on screen (above the field if there is no room below), is scrollable when long, and
  the native keyboard does not appear.

- [ ] **Autocomplete near the bottom with the keyboard open.**
  Story: [Form/Stress — Autocomplete near bottom](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--autocomplete-near-bottom).
  Steps: tap the field, type two letters, pick a suggestion.
  Expected: the suggestion list stays visible between the field and the keyboard, follows the field when the
  viewport shrinks, and tapping a suggestion selects it on the first tap.

- [ ] **DatePicker near the bottom and in a form card.**
  Story: [Form/Stress — DatePicker near bottom](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--date-picker-near-bottom),
  [Form/Stress — DatePicker in form card](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--date-picker-in-form-card).
  Steps: tap the date input, change month, pick a day.
  Expected: the input has the same height and width as the other fields (the regression this checklist was written
  for), the calendar opens fully on screen, and the picked date appears in the input.

- [ ] **Overlays at the screen edges.**
  Story: [Form/Stress — Select at edges](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--select-at-edges),
  [Autocomplete at edges](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--autocomplete-at-edges),
  [DatePicker at edges](https://sui.surakh.com/iframe.html?id=ui-components-form-stress--date-picker-at-edges).
  Steps: open each overlay on the left and right fields.
  Expected: no menu is clipped by the screen edge and the page does not scroll sideways.

## 3. Mobile navigation drawer (about 3 min)

- [ ] **Open, scrim and close.**
  Story: [Layout/Stress — App shell](https://sui.surakh.com/iframe.html?id=ui-components-layout-stress--app-shell).
  Steps: tap the menu button; tap the dimmed area; open again and swipe the drawer toward the edge.
  Expected: the drawer slides over the page with a scrim; a scrim tap and a swipe both close it.

- [ ] **Scroll lock while open.**
  Same story. Steps: open the drawer and try to scroll the page behind it, including a rubber-band pull at the top.
  Expected: the page behind does not scroll; the drawer's own list scrolls if it is long.

- [ ] **Scroll still works after rotate (recent bug).**
  Same story. Steps: open the drawer, rotate the phone to landscape and back to portrait, close the drawer, then
  scroll the page. Repeat with the drawer closed before rotating.
  Expected: the page scrolls normally every time. `<html>` is never left locked (a page you cannot scroll is a fail).

- [ ] **Persistent mobile drawer.**
  Story: [Layout/Stress — Mobile drawer open](https://sui.surakh.com/iframe.html?id=ui-components-layout-stress--mobile-drawer-open).
  Expected: the page behind is dimmed, the drawer fits the screen height, and nothing sits under the status bar or home
  indicator.

## 4. Dialogs (about 2 min)

- [ ] **Fullscreen dialog.**
  Story: [Dialog — fullscreen](https://sui.surakh.com/iframe.html?id=ui-components-dialog--dialog&args=fullscreen:!true).
  Steps: open the dialog, scroll its content, close it.
  Expected: it covers the whole screen including behind the status bar background, its title and actions stay clear
  of the notch and home indicator, and the page behind does not scroll.

- [ ] **Regular dialog gutters and bottom sheet.**
  Story: [Dialog](https://sui.surakh.com/iframe.html?id=ui-components-dialog--dialog),
  [Dialog — bottom sheet](https://sui.surakh.com/iframe.html?id=ui-components-dialog--bottom-sheet),
  [Dialog with menu](https://sui.surakh.com/iframe.html?id=ui-components-dialog--dialog-with-menu).
  Expected: the dialog keeps a visible gutter on both sides; the bottom sheet sits above the home indicator; a menu
  inside the dialog opens on top of it.

## 5. Bottom navigation, tabs and snackbar (about 2 min)

- [ ] **Bottom navigation safe area.**
  Story: [Layout/Stress — Short page with bottom navigation](https://sui.surakh.com/iframe.html?id=ui-components-layout-stress--short-page-bottom-navigation),
  [Layout](https://sui.surakh.com/iframe.html?id=ui-components-layout--layout).
  Steps: switch tabs; scroll so Safari's toolbar collapses and expands.
  Expected: the bar stays pinned to the bottom, its icons sit above the home indicator, and no content is hidden
  behind it.

- [ ] **Tabs scroll horizontally.**
  Story: [Tabs](https://sui.surakh.com/iframe.html?id=ui-components-tabs--tab).
  Steps: swipe the tab row sideways; tap the last tab.
  Expected: the row scrolls by swipe without scrolling the page sideways, and the selected tab scrolls into view.

- [ ] **Snackbar position.**
  Story: [Snackbar](https://sui.surakh.com/iframe.html?id=ui-components-snackbar--snackbar),
  [Snackbar — top](https://sui.surakh.com/iframe.html?id=ui-components-snackbar--snackbar&args=location:top),
  [Snackbar with action](https://sui.surakh.com/iframe.html?id=ui-components-snackbar--snackbar-with-action).
  Expected: the bottom snackbar sits above the home indicator, the top one below the status bar, and the action button
  is tappable.

## 6. Safe areas: notch and home indicator (about 2 min)

The Storybook iframe opts in with `viewport-fit=cover`, as an app does, so these stories show the real insets. Use a
notched / Dynamic Island iPhone; on a model without a notch the top inset is the status bar only.

- [ ] **App shell in portrait.**
  Story: [Layout/Safe Area — Safe area shell](https://sui.surakh.com/iframe.html?id=ui-components-layout-safe-area--safe-area-shell).
  The story sets simulated insets (47px top, 34px bottom), so first check that it looks like the desktop capture,
  then compare the real-device stories below, which use the device's own insets.
  Expected: the layout matches the simulated story; nothing renders under the notch or the home indicator.

- [ ] **Fixed app bar and bottom navigation.**
  Story: [Layout/Stress — Short page with bottom navigation](https://sui.surakh.com/iframe.html?id=ui-components-layout-stress--short-page-bottom-navigation).
  Expected: the app bar's background reaches the top edge behind the status bar while its title and buttons sit below
  the notch; the bottom navigation's background reaches the bottom edge while its icons sit above the home indicator;
  the first line of content is not hidden under the app bar.

- [ ] **Mobile drawer.**
  Story: [Layout/Stress — Mobile drawer open](https://sui.surakh.com/iframe.html?id=ui-components-layout-stress--mobile-drawer-open).
  Expected: the first drawer item is below the notch and the last one, scrolled to the end, is above the home indicator.

- [ ] **Fullscreen dialog.**
  Story: [Layout/Safe Area — Fullscreen dialog](https://sui.surakh.com/iframe.html?id=ui-components-layout-safe-area--safe-area-fullscreen-dialog)
  and [Dialog — fullscreen](https://sui.surakh.com/iframe.html?id=ui-components-dialog--dialog&args=fullscreen:!true).
  Expected: the card colour fills the whole screen, the title is below the notch and the actions above the home
  indicator.

- [ ] **Snackbar.**
  Story: [Snackbar](https://sui.surakh.com/iframe.html?id=ui-components-snackbar--snackbar) and
  [Snackbar — top](https://sui.surakh.com/iframe.html?id=ui-components-snackbar--snackbar&args=location:top).
  Expected: the bottom snackbar clears the home indicator; the top one clears the notch.

- [ ] **Landscape.**
  Rotate the phone to landscape on the short-page and mobile-drawer stories above.
  Expected: the app bar's buttons and the open drawer's items stay clear of the notch side; nothing is cut off.

- [ ] **Permanent drawer in landscape.**
  Story: [Layout/Safe Area — Landscape permanent drawers](https://sui.surakh.com/iframe.html?id=ui-components-layout-safe-area--safe-area-landscape-permanent-drawers).
  The story sets simulated side insets (47px left and right), so first check it against the desktop capture. Then
  rotate the phone to landscape on it, with the notch / Dynamic Island on the left and then on the right.
  Expected: the drawer on the notch side keeps its icons and labels clear of the notch, and the page content beside
  it is not hidden under the drawer.

## Record the run

Paste this into the release PR when you are done:

```text
iOS checklist: <pass | fail> — iPhone <model>, iOS <version>, Safari — <storybook URL> — <date>
Failures: <none | links to bug issues>
```
