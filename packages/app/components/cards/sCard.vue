<template>
  <Component :is="tag" class="s_card" :class="classes" :style="styles" :href="href" :to="to">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropsCard } from '@/app/definitions'
import {
  useLinkService,
  useBorderService,
  useColorService,
  useElevationService,
  useMeasurableStylesService,
} from '@/app/services'

const props = defineProps<PropsCard>()
const { classListElevation } = useElevationService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListColor, styleListColor } = useColorService(props)
const { classListBorder, styleListBorder } = useBorderService(props)
const { tag, isLink } = useLinkService(props)

const classes = computed(() => {
  return {
    s_linkElement: isLink.value,
    ...classListElevation.value,
    ...classListColor.value,
    ...classListBorder.value,
  }
})

const styles = computed(() => {
  return {
    ...measurableStyles.value,
    ...styleListColor.value,
    ...styleListBorder.value,
  }
})
</script>

<style lang="scss">
.s_app {
  .s_card {
    @include s_dark();
  }
}

.s_card {
  @include s_elevation(0);
  @include s_dark();
  position: relative;
  display: block;
  width: 100%;
  overflow-wrap: break-word;
  white-space: normal;
  text-decoration: none;
  outline: none;
  background-color: s_getAppColor('card');
  border-radius: $s_borderRadius;
  transition-property: box-shadow, opacity;

  /* stylelint-disable-next-line no-descending-specificity */
  .s_card__subtitle + .s_card__text {
    padding-top: $s_cardAdjucentSibling--textPadding__top;
  }

  .s_card__title {
    + .s_card__subtitle {
      padding-top: $s_cardAdjucentSibling--textPadding__top;
      margin-top: $s_cardTitleAdjacentSibling--subtitleMargin__top;

      /* stylelint-disable-next-line selector-max-compound-selectors */
      + .s_card__text {
        padding-top: $s_cardAdjucentSibling--textPadding__top;
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    + .s_card__text {
      padding-top: $s_cardAdjucentSibling--textPadding__top;
    }
  }
}
</style>
