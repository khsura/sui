<template>
  <div :class="classList">
    <div v-if="hasMedia" class="s_emptyState__media">
      <slot name="media">
        <img v-if="props.image" class="s_emptyState__image" :src="props.image" alt="" draggable="false" />
        <SIcon v-else-if="props.icon" class="s_emptyState__icon" :icon="props.icon" :color="props.color"></SIcon>
      </slot>
    </div>
    <div v-if="hasTitle" class="s_emptyState__title">
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div v-if="hasText" class="s_emptyState__text">
      <slot name="text">{{ props.text }}</slot>
    </div>
    <slot></slot>
    <div v-if="hasActions" class="s_emptyState__actions">
      <slot name="actions">
        <SButton color="primary" :size="props.size" @click="onAction">{{ props.actionText }}</SButton>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SButton from '@/app/components/sButton.vue'
import SIcon from '@/app/components/sIcon.vue'
import type { PropsEmptyState } from '@/app/definitions'
import { useComponentDefaultsService, useComponentThemeService, useSizeService } from '@/app/services'

const rawProps = defineProps<PropsEmptyState>()
const props = useComponentDefaultsService('SEmptyState', rawProps)
const { themeClasses } = useComponentThemeService(props)
const { classListSize } = useSizeService(props, { block: 'emptyState' })

const emit = defineEmits<{
  /** The built-in action button (shown when `actionText` is set) was clicked. */
  action: [event: Event]
}>()

const slots = defineSlots<{
  /** Replaces the icon or image, such as an illustration component. Keep it decorative. */
  media?: () => unknown
  /** Replaces the `title` text. */
  title?: () => unknown
  /** Replaces the `text` sentence. */
  text?: () => unknown
  /** Extra content between the text and the actions. */
  default?: () => unknown
  /** Replaces the built-in action button, such as two SButtons or a link. */
  actions?: () => unknown
}>()

const hasMedia = computed(() => !!slots.media || !!props.image || !!props.icon)
const hasTitle = computed(() => !!slots.title || !!props.title)
const hasText = computed(() => !!slots.text || !!props.text)
const hasActions = computed(() => !!slots.actions || !!props.actionText)

const onAction = (event: Event) => {
  emit('action', event)
}

const classList = computed(() => {
  return {
    s_emptyState: true,
    ...themeClasses.value,
    ...classListSize.value,
  }
})
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
// Each map is keyed by the `size` preset; the rules without a size modifier use the 'default' entry.
$s_emptyState--paddings: (
  'mini': calc($s_spacer * 2),
  'small': calc($s_spacer * 4),
  'default': calc($s_spacer * 8),
  'large': calc($s_spacer * 10),
  'extra': calc($s_spacer * 12),
) !default;
$s_emptyState__icon--fontSizes: (
  'mini': 32px,
  'small': 48px,
  'default': 64px,
  'large': 80px,
  'extra': 96px,
) !default;
$s_emptyState__image--widths: (
  'mini': 80px,
  'small': 120px,
  'default': 160px,
  'large': 200px,
  'extra': 240px,
) !default;
$s_emptyState__title--fontSizes: (
  'mini': 0.875rem,
  'small': 1rem,
  'default': 1.25rem,
  'large': 1.5rem,
  'extra': 1.75rem,
) !default;
$s_emptyState__text--fontSizes: (
  'mini': 0.75rem,
  'small': 0.8125rem,
  'default': 0.875rem,
  'large': 1rem,
  'extra': 1.125rem,
) !default;

// The share of the viewport width the padding and the icon may take at most, so they shrink on a phone.
$s_emptyState--paddingViewportMax: 6vw !default;
$s_emptyState__icon--viewportMax: 20vw !default;
$s_emptyState__text--maxWidth: 32rem !default;
$s_emptyState__media--marginBottom: calc($s_spacer * 4) !default;
$s_emptyState__title--marginBottom: calc($s_spacer * 2) !default;
$s_emptyState__actions--marginTop: calc($s_spacer * 6) !default;
$s_emptyState__actions--gap: calc($s_spacer * 2) !default;
$s_emptyState__title--lineHeight: 1.3 !default;
$s_emptyState__text--lineHeight: 1.5 !default;

@mixin s_emptyState--size($name) {
  padding: min(map.get($s_emptyState--paddings, $name), $s_emptyState--paddingViewportMax);

  .s_emptyState__icon.s_icon {
    font-size: min(map.get($s_emptyState__icon--fontSizes, $name), $s_emptyState__icon--viewportMax);
  }

  .s_emptyState__image {
    width: min(map.get($s_emptyState__image--widths, $name), 100%);
  }

  .s_emptyState__title {
    font-size: map.get($s_emptyState__title--fontSizes, $name);
  }

  .s_emptyState__text {
    font-size: map.get($s_emptyState__text--fontSizes, $name);
  }
}

.s_emptyState {
  @include s_dark();
  @include s_emptyState--size('default');
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  color: s_getAppColor('text');
  text-align: center;

  // Long words and URLs wrap instead of pushing the page wider.
  overflow-wrap: anywhere;

  @each $name, $padding in $s_emptyState--paddings {
    &--size__#{$name} {
      @include s_emptyState--size($name);
    }
  }

  &__media {
    display: flex;
    justify-content: center;
    max-width: 100%;
    margin-bottom: $s_emptyState__media--marginBottom;

    // secondaryText, not disabled: a muted icon that still reads as part of the message.
    color: s_getAppColor('secondaryText');
  }

  &__image {
    display: block;
    max-width: 100%;
    height: auto;
  }

  &__title {
    max-width: min($s_emptyState__text--maxWidth, 100%);
    margin-bottom: $s_emptyState__title--marginBottom;
    font-weight: 500;
    line-height: $s_emptyState__title--lineHeight;

    // The root's colour: the app text colour, or the `theme` prop's text colour from s_dark().
    color: inherit;
  }

  &__text {
    max-width: min($s_emptyState__text--maxWidth, 100%);
    line-height: $s_emptyState__text--lineHeight;

    // secondaryText keeps 4.5:1 contrast on the card and background colours in both themes.
    color: s_getAppColor('secondaryText');
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $s_emptyState__actions--gap;
    justify-content: center;
    max-width: 100%;
    margin-top: $s_emptyState__actions--marginTop;
  }

  // With the `theme` prop the muted parts take that theme's secondaryText, not the app's.
  @each $themeName in $s_themeNames {
    &.s_#{$themeName} &__media,
    &.s_#{$themeName} &__text {
      color: s_getThemeColor('secondaryText', $themeName);
    }
  }
}
</style>
