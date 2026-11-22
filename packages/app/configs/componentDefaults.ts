import type { GlobalComponentDefaultTargets } from '@/app/definitions'

/**
 * Which components a `defaults.global` prop reaches. The `satisfies` check rejects any
 * component whose prop is missing or cannot take the global value's type.
 * Left out on purpose (set them per component instead):
 * - `size`: `SCheckbox` ('default' | 'large'), `SProgressCircular` / `SProgressLinear` (px dimensions).
 * - `color`: surfaces and text (`SAppBar`, `SCard`, `SSheet`, `SToolbar`, `SFooter`, `SContainer`,
 *   `SList`, `SWindow`, `STooltip`, `SAlert`, `SIcon`, titles…) — a global accent color must not
 *   repaint backgrounds; `SCheckbox` takes preset colors only.
 */
export const globalComponentDefaultTargets = {
  size: [
    'SAlert',
    'SAutocomplete',
    'SAvatar',
    'SAvatarGroup',
    'SButton',
    'SChip',
    'SDatePickerInput',
    'SEmptyState',
    'SFileInput',
    'SIcon',
    'SInput',
    'SNumberInput',
    'SPagination',
    'STextarea',
  ],
  borderRadius: [
    'SAppBar',
    'SAvatar',
    'SBottomNavigation',
    'SButton',
    'SCard',
    'SChip',
    'SRadioGroup',
    'SSelect',
    'SSheet',
    'SSnackbar',
    'STabs',
    'SToggleButtonGroup',
    'SToolbar',
  ],
  rounded: ['SButton', 'STable'],
  elevation: ['SAppBar', 'SButton', 'SCard', 'SDialog', 'SFooter', 'SNavigationDrawer', 'SSheet', 'SToolbar'],
  color: [
    'SBadge',
    'SButton',
    'SCalendar',
    'SChip',
    'SDatePicker',
    'SDatePickerInput',
    'SPagination',
    'SProgressCircular',
    'SProgressLinear',
    'SRadioGroup',
    'SSwitch',
  ],
  // Components that render `density` (see densityService); others ignore it.
  density: [
    'SAutocomplete',
    'SButton',
    'SChip',
    'SFileInput',
    'SInput',
    'SList',
    'SListItem',
    'SNumberInput',
    'SSelect',
    'STable',
    'STextarea',
    'SToolbar',
  ],
} as const satisfies GlobalComponentDefaultTargets
