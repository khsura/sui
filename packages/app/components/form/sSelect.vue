<template>
  <div ref="selectElement" class="s_select" :class="selectClasses" :style="styleListBorder">
    <select :id="id" :value="modelValue" class="s_select__input" :name="name ?? undefined">
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
        <slot name="activator" :item="selectedItem" :value="menuModel">
          {{ displayText }}
        </slot>
        <span class="s_select__spacer"></span>
        <slot name="dropdownIcon" :color="color" :value="menuModel">
          <SIcon icon="mdi-chevron-down" :rotated="menuModel"></SIcon>
        </slot>
      </div>
    </div>

    <SFormInputError v-if="!hideDetails" :errors="errors"></SFormInputError>

    <SOverlay v-slot="{ attrs }" :value="menuModel">
      <OnClickOutside @trigger="onClickOutside">
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
                <SListItemSubtitle class="s_select__item">{{ getItemText(item) }}</SListItemSubtitle>
              </SListItemContent>
            </SListItem>
          </SList>
        </div>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import { ref, computed, watch, nextTick } from 'vue'
import SFormInputError from '@khsura/sui/components/form/common/sFormInputError.vue'
import { SList, SListItem, SListItemContent, SListItemSubtitle } from '@khsura/sui/components/list'
import SIcon from '@khsura/sui/components/sIcon.vue'
import SOverlay from '@khsura/sui/components/sOverlay.vue'
import { type PropsSelect } from '@khsura/sui/definitions'
import { useBorderService, useDisabledService, useFormInputService, useMenuService } from '@khsura/sui/services'
import { type SelectItem, type EmitFormInput } from '@khsura/sui/types'

const props = defineProps<PropsSelect>()
const emit = defineEmits<EmitFormInput<string | number | null>>()
const selectElement = ref<HTMLElement | null>(null)
const { classListBorder, styleListBorder } = useBorderService(props)
const model = defineModel<string | number | null>()
const { errors, updateFormInput } = useFormInputService<string | number | null>(props, emit, model)
const menuModel = defineModel<boolean>('menu')
const { classListDisabled } = useDisabledService(props)

const { activatorElement, activatorOn, contentElement, updateLocation, activatorAttrs, contentClasses, contentStyles } =
  useMenuService(props, menuModel)

const onClickOutside = () => {
  if (menuModel.value) {
    menuModel.value = false
  }
}

const objectItems = computed<SelectItem[]>(() => {
  return (props.items ?? []).map((item) => {
    if (typeof item === 'string' || item === undefined || item === null) {
      return { value: item, text: item ?? '-' }
    }

    return item
  })
})

const getSelectedItemFromValue = (): SelectItem | null => {
  const item = (props.items ?? []).find((item) => {
    if (typeof item === 'string') {
      return item === model.value
    }

    return item?.value === model.value
  })

  return typeof item === 'string' ? { value: item, text: item } : (item ?? null)
}

const selectedItem = computed<SelectItem | null>({
  get() {
    return getSelectedItemFromValue()
  },
  set(item) {
    if (item === null) {
      model.value = null

      return
    }

    model.value = item.value
  },
})

const selectClasses = computed(() => {
  return {
    's_select--grow': props.grow,
  }
})

const activatorClasses = computed(() => {
  return {
    's_select__activator--empty': model.value === null || model.value === undefined,
    's_select__activator--dense': props.dense,
    ...classListBorder.value,
    ...classListDisabled.value,
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

  return typeof item === 'string' ? item === model.value : item.value === model.value
}

const selectItem = async (value: SelectItem | null) => {
  selectedItem.value = value
  menuModel.value = false
  await updateFormInput()
}

watch([() => props.grow, () => props.disabled, () => props.label], () => {
  menuModel.value = false
})

watch(menuModel, async () => {
  if (menuModel.value) {
    await nextTick()
    updateLocation()
    void updateFormInput()
    const selectedElement = contentElement.value?.querySelector<HTMLElement>('.s_select__listItem--selected')

    if (contentElement.value) {
      contentElement.value.scrollTop = selectedElement?.offsetTop ?? 0
    }
  }
})

const displayText = computed(() => {
  return selectedItem.value?.text ?? props.label
})
</script>

<style lang="scss">
.s_select {
  position: relative;

  &__activator {
    padding: 0 8px;
    background-color: s_getAppColor('card');

    @include s_button();

    &--empty {
      color: s_getAppColor('textSecondary');
      background-color: s_getAppColor('inputPlaceholderShown');
    }

    &--dense {
      height: #{map.get($s_button--sizes, 'small')}px;
    }

    &:not(.s_outlined, .s_underlined) {
      @include s_elevation(1);
    }

    &.s_outlined {
      @include s_outlined();
    }

    &.s_underlined {
      @include s_underlined();
    }

    &.s_rounded {
      @include s_borderRadius(16px);
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

  &__item {
    padding: 0 8px;
    cursor: pointer;
  }
}
</style>
