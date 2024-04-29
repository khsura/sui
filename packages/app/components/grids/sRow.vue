<template>
  <section :class="classes">
    <div class="s_row__content" :class="contentClasses" :style="contentStyles">
      <slot></slot>
    </div>
  </section>
</template>
<script setup lang="ts">
import { gridAlignProperties, gridJustifyProperties } from '@sui/app/configs'
import { propsContent } from '@sui/app/props'
import { useContentService } from '@sui/app/services'
import { type GridAlignPropertyType, type GridJustifyPropertyType } from '@sui/app/types'
import { computed } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  noGutters: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String as PropType<GridAlignPropertyType | null>,
    default: null,
    validator: (v: GridAlignPropertyType | null) => {
      return !v || gridAlignProperties.includes(v)
    },
  },
  justify: {
    type: String as PropType<GridJustifyPropertyType | null>,
    default: null,
    validator: (v: GridJustifyPropertyType | null) => {
      return !v || gridJustifyProperties.includes(v)
    },
  },
  fillHeight: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  ...propsContent(),
})

const content = useContentService(props)

const classes = computed(() => {
  return {
    s_row: true,
    's_row--noGutters': props.noGutters,
    's_row--dense': props.dense,
    's_row--fillHeight': props.fillHeight,
  }
})

const contentClasses = computed(() => {
  return {
    's_row__content--noGutters': props.noGutters,
    's_row__content--dense': props.dense,
    [`s_align__${props.align}`]: !!props.align,
    [`s_justify__${props.justify}`]: !!props.justify,
    ...content.classes.value,
  }
})

const contentStyles = computed(() => {
  return {
    ...content.styles.value,
  }
})
</script>
<style lang="scss">
/* stylelint-disable-next-line scss/map-keys-quotes */
$s_row--paddings: (
  null: calc($s_gridGutter / 2),
  'dense': calc($s_form--gridGutter / 2),
  'noGutters': 0,
);

/* stylelint-disable-next-line scss/map-keys-quotes */
$s_column--paddings: (
  null: calc($s_gridGutter / 2),
  'dense': calc($s_form--gridGutter / 2),
  'noGutters': 0,
);

@mixin s_makeRowPadding($padding: null) {
  padding: map-get($s_row--paddings, $padding);
}

@mixin s_makeRowContentPadding($padding: null) {
  > .s_column {
    padding: map-get($s_column--paddings, $padding);
  }
}

.s_row {
  display: flex;
  width: 100%;

  &__content {
    display: flex;
    flex: 1 1 auto;
    flex-wrap: wrap;
    width: 100%;

    &--dense {
      @include s_makeRowContentPadding('dense');
    }

    &--noGutters {
      @include s_makeRowContentPadding('noGutters');
    }
  }

  @include s_makeRowPadding();

  &--dense {
    @include s_makeRowPadding('dense');
  }

  &--noGutters {
    @include s_makeRowPadding('noGutters');
  }

  &--fillHeight {
    height: 100%;
  }
}
</style>
