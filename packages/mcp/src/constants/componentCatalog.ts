export const COMPONENT_PREFIX = 's'
export const MAX_NAME_SUGGESTIONS = 3
export const MIN_COMPONENT_NAME_LENGTH = 1

export const ACTIVATOR_COMPONENTS = ['SDialog', 'SMenu', 'SSnackbar'] as const
export const SLOTLESS_ACTIVATOR_NOTE_COMPONENTS = ['STooltip'] as const
export const LAYOUT_CHILD_COMPONENTS = [
  'SAppBar',
  'SNavigationDrawer',
  'SMain',
  'SFooter',
  'SBottomNavigation',
] as const

export const ACTIVATOR_NOTE =
  '**Activator pattern:** open it from the `#activator="{ on, attrs }"` slot and bind BOTH `v-on="on"` and `v-bind="attrs"` on the activator element. Binding only one leaves the popup unable to open or out of sync.'
export const SLOTLESS_ACTIVATOR_NOTE =
  '**Activator:** put the trigger element inside `<template #activator>`. This slot passes no slot props, and the tooltip listens on its own wrapper, so do not destructure `{ on, attrs }` or bind `v-on`/`v-bind` here. Always set `location`; when it is unset the tooltip overlaps the activator.'
export const LAYOUT_CHILD_NOTE =
  '**Layout child:** render it inside an `SLayout name="x"` and set `for="x"` to the same name. Without a matching `for`, it is not placed in the layout.'

export const DEFAULT_FAMILY_PURPOSE = 'SUI component'

export const FAMILY_PURPOSES = {
  core: 'core UI building block',
  layout: 'app shell layout (SLayout and its named regions)',
  badge: 'status badge overlay',
  calendar: 'calendar view',
  cards: 'card container or one of its sections',
  carousel: 'content carousel',
  form: 'form input with validation rules',
  grids: 'responsive grid layout',
  datePicker: 'date or month picker',
  expansionPanel: 'collapsible expansion panel',
  list: 'list or one of its item parts',
  progress: 'progress indicator',
  slideGroup: 'horizontally scrollable slide group',
  splitViews: 'resizable split view',
  stepper: 'multi-step stepper',
  tabs: 'tab navigation',
  table: 'data table or one of its cells',
  toggleButtonGroup: 'toggle button group',
  toolbar: 'toolbar or one of its parts',
  window: 'windowed content with transitions',
}
