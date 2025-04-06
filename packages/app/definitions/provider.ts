import { type ComputedRef, type Ref } from 'vue'
import { type ProviderName, type ProviderPropsName, type defaultLayoutSizes } from '@khsura/sui/constants'
import { type AppState, type GroupItemValue, type FormProviderRegisterInputAttribute } from '@khsura/sui/types'
import type * as props from './props'

export interface GroupProvider {
  registerItem: (name: GroupItemValue, attrs: { element?: Ref<HTMLElement | null> }) => number
  unregisterItem: (name: GroupItemValue | undefined) => void
  toggleItem: (name: GroupItemValue | undefined) => void
  isSelectedItem: (name: GroupItemValue | undefined) => boolean
  items: ComputedRef<Array<{ value: GroupItemValue; readonly element: HTMLElement | null }>>
}

export interface Provider {
  [ProviderName.form]: {
    registerItem: (id: string, attrs: FormProviderRegisterInputAttribute) => void
    unregisterItem: (id: string) => void
    updateItem: (id: string) => void
  }
  [ProviderName.stepperUpdateValue]: (value: number) => void
  [ProviderName.stepperRegisterStepperStep]: (step: number) => void
  [ProviderName.stepperUnregisterStepperStep]: (step: number) => void
  [ProviderName.stepperSteps]: ComputedRef<number>
  [ProviderName.group]: GroupProvider
  [ProviderName.singleGroup]: SingleGroupProvider
  [ProviderName.app]: Ref<typeof defaultLayoutSizes>
  [ProviderName.sui]: AppState
  [ProviderName.expansionPanel]: {
    isExpanded: ComputedRef<boolean | null>
    toggle: (panel?: number) => void
  }
}

export interface ProviderProps {
  [ProviderPropsName.listProps]: props.PropsList
  [ProviderPropsName.listItemProps]: { lines?: number | null }
  [ProviderPropsName.radioGroupProps]: props.PropsRadioGroup
  [ProviderPropsName.stepperProps]: props.PropsStepper
  [ProviderPropsName.tabsProps]: props.PropsTabs
  [ProviderPropsName.toggleButtonGroupProps]: props.PropsToggleButtonGroup
  [ProviderPropsName.slideGroupProps]: props.PropsSlideGroup
  [ProviderPropsName.groupProps]: props.PropsGroup
  [ProviderPropsName.groupSingleProps]: props.PropsSingleGroup
  [ProviderPropsName.navigationDrawerProps]: props.PropsNavigationDrawer
  [ProviderPropsName.bottomNavigation]: props.PropsBottomNavigation
  [ProviderPropsName.toolbar]: props.PropsToolbar
  [ProviderPropsName.window]: props.PropsWindow
  [ProviderPropsName.splitViewProps]: props.PropsSplitView
  [ProviderPropsName.expansionPanelsProps]: props.PropsExpansionPanels
  [ProviderPropsName.dialog]: props.PropsDialog
}

export interface SingleGroupProvider extends GroupProvider {
  selectedItem: ComputedRef<{ value?: GroupItemValue | undefined; id: number }>
}
