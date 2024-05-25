<template>
  <div>
    <div class="overFlowDemo s_my__10">
      <div class="overFlowDemo__sampleColumn">
        <div class="s_fontWeight__bold">k_overflow__{{ overflowOne }}</div>
        <div :class="`overFlowDemo__textSample s_overflow__${overflowOne}`">
          {{ sampleText }}
        </div>
      </div>
      <div class="overFlowDemo__sampleColumn">
        <div class="s_fontWeight__bold">k_overflow__{{ overflowTwo }}</div>
        <div :class="`overFlowDemo__textSample s_overflow__${overflowTwo}`">{{ sampleText }}</div>
      </div>
      <div class="overFlowDemo__sampleColumn">
        <div class="s_fontWeight__bold">k_overflow__{{ overflowThree }}</div>
        <div :class="`overFlowDemo__textSample s_overflow__${overflowThree}`">{{ sampleText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@khsura/shared'

defineProps({
  overflowOne: {
    type: String,
    default: 'auto',
  },
  overflowTwo: {
    type: String,
    default: 'hidden',
  },
  overflowThree: {
    type: String,
    default: 'visible',
  },
})

const sampleText = faker.lorem.words({ max: 40, min: 30 })
</script>

<style lang="scss">
.overFlowDemo {
  display: flex;
  justify-content: space-evenly;
  height: 320px;

  &__textSample {
    width: 250px;
    height: 180px;
    padding: 15px;
    margin: 15px;
    border: 1px solid var(--s-color-primary);
  }

  &__sampleColumn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
  }
}
</style>
