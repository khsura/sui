import { getCurrentInstance, warn } from 'vue'
import type { LinkLocation } from '@/app/types'

/**
 * Whether the host app can render `RouterLink`, found without importing
 * vue-router.
 *
 * `@khsura/sui` does not depend on vue-router. A static import of it — even
 * a type import written as `import { type X } from 'vue-router'`, which
 * `verbatimModuleSyntax` keeps as a bare `import 'vue-router'` — puts the
 * package into `dist/s-ui.js`, and an app without it then fails to build
 * with "Failed to resolve import 'vue-router'".
 *
 * `app.use(router)` registers `RouterLink` as a global component, so the
 * app's component registry answers the question. Call this from `setup`:
 * outside a component there is no app, and so no router.
 */
export const useRouterLinkService = () => {
  const hasRouterLink = Boolean(getCurrentInstance()?.appContext.components.RouterLink)

  /** Dev-only warning (Vue's `warn` is a no-op in production builds). */
  const warnIfNoRouter = (to: LinkLocation | null | undefined) => {
    if (!to || hasRouterLink) {
      return
    }

    warn(
      '[sui] `to` was set but the app has no vue-router (`RouterLink` is not registered). ' +
        'Rendering a plain <a href> instead; a route given by `name` has no URL without the router. ' +
        'Install vue-router and call `app.use(router)`, or use `href`.',
    )
  }

  return {
    hasRouterLink,
    warnIfNoRouter,
  }
}
