import { getDocument } from '@khsura/sui/lib/browser'
import { type ComponentPublicInstance, type Ref } from 'vue'

export const useClickOutsideService = () => {
  const onClick = (
    content:
      | Ref<HTMLElement | ComponentPublicInstance | null>
      | Array<Ref<HTMLElement | ComponentPublicInstance | null>>,
    listener: (data: { isOutside: boolean }, event: Event) => void,
  ) => {
    const onClick = (event: MouseEvent) => {
      const contents = content instanceof Array ? content : [content]

      const isOutside = contents
        .filter((c) => !!c.value)
        .every((content) => {
          const contentValue = content.value

          if (contentValue instanceof HTMLElement) {
            return !contentValue?.contains(event.target as HTMLElement)
          }

          return !contentValue?.$el.contains(event.target as HTMLElement)
        })

      listener({ isOutside }, event)
    }

    const register = () => {
      getDocument()?.addEventListener('click', onClick)
    }

    const unregister = () => {
      getDocument()?.removeEventListener('click', onClick)
    }

    return {
      register,
      unregister,
    }
  }

  return {
    onClick,
  }
}
