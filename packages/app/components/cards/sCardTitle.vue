<template>
  <Component :is="tagName" class="s_card__title">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { type PropsTag } from '@/app/definitions'
import { useComponentDefaultsService, useTagService } from '@/app/services'

const rawProps = defineProps<PropsTag>()
const props = useComponentDefaultsService('SCardTitle', rawProps)
const { tagName } = useTagService(props)
</script>

<style lang="scss">
.s_card__title {
  @include s_typography('h6');
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: $s_cardItemPadding;
  // Wrap between words; split a word only when it is wider than the card on its own.
  overflow-wrap: anywhere;
}

// The title is a flex container, so a text-align utility class alone cannot move a one-line title.
// Each s_textAlign class (responsive ones included) also sets the matching justify-content.
$s_cardTitleJustifyByTextAlign: (
  'left': flex-start,
  'start': flex-start,
  'justify': flex-start,
  'center': center,
  'right': flex-end,
  'end': flex-end,
);

@each $breakpoint in map.keys($s_gridBreakpoints) {
  @include s_breakpointUp($breakpoint) {
    $infix: s_breakpointInfix(
      $name: $breakpoint,
      $breakpoints: $s_gridBreakpoints,
    );

    @each $alignment, $justify in $s_cardTitleJustifyByTextAlign {
      .s_card__title.s_textAlign#{$infix}__#{$alignment} {
        justify-content: $justify;
      }
    }
  }
}
</style>
