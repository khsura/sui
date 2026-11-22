<template>
  <div
    :class="classList"
    :style="styleList"
    :role="isSkeletonShown ? 'status' : undefined"
    :aria-busy="isSkeletonShown ? 'true' : undefined"
    :aria-label="isSkeletonShown ? props.loadingText : undefined"
  >
    <div v-if="isSkeletonShown" class="s_skeletonLoader__bones" aria-hidden="true">
      <!-- The presets nest at most three levels (table → row → cell); a unit test guards that limit. -->
      <div v-for="node in nodes" :key="node.key" :class="getSkeletonLoaderNodeClass(node)">
        <div v-for="child in node.children" :key="child.key" :class="getSkeletonLoaderNodeClass(child)">
          <div
            v-for="grandchild in child.children"
            :key="grandchild.key"
            :class="getSkeletonLoaderNodeClass(grandchild)"
          ></div>
        </div>
      </div>
    </div>
    <slot v-else></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { skeletonLoaderDefaultType } from '@/app/constants'
import { getCleanSetObject } from '@/app/lib'
import type { PropsSkeletonLoader } from '@/app/definitions'
import {
  getSkeletonLoaderNodeClass,
  useComponentDefaultsService,
  useComponentThemeService,
  useMeasurableStylesService,
  useSkeletonLoaderService,
} from '@/app/services'

const rawProps = withDefaults(defineProps<PropsSkeletonLoader>(), {
  // Literals, so sui-api.json shows the real defaults.
  type: 'text',
  loading: false,
  boilerplate: false,
  loadingText: 'Loading…',
})

const props = useComponentDefaultsService('SSkeletonLoader', rawProps)

const slots = defineSlots<{
  /** The real content, shown once `loading` is `false`. */
  default?: () => void
}>()

const { themeClasses } = useComponentThemeService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { nodes } = useSkeletonLoaderService(() => props.type ?? skeletonLoaderDefaultType)
// Without content to swap in, the skeleton is all there is to show.
const isSkeletonShown = computed(() => !!props.loading || !slots.default)

const classList = computed(() => {
  return {
    s_skeletonLoader: true,
    's_skeletonLoader--loading': isSkeletonShown.value,
    's_skeletonLoader--boilerplate': !!props.boilerplate,
    ...themeClasses.value,
  }
})

const styleList = computed(() => {
  return getCleanSetObject({
    ...measurableStyles.value,
  })
})
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
// Bones are tinted from the text colour, so they follow the light and dark theme (and the `theme` prop) by themselves.
// The avatar is 40px, the standard SAvatar size; the list items and table rows match SListItem's and STable's
// heights. Swapping the skeleton for the real content then does not move the layout.
$s_skeletonLoader__boneTint: 12% !default;
$s_skeletonLoader__shimmerTint: 10% !default;
$s_skeletonLoader__shimmerDuration: 1.5s !default;
$s_skeletonLoader__borderRadius: $s_borderRadius !default;
$s_skeletonLoader__gap: calc($s_spacer * 2) !default;
$s_skeletonLoader__padding: calc($s_spacer * 4) !default;
$s_skeletonLoader__text--height: calc($s_spacer * 3) !default;
$s_skeletonLoader__text--lastWidth: 70% !default;
$s_skeletonLoader__heading--height: calc($s_spacer * 6) !default;
$s_skeletonLoader__heading--width: 50% !default;
$s_skeletonLoader__avatar--size: calc($s_spacer * 10) !default;
$s_skeletonLoader__button--height: #{map.get($s_button--sizes, 'default')}px !default;
$s_skeletonLoader__button--width: calc($s_spacer * 22) !default;
$s_skeletonLoader__image--height: calc($s_spacer * 50) !default;
$s_skeletonLoader__listItem--minHeight: calc($s_spacer * 12) !default;
$s_skeletonLoader__listItemAvatar--minHeight: calc($s_spacer * 14) !default;
$s_skeletonLoader__tableRow--height: calc($s_spacer * 12) !default;

