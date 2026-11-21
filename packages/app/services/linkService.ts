import { computed, watch } from 'vue'
import { useRouterLinkService } from './routerLinkService'
import { type PropsLink, type PropsTag } from '@/app/definitions'
import { getLinkLocationHref } from '@/app/lib'

/**
 * `to` renders a `router-link` when the app has vue-router, and degrades to a
 * plain `<a href>` when it does not, so `@khsura/sui` never needs vue-router
 * installed. See `useRouterLinkService`.
 */
export const useLinkService = (props: PropsLink & PropsTag) => {
  const { hasRouterLink, warnIfNoRouter } = useRouterLinkService()

  if (!hasRouterLink) {
    watch(() => props.to, warnIfNoRouter, { immediate: true })
  }

  const tag = computed(() => {
    if (props.to && hasRouterLink) {
      return 'router-link'
    }

    if (props.to || props.href) {
      return 'a'
    }

    return props?.tag ?? 'div'
  })

  const isLink = computed(() => {
    return ['router-link', 'a'].includes(tag.value)
  })

  /**
   * Only the destination that belongs to the tag we chose.
   *
   * Components used to bind both — `:href="href" :to="to"` — and that broke
   * every internal link. `RouterLink` does not declare `href` as a prop, so
   * an `href` of `undefined` falls through to `attrs` and is spread over the
   * `<a>` it renders, removing the `href` it had just computed; Vue omits an
   * attribute whose value is `undefined`.
   *
   * The result was an `<a>` with no `href`, which is not a hyperlink: no
   * command-click or middle-click into a new tab, no "copy link address", no
   * destination shown in the status bar, and no link semantics for assistive
   * technology. Navigation still worked, because `RouterLink`'s click handler
   * was untouched, so nothing looked wrong until somebody tried to open a
   * menu item in a new tab.
   *
   * `target` and `rel` ride along with an external `href` only. On an
   * internal route they are meaningless, and `rel` without `href` is a
   * stray attribute.
   */
  const linkAttrs = computed(() => {
    if (tag.value === 'router-link') {
      return { to: props.to }
    }

    if (tag.value === 'a' && props.to) {
      return { href: getLinkLocationHref(props.to) ?? props.href ?? undefined }
    }

    if (tag.value === 'a') {
      return { href: props.href, target: props.target, rel: props.rel }
    }

    return {}
  })

  return {
    tag,
    isLink,
    linkAttrs,
  }
}
