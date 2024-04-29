<template>
  <div class="spacingField">
    <div :class="`s_m${marginType}__${marginSizeComputed}`" class="spacingField__margingWrapper">
      <div :class="`s_p${paddingType}__${paddingSizeComputed}`" class="spacingField__paddingWrapper">
        <div class="spacingField__info">
          <div class="spacingField__params">
            <div>class syntax</div>
            <div>s_m{{ marginDirection }}__{{ marginSize }}</div>
            <div>s_p{{ paddingDirection }}__{{ paddingSize }}</div>
          </div>
          <div class="spacingField__text">
            {{ sampleText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@sui/shared'
import { computed } from 'vue'

const props = defineProps({
  marginDirection: {
    type: String,
    default: 'a',
  },
  marginSize: {
    type: Number,
    default: 3,
  },
  paddingDirection: {
    type: String,
    default: 'a',
  },
  paddingSize: {
    type: Number,
    default: 3,
  },
})

const marginSizeComputed = computed(() => {
  return props.marginSize
})

const paddingSizeComputed = computed(() => {
  return props.paddingSize
})

const marginType = computed(() => {
  return props.marginDirection
})

const paddingType = computed(() => {
  return props.paddingDirection
})

const sampleText = faker.lorem.words({ max: 40, min: 30 })
</script>

<style lang="scss">
.spacingField {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  font-weight: 700;
  background-color: rgb(255 204 128);

  &__margingWrapper {
    box-shadow: 0 4px 8px 1px #ababab;
  }

  &__paddingWrapper {
    background-color: rgb(197 225 165);
  }

  &__info,
  &__text {
    background-color: rgb(255 255 255);
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__params {
    display: flex;
    flex-flow: row wrap;
    // gap: 10px;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;

    div:first-child {
      flex: 1 0 100%;
      justify-self: center;
      text-align: center;
    }

    div:not(:first-child) {
      flex: 0 1;
      background-color: #ebebeb;
    }

    div:nth-child(2) {
      margin-right: 15px;
    }

    div:nth-child(3) {
      margin-left: 15px;
    }
  }
}
</style>
