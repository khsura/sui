<template>
  <div class="s_avatarGroup" role="group">
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
import { provide, useSlots } from 'vue'
import SAvatar from './sAvatar.vue'
import { ProviderPropsName } from '@/app/configs'
import { AVATAR_GROUP_COUNT_PLACEHOLDER, AVATAR_GROUP_MORE_LABEL } from '@/app/constants'
import { flattenVNodes } from '@/app/lib'
import type { PropsAvatarGroup } from '@/app/definitions'
import { useComponentDefaultsService } from '@/app/services'

const rawProps = defineProps<PropsAvatarGroup>()
const props = useComponentDefaultsService('SAvatarGroup', rawProps)

provide(ProviderPropsName.avatarGroupProps, props)

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
// How far each avatar slides under the one before it, as a share of the avatar size.
$s_avatarGroup__overlapRatio: 0.25 !default;
$s_avatarGroup__ringWidth: 2px !default;

.s_avatarGroup {
  display: inline-flex;
  flex-wrap: wrap;
  row-gap: $s_avatarGroup__ringWidth * 2;
  align-items: center;
  max-width: 100%;
  vertical-align: middle;

  > .s_avatar {
    box-shadow: 0 0 0 $s_avatarGroup__ringWidth s_getAppColor('card');
  }

  > .s_avatar:not(:first-child) {
    margin-left: calc(var(--s_avatar--size) * -#{$s_avatarGroup__overlapRatio});
  }
}
</style>
