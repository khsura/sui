import fs from 'node:fs'
import path from 'node:path'
import { suiApiSchema } from '@khsura/shared/schemas'
import type { SuiApi } from '@khsura/shared/types'
import { createChecker } from 'vue-component-meta'
import { findPublicComponents } from './componentExports'
import { extractComponentMeta } from './componentMeta'
import { PACKAGE_JSON_FILE, PRINTER_NEW_LINE_LF, SUI_PACKAGE_NAME, TSCONFIG_FILE } from './constants'
import { packageVersionSchema } from './schemas'

/** Props, slots and events of every public component, stamped with the package version. */
export const buildApiMetadata = (appRoot: string): SuiApi => {
  const checker = createChecker(path.join(appRoot, TSCONFIG_FILE), {
    forceUseTs: true,
    schema: true,
    printer: { newLine: PRINTER_NEW_LINE_LF },
  })

  const { version } = packageVersionSchema.parse(
    JSON.parse(fs.readFileSync(path.join(appRoot, PACKAGE_JSON_FILE), 'utf8')),
  )

  return suiApiSchema.parse({
    package: SUI_PACKAGE_NAME,
    version,
    generatedAt: new Date().toISOString(),
    components: findPublicComponents(appRoot).map((entry) => extractComponentMeta(checker, appRoot, entry)),
  })
}
