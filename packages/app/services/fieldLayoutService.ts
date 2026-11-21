import { computed, type ComputedRef } from 'vue'

export interface FieldLayoutState {
  /** A label is rendered above the field box (a label is set and `hideDetails` is off). */
  hasLabel: boolean
  /** The details line (error / counter) is reserved below the field box. */
  hasDetails: boolean
}

/**
 * Marker classes on a text field's root, so `SFormRow` can line its buttons up with the field box:
 * it offsets the other children by the label height when a field in the row shows a label.
 * The classes carry no styles of their own, so a field outside `SFormRow` renders unchanged.
 */
export const useFieldLayoutService = (state: ComputedRef<FieldLayoutState>) => {
  const classListField = computed(() => {
    return {
      s_field: true,
      's_field--labelled': state.value.hasLabel,
      's_field--details': state.value.hasDetails,
    }
  })

  return { classListField }
}
