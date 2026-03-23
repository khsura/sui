<template>
  <section :class="classes">
    <div class="s_row__content" :class="contentClasses" :style="contentStyles">
      <slot></slot>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { type CSSProperties, computed } from 'vue'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import { useContentService } from '@/app/services'
import { type PropsRow } from '@/app/definitions'

const props = defineProps<PropsRow>()
const content = useContentService(props)

const classes = computed(() => {
  return getCleanSetObject({
    s_row: true,
    's_row--noGutters': props.noGutters,
    's_row--noOuterGutters': props.noOuterGutters,
    's_row--dense': props.dense,
    's_row--fillHeight': props.fillHeight,
  })
})

const contentClasses = computed(() => {
  return getCleanSetObject({
    's_row__content--noGutters': !!props.gap || !!props.noGutters,
    's_row__content--dense': !props.gap && props.dense,
    [`s_align__${props.align}`]: !!props.align,
    [`s_justify__${props.justify}`]: !!props.justify,
    ...content.classes.value,
  })
})

const contentStyles = computed<CSSProperties>(() => {
  const gap = getNumericCssAttribute(props.gap)

  return getCleanSetObject({
    ...content.styles.value,
    gap,
    '--s-row-gap': gap,
  })
})
</script>

<style lang="scss">
$s_row--paddings: (
  'default': calc($s_gridGutter / 2),
  'dense': calc($s_form--gridGutter / 2),
  'noGutters': 0,
);
$s_column--paddings: (
  'default': calc($s_gridGutter / 2),
  'dense': calc($s_form--gridGutter / 2),
  'noGutters': 0,
);

@mixin s_makeRowPadding($padding: 'default') {
  padding: map.get($s_row--paddings, $padding);
}

@mixin s_makeRowContentPadding($padding: 'default') {
  > .s_column {
    padding: map.get($s_column--paddings, $padding);
  }
}

.s_row {
  @include s_makeRowPadding('default');
  display: flex;
  width: 100%;

  &--dense {
    @include s_makeRowPadding('dense');
  }

  &--noGutters {
    @include s_makeRowPadding('noGutters');
  }

  &--fillHeight {
    height: 100%;
  }

  &__content {
    @include s_makeRowContentPadding('default');
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

  &--noOuterGutters {
    padding: 0;
  }
}
</style>
