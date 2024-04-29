<template>
  <SWindow
    ref="windowRef"
    v-model="model"
    :class="{
      s_carousel: true,
      's_carousel--hideDelimiterBackground': hideDelimiterBackground,
      's_carousel--verticalDelimiters': verticalDelimiters,
    }"
    :style="{ height: getNumericCssAttribute(height) }"
    continuous
    mandatory
    :no-animation="noAnimation"
    :touch="touch"
    :selected-class="selectedClass"
    :tag="tag"
    :height="height"
    :hide-arrows="hideArrows"
    :prev-icon="prevIcon"
    :next-icon="nextIcon"
  >
    <template #default="{ items, selected, select }">
      <slot></slot>
      <div v-if="!hideDelimiters" class="s_carousel__controls" :style="styleList">
        <SButton
          v-for="(item, id) in items"
          :key="id"
          variant="icon"
          size="small"
          :class="{
            s_carousel__controls__item: true,
            's_carousel__controls__item--active': item.value === selected.value,
          }"
          @click="select({ value: item.value })"
        >
          <SIcon :color="item.value === selected.value ? color : null" :icon="delimiterIcon" size="mini"></SIcon>
        </SButton>
      </div>
    </template>
  </SWindow>
</template>
<script setup lang="ts">
import SButton from '@sui/app/components/sButton.vue'
import SIcon from '@sui/app/components/sIcon.vue'
import { SWindow } from '@sui/app/components/window'
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsCarousel } from '@sui/app/props'
import { type GroupItemValue } from '@sui/app/types'
import { ref, computed, watch, onMounted } from 'vue'

const styleList = computed(() => {
  return {
    left: props.verticalDelimiters === 'left' && props.verticalDelimiters ? 0 : 'auto',
    right: props.verticalDelimiters === 'right' ? 0 : 'auto',
    'background-color': props.controlsBackgroundColor,
  }
})

const props = defineProps(propsCarousel())
const model = defineModel<GroupItemValue | null>()
const windowRef = ref<typeof SWindow | null>()
let slideTimeout = -1

watch(model, restartTimeout)

watch(() => props.interval, restartTimeout)

watch(
  () => props.cycle,
  (val) => {
    if (val) {
      restartTimeout()
    } else {
      window.clearTimeout(slideTimeout)
    }
  },
)

function startTimeout() {
  if (!props.cycle || !windowRef.value) {
    return
  }

  window.clearTimeout(slideTimeout)
  slideTimeout = window.setTimeout(() => {
    startTimeout()
    windowRef.value?.goNext()
  }, props.interval)
}

function restartTimeout() {
  window.clearTimeout(slideTimeout)
  slideTimeout = window.setTimeout(startTimeout, props.interval)
}

onMounted(startTimeout)
</script>

<style lang="scss">
$s_carouselControlsSize: 50px !default;
$s_carouselDotMargin: 0 8px !default;
$s_carouselDotInactiveOpacity: 0.5 !default;
$s_carouselDotActiveOpacity: 1 !default;
$s_carouselDotHoverOpacity: 0.8 !default;

.s_carousel {
  position: relative;
  width: 100%;
  overflow: hidden;

  &__controls {
    position: absolute;
    bottom: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: $s_carouselControlsSize;
    list-style-type: none;

    > .s_singleItemGroup {
      flex: 0 1 auto;
    }

    &__item {
      margin: $s_carouselDotMargin;

      .s_icon {
        color: s_getAppColor('card');
        filter: drop-shadow(2px 2px 6px #000000ff);
        opacity: $s_carouselDotInactiveOpacity;
        fill: s_getAppColor('card');
      }

      &--active {
        .s_icon {
          vertical-align: middle;
          opacity: $s_carouselDotActiveOpacity;
        }
      }

      &:hover {
        background: none;

        .s_icon {
          opacity: $s_carouselDotHoverOpacity;
        }
      }
    }
  }

  &--hideDelimiterBackground {
    .s_carousel__controls {
      background-color: unset;
    }
  }
}
</style>
