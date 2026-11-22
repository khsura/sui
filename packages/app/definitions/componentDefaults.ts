import type * as props from './props'
import type { CalendarEvent, DensityType, SizePropertyType } from '@/app/types'

/**
 * Props type of every component that reads app-wide defaults
 * (`useComponentDefaultsService`). Keys are the registered component names.
 */
export interface ComponentPropsMap {
  SAlert: props.PropsAlert
  SAppBar: props.PropsAppBar
  SAppBarTitle: props.PropsToolbarTitle
  SAutocomplete: props.PropsAutocomplete
  SAvatar: props.PropsAvatar
  SAvatarGroup: props.PropsAvatarGroup
  SBadge: props.PropsBadge
  SBadgeContent: props.PropsBadge
  SBottomNavigation: props.PropsBottomNavigation
  SBreadcrumbs: props.PropsBreadcrumbs
  SButton: props.PropsButton
  SCalendar: props.PropsCalendar<CalendarEvent>
  SCalendarMonthly: props.PropsCalendarMonthly<CalendarEvent>
  SCalendarWeekly: props.PropsCalendarWeekly<CalendarEvent>
  SCard: props.PropsCard
  SCardActions: props.PropsTag
  SCardSubtitle: props.PropsTag
  SCardText: props.PropsTag
  SCardTitle: props.PropsTag
  SCarousel: props.PropsCarousel
  SCarouselItem: props.PropsCarouselItem
  SCheckbox: props.PropsCheckbox
  SChip: props.PropsChip
  SColumn: props.PropsColumn
  SContainer: props.PropsContainer
  SDatePicker: props.PropsDatePicker
  SDatePickerInput: props.PropsDatePickerInput
  SDatePickerYear: props.PropsDatePickerItem
  SDialog: props.PropsDialog
  SDivider: props.PropsDivider
  SDroppable: props.PropsDroppable
  SEmptyState: props.PropsEmptyState
  SFileInput: props.PropsFileInput
  SFooter: props.PropsFooter
  SIcon: props.PropsIcon
  SImage: props.PropsImage
  SInput: props.PropsInput
  SLayout: props.PropsLayoutContainer
  SList: props.PropsList
  SListItem: props.PropsListItem
  SMain: props.PropsMain
  SMenu: props.PropsMenu
  SNavigationDrawer: props.PropsNavigationDrawer
  SNumberInput: props.PropsNumberInput
  SPagination: props.PropsPagination
  SProgressCircular: props.PropsProgressCircular
  SProgressLinear: props.PropsProgressLinear
  SRadioGroup: props.PropsRadioGroup
  SRow: props.PropsRow
  SSelect: props.PropsSelect
  SSheet: props.PropsSheet
  SSkeletonLoader: props.PropsSkeletonLoader
  SSlideItem: props.PropsGroupItem
  SSnackbar: props.PropsSnackbar
  SSplitView: props.PropsSplitView
  SStepper: props.PropsStepper
  SStepperStep: props.PropsStepperStep
  SSwitch: props.PropsSwitch
  STab: props.PropsTab
  STable: props.PropsTable
  STableBodyCell: props.PropsTableBodyCell
  STableHeadCell: props.PropsTableHeadCell
  STabs: props.PropsTabs
  STextarea: props.PropsTextarea<string>
  SToggleButtonGroup: props.PropsToggleButtonGroup
  SToolbar: props.PropsToolbar
  SToolbarTitle: props.PropsToolbarTitle
  STooltip: props.PropsTooltip
  SWindow: props.PropsWindow
}

export type ComponentWithDefaultsName = keyof ComponentPropsMap

/**
 * Styling props that can be set once for the whole app under `defaults.global`.
 * A global value only reaches the components listed for that prop in
 * `globalComponentDefaultTargets` (configs) — components without the prop, or whose
 * prop takes a different scale (e.g. `SCheckbox` size, `SProgressCircular` size in px),
 * are never affected. `variant` is intentionally absent: its values differ per component,
 * so set it per component instead.
 */
export interface GlobalComponentDefaults {
  size?: SizePropertyType
  borderRadius?: props.PropsBorder['borderRadius']
  rounded?: boolean
  elevation?: props.PropsElevation['elevation']
  color?: string
  /** Vertical density of fields, buttons, lists, table rows, toolbars and chips. */
  density?: DensityType
}

export type GlobalComponentDefaultName = keyof GlobalComponentDefaults

/** Components whose prop `K` exists and accepts every value of `GlobalComponentDefaults[K]`. */
export type ComponentsAcceptingGlobalDefault<K extends GlobalComponentDefaultName> = {
  [C in ComponentWithDefaultsName]: K extends keyof ComponentPropsMap[C]
    ? NonNullable<GlobalComponentDefaults[K]> extends ComponentPropsMap[C][K]
      ? C
      : never
    : never
}[ComponentWithDefaultsName]

export type GlobalComponentDefaultTargets = {
  [K in GlobalComponentDefaultName]-?: ReadonlyArray<ComponentsAcceptingGlobalDefault<K>>
}

export type ComponentDefaultsOptions = {
  [C in ComponentWithDefaultsName]?: Partial<ComponentPropsMap[C]>
} & {
  global?: GlobalComponentDefaults
}
