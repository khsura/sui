import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { AppState, GroupProvider, SingleGroupProvider } from '@/app/definitions'
import type { FormProviderRegisterInputAttribute } from '@/app/types'
import type { defaultLayoutSizes } from '@/app/constants'
import type * as props from '@/app/definitions/props'

export const ProviderName = {
  sui: Symbol() as InjectionKey<AppState>,
  form: Symbol() as InjectionKey<{
    registerItem: (id: string, attrs: FormProviderRegisterInputAttribute) => void
    unregisterItem: (id: string) => void
    updateItem: (id: string) => void
  }>,
  stepperRegisterStepperStep: Symbol() as InjectionKey<(step: number) => void>,
  stepperSteps: Symbol() as InjectionKey<ComputedRef<number>>,
  stepperUnregisterStepperStep: Symbol() as InjectionKey<(step: number) => void>,
  stepperUpdateValue: Symbol() as InjectionKey<(value: number) => void>,
  group: Symbol() as InjectionKey<GroupProvider>,
  singleGroup: Symbol() as InjectionKey<SingleGroupProvider>,
  app: Symbol() as InjectionKey<Ref<typeof defaultLayoutSizes>>,
  expansionPanel: Symbol() as InjectionKey<{
    isExpanded: ComputedRef<boolean | null>
    toggle: (panel?: number) => void
  }>,
} as const

export const ProviderPropsName = {
  radioGroupProps: Symbol() as InjectionKey<props.PropsRadioGroup>,
  stepperProps: Symbol() as InjectionKey<props.PropsStepper>,
  tabsProps: Symbol() as InjectionKey<props.PropsTabs>,
  toggleButtonGroupProps: Symbol() as InjectionKey<props.PropsToggleButtonGroup>,
  slideGroupProps: Symbol() as InjectionKey<props.PropsSlideGroup>,
  groupProps: Symbol() as InjectionKey<props.PropsGroup>,
  groupSingleProps: Symbol() as InjectionKey<props.PropsSingleGroup>,
  navigationDrawerProps: Symbol() as InjectionKey<props.PropsNavigationDrawer>,
  bottomNavigation: Symbol() as InjectionKey<props.PropsBottomNavigation>,
  toolbar: Symbol() as InjectionKey<props.PropsToolbar>,
  window: Symbol() as InjectionKey<props.PropsWindow>,
  splitViewProps: Symbol() as InjectionKey<props.PropsSplitView>,
  expansionPanelsProps: Symbol() as InjectionKey<props.PropsExpansionPanels>,
  dialog: Symbol() as InjectionKey<props.PropsDialog>,
  listProps: Symbol() as InjectionKey<props.PropsList>,
  listItemProps: Symbol() as InjectionKey<props.PropsListItem>,
}
