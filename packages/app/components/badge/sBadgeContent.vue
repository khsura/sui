<template>
  <Transition :name="transitionName || ''">
    <span v-if="value && !contentChanged" class="s_badgeContent">
      <span
        :aria-atomic="true"
        :aria-label="label ?? ''"
        aria-live="polite"
        role="status"
        :class="classes"
        :style="styles"
      >
        <slot v-if="$slots.badge" name="badge"></slot>
        <SIcon v-else-if="!dot && icon" :icon="icon"></SIcon>
        <span v-else-if="!dot && content">{{ content }}</span>
      </span>
    </span>
  </Transition>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import SIcon from '@khsura/sui/components/sIcon.vue'
import { type PropsBadge } from '@khsura/sui/definitions'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { useColorService } from '@khsura/sui/services'

// eslint-disable-next-line vue/no-unused-properties
const props = defineProps<PropsBadge>()
const contentChanged = ref(false)
const { classListColor, styleListColor } = useColorService(props)

const classes = computed(() => ({
  s_badgeContent__badge: true,
  's_badgeContent__badge--dot': props.dot,
  's_badgeContent__badge--tile': props.tile,
  ...classListColor.value,
}))

const positionSpacer = computed(() => {
  if (props.dot && props.overlap) {
    return '8px'
  }

  if (props.dot) {
    return '2px'
  }

  if (props.overlap) {
    return '12px'
  }

  return '4px'
})

const position = computed(() => {
  if (props.inline) {
    return null
  }

  const spacer = `calc(100% - ${positionSpacer.value})`
  const offsetX = getNumericCssAttribute(props.offsetX)
  const offsetY = getNumericCssAttribute(props.offsetY)
  const x = offsetX ? `calc(100% - ${offsetX})` : spacer
  const y = offsetY ? `calc(100% - ${offsetY})` : spacer

  if (props.left && props.bottom) {
    return {
      top: y,
      right: x,
      bottom: 'auto',
      left: 'auto',
    }
  }

  if (props.bottom) {
    return {
      top: y,
      right: 'auto',
      bottom: 'auto',
      left: x,
    }
  }

  if (props.left) {
    return {
      top: 'auto',
      right: x,
      bottom: y,
      left: 'auto',
    }
  }

  return {
    top: 'auto',
    right: 'auto',
    bottom: y,
    left: x,
  }
})

const styles = computed(() => {
  return {
    ...(position.value
      ? {
          // trick for browser avoiding auto set to inset which is unsupported in safari
          top: `${position.value.top} !important`,
          right: position.value.right,
          bottom: position.value.bottom,
          left: position.value.left,
        }
      : {}),
    ...styleListColor.value,
  }
})

watch(
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  () => !props.dot && (props.content || props.icon),
  async () => {
    contentChanged.value = true
    await nextTick()
    contentChanged.value = false
  },
)
</script>
<style lang="scss">
.s_badgeContent {
  position: absolute;
  top: 0;
  left: 0;
  flex: 0 1;
  width: 100%;
  height: 100%;
  pointer-events: none;

  &__badge {
    position: absolute;
    top: auto;
    display: inline-block;
    min-width: 20px;
    height: 20px;
    padding: 4px 6px;
    font-size: 12px;
    line-height: 1;
    color: #ffffff;
    text-align: center;
    text-indent: 0;
    letter-spacing: 0;
    white-space: nowrap;
    pointer-events: auto;
    background-color: s_getPresetColor('primary');
    border-radius: 10px;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);

    .s_icon {
      width: 12px;
      height: 12px;
      margin: 0 -2px;
      font-size: 12px;
      color: inherit;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    &--dot {
      width: 9px;
      min-width: 0;
      height: 9px;
      padding: 0;
      border-radius: 4.5px;
    }

    &--tile {
      border-radius: 0;
    }
  }
}

.s_badge--inline {
  .s_badgeContent {
    position: relative;
    margin: 0 4px;
  }

  .s_badgeContent__badge {
    position: relative;
  }
}
</style>
