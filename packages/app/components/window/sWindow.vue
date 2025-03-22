<template>
  <Component :is="tagName" :class="classes" :styles="styles">
    <div class="s_window__container">
      <slot :items="items" :selected="selected" :select="select"></slot>
    </div>
    <div class="s_window__controls">
      <template v-if="canMoveBack">
        <slot v-if="$slots.prev" name="prev" :icon="prevIcon" :click="goPrev" :disabled="disabled"></slot>
        <SButton
          v-else
          variant="icon"
          class="s_window__left"
          aria-label="previous"
          :disabled="disabled"
          @click="goPrev"
        >
          <SIcon :icon="prevIcon" size="large"></SIcon>
        </SButton>
      </template>
      <template v-if="canMoveForward">
        <slot v-if="$slots.next" name="next" :icon="nextIcon" :click="goNext"></slot>
        <SButton
          v-else
          variant="icon"
          class="s_window__right"
          aria-label="previous"
          :disabled="disabled"
          @click="goNext"
        >
          <SIcon :icon="nextIcon" size="large"></SIcon>
        </SButton>
      </template>
    </div>
  </Component>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SButton from '@khsura/sui/components/sButton.vue'
import SIcon from '@khsura/sui/components/sIcon.vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { propsWindow } from '@khsura/sui/props'
import {
  useColorService,
  useProviderService,
  useSingleGroupService,
  useTagService,
  useTouchService,
} from '@khsura/sui/services'
import { type GroupItemValue } from '@khsura/sui/types'

const props = defineProps({
  ...propsWindow(),
})

const model = defineModel<GroupItemValue>()
const { classListColor, styleListColor } = useColorService(props)
const { provideProps } = useProviderService()
const { tagName } = useTagService(props)

provideProps(ProviderPropsName.window, props)
// TODO (Sura) Improve

useTouchService(
  props.touch === true
    ? {
        left: () => {
          next()
        },
        right: () => {
          prev()
        },
        start: (event) => {
          event.stopPropagation()
        },
      }
    : props.touch === false
      ? undefined
      : props.touch,
)
const {
  canMoveBack,
  canMoveForward,
  prev,
  next,
  items,
  selected,
  init,
  select: selectItem,
} = useSingleGroupService(props, model)

const goPrev = () => {
  prev()
}

const goNext = () => {
  next()
}

const select = (...params: Parameters<typeof selectItem>) => {
  selectItem(...params)
}

const classes = computed(() => {
  return {
    ...classListColor.value,
    s_window: true,
    's_window--hideArrows': props.hideArrows,
    's_window--disabled': props.disabled,
  }
})

const styles = computed(() => {
  return {
    ...styleListColor.value,
  }
})

onMounted(() => {
  init(true)
})

defineExpose({
  goNext,
  goPrev,
})
</script>

<style lang="scss">
.s_window {
  overflow: hidden;

  &__container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: inherit;
  }

  &__controls {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: $s_windowControlsPadding;
    pointer-events: none;
  }

  &__left,
  &__right {
    color: s_getAppColor('card');
    filter: drop-shadow(2px 2px 6px #000000bf);
    fill: s_getAppColor('card');
  }

  * {
    pointer-events: auto;
  }

  &--hideArrows {
    .s_window__controls {
      display: none;
    }
  }
}
</style>
