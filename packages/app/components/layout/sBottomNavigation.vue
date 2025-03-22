<template>
  <component :is="tagName" :class="classes" :style="styles">
    <div class="s_bottomNavigation__content" :class="contentClasses">
      <slot></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { getCleanSetObject, getNumericValue } from '@khsura/sui/lib'
import { isBrowser } from '@khsura/sui/lib/browser'
import { propsBottomNavigation } from '@khsura/sui/props'
import {
  useBorderService,
  useLayoutService,
  useMeasurableStylesService,
  usePositionService,
  useProviderService,
  useScrollableService,
  useSingleGroupService,
  useTagService,
} from '@khsura/sui/services'
import { type GroupItemValue } from '@khsura/sui/types'

const props = defineProps({
  ...propsBottomNavigation(),
})

const model = defineModel<GroupItemValue>()

const canScroll = computed((): boolean => {
  return isBrowser() && (props.hideOnScroll || !props.inputValue)
})

const { isActive } = useScrollableService(
  props,
  ({ isScrollingUp, currentScroll, computedScrollThreshold, currentThreshold }) => {
    if (props.hideOnScroll) {
      const isActiveNewValue = !isScrollingUp || currentScroll > computedScrollThreshold

      model.value = isActiveNewValue

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
const { left, right, width, app, isApp } = useLayoutService(props)
const { tagName } = useTagService(props)

useSingleGroupService(props, model)

provideProps(ProviderPropsName.bottomNavigation, props)

const classes = computed((): object => {
  return getCleanSetObject({
    ...classListPosition.value,
    ...classListBorder.value,
    s_bottomNavigation: true,
    's_bottomNavigation--absolute': !isApp.value && isAbsolutePosition.value,
    's_bottomNavigation--fixed': isApp.value || isFixedPosition.value,
    's_bottomNavigation--horizontal': props.horizontal,
    's_bottomNavigation--shift': props.shift,
    's_bottomNavigation--dense': props.dense,
    's_bottomNavigation--bordered': props.bordered,
    's_bottomNavigation--grow': props.grow,
  })
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
  app.value.bottomNavigationHeight = getNumericValue(props.height, { defaultValue: 0 })
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
  app.value.bottomNavigationHeight = 0
})
</script>

<style lang="scss">
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
