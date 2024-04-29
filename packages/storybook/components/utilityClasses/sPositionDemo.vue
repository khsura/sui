<template>
  <div class="positionDemo">
    <div class="positionDemo__item"></div>
    <div
      :style="`top: ${topShift}px; left: ${leftShift}px`"
      :class="`positionDemo__testItem s_position__${positionSettings}`"
    >
      s_position__{{ positionSettings }}
    </div>
    <div class="positionDemo__item"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  positionSettings: {
    type: String,
    default: 'unset',
  },
  topShift: {
    type: Number,
    default: 30,
  },
  leftShift: {
    type: Number,
    default: 30,
  },
})
</script>

<style lang="scss">
.positionDemo {
  display: flex;
  flex-direction: row;
  gap: 25px;
  align-items: center;
  justify-content: center;
  width: 600px;
  height: 400px;
  margin-right: auto;
  margin-left: auto;

  &__item {
    display: block;
    width: 70px;
    height: 70px;
    background-color: #0071eb0c;
    border: 1px solid var(--s-color-primary);
  }

  &__testItem {
    width: 320px;
    height: 70px;
    padding: 5px;
    line-height: 60px;
    text-align: center;
    background-color: #0071eb27;
    border: 1px solid var(--s-color-primary);
  }
}
</style>
