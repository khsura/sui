<template>
  <div :class="classList" :style="styleList" role="group">
    <Component :is="avatarNode" v-for="(avatarNode, index) in getVisibleAvatars()" :key="avatarNode.key ?? index" />
    <template v-if="getHiddenCount() > 0">
      <slot name="more" :count="getHiddenCount()">
        <SAvatar
          class="s_avatarGroup__more"
          :color="props.color"
          :color-threshold="props.colorThreshold"
          :theme="props.theme"
          :text="`+${getHiddenCount()}`"
          :alt="getMoreLabel(getHiddenCount())"
        ></SAvatar>
      </slot>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, provide, useSlots } from 'vue'
import SAvatar from './sAvatar.vue'
import { ProviderPropsName } from '@/app/configs'
import { AVATAR_GROUP_COUNT_PLACEHOLDER, AVATAR_GROUP_MORE_LABEL } from '@/app/constants'
import { flattenVNodes, getCleanSetObject, getNumericCssAttribute } from '@/app/lib'
import type { PropsAvatarGroup } from '@/app/definitions'
import { useComponentDefaultsService, useSizeService } from '@/app/services'

const rawProps = defineProps<PropsAvatarGroup>()
const props = useComponentDefaultsService('SAvatarGroup', rawProps)

provide(ProviderPropsName.avatarGroupProps, props)

const { classListSize, isPresetSize } = useSizeService(props, { block: 'avatarGroup' })

const classList = computed(() => {
  return {
    s_avatarGroup: true,
    ...classListSize.value,
  }
})

// The group's avatar size sets its overlap, so a wrapped line starts flush with the first one.
const styleList = computed(() => {
  return getCleanSetObject({
    '--s-avatar-size': isPresetSize.value ? undefined : getNumericCssAttribute(props.size),
  })
})

defineSlots<{
  default: () => void
  more: (props: { count: number }) => void
}>()

const slots = useSlots()
const getAvatars = () => flattenVNodes(slots.default?.())

const getLimit = () => {
  const avatarCount = getAvatars().length

  if (props.max === undefined || props.max < 0 || props.max >= avatarCount) {
    return avatarCount
  }

  return Math.floor(props.max)
}

const getVisibleAvatars = () => getAvatars().slice(0, getLimit())
const getHiddenCount = () => getAvatars().length - getLimit()

const getMoreLabel = (count: number) => {
  return (props.moreLabel ?? AVATAR_GROUP_MORE_LABEL).replace(AVATAR_GROUP_COUNT_PLACEHOLDER, String(count))
}
</script>
<style lang="scss">
$s_avatarGroup__ringWidth: 2px !default;

.s_avatarGroup {
  --s-avatar-size: #{map.get($s_avatar--sizes, 'default')};
  display: inline-flex;
  flex-wrap: wrap;
  row-gap: $s_avatarGroup__ringWidth * 2;
  align-items: center;
  max-width: 100%;

  // Every avatar, the first of each wrapped line included, slides left by the overlap; the padding takes it back.
  padding-left: calc(var(--s-avatar-size) * #{$s_avatarGroup__overlapRatio});
  vertical-align: middle;

  @each $name, $size in $s_avatar--sizes {
    &--size__#{$name} {
      --s-avatar-size: #{$size};
    }
  }

  > .s_avatar {
    margin-left: calc(var(--s-avatar-size) * -#{$s_avatarGroup__overlapRatio});
    box-shadow: 0 0 0 $s_avatarGroup__ringWidth s_getAppColor('card');
  }
}
</style>
