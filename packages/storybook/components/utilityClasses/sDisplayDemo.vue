<template>
  <div class="displayDemo">
    <div class="displayDemo__statesOfClasses s_fontWeight__bold k_display__flex k_py__4">
      <div>s_display__{{ displayMode }}</div>
      <div v-if="isFlexMode">s_justify__{{ flexConfigValues.justify }}</div>
      <div v-if="isFlexMode">s_align__{{ flexConfigValues.align }}</div>
    </div>
    <div
      v-if="isFlexMode"
      :class="`displayDemo__flexItems s_display__${displayMode} k_justify__${flexConfigValues.justify} k_align__${flexConfigValues.align}`"
    >
      <div
        v-for="(item, index) in itemCounter"
        :key="index"
        :class="`displayDemo__sampleFlexItem s_order__${getOrderStates[index]} k_px__3`"
      >
        <div class="displayDemo__ordering">
          <div class="s_ml__3">{{ item }}</div>
          <div class="displayDemo__orderOptionWrapper">
            <select v-model="getOrderStates[index]" class="displayDemo__orderOptions" :name="`selector-${index}`">
              <option v-for="(order, orderIndex) in selectedOrder" :key="orderIndex" :value="order">
                {{ order }}
              </option>
            </select>
            <label style="text-align: center" :for="`selector-${index}`">order</label>
          </div>
          <div v-if="isFlexMode">s_order__{{ getOrderStates[index] }}</div>
        </div>
      </div>
    </div>
    <div v-else class="displayDemo__displayItems">
      <span class="displayDemo__sampleItem">1</span>
      <span :style="`width: ${sampleItemWidth}`" :class="`displayDemo__sampleItem s_display__${displayMode}`"
        >2{{ sizeHint }}
      </span>
      <span class="displayDemo__sampleItem">3</span>
      <span class="displayDemo__sampleItem">4</span>
    </div>
    <div v-if="isFlexMode" class="displayDemo__flexConfig">
      <div>
        <SRadioGroup
          v-for="(config, index) in flexAdjustments"
          id="radioGroup1"
          :key="index"
          v-model="flexConfigValues[config.type]"
          name="value1"
          :mandatory="true"
          :outlined="true"
          :disabled="false"
          :hide-details="true"
          class="displayDemo__radioGroup s_my__3"
        >
          <div style="width: 60px">{{ config.type }}</div>
          <SRadio
            v-for="(option, radioIndex) in config.options"
            :id="`radio-${radioIndex}`"
            :key="radioIndex"
            :value="option"
            :label="option"
          ></SRadio>
        </SRadioGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SRadioGroup, SRadio } from '@sui/app/components'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

const props = defineProps({
  itemNumber: {
    type: Number,
    default: 3,
  },
  displayMode: {
    type: String,
    default: 'inline',
  },
})

const commonParameters = ['start', 'end', 'center']
const justifyConfig = [...commonParameters, 'spaceBetween', 'spaceAround']
const alignConfig = [...commonParameters, 'baseline', 'stretch']
const sampleItemWidth = '260px'

const flexAdjustments = [
  { type: 'justify', options: justifyConfig },
  { type: 'align', options: alignConfig },
]

const flexConfigValues = ref<{ justify: string; align: string }>({ justify: 'start', align: 'start' })
const flexOrders = computed(() => ['first', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'last'])

const arrayGenerator = (arraySize: number) => {
  return [...new Array(arraySize).fill(0).map((_, i) => i + 1)]
}

const itemCounter = computed(() => {
  if (props.itemNumber >= 1 && props.itemNumber <= 9) {
    return arrayGenerator(props.itemNumber)
  }

  return props.itemNumber < 1 ? arrayGenerator(1) : arrayGenerator(9)
})

const selectedOrder = computed(() => flexOrders.value.slice(0, itemCounter.value.length + 1).concat('last'))
// TODO (Georgii) fix
// eslint-disable-next-line vue/no-setup-props-destructure
const orderStates: Ref<string[]> = ref([...new Array(props.itemNumber).fill('0')])

const getOrderStates = computed(() => {
  // TODO (Sura)
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  orderStates.value = [...new Array(props.itemNumber).fill('0')]

  return orderStates.value
})

const isFlexMode = computed(() => props.displayMode === 'flex' || props.displayMode === 'inlineFlex')

const sizeHint = computed(() => {
  if (props.displayMode === 'inlineBlock' || props.displayMode === 'block') {
    return ` My ${sampleItemWidth} now works`
  }

  return ''
})
</script>

<style lang="scss">
.displayDemo {
  &__statesOfClasses {
    flex-wrap: wrap;
    justify-content: space-around;
  }

  &__flexItems {
    flex-wrap: wrap;
    width: 100%;
    height: 480px;
    margin-right: auto;
    margin-left: auto;
    background-color: #ffebcd;
  }

  &__orderInput {
    width: 30px;
  }

  &__sampleItem,
  &__sampleFlexItem {
    background-color: #0071eb27;
    border: 1px solid var(--s-color-primary);
    border-radius: 0.2967% / 4.166%;
  }

  &__sampleItem {
    padding: 5px;
    margin: 5px;
    text-align: center;
  }

  &__ordering {
    display: flex;
    flex-direction: row;
    gap: 20px;
    align-items: center;
    justify-content: space-evenly;
    height: 50px;
  }

  &__orderOptionWrapper {
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
    align-items: center;
    justify-content: center;
  }

  &__orderOptions {
    width: 40px;
    height: 20px;
    text-align: center;
  }

  &__flexConfig {
    display: flex;
    flex-direction: row;
    gap: 25px;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }

  &__radioGroup {
    display: flex;
    flex-direction: row;
    place-content: center center;
    align-items: center;
  }
}
</style>
