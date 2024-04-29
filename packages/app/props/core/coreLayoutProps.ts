import { type PropType } from 'vue'

export const propsCoreLayout = (defaults?: { app?: boolean }) => {
  return {
    app: {
      type: Boolean as PropType<boolean>,
      default: defaults?.app ?? false,
    },
  }
}
