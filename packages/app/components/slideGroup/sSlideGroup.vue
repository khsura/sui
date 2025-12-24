<template>
  <section class="s_slideGroup">
    <div v-if="isNavigatorVisible" class="s_slideGroup__navigator">
      <slot name="left" :attrs="{ disabled: !canGoPrevious }" :on="{ click: prev }">
        <SButton variant="icon" class="s_slideGroup__button" :disabled="!canGoPrevious" @click="prev()">
          <SIcon icon="mdi-chevron-left"></SIcon>
        </SButton>
      </slot>
    </div>
    <!-- element.scroll does not work when scrollable prop changes, so used key to reload element -->
    <div ref="elementViewport" :key="canScroll ? 'touch' : 'non-touch'" :class="slideGroupMainClass" @scroll="onScroll">
      <div class="s_slideGroup__content" v-bind="contentAttrs">
        <slot></slot>
      </div>
    </div>

    <div v-if="isNavigatorVisible" class="s_slideGroup__navigator">
      <slot name="right" :attrs="{ disabled: !canGoPrevious }" :on="{ click: next }">
        <SButton variant="icon" class="s_slideGroup__button" :disabled="!canGoNext" @click="next()">
          <SIcon icon="mdi-chevron-right"></SIcon>
        </SButton>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import SButton from '@khsura/sui/components/sButton.vue'
import SIcon from '@khsura/sui/components/sIcon.vue'
import type { PropsSlideGroup } from '@khsura/sui/definitions'
import { useSlideGroupService } from '@khsura/sui/services'
import { type GroupItemValue } from '@khsura/sui/types'

const isReady = ref(false)
const props = defineProps<PropsSlideGroup>()
const model = defineModel<GroupItemValue[]>({ default: [], required: false })
const elementViewport = useTemplateRef('elementViewport')

const { isNavigatorVisible, canGoNext, canGoPrevious, canScroll, contentAttrs, next, prev, onScroll } =
  useSlideGroupService(props, model, elementViewport)

const slideGroupMainClass = computed(() => {
  return {
    s_slideGroup__main: true,
    's_slideGroup__main--scrollable': isReady.value && canScroll.value,
  }
})

onMounted(() => {
  isReady.value = true
})
</script>

<style lang="scss">
$slideGroupButtonSize: #{map-deep-get($s_button--sizes, 'default')}px;

.s_slideGroup {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;

  &__navigator {
    flex: 0 1;
  }

  &__button {
    position: relative;
    width: $slideGroupButtonSize;
    height: $slideGroupButtonSize;
    margin: 2px;
  }

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    list-style: none;
    transition: 0.3s $s_primaryTransition;
  }

  &__main {
    position: relative;
    flex: 1 1 100%;
    margin: 0 auto;
    overflow-x: hidden;
    scrollbar-width: none; // hide scrollbar for firefox
    -ms-overflow-style: none;

    hidescrollbarforfirefox-ms-overflow-style // hide scrollbar for IE and Edge

    &::-webkit-scrollbar {
      display: none; // hide scrollbar for Chrome, Safari and Opera
    }

    &--scrollable {
      overflow-x: scroll;

      // Property is nonstandard. Avoid using it.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-overflow-scrolling;
      -webkit-overflow-scrolling: touch;
    }

    .s_sliderItem + .s_sliderItem {
      padding-left: calc($s_spacer / 2);
    }
  }
}
</style>
