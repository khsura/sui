import { DOCS_SITE_URL } from '../constants'
import type { ComponentNames } from '../types'

// Storybook ids lowercase the title and turn every other character run into `-`: `UI Components/SkeletonLoader`
// becomes `ui-components-skeletonloader`.
const storybookDocsUrl = (names: ComponentNames) =>
  `${DOCS_SITE_URL}?path=/docs/ui-components-${names.base.toLowerCase()}--docs`

/** docs/components/x.md: the hand-written reference, same layout as chip.md. */
export const renderDocsFile = (names: ComponentNames): string => `# ${names.component}

**Import:** \`import { ${names.component} } from '@khsura/sui'\`

TODO(scaffold): one or two sentences on what ${names.component} is for, and what it renders (element and ARIA role).

Live examples: [${names.component} in Storybook](${storybookDocsUrl(names)})

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`text\` | \`string\` | \`undefined\` | Text shown when the default slot is empty |
| \`color\` | \`string\` | \`undefined\` | Background color — preset name or CSS color |
| \`size\` | \`'mini' \\| 'small' \\| 'default' \\| 'large' \\| 'extra'\` | \`undefined\` | Preset size |
| \`colorThreshold\` | \`number\` | \`undefined\` | Auto text contrast threshold |
| \`theme\` | \`AppThemeType\` | \`undefined\` | Per-component theme override |

## Slots

| Slot | Scoped data | Description |
|------|-------------|-------------|
| \`default\` | — | Content; replaces \`text\` |

## Events

None.

## Usage

\`\`\`vue
<${names.component} text="Hello" />

<${names.component} color="primary" size="large">Custom content</${names.component}>
\`\`\`

## Accessibility

TODO(scaffold): role, accessible name, keyboard (Tab stops and keys), focus ring, and what screen readers announce.

## Notes

- TODO(scaffold): the gotchas — props that look supported but are not, required parents, layout traps.
`

/**
 * plugins/sui-plugin/skills/sui-component/references/x.md: the skill reference. The tables between the
 * `generated:api` markers are filled from sui-api.json by `yarn sync:skills` during `yarn build`.
 */
export const renderSkillReferenceFile = (names: ComponentNames): string => `# ${names.component}

**Import:** \`import { ${names.component} } from '@khsura/sui'\`

TODO(scaffold): one or two sentences on what ${names.component} is for.

Types: \`node_modules/@khsura/sui/@types/definitions/props/${names.propsFile}.d.ts\`

Docs: ${storybookDocsUrl(names)}

<!-- generated:api:start ${names.component} -->
<!-- generated:api:end ${names.component} -->

**${names.component} notes**

- \`text\`: Text shown when the default slot is empty

## Usage

\`\`\`vue
<${names.component} text="Hello" />
\`\`\`

## Gotchas

| ❌ | ✅ |
|----|----|
| TODO(scaffold): a likely AI misuse | The correct pattern |
`
