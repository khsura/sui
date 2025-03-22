<template>
  <nav :class="classList" aria-label="breadcrumbs">
    <ol class="s_breadcrumbs__list">
      <template v-for="(item, id) in items" :key="`item-${id}`">
        <li class="s_breadcrumbs__listItem">
          <Component
            :is="getTagOfItem(id, item)"
            :href="item.href"
            :to="item.to"
            :class="getListItemLinkClasses(id, item)"
            :style="getDisabledOfItem(id, item) ? undefined : styleListTextColor"
            >{{ item.text }}</Component
          >
        </li>
        <li aria-hidden="true" class="s_breadcrumbs__listItem s_breadcrumbs__listItem--divider">
          <slot name="custom-divider">{{ divider }}</slot>
        </li>
      </template>
    </ol>
  </nav>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropType } from 'vue'
import { propsTextColor } from '@khsura/sui/props'
import { useTextColorService } from '@khsura/sui/services'
import { type BreadcrumbsItem } from '@khsura/sui/types'

const props = defineProps({
  items: {
    type: Array as PropType<BreadcrumbsItem[]>,
    default: () => [],
  },
  divider: {
    type: String as PropType<string>,
    default: '/',
  },
  large: {
    type: Boolean,
    default: false,
  },
  ...propsTextColor(),
})

const { classListTextColor, styleListTextColor } = useTextColorService(props)

const classList = computed(() => {
  return {
    s_breadcrumbs: true,
    's_breadcrumbs--large': props.large,
  }
})

const size = computed(() => props.items.length)

const getTagOfItem = (id: number, item: BreadcrumbsItem) => {
  if (getDisabledOfItem(id, item)) {
    return 'span'
  }

  if (item.to) {
    return 'router-link'
  }

  if (item.href) {
    return 'a'
  }

  return 'span'
}

const getDisabledOfItem = (id: number, item: BreadcrumbsItem) => {
  return item.disabled ?? (id + 1 === size.value && item.disabled === undefined)
}

const getListItemLinkClasses = (id: number, item: BreadcrumbsItem) => {
  return {
    s_breadcrumbs__listItemLink: true,
    's_breadcrumbs__listItemLink--disabled': getDisabledOfItem(id, item),
    ...(getDisabledOfItem(id, item) ? {} : classListTextColor.value),
  }
}
</script>

<style lang="scss">
.s_breadcrumbs {
  font-size: 0.875rem;

  &--large {
    font-size: 1rem;
  }

  &__list {
    &Item {
      display: inline-flex;
      align-items: center;

      &--divider {
        margin: 0 $s_spacer;
        color: s_getAppColor('textSecondary');
      }
    }

    &ItemLink {
      text-decoration: underline;
      cursor: pointer;

      &--disabled {
        color: s_getAppColor('textSecondary');
        text-decoration: none;
        pointer-events: none;
        cursor: auto;
        user-select: none;
      }
    }

    &Item:last-child {
      display: none;
    }

    &Item:nth-last-child(2) {
      font-weight: 700;
    }
  }
}
</style>
