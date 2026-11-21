// Fixed interaction scenarios per page. Each page always gets a `base` shot; every extra
// scenario starts from a fresh load, runs its steps, then shoots. Steps are deliberately
// generic (click visible text / nth button / fill nth text field) so the same scenarios can
// be replayed on pages regenerated in later eval runs.
//   { click: 'Text' }               click the first visible element whose text is exactly 'Text'
//   { clickContains: 'Text' }       click the first visible element containing 'Text'
//   { clickIcon: 'mdi-dots-vertical' } click the first visible button containing that icon class
//   { fill: [n, 'value'] }          fill the n-th visible text input/textarea (0-based)
//   { wait: ms }                    wait before the next step / the shot
export const scenarios = {
  '01-settings': {
    validation: [{ fill: [0, ''] }, { fill: [1, 'not-an-email'] }, { click: 'Save' }, { wait: 400 }],
    dialog: [{ click: 'Delete account' }, { wait: 600 }],
  },
  '02-dashboard-shell': {
    drawer: [{ clickIcon: 'mdi-menu' }, { wait: 600 }],
  },
  '03-mobile-list': {
    menu: [{ clickIcon: 'mdi-dots-vertical' }, { wait: 600 }],
    search: [{ fill: [0, 'an'] }, { wait: 400 }],
  },
  '04-date-range-filter': {
    picker: [{ clickNthInput: 0 }, { wait: 600 }],
    apply: [{ click: 'Apply' }, { wait: 400 }],
  },
  '05-card-grid': {
    added: [{ clickContains: 'Add to cart' }, { clickContains: 'Add to cart' }, { wait: 400 }],
  },
  '06-login': {
    validation: [{ click: 'Sign in' }, { wait: 400 }],
    loading: [{ fill: [0, 'jane@example.com'] }, { fill: [1, 'secret123'] }, { click: 'Sign in' }, { wait: 300 }],
  },
  '07-stepper-wizard': {
    step2: [{ fill: [0, 'Jane Cooper'] }, { fill: [1, 'Acme'] }, { click: 'Next' }, { wait: 500 }],
    step3: [
      { fill: [0, 'Jane Cooper'] },
      { fill: [1, 'Acme'] },
      { click: 'Next' },
      { wait: 500 },
      { clickRadio: 1 },
      { click: 'Next' },
      { wait: 500 },
    ],
  },
  '08-tabs-expansion': {
    panel: [{ clickContains: '?' }, { wait: 600 }],
    billing: [{ click: 'Billing' }, { wait: 600 }],
  },
  '09-snackbar': {
    deleted: [{ click: 'Delete' }, { wait: 600 }],
    rename: [{ click: 'Rename' }, { wait: 600 }],
  },
  '10-detail-two-column': {},
}
