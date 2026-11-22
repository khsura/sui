<template>
  <div :class="classList" :style="styleList" :role="props.alt ? 'img' : undefined" :aria-label="props.alt || undefined">
    <slot>
      <img
        v-if="isImageShown"
        class="s_avatar__image"
        :src="props.image"
        alt=""
        draggable="false"
        @error="onImageError"
      />
      <span v-else-if="props.text" class="s_avatar__text">{{ props.text }}</span>
      <SIcon v-else class="s_avatar__icon" :icon="props.icon ?? AVATAR_DEFAULT_ICON"></SIcon>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, reactive, ref, watch } from 'vue'
import SIcon from '@/app/components/sIcon.vue'
import { ProviderPropsName } from '@/app/configs'
import { AVATAR_DEFAULT_ICON } from '@/app/constants'
import { getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import type { PropsAvatar } from '@/app/definitions'
import { useBorderService, useColorService, useComponentDefaultsService, useSizeService } from '@/app/services'

const rawProps = defineProps<PropsAvatar>()
const props = useComponentDefaultsService('SAvatar', rawProps)
const groupProps = inject(ProviderPropsName.avatarGroupProps, null)
// An avatar inside an SAvatarGroup takes the group's size unless it sets its own.
const sizeProps = reactive({ size: computed(() => props.size ?? groupProps?.size) })

const { classListColor, styleListColor } = useColorService(props, {
  isText: computed(() => !!props.outlined),
})

const { classListSize, isPresetSize } = useSizeService(sizeProps, { block: 'avatar' })
const { classListBorder, styleListBorder } = useBorderService(props, { block: 'avatar' })
const hasImageError = ref(false)

watch(
  () => props.image,
  () => {
    hasImageError.value = false
  },
)

const isImageShown = computed(() => !!props.image && !hasImageError.value)

const onImageError = () => {
  hasImageError.value = true
}

const classList = computed(() => {
  return {
    s_avatar: true,
    ...classListColor.value,
    ...classListSize.value,
    ...classListBorder.value,
  }
})

const styleList = computed(() => {
  return getCleanSetObject({
    ...styleListColor.value,
    ...styleListBorder.value,
    '--s-avatar-size': isPresetSize.value ? undefined : getNumericCssAttribute(sizeProps.size),
  })
})

defineSlots<{
  default: () => void
}>()
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
$s_avatar--sizes: () !default;
$s_avatar--sizes: map.merge(
  (
    'mini': 24px,
    'small': 32px,
    'default': 40px,
    'large': 48px,
    'extra': 56px,
  ),
  $s_avatar--sizes
);
$s_avatar__fontRatio: 0.4 !default;
$s_avatar__iconRatio: 0.6 !default;
$s_avatar__fontWeight: 500 !default;
$s_avatar__borderWidth: thin !default;

// The gap, in px, between an avatar and the edge of a chip around it (unitless like $s_button--sizes).
$s_avatar__chipInset: 4 !default;
$s_avatar__listItemGap: calc($s_spacer * 4) !default;
$s_avatar__cardTitleGap: calc($s_spacer * 3) !default;

.s_avatar {
  @include s_dark($fillBackground: false);

  --s-avatar-size: #{map.get($s_avatar--sizes, 'default')};
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--s-avatar-size);
  height: var(--s-avatar-size);
  overflow: hidden;
  font-size: calc(var(--s-avatar-size) * #{$s_avatar__fontRatio});
  font-weight: $s_avatar__fontWeight;
  line-height: 1;
  vertical-align: middle;
  color: s_getAppColor('text');
  text-transform: uppercase;
  letter-spacing: normal;
  white-space: nowrap;
  user-select: none;
  background-color: s_getAppColor('button');
  border-radius: 50%;

  @each $name, $size in $s_avatar--sizes {
    &--size__#{$name} {
      --s-avatar-size: #{$size};
    }
  }

  &--tile {
    border-radius: 0;
  }

  &--rounded {
    @include s_borderRadius();
  }

  &--outlined {
    background-color: transparent;
    border: $s_avatar__borderWidth solid currentcolor;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__text {
    max-width: 100%;
    overflow: hidden;
    text-overflow: clip;
  }

  .s_icon.s_avatar__icon {
    width: auto;
    height: auto;
    font-size: calc(var(--s-avatar-size) * #{$s_avatar__iconRatio});
    color: inherit;
  }
}

// Avatar as the leading item of a list item, a chip or a card title.
.s_listItem > .s_avatar {
  margin-right: $s_avatar__listItemGap;
}

.s_card__title > .s_avatar {
  margin-right: $s_avatar__cardTitleGap;
}

.s_chip .s_avatar {
  --s-avatar-size: #{map.get($s_button--sizes, 'default') - 2 * $s_avatar__chipInset}px;
  margin-right: $s_spacer;
  margin-left: calc(#{$s_avatar__chipInset}px - #{$s_spacer * 2});
}

@each $name, $size in $s_button--sizes {
  .s_chip--size__#{$name} .s_avatar {
    --s-avatar-size: #{$size - 2 * $s_avatar__chipInset}px;
  }
}
</style>
