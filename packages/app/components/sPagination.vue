<template>
  <nav ref="root" :class="classList" :aria-label="props.ariaLabel">
    <ul class="s_pagination__list">
      <li v-if="showFirstLast" class="s_pagination__slot">
        <SButton
          class="s_pagination__control s_pagination__first"
          variant="icon"
          :size="props.size"
          :theme="props.theme"
          :aria-label="props.firstAriaLabel"
          :disabled="!!props.disabled || !canGoBack"
          @click="setPage(paginationFirstPage)"
        >
          <SIcon icon="mdi-chevron-double-left" />
        </SButton>
      </li>
      <li class="s_pagination__slot">
        <SButton
          class="s_pagination__control s_pagination__prev"
          variant="icon"
          :size="props.size"
          :theme="props.theme"
          :aria-label="props.prevAriaLabel"
          :disabled="!!props.disabled || !canGoBack"
          @click="setPage(page - 1)"
        >
          <SIcon icon="mdi-chevron-left" />
        </SButton>
      </li>
      <li v-for="(item, index) in items" :key="`${item}-${index}`" class="s_pagination__slot">
        <span v-if="item === paginationEllipsis" class="s_pagination__ellipsis" aria-hidden="true">&hellip;</span>
        <SButton
          v-else
          :class="{ s_pagination__item: true, 's_pagination__item--active': item === page }"
          :variant="item === page ? undefined : 'text'"
          :color="item === page ? props.color : undefined"
          :color-threshold="props.colorThreshold"
          :theme="props.theme"
          :aria-label="`${props.pageAriaLabel} ${item}`"
          :aria-current="item === page ? 'page' : undefined"
          :disabled="!!props.disabled"
          @click="setPage(item)"
        >
          {{ item }}
        </SButton>
      </li>
      <li class="s_pagination__slot">
        <SButton
          class="s_pagination__control s_pagination__next"
          variant="icon"
          :size="props.size"
          :theme="props.theme"
          :aria-label="props.nextAriaLabel"
          :disabled="!!props.disabled || !canGoForward"
          @click="setPage(page + 1)"
        >
          <SIcon icon="mdi-chevron-right" />
        </SButton>
      </li>
      <li v-if="showFirstLast" class="s_pagination__slot">
        <SButton
          class="s_pagination__control s_pagination__last"
          variant="icon"
          :size="props.size"
          :theme="props.theme"
          :aria-label="props.lastAriaLabel"
          :disabled="!!props.disabled || !canGoForward"
          @click="setPage(pageCount)"
        >
          <SIcon icon="mdi-chevron-double-right" />
        </SButton>
      </li>
    </ul>
  </nav>
</template>
<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import SButton from './sButton.vue'
import SIcon from './sIcon.vue'
import { paginationDefaultTotalVisible, paginationEllipsis, paginationFirstPage } from '@/app/constants'
import type { PropsPagination } from '@/app/definitions'
import {
  clampPage,
  useComponentDefaultsService,
  useComponentThemeService,
  usePaginationService,
  useSizeService,
} from '@/app/services'

const rawProps = withDefaults(defineProps<PropsPagination>(), {
  modelValue: undefined,
  totalVisible: undefined,
  showFirstLastPage: false,
  compact: undefined,
  disabled: false,
  color: 'primary',
  ariaLabel: 'Pagination',
  pageAriaLabel: 'Page',
  firstAriaLabel: 'First page',
  prevAriaLabel: 'Previous page',
  nextAriaLabel: 'Next page',
  lastAriaLabel: 'Last page',
})

const props = useComponentDefaultsService('SPagination', rawProps)
const emit = defineEmits<(event: 'update:modelValue', value: number) => void>()
const root = useTemplateRef<HTMLElement>('root')
const { classListSize } = useSizeService(props, { block: 'pagination' })
const { themeClasses } = useComponentThemeService(props)
// Kept locally too, so SPagination also works without v-model.
const requestedPage = ref(props.modelValue ?? paginationFirstPage)

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) {
      requestedPage.value = value
    }
  },
)

const { page, pageCount, items, isCompact, showFirstLast, canGoBack, canGoForward } = usePaginationService(
  {
    page: requestedPage,
    length: () => props.length,
    totalVisible: () => props.totalVisible ?? paginationDefaultTotalVisible,
    compact: () => props.compact,
    showFirstLastPage: () => props.showFirstLastPage,
    layoutKey: () => props.size,
  },
  root,
)

const setPage = (value: number) => {
  const nextPage = clampPage(value, pageCount.value)

  if (props.disabled || nextPage === page.value) {
    return
  }

  requestedPage.value = nextPage
  emit('update:modelValue', nextPage)
}

const classList = computed(() => {
  return {
    s_pagination: true,
    's_pagination--compact': isCompact.value,
    's_pagination--disabled': !!props.disabled,
    ...classListSize.value,
    ...themeClasses.value,
  }
})
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
$s_pagination__gap: $s_spacer !default;
$s_pagination__item--paddingX: $s_spacer !default;
$s_pagination__ellipsis--opacity: 0.6 !default;

.s_pagination {
  @include s_dark();
  display: block;
  min-width: 0;
  max-width: 100%;
  color: s_getAppColor('text');

  --s_pagination__itemSize: #{map.get($s_button--sizes, 'default')}px;
  --s_pagination__fontSize: #{map.get($s_button--fontSizes, 'default')};

  @each $name, $size in $s_button--sizes {
    &--size__#{$name} {
      --s_pagination__itemSize: #{$size}px;
      --s_pagination__fontSize: #{map.get($s_button--fontSizes, $name)};
    }
  }

  &__list {
    display: flex;
    flex-wrap: nowrap;
    gap: $s_pagination__gap;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__slot {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    min-width: var(--s_pagination__itemSize);
  }

  // Square page buttons. Two classes beat SButton's own min-width and padding.
  &__item.s_button {
    min-width: var(--s_pagination__itemSize);
    height: var(--s_pagination__itemSize);
    padding: 0 $s_pagination__item--paddingX;
    font-size: var(--s_pagination__fontSize);
    font-variant-numeric: tabular-nums;
    text-indent: 0;
  }

  // Arrows and the other pages take the nav's text colour, so the `theme` prop and a dark surface reach them
  // (SButton only themes itself when it has a background colour). Three classes beat SButton's disabled colour.
  & &__control.s_button,
  & &__item.s_button--text {
    color: inherit;
  }

  &__ellipsis {
    min-width: var(--s_pagination__itemSize);
    font-size: var(--s_pagination__fontSize);
    text-align: center;
    user-select: none;
    opacity: $s_pagination__ellipsis--opacity;
  }
}
</style>
