<template>
  <Component :is="tagName" :class="classes" :style="styles">
    <div class="s_bottomNavigation__content" :class="contentClasses">
      <slot></slot>
    </div>
  </Component>
</template>

<script setup lang="ts">
import { ProviderPropsName } from '@sui/app/constants'
import { isBrowser } from '@sui/app/lib/browser'
import { getNumericValue } from '@sui/app/lib'
import { propsBottomNavigation } from '@sui/app/props'
import {
  useBorderService,
  useLayoutService,
  useMeasurableStylesService,
  usePositionService,
  useProviderService,
  useScrollableService,
  useSingleGroupService,
  useTagService,
} from '@sui/app/services'
import { type GroupItemValue } from '@sui/app/types'
import { computed, watch, onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  ...propsBottomNavigation(),
})

const emit = defineEmits<(event: 'update:modelValue', value: GroupItemValue | null) => void>()

const canScroll = computed((): boolean => {
  return isBrowser() && (props.hideOnScroll || !props.inputValue)
})

const { isActive } = useScrollableService(
  props,
  ({ isScrollingUp, currentScroll, computedScrollThreshold, currentThreshold }) => {
    if (props.hideOnScroll) {
      const isActiveNewValue = !isScrollingUp || currentScroll > computedScrollThreshold

      emit('update:modelValue', isActiveNewValue)

      return {
        isActive: isActiveNewValue,
      }
    }

    if (currentThreshold < computedScrollThreshold) {
      return {}
    }

    return {
      savedScroll: currentScroll,
    }
  },
  canScroll,
)

const { classListPosition, isAbsolutePosition, isFixedPosition } = usePositionService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListBorder } = useBorderService(props)
const { provideProps } = useProviderService()
const { left, right, width, app } = useLayoutService(props)
const { tagName } = useTagService(props)

useSingleGroupService(props, emit)

provideProps(ProviderPropsName.bottomNavigation, props)

const classes = computed((): object => {
  return {
    ...classListPosition.value,
    ...classListBorder.value,
    s_bottomNavigation: true,
    's_bottomNavigation--absolute': isFixedPosition.value,
    's_bottomNavigation--fixed': isAbsolutePosition.value,
    's_bottomNavigation--horizontal': props.horizontal,
    's_bottomNavigation--shift': props.shift,
    's_bottomNavigation--dense': props.dense,
    's_bottomNavigation--bordered': props.bordered,
    's_bottomNavigation--grow': props.grow,
  }
})

const contentClasses = computed(() => {
  return {
    's_bottomNavigation__content--grow': props.grow,
  }
})

const styles = computed((): object => {
  return {
    ...measurableStyles.value,
    transform: isActive.value ? 'none' : 'translateY(100%)',
    left: left.value,
    right: right.value,
    width: width.value,
  }
})

const updateAppHeight = () => {
  app.value.bottom = getNumericValue(props.height, true, 0)
}

watch(
  () => props.height,
  () => {
    updateAppHeight()
  },
)

onMounted(() => {
  updateAppHeight()
})

onBeforeUnmount(() => {
  app.value.bottom = 0
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/layout';

.s_bottomNavigation {
  @include s_layoutTransition();
  position: relative;
  bottom: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  color: s_getAppColor('text');
  text-align: center;
  background-color: s_getAppColor('card');

  @include s_elevation(4);

  &__content {
    height: 100%;

    &--grow {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-around;
      width: 100%;
    }
  }

  &--shrink {
    display: inline-block;
  }

  &--bordered {
    border: thin s_getAppColor('border') solid;

    .s_bottomNavigation__content {
      margin-top: -1px;
      margin-left: -1px;
    }
  }

  &--fixed,
  &--absolute {
    z-index: 4;
  }

  &--active {
    transform: translate(0, 0);
  }

  // &--grow {
  //   .v-btn
  //   width: 100%
  // }
}

// .v-btn:not(.v-btn--active)
//   color: map-deep-get($material, 'text', 'secondary') !important

// Block
// .v-item-group.v-bottom-navigation
// .v-btn
//   background-color: transparent
//   border-radius: 0
//   box-shadow: none
//   flex: 0 1 auto
//   font-size: $bottom-nav-btn-font-size
//   height: inherit
//   max-width: $bottom-nav-btn-max-width
//   min-width: $bottom-nav-btn-min-width
//   position: relative
//   text-transform: none

//   &:after
//     content: none

//   .v-btn__content
//     flex-direction: column-reverse
//     height: inherit

//     > *:not(.v-icon)
//       line-height: 1.2

//   &.v-btn--active
//     color: inherit

//     &:not(:hover):before
//       opacity: 0

// .v-item-group.v-bottom-navigation--horizontal
//   .v-btn > .v-btn__content
//     flex-direction: row-reverse

//     > .v-icon
//       margin-bottom: 0
//       margin-right: 16px

// .v-item-group.v-bottom-navigation--shift
//   .v-btn .v-btn__content > *:not(.v-icon)
//     opacity: 0
//     position: absolute
//     top: $bottom-nav-shift-btn-top
//     transform: scale(.9)
//     transition: $primary-transition

//   .v-btn--active .v-btn__content
//     > .v-icon
//       transform: translateY(-8px)

//     > *:not(.v-icon)
//       opacity: 1
//       top: $bottom-nav-shift-btn-active-top
//       transform: scale(1)
</style>
