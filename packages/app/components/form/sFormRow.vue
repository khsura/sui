<template>
  <!-- A row of text fields and the buttons that act on them (a search bar, a filter bar) -->
  <div class="s_formRow">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
/**
 * Lines up text fields (`SInput`, `SSelect`, `SDatePickerInput`, `SAutocomplete`, `STextarea`) and the buttons
 * next to them in one wrapping row. Each button's top and bottom match the field box, not the field's label or
 * its error line, with or without a label and while an error shows.
 */
defineSlots<{
  /** The fields and buttons of the row. */
  default?: () => unknown
}>()
</script>
<style lang="scss">
.s_formRow {
  display: flex;
  flex-wrap: wrap;
  column-gap: calc($s_spacer * 2);
  align-items: flex-start;

  // A field keeps the width it has on its own (SSelect and SDatePickerInput: as wide as their value) ...
  > .s_field {
    flex: 0 1 auto;
  }

  // ... and a full-width field takes the free width instead of a whole line, so the row wraps only when needed.
  > .s_input,
  > .s_textarea,
  > .s_autocomplete,
  > .s_select--grow,
  > .s_datePickerInput--block {
    flex: 1 1 auto;
    width: auto;
  }

  > :not(.s_field) {
    flex: 0 0 auto;
  }

  // Once a field in the row shows a label, its box starts one label height below the top of the row:
  // buttons and unlabelled fields start there too.
  &:has(> .s_field--labelled) > :not(.s_field),
  &:has(> .s_field--labelled) > .s_field:not(.s_field--labelled) {
    margin-top: $s_field__labelHeight;
  }

  // The fields reserve an error line under their box; a button reserves the same space, so a line of the
  // wrapped row that holds only buttons keeps the gap to the next line.
  &:has(> .s_field--details) > :not(.s_field) {
    margin-bottom: $s_formInputError__minHeight;
  }

  // Without an error line (`hide-details`) nothing separates the row from what follows, so add the same gap.
  &:not(:has(> .s_field--details)) {
    row-gap: calc($s_spacer * 2);
    margin-bottom: $s_formInputError__minHeight;
  }
}
</style>
