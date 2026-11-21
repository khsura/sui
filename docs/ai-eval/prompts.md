# AI eval prompts (fixed)

These 10 prompts are **frozen**. Every eval run (baseline, with MCP, after hardening) passes them
to the generating agent **verbatim** — do not edit wording, order, or numbering. If a prompt must
change, add a new prompt set (`prompts-v2.md`) and start a new baseline.

Each prompt is the full feature request the generating agent receives (see `README.md` for the
wrapper instruction around it). The page id (`NN-name`) is used for file names everywhere.

## 01-settings

Build an account settings page. It should have a form with display name (required), email
(required, must be a valid email), a bio textarea limited to 200 characters, a language select
(English, Japanese, Mongolian) and a switch to enable email notifications. Validate the form on
save and show the errors inline. Add a "Delete account" button that opens a confirmation dialog
with Cancel and Delete actions; Delete should be styled as a destructive action.

## 02-dashboard-shell

Build an admin dashboard shell: a top app bar with the product name, a menu (hamburger) button
that toggles a left navigation drawer, and a user avatar on the right. The drawer lists five
navigation items with icons (Dashboard, Orders, Customers, Reports, Settings). The main area shows
a page title and a table of recent orders with columns order #, customer, date, status and total,
using about 8 rows of mock data. It must work on mobile (drawer hidden by default) and desktop.

## 03-mobile-list

Build a mobile-first contacts list page. Each row shows an avatar, the contact's name, and their
phone number underneath, and has a three-dots button on the right that opens a menu with Call,
Edit and Delete actions. Add a search input above the list that filters contacts by name. Use
about 10 mock contacts. It should look good on a 375px wide phone screen.

## 04-date-range-filter

Build a filter bar for a transactions report. It needs a "from" date picker and a "to" date
picker, a status select (All, Paid, Pending, Failed), and Apply and Reset buttons. On desktop the
controls sit on one row; on mobile they stack vertically. Below the bar show a small summary text
of the currently applied filters. The "to" date must not be before the "from" date — show an
error if it is.

## 05-card-grid

Build a product catalog page showing a responsive grid of product cards (1 column on mobile,
2 on tablet, 4 on desktop). Each card has an image, product name, price, a row of category chips,
and a badge on the image corner for "New" or "Sale" items. Each card has an "Add to cart" button.
Use about 8 mock products. Above the grid, show a cart button with a badge that displays how many
items are in the cart.

## 06-login

Build a login page with the login card centered both horizontally and vertically on the screen.
The card has the app name, an email field, a password field with a show/hide password toggle, a
"Remember me" checkbox, a "Forgot password?" link and a full-width Sign in button. Validate that
both fields are filled in and that the email is valid before submitting; show a loading state on
the button for 1.5 seconds when submitting.

## 07-stepper-wizard

Build a three-step onboarding wizard using a stepper: step 1 "Profile" (full name and company),
step 2 "Plan" (choose one of three plans with radio buttons, each showing a price), step 3
"Confirm" (a summary of the entered data). Back and Next buttons navigate between steps; Next is
disabled until the current step is valid, and the last step shows a Finish button instead of Next.

## 08-tabs-expansion

Build a help center page with tabs for "Getting started", "Billing" and "Account". Each tab
contains a list of FAQ questions shown as expansion panels; only one panel can be open at a time
inside a tab. Use 4 questions per tab with short answers. Add a page heading and a short intro
paragraph above the tabs.

## 09-snackbar

Build a file manager page that shows a list of files (name, size, modified date) with Rename and
Delete buttons on each row. Deleting a file removes it and shows a snackbar "File deleted" with an
Undo action that restores it; renaming opens a dialog with a text field and shows a "Renamed"
success snackbar after saving. Snackbars should disappear automatically after 4 seconds.

## 10-detail-two-column

Build a customer detail page with a responsive two-column layout: on desktop, the left column
(about one third of the width) is a profile card with avatar, name, email, phone and a tag list;
the right column shows an "Orders" card with a table of orders and a "Notes" card with a textarea
and a Save button. On mobile the columns stack, profile first. Add a breadcrumb at the top
(Customers / Jane Cooper).
