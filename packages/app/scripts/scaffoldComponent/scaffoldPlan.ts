import path from 'node:path'
import {
  BARREL_FILE,
  COMPONENT_DOCS_DIR,
  COMPONENT_DOCS_INDEX_FILE,
  COMPONENT_TESTS_DIR,
  COMPONENTS_DIR,
  MARKDOWN_EXTENSION,
  PROPS_DIR,
  SKILL_INDEX_FILE,
  SKILL_REFERENCES_DIR,
  STORIES_DIR,
  STORY_FILE_SUFFIX,
  TEST_FILE_SUFFIX,
  TS_EXTENSION,
} from './constants'
import {
  registerComponentExport,
  registerPropsExport,
  registerSkillIndexRow,
  registerSummaryRow,
} from './registrations'
import {
  renderComponentFile,
  renderDocsFile,
  renderPropsFile,
  renderSkillReferenceFile,
  renderStoryFile,
  renderTestFile,
} from './templates'
import type { ComponentNames, ScaffoldFile, ScaffoldRegistration } from './types'

/** The new files for one component, with paths relative to packages/app (posix separators). */
export const planScaffoldFiles = (names: ComponentNames): ScaffoldFile[] => [
  { path: path.posix.join(PROPS_DIR, `${names.propsFile}${TS_EXTENSION}`), content: renderPropsFile(names) },
  { path: path.posix.join(COMPONENTS_DIR, names.vueFile), content: renderComponentFile(names) },
  { path: path.posix.join(STORIES_DIR, `${names.camel}${STORY_FILE_SUFFIX}`), content: renderStoryFile(names) },
  {
    path: path.posix.join(COMPONENT_TESTS_DIR, `${names.componentFile}${TEST_FILE_SUFFIX}`),
    content: renderTestFile(names),
  },
  { path: path.posix.join(COMPONENT_DOCS_DIR, `${names.kebab}${MARKDOWN_EXTENSION}`), content: renderDocsFile(names) },
  {
    path: path.posix.join(SKILL_REFERENCES_DIR, `${names.kebab}${MARKDOWN_EXTENSION}`),
    content: renderSkillReferenceFile(names),
  },
]

/** The existing files that register the component: barrels, the skill index and the docs summary. */
export const planScaffoldRegistrations = (names: ComponentNames): ScaffoldRegistration[] => [
  { path: path.posix.join(PROPS_DIR, BARREL_FILE), update: (source) => registerPropsExport(source, names) },
  { path: path.posix.join(COMPONENTS_DIR, BARREL_FILE), update: (source) => registerComponentExport(source, names) },
  { path: SKILL_INDEX_FILE, update: (source) => registerSkillIndexRow(source, names) },
  { path: COMPONENT_DOCS_INDEX_FILE, update: (source) => registerSummaryRow(source, names) },
]
