/** Hint shared by the `SAvatar`-style names until a real avatar component ships. */
const AVATAR_HINT =
  'There is no avatar component yet (planned for M3). For a photo use `<SImage src="…" :aspect-ratio="1" object-fit="cover" :width="40" style="border-radius: 50%" />`; for initials use a fixed-size element with `border-radius: 50%`, a background colour and centred text.'

/**
 * Component names from Vuetify, Quasar, Element and similar libraries that are not in @khsura/sui,
 * with the SUI component(s) to use instead and a short hint. An empty `suiNames` means SUI has no
 * equivalent yet. Keys are matched like component names (case, `-` and the `S` prefix are ignored),
 * and an alias is never used when the name is a real component in the resolved `sui-api.json`.
 */
export const COMPONENT_ALIASES = {
  SCol: {
    suiNames: ['SColumn'],
    hint: 'The grid column is `SColumn`, inside an `SRow` (`:cols`, `:md`, … set its width).',
  },
  SCols: { suiNames: ['SColumn'], hint: 'The grid column is `SColumn`, inside an `SRow`.' },
  SColumns: { suiNames: ['SColumn'], hint: 'The grid column is `SColumn`, one per column, inside an `SRow`.' },
  STextField: { suiNames: ['SInput'], hint: 'The text field is `SInput` (`label`, `type`, `rules`, `v-model`).' },
  STextInput: { suiNames: ['SInput'], hint: 'The text field is `SInput` (`label`, `type`, `rules`, `v-model`).' },
  SInputText: { suiNames: ['SInput'], hint: 'The text field is `SInput`.' },
  SBtn: { suiNames: ['SButton'], hint: 'The button is `SButton` (`variant`, `color`, `size`).' },
  SIconButton: {
    suiNames: ['SButton'],
    hint: 'An icon-only button is `<SButton variant="icon" aria-label="…">` with an `SIcon` inside.',
  },
  SBtnToggle: {
    suiNames: ['SToggleButtonGroup', 'SToggleButton'],
    hint: 'Use `SToggleButtonGroup` with `SToggleButton` children.',
  },
  SDataTable: { suiNames: ['STable'], hint: 'The data table is `STable` (`headers`, `items`, `item.<key>` slots).' },
  SSimpleTable: { suiNames: ['STable'], hint: 'The table is `STable`.' },
  STabsWindow: {
    suiNames: ['SWindow'],
    hint: 'Tab content is an `SWindow` bound to the same `v-model` as `STabs`, with one `SWindowItem` per tab.',
  },
  STabsWindowItem: { suiNames: ['SWindowItem'], hint: 'Each tab panel is an `SWindowItem` inside an `SWindow`.' },
  STabsItems: { suiNames: ['SWindow'], hint: 'Tab content is an `SWindow` bound to the same `v-model` as `STabs`.' },
  STabItem: {
    suiNames: ['SWindowItem'],
    hint: 'Each tab panel is an `SWindowItem` inside an `SWindow`; the tab itself is `STab`.',
  },
  STabPanels: { suiNames: ['SWindow'], hint: 'Tab content is an `SWindow` bound to the same `v-model` as `STabs`.' },
  STabPanel: { suiNames: ['SWindowItem'], hint: 'Each tab panel is an `SWindowItem` inside an `SWindow`.' },
  STabPane: {
    suiNames: ['STab', 'SWindowItem'],
    hint: 'Put an `STab` in `STabs` and its content in an `SWindowItem` inside an `SWindow`.',
  },
  SAvatar: { suiNames: [], hint: AVATAR_HINT },
  SModal: { suiNames: ['SDialog'], hint: 'The modal is `SDialog`, opened from its `#activator` slot or a `v-model`.' },
  SDrawer: { suiNames: ['SNavigationDrawer'], hint: 'The side drawer is `SNavigationDrawer`, a child of `SLayout`.' },
  SHeader: { suiNames: ['SAppBar'], hint: 'The page header bar is `SAppBar`, a child of `SLayout`.' },
  SPage: { suiNames: ['SMain'], hint: 'The page content area is `SMain`, a child of `SLayout`.' },
  SContent: { suiNames: ['SMain'], hint: 'The page content area is `SMain`, a child of `SLayout`.' },
  SToast: { suiNames: ['SSnackbar'], hint: 'The toast is `SSnackbar` (`v-model`, `timeout`, `#action` slot).' },
  SNotification: { suiNames: ['SSnackbar'], hint: 'A transient message is `SSnackbar`; a static one is `SAlert`.' },
  SDropdown: { suiNames: ['SMenu'], hint: 'The dropdown is `SMenu`, opened from its `#activator` slot.' },
  SSpinner: { suiNames: ['SProgressCircular'], hint: 'The spinner is `<SProgressCircular indeterminate />`.' },
  SProgressBar: { suiNames: ['SProgressLinear'], hint: 'The progress bar is `SProgressLinear`.' },
  SToggle: { suiNames: ['SSwitch'], hint: 'The on/off toggle is `SSwitch`.' },
  SCombobox: { suiNames: ['SAutocomplete'], hint: 'A searchable select is `SAutocomplete`.' },
  SImg: { suiNames: ['SImage'], hint: 'The image is `SImage`.' },
  SCardHeader: { suiNames: ['SCardTitle'], hint: 'The card heading is `SCardTitle` (with `SCardSubtitle` below it).' },
  SCardBody: { suiNames: ['SCardText'], hint: 'The card body is `SCardText`.' },
  SCardContent: { suiNames: ['SCardText'], hint: 'The card body is `SCardText`.' },
  SCardSection: { suiNames: ['SCardText'], hint: 'The card body is `SCardText`.' },
  SCardFooter: { suiNames: ['SCardActions'], hint: 'The card footer with buttons is `SCardActions`.' },
  SExpansionPanelTitle: {
    suiNames: ['SExpansionPanelHeader'],
    hint: 'The clickable row of a panel is `SExpansionPanelHeader`.',
  },
  SExpansionPanelText: {
    suiNames: ['SExpansionPanelContent'],
    hint: 'The body of a panel is `SExpansionPanelContent`.',
  },
  SAccordion: {
    suiNames: ['SExpansionPanels'],
    hint: 'The accordion is `SExpansionPanels` with `SExpansionPanel` children.',
  },
  SStepperItem: { suiNames: ['SStepperStep'], hint: 'Each step is an `SStepperStep` inside `SStepper`.' },
}
