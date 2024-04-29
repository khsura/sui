<template>
  <div ref="selectElement" class="s_select" :class="selectClasses">
    <select :id="id" :value="modelValue" class="s_select__input" :name="name">
      <option v-for="(item, id) in objectItems" :key="id" :value="getItemValue(item)">{{ getItemText(item) }}</option>
    </select>
    <div ref="activatorElement">
      <div
        class="s_select__activator"
        role="button"
        v-bind="activatorAttrs"
        :class="activatorClasses"
        v-on="activatorOn"
      >
        <slot name="activator" :item="selectedItem" :value="model">
          {{ displayText }}
        </slot>
        <span class="s_select__spacer"></span>
        <slot name="dropdownIcon" :color="color" :value="model">
          <SIcon icon="mdi-chevron-down" :rotated="model"></SIcon>
        </slot>
      </div>
    </div>

    <SFormInputError :errors="errors" :hidden="hideDetails"></SFormInputError>

    <SOverlay v-slot="{ attrs }" :value="model">
      <div ref="contentElement" class="s_select__list" :style="contentStyles" :class="contentClasses" v-bind="attrs">
        <SList link :dense="dense" :color="color" :text="text">
          <SListItem
            v-for="(item, id) in objectItems"
            :key="id"
            :disabled="getIsDisabled(item)"
            :class="{ 's_select__listItem--selected': getIsSelected(item) }"
            @click="selectItem(item)"
          >
            <SListItemContent>
              <SListItemSubtitle>{{ getItemText(item) }}</SListItemSubtitle>
            </SListItemContent>
          </SListItem>
        </SList>
      </div>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import SFormInputError from '@sui/app/components/form/common/sFormInputError.vue'
import { SList, SListItem, SListItemContent, SListItemSubtitle } from '@sui/app/components/list'
import SIcon from '@sui/app/components/sIcon.vue'
import SOverlay from '@sui/app/components/sOverlay.vue'
import { propsSelect } from '@sui/app/props'
import { useBorderService, useDisabledService, useFormInputService, useMenuService } from '@sui/app/services'
import { type SelectItem } from '@sui/app/types'
import { ref, computed, watch } from 'vue'

const props = defineProps(propsSelect())

const emit = defineEmits<{
  (event: 'update:modelValue', value: null | string | number): void
  (event: 'change', value: null | string | number): void
  (event: 'update:menu', value: boolean | null | undefined): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
  (event: 'close'): void
}>()

const selectElement = ref<HTMLElement | null>(null)
const { classListBorder } = useBorderService(props)
const { errors, updateFormInput } = useFormInputService<string | number>(props, emit)
const { classListDisabled } = useDisabledService(props)

const {
  activatorElement,
  onClickOutside,
  model,
  activatorOn,
  contentElement,
  activatorAttrs,
  contentClasses,
  contentStyles,
} = useMenuService<'menu'>(props, emit, {
  modelKey: 'menu',
  onChange: (value) => {
    if (value) {
      setTimeout(() => {
        const selectedElement = contentElement.value?.querySelector<HTMLElement>('.s_select__listItem--selected')

        if (contentElement.value) {
          contentElement.value.scrollTop = selectedElement?.offsetTop ?? 0
        }
      })
    }
  },
})

const objectItems = computed<SelectItem[]>(() => {
  return props.items.map((item) => {
    if (typeof item === 'string') {
      return { value: item, text: item }
    }

    return item
  })
})

const getSelectedItemFromValue = (): SelectItem | null => {
  const item = props.items.find((item) => {
    if (typeof item === 'string') {
      return item === props.modelValue
    }

    return item.value === props.modelValue
  })

  return typeof item === 'string' ? { value: item, text: item } : item ?? null
}

const selectedItem = computed<SelectItem | null>({
  get() {
    return getSelectedItemFromValue()
  },
  set(item) {
    if (item === null) {
      emit('update:modelValue', null)

      return
    }

    emit('update:modelValue', item.value)
  },
})

const selectClasses = computed(() => {
  return {
    's_select--grow': props.grow,
  }
})

const activatorClasses = computed(() => {
  return {
    's_select__activator--empty': props.modelValue === null || props.modelValue === undefined,
    's_select__activator--dense': props.dense,
    ...classListBorder.value,
    ...classListDisabled.value,
  }
})

onClickOutside(async () => {
  if (model.value) {
    await updateFormInput()
    model.value = false
  }
})

const getItemValue = (item: SelectItem) => {
  return typeof item === 'string' ? item : item.value
}

const getItemText = (item: SelectItem) => {
  return typeof item === 'string' ? item : item.text
}

const getIsDisabled = (item: SelectItem) => {
  return typeof item === 'string' ? false : !!item.disabled
}

const getIsSelected = (item: SelectItem) => {
  if (getIsDisabled(item)) {
    return false
  }

  return typeof item === 'string' ? item === props.modelValue : item.value === props.modelValue
}

const selectItem = async (value: SelectItem | null) => {
  selectedItem.value = value
  model.value = false
  await updateFormInput()
}

watch([() => props.grow, () => props.disabled, () => props.label], () => {
  model.value = false
})

const displayText = computed(() => {
  return selectedItem.value?.text ?? props.label
})
</script>

<style lang="scss">
@import '@sui/app/styles/components/button';
@import '@sui/app/styles/components/menu';

.s_select {
  position: relative;

  &__activator {
    @include s_button();
    padding: 0 8px;
    background-color: s_getAppColor('card');

    &--empty {
      color: s_getAppColor('textSecondary');
      background-color: s_getAppColor('inputPlaceholderShown');
    }

    &--dense {
      height: #{map.get($s_button--sizes, 'small')}px;
    }

    &:not(.s_outlined) {
      @include s_elevation(1);
    }
  }

  &--grow {
    display: block;
    width: 100%;

    .s_select__activator {
      width: 100%;
    }
  }

  &__input {
    display: none;
  }

  &__spacer {
    flex: 1;
    min-width: calc($s_spacer * 2);
  }

  &__list {
    @include s_menuContent();
    @include s_elevation(2);

    // override
    > .s_list {
      padding: 0;
    }

    &Item--selected {
      .s_listItemSubtitle {
        font-weight: 700;
      }
    }
  }
}
</style>
