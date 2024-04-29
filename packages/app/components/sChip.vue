<template>
  <span :class="classList" @click.stop="click">
    <span class="s_chip__content">
      <slot></slot>
      <slot v-if="closable" name="close" :on="{ close }">
        <SIcon class="s_chip__icon s_chip__icon--close" icon="mdi-close" @click.stop="close"></SIcon>
      </slot>
    </span>
  </span>
</template>
<script setup lang="ts">
import SIcon from '@sui/app/components/sIcon.vue'
import { propsBorder, propsColor, propsDisabled, propsSizePreset } from '@sui/app/props'
import { useBorderService, useColorService, useDisabledService, useSizeService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps({
  ...propsColor(),
  ...propsDisabled(),
  ...propsBorder(),
  ...propsSizePreset(),
  label: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  link: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'click', value: Event): void
}>()

const { classListBorder } = useBorderService(props, { block: 'chip' })

const { classListColor } = useColorService(props, {
  isText: computed(() => !!props.outlined || !!props.underlined),
})

const { classListSize } = useSizeService(props, { block: 'chip' })
const { classListDisabled } = useDisabledService(props)

const classList = computed(() => {
  return {
    s_chip: true,
    's_chip--label': props.label,
    's_chip--link': props.link,
    ...classListBorder.value,
    ...classListColor.value,
    ...classListSize.value,
    ...classListDisabled.value,
  }
})

const close = () => {
  emit('close')
}

const click = (event: Event) => {
  if (props.link) {
    emit('click', event)
  }
}
</script>
<style lang="scss">
@import '@sui/app/styles/components/button';

.s_chip {
  @include s_dark();
  $size: map.get($s_button--sizes, 'default');
  $fontSize: map.get($s_button--fontSizes, 'default');
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  height: #{$size}px;
  padding: 0 calc($s_spacer * 2);
  overflow: hidden;
  font-size: $fontSize;
  line-height: calc($s_spacer * 4);
  text-decoration: none;
  white-space: nowrap;
  vertical-align: middle;
  cursor: default;
  background-color: s_getAppColor('button');
  border-radius: #{calc($size / 2)}px;
  outline: none;
  transition-timing-function: $s_button__transitionTimingFunction;
  transition-duration: $s_button__transitionDuration;
  transition-property: box-shadow, opacity;

  &__icon {
    &--close {
      margin-left: calc($s_spacer * 1.5);
      cursor: pointer;
      border-radius: 100%;
      fill: currentcolor;

      &:hover,
      &:focus,
      &:active {
        opacity: 0.72;
      }
    }
  }

  &::before {
    position: absolute;
    inset: 0;
    color: inherit;
    pointer-events: none;
    content: '';
    background-color: currentcolor;
    border-radius: inherit;
    opacity: 0;
    transition: $s_button__transition;
  }

  @each $name, $size in $s_button--sizes {
    &--size__#{$name} {
      height: #{$size}px;
      border-radius: #{calc($size / 2)}px;

      .s_chip__icon {
        width: #{calc($size / 2.25)}px;
        height: #{calc($size / 2.25)}px;
      }
    }
  }

  @each $name, $size in $s_button--fontSizes {
    &--size__#{$name} {
      font-size: $size;
    }
  }

  &__content {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    height: 100%;
  }

  &--outlined {
    @include s_buttonOutlined();
  }

  &--label {
    @include s_borderRadius();
  }

  &--link {
    cursor: pointer;
    user-select: none;

    &:hover::before {
      opacity: $s_button--hover__opacity;
    }

    &:focus::before {
      opacity: $s_button--focus__opacity;
    }
  }
}
</style>
