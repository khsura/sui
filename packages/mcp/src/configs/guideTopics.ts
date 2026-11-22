import type { GuideDefinition, GuideTopic } from '../types'
import { GETTING_STARTED_SKILL_PATH, UTILITY_CLASSES_DOC_PATH } from '../constants'

export const guideDefinitions: Record<GuideTopic, GuideDefinition> = {
  installation: {
    topic: 'installation',
    title: 'Installation (Vue and Nuxt)',
    summary:
      'Install @khsura/sui, register createSUI and SApp, import the stylesheets and @mdi/font, add @khsura/sui-nuxt.',
    sections: [
      { file: GETTING_STARTED_SKILL_PATH, heading: '1. Install (public npm)' },
      { file: GETTING_STARTED_SKILL_PATH, heading: '2. Register the plugin and wrap the app in `SApp`' },
      { file: GETTING_STARTED_SKILL_PATH, heading: '3. Styles and icons' },
      { file: GETTING_STARTED_SKILL_PATH, heading: '4. Nuxt — `@khsura/sui-nuxt`' },
    ],
  },
  theming: {
    topic: 'theming',
    title: 'Theming and dark mode',
    summary: 'Override preset and app colors per theme, switch light/dark with useTheme().',
    sections: [
      { file: GETTING_STARTED_SKILL_PATH, heading: '5. App options — `createSUI(options)`', includeSubsections: false },
      { file: GETTING_STARTED_SKILL_PATH, heading: 'Theme colors' },
      { file: GETTING_STARTED_SKILL_PATH, heading: 'Dark mode — `useTheme()`' },
    ],
  },
  'component-defaults': {
    topic: 'component-defaults',
    title: 'Component defaults',
    summary:
      "Set app-wide default props once with createSUI({ defaults }): per component and global styling props (global: { size: 'small' }).",
    sections: [{ file: GETTING_STARTED_SKILL_PATH, heading: 'Component defaults — `defaults`' }],
  },
  display: {
    topic: 'display',
    title: 'Display breakpoints (useDisplay)',
    summary: 'Breakpoint thresholds, the useDisplay() refs and responsive utility-class infixes.',
    sections: [
      { file: GETTING_STARTED_SKILL_PATH, heading: '5. App options — `createSUI(options)`', includeSubsections: false },
      { file: GETTING_STARTED_SKILL_PATH, heading: 'Composables' },
      { file: UTILITY_CLASSES_DOC_PATH, heading: 'Breakpoints' },
    ],
  },
  i18n: {
    topic: 'i18n',
    title: 'vue-i18n setup',
    summary: 'Merge SUI messages (en, mn, ja) into vue-i18n and build localized form rules.',
    sections: [{ file: GETTING_STARTED_SKILL_PATH, heading: '6. vue-i18n — SUI messages and form rules' }],
  },
  'common-mistakes': {
    topic: 'common-mistakes',
    title: 'Common mistakes',
    summary: 'The activator, layout and validation patterns plus the mistakes that most often break SUI UIs.',
    sections: [
      { file: GETTING_STARTED_SKILL_PATH, heading: 'Critical patterns' },
      { file: GETTING_STARTED_SKILL_PATH, heading: 'Common mistakes' },
    ],
  },
}

/** Every distinct source file a guide reads; the build copies exactly these into dist/guides. */
export const guideSourceFiles: readonly string[] = [
  ...new Set(Object.values(guideDefinitions).flatMap(({ sections }) => sections.map(({ file }) => file))),
]