@keyframes s-skeleton-loader-shimmer {
  100% {
    transform: translateX(100%);
  }
}

.s_skeletonLoader {
  @include s_dark($fillBackground: false);
  position: relative;

  // Full width by default, so 100%-wide bones do not collapse inside a flex row or an inline-block parent.
  width: 100%;
  min-width: 0;
  max-width: 100%;
  color: s_getAppColor('text');

  &__bones {
    display: flex;
    flex-direction: column;
    gap: $s_skeletonLoader__gap;
  }

  &__bone {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    background-color: color-mix(in srgb, currentcolor $s_skeletonLoader__boneTint, transparent);
    border-radius: $s_skeletonLoader__borderRadius;

    &::after {
      position: absolute;
      inset: 0;
      content: '';
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, currentcolor $s_skeletonLoader__shimmerTint, transparent),
        transparent
      );
      transform: translateX(-100%);
      animation: s-skeleton-loader-shimmer $s_skeletonLoader__shimmerDuration ease-in-out infinite;
    }
  }

  &--boilerplate &__bone::after {
    content: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &__bone::after {
      content: none;
    }
  }

  &__text {
    width: 100%;
    height: $s_skeletonLoader__text--height;
    border-radius: calc($s_skeletonLoader__text--height / 2);

    // The last line of a paragraph is shorter, as real text usually is.
    &:not(:first-child):last-child {
      width: $s_skeletonLoader__text--lastWidth;
    }
  }

  &__heading {
    width: $s_skeletonLoader__heading--width;
    height: $s_skeletonLoader__heading--height;
  }

  &__avatar {
    width: $s_skeletonLoader__avatar--size;
    height: $s_skeletonLoader__avatar--size;
    border-radius: 50%;
  }

  &__button {
    width: $s_skeletonLoader__button--width;
    max-width: 100%;
    height: $s_skeletonLoader__button--height;
  }

  &__image {
    width: 100%;
    height: $s_skeletonLoader__image--height;
  }

  &__listItem {
    display: flex;
    align-items: center;
    min-height: $s_skeletonLoader__listItem--minHeight;
    padding-inline: $s_skeletonLoader__padding;
  }

  &__listItemAvatar {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: $s_skeletonLoader__gap $s_skeletonLoader__padding;
    align-content: center;
    min-height: $s_skeletonLoader__listItemAvatar--minHeight;
    padding-inline: $s_skeletonLoader__padding;

    > .s_skeletonLoader__avatar {
      grid-row: 1 / span 2;
      align-self: center;
    }
  }

  &__tableRow {
    display: flex;
    gap: $s_skeletonLoader__padding;
    align-items: center;
    height: $s_skeletonLoader__tableRow--height;
    padding-inline: $s_skeletonLoader__padding;
    border-bottom: thin solid color-mix(in srgb, currentcolor $s_skeletonLoader__boneTint, transparent);

    > .s_skeletonLoader__text {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: $s_skeletonLoader__gap;
    padding-bottom: $s_skeletonLoader__padding;
    overflow: hidden;
    border-radius: $s_skeletonLoader__borderRadius;

    > :not(.s_skeletonLoader__image) {
      margin-inline: $s_skeletonLoader__padding;
    }

    > .s_skeletonLoader__image {
      border-radius: 0;
    }

    > .s_skeletonLoader__heading {
      margin-top: $s_skeletonLoader__gap;
    }

    > .s_skeletonLoader__text {
      width: calc(100% - 2 * $s_skeletonLoader__padding);
    }

    > .s_skeletonLoader__text:not(:first-child):last-child {
      width: calc(($s_skeletonLoader__text--lastWidth) - 2 * $s_skeletonLoader__padding);
    }
  }

  &__table {
    display: flex;
    flex-direction: column;
  }
}
</style>
