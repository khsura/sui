import { type ExtractPropTypes } from 'vue'
import type * as props from '@sui/app/props'
import { type FormInputModelValue } from '../types/core'

export type PropsActivator = ExtractPropTypes<ReturnType<typeof props.propsActivator>>
export type PropsApp = ExtractPropTypes<ReturnType<typeof props.propsApp>>
export type PropsAppBar = ExtractPropTypes<ReturnType<typeof props.propsAppBar>>
export type PropsBorder = ExtractPropTypes<ReturnType<typeof props.propsBorder>>
export type PropsBottomNavigation = ExtractPropTypes<ReturnType<typeof props.propsBottomNavigation>>
export type PropsBreadcrumbs = ExtractPropTypes<ReturnType<typeof props.propsBreadcrumbs>>
export type PropsButton = ExtractPropTypes<ReturnType<typeof props.propsButton>>
export type PropsCalendar = ExtractPropTypes<ReturnType<typeof props.propsCalendar>>
export type PropsChip = ExtractPropTypes<ReturnType<typeof props.propsChip>>
export type PropsColumn = ExtractPropTypes<ReturnType<typeof props.propsColumn>>
export type PropsDatePicker = ExtractPropTypes<ReturnType<typeof props.propsDatePicker>>
export type PropsDatePickerItem = ExtractPropTypes<ReturnType<typeof props.propsDatePickerItem>>
export type PropsDatePickerItemSwitch = ExtractPropTypes<ReturnType<typeof props.propsDatePickerItemSwitch>>
export type PropsDatePickerItemTitle = ExtractPropTypes<ReturnType<typeof props.propsDatePickerItemTitle>>
export type PropsDialog = ExtractPropTypes<ReturnType<typeof props.propsDialog>>
export type PropsDisabled = ExtractPropTypes<ReturnType<typeof props.propsDisabled>>
export type PropsElevation = ExtractPropTypes<ReturnType<typeof props.propsElevation>>
export type PropsExpansionPanels = ExtractPropTypes<ReturnType<typeof props.propsExpansionPanels>>
export type PropsFormInput<T extends FormInputModelValue> = Omit<
  ExtractPropTypes<ReturnType<typeof props.propsFormInput>>,
  'modelValue'
> & { modelValue?: T | undefined }
export type PropsGroup = ExtractPropTypes<ReturnType<typeof props.propsGroup>>
export type PropsGroupItem = ExtractPropTypes<ReturnType<typeof props.propsGroupItem>>
export type PropsIcon = ExtractPropTypes<ReturnType<typeof props.propsIcon>>
export type PropsImageLoader = ExtractPropTypes<ReturnType<typeof props.propsImageLoader>>
export type PropsLayout = Partial<ExtractPropTypes<ReturnType<typeof props.propsLayout>>>
export type PropsLayoutProvider = ExtractPropTypes<ReturnType<typeof props.propsLayoutProvider>>
export type PropsLink = ExtractPropTypes<ReturnType<typeof props.propsLink>>
export type PropsList = ExtractPropTypes<ReturnType<typeof props.propsList>>
export type PropsListMediaItem = ExtractPropTypes<ReturnType<typeof props.propsListMediaItem>>
export type PropsLocation = ExtractPropTypes<ReturnType<typeof props.propsLocation>>
export type PropsMeasurableStyles = Partial<ExtractPropTypes<ReturnType<typeof props.propsMeasurableStyles>>>
export type PropsMenu = ExtractPropTypes<ReturnType<typeof props.propsMenu>>
export type PropsNavigationDrawer = ExtractPropTypes<ReturnType<typeof props.propsNavigationDrawer>>
export type PropsOverlay = ExtractPropTypes<ReturnType<typeof props.propsOverlay>>
export type PropsPosition = ExtractPropTypes<ReturnType<typeof props.propsPosition>>
export type PropsRadioGroup = ExtractPropTypes<ReturnType<typeof props.propsRadioGroup>>
export type PropsScrollable = ExtractPropTypes<ReturnType<typeof props.propsScrollable>>
export type PropsSelect = ExtractPropTypes<ReturnType<typeof props.propsSelect>>
export type PropsSelectMenu = ExtractPropTypes<ReturnType<typeof props.propsMenu>>
export type PropsSingleGroup = ExtractPropTypes<ReturnType<typeof props.propsSingleGroup>>
export type PropsSingleGroupItem = ExtractPropTypes<ReturnType<typeof props.propsSingleGroupItem>>
export type PropsSizePreset = ExtractPropTypes<ReturnType<typeof props.propsSizePreset>>
export type PropsSizeUnion = ExtractPropTypes<ReturnType<typeof props.propsSizeUnion>>
export type PropsSlideGroup = ExtractPropTypes<ReturnType<typeof props.propsSlideGroup>>
export type PropsSplitView = ExtractPropTypes<ReturnType<typeof props.propsSplitView>>
export type PropsStepper = ExtractPropTypes<ReturnType<typeof props.propsStepper>>
export type PropsStepperStep = ExtractPropTypes<ReturnType<typeof props.propsStepperStep>>
export type PropsTabs = ExtractPropTypes<ReturnType<typeof props.propsTabs>>
export type PropsTag = ExtractPropTypes<ReturnType<typeof props.propsTag>>
export type PropsTextColor = ExtractPropTypes<ReturnType<typeof props.propsTextColor>>
export type PropsToggleButtonGroup = ExtractPropTypes<ReturnType<typeof props.propsToggleButtonGroup>>
export type PropsToolbar = ExtractPropTypes<ReturnType<typeof props.propsToolbar>>
export type PropsToolbarTitle = ExtractPropTypes<ReturnType<typeof props.propsToolbarTitle>>
export type PropsTooltip = ExtractPropTypes<ReturnType<typeof props.propsTooltip>>
export type PropsVariant = ExtractPropTypes<ReturnType<typeof props.propsVariant>>
export type PropsWindow = ExtractPropTypes<ReturnType<typeof props.propsWindow>>
