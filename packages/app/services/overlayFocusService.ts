import { computed, nextTick, onBeforeUnmount, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { overlayCloseKey, overlayFocusKey, overlayFocusableSelector } from '@/app/constants'
import { getDocument } from '@/app/lib/browser'

// Open overlays, innermost last: only the innermost one reacts to Esc and Tab, so Esc in a menu inside a
// dialog closes the menu and leaves the dialog open.
const openOverlays: symbol[] = []
const isFocusable = (element: Element | null): element is HTMLElement => element instanceof HTMLElement

export const useOverlayFocusService = (
  model: Ref<boolean | null | undefined>,
  elements: {
    activator: Readonly<Ref<HTMLElement | null>>
    content: Readonly<Ref<HTMLElement | null>>
  },
  options: {
    /** Esc closes the overlay unless this returns false (a persistent dialog). */
    canCloseOnEscape: () => boolean
    /** Move focus into the content on open and keep Tab inside it (modal dialogs). */
    trapFocus: boolean
  },
) => {
  const overlayKey = Symbol('overlay')
  let focusBeforeOpen: HTMLElement | null = null
  const isInnermost = () => openOverlays[openOverlays.length - 1] === overlayKey

  const removeFromStack = () => {
    const index = openOverlays.indexOf(overlayKey)

    if (index !== -1) {
      openOverlays.splice(index, 1)
    }
  }

  const getFocusableElements = () => {
    return [...(elements.content.value?.querySelectorAll(overlayFocusableSelector) ?? [])].filter(isFocusable)
  }

  const focusContent = () => {
    const content = elements.content.value
    const activeElement = getDocument()?.activeElement ?? null

    if (!content || content.contains(activeElement)) {
      return
    }

    const [firstFocusable] = getFocusableElements()

    ;(firstFocusable ?? content).focus()
  }

  const restoreFocus = () => {
    const document = getDocument()
    const activeElement = document?.activeElement ?? null
    const isFocusLost = activeElement === null || activeElement === document?.body
    const isFocusInside = elements.content.value?.contains(activeElement) ?? false

    if (isFocusLost || isFocusInside) {
      ;(elements.activator.value ?? focusBeforeOpen)?.focus()
    }
  }

  const trapTab = (event: KeyboardEvent) => {
    const focusableElements = getFocusableElements()
    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    const activeElement = getDocument()?.activeElement ?? null

    if (!first || !last) {
      event.preventDefault()

      return
    }

    if (event.shiftKey && (activeElement === first || !elements.content.value?.contains(activeElement))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (activeElement === last || !elements.content.value?.contains(activeElement))) {
      event.preventDefault()
      first.focus()
    }
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (!isInnermost()) {
      return
    }

    if (event.key === overlayCloseKey && options.canCloseOnEscape()) {
      event.stopPropagation()
      model.value = false
    } else if (event.key === overlayFocusKey && options.trapFocus) {
      trapTab(event)
    }
  }

  const openDocument = computed(() => (model.value ? getDocument() : null))

  useEventListener(openDocument, 'keydown', onKeydown)

  watch(
    () => model.value,
    async (isOpen) => {
      if (isOpen) {
        const activeElement = getDocument()?.activeElement ?? null

        focusBeforeOpen = isFocusable(activeElement) ? activeElement : null
        openOverlays.push(overlayKey)

        if (options.trapFocus) {
          await nextTick()
          focusContent()
        }

        return
      }

      if (openOverlays.includes(overlayKey)) {
        removeFromStack()
        restoreFocus()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(removeFromStack)
}
