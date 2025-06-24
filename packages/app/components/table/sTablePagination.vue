<template>
  <div class="s_tablePagination" v-if="itemsPerPage">
    <slot name="pagination" :items-per-page="itemsPerPage" :total-items="itemsCount">
      <div class="s_tablePagination__itemsPerPage">
        <span class="s_tablePagination__page"><slot name="itemsPerPageLabel">Items per page: </slot></span>
        <SSelect :items="itemsPerPageOptions" divided outlined hide-details v-model="itemsPerPage"></SSelect>
      </div>
      <span class="s_tablePagination__page s_px__3"
        >{{ pageIndex * itemsPerPage + 1 }} - {{ Math.min(pageIndex * itemsPerPage + itemsPerPage, itemsCount) }} /
        {{ itemsCount }}</span
      >
      <div class="s_tablePagination__actions">
        <SButton variant="icon" @click="pageIndex = 0" :disabled="!canGoToFirst">
          <SIcon icon="mdi-chevron-double-left"></SIcon>
        </SButton>
        <SButton variant="icon" @click="pageIndex--" :disabled="!canGoToFirst">
          <SIcon icon="mdi-chevron-left" />
        </SButton>
        <SButton variant="icon" @click="pageIndex++" :disabled="!canGoToLast">
          <SIcon icon="mdi-chevron-right" />
        </SButton>
        <SButton variant="icon" @click="pageIndex = lastPageIndex" :disabled="!canGoToLast">
          <SIcon icon="mdi-chevron-double-right"></SIcon>
        </SButton>
      </div>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import SSelect from '@khsura/sui/components/form/sSelect.vue'
import SButton from '@khsura/sui/components/sButton.vue'
import SIcon from '@khsura/sui/components/sIcon.vue'

const itemsPerPage = defineModel<number>('itemsPerPage')

const props = defineProps<{
  itemsCount: number
}>()

const getPageIndex = (value: number) => {
  return Math.max(0, Math.min(value, Math.ceil(props.itemsCount / (itemsPerPage.value ?? 10)) - 1))
}

const pageIndex = defineModel<number>('pageIndex', {
  get: (value) => {
    return getPageIndex(value)
  },
  set: (value) => {
    return getPageIndex(value)
  },
  required: true,
})

const itemsPerPageOptions = computed(() => {
  return [...new Set([itemsPerPage.value ?? 10, 10, 25, 50, 100])]
    .map((item) => ({ value: item, text: item.toString() }))
    .sort((a, b) => a.value - b.value)
})

const lastPageIndex = computed(() => {
  return Math.ceil(props.itemsCount / (itemsPerPage.value ?? 10)) - 1
})

const canGoToFirst = computed(() => {
  return pageIndex.value > 0
})

const canGoToLast = computed(() => {
  return pageIndex.value < lastPageIndex.value
})
</script>

<style lang="scss" scoped>
.s_tablePagination {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  padding: 8px;

  &__itemsPerPage {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__page {
    min-width: 100px;
    font-size: 16px;
    text-align: right;
  }

  &__actions {
    display: flex;
    align-items: center;
  }
}
</style>
