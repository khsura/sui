// Storybook preview channel events that mean the story failed. A `play` function that throws still ends the render in
// the `finished` phase in the static build, so the harness listens for these instead of trusting the phase alone.
export const storyFailureEvents = [
  'playFunctionThrewException',
  'storyThrewException',
  'storyErrored',
  'unhandledErrorsWhilePlaying',
]

// Window property the preview assigns its channel to on boot, and the one the harness keeps the failures in.
export const storybookChannelGlobal = '__STORYBOOK_ADDONS_CHANNEL__'
export const storyFailuresGlobal = '__suiVisualStoryFailures'

// The longest part of a failure payload printed in the test error.
export const storyFailureMaxLength = 500

// Turns off the a11y addon's automatic axe run (its `afterEach`). The render phase only reaches `finished` after it,
// which costs seconds per capture in WebKit; storyAccessibility.visual.ts runs its own axe audit instead.
export const storybookA11yManualGlobal = 'a11y.manual:!true'
