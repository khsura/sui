<template>
  <div class="s_autocomplete">
    <div ref="activatorElement" class="s_autocomplete__inputField">
      <div class="s_autocomplete__inputFieldContent" :class="{ 's_autocomplete__inputFieldContent--focus': isFocused }">
        <template v-if="Array.isArray(model) && model.length > 0">
          <div v-for="input in model" :key="input" class="s_autocomplete__selectedItemContainer">
            <component
              :is="chips ? SChip : 'div'"
              size="small"
              class="s_autocomplete__selectedItem"
              :class="{
                's_autocomplete__selectedItem--chips': chips,
              }"
            >
              {{ getItemFromItemsPool(input)?.text }}
              <SIcon
                v-if="closableChips"
                icon="mdi-close"
                size="small"
                class="s_autocomplete__selectedItemCloseIcon"
                @click="removeInput(input)"
              ></SIcon>
            </component>
            <span>, </span>
          </div>
        </template>
        <SChip
          v-if="!multiple && chips && model"
          size="small"
          class="s_autocomplete__selectedItem"
          :class="{
            's_autocomplete__selectedItem--chips': chips,
          }"
        >
          {{ getItemFromItemsPool(model as AutocompleteModelTypeBase)?.text }}
          <SIcon
            v-if="closableChips"
            icon="mdi-close"
            class="s_autocomplete__selectedItemCloseIcon"
            size="small"
            @click="removeInput(model as AutocompleteModelTypeBase)"
          ></SIcon>
        </SChip>
        <OnClickOutside
          @trigger="onBlur(true)"
          :options="{ ignore: ['.s_autocomplete__list'] }"
          class="s_autocomplete__inputContainer"
        >
          <input
            class="s_autocomplete__input"
            :placeholder="placeholder"
            v-model="queryText"
            ref="inputElement"
            name="autocomplete"
            :autocomplete="autocomplete"
            @keydown="onKeydown"
            @keypress.enter="onEnter"
            @keydown.backspace="onBackspace"
            @focus="onFocus"
          />
          <SButton v-if="!loading && clearable && !isEmpty(model)" @click="clear" variant="icon" size="small">
            <SIcon icon="mdi-close"></SIcon>
          </SButton>
          <SProgressCircular v-if="loading" :size="20" indeterminate></SProgressCircular>
        </OnClickOutside>
      </div>
    </div>
    <SOverlay v-slot="{ attrs }" :value="isMenuOpen">
      <OnClickOutside @trigger="onClickOutside" :options="{ ignore: ['.s_autocomplete', '.s_autocomplete__input'] }">
        <SCard
          ref="contentElement"
          class="s_autocomplete__list"
          v-bind="attrs"
          elevation="1"
          :style="contentStyles"
          :class="contentClasses"
        >
          <SList :divided="divided" :dense="dense">
            <SListItem
              v-for="(item, id) in filteredItems"
              :key="`${typeof item === 'string' ? item : item.value} - ${id}`"
              :link="true"
              :disabled="getSelectItem(item).disabled"
              @click="onSelectItem(item)"
            >
              <SListItemIcon v-if="multiple">
                <SCheckbox :model-value="getIsSelected(item)" hide-details></SCheckbox>
              </SListItemIcon>
              <SListItemContent>
                {{ getItemText(item) }}
              </SListItemContent>
              <span></span>
            </SListItem>
          </SList>
        </SCard>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script lang="ts" setup generic="T extends boolean = false">
import { watch, useTemplateRef } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import { getSelectItem } from '../helpers'
import type { AutocompleteEmitEvents, AutocompleteModelType, AutocompleteModelTypeBase } from '../types/autocomplete'
import { useAutocompleteService, useComponentDefaultsService } from '../services'
import type { PropsAutocomplete } from '../definitions'
import { isEmpty } from '../lib/isEmpty'
import SChip from './sChip.vue'
import SIcon from './sIcon.vue'
import SButton from './sButton.vue'
import SProgressCircular from './progress/sProgressCircular.vue'
import SCheckbox from '@/app/components/form/sCheckbox.vue'
import { SList, SListItem, SListItemContent, SListItemIcon } from '@/app/components/list'
import SCard from '@/app/components/cards/sCard.vue'
import SOverlay from '@/app/components/sOverlay.vue'

const rawProps = withDefaults(defineProps<PropsAutocomplete<T>>(), {
  location: 'bottom',
  filterMode: 'contains',
  debounce: 500,
})

const props = useComponentDefaultsService('SAutocomplete', rawProps)
const model = defineModel<AutocompleteModelType<T> | null>()
const emit = defineEmits<AutocompleteEmitEvents>()
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')
const inputElement = useTemplateRef('inputElement')

const {
  queryText,
  contentClasses,
  contentStyles,
  filteredItems,
  isFocused,
  isMenuOpen,
  clear,
  onBlur,
  onFocus,
  onEnter,
  onKeydown,
  removeInput,
  onBackspace,
  getIsSelected,
  getItemText,
  onClickOutside,
  onSelectItem,
  updateModelType,
  updateItemsPool,
  getItemFromItemsPool,
} = useAutocompleteService(props, model, emit, {
  activatorElement,
  contentElement,
  inputElement,
})

updateItemsPool(props.items ?? [])

// Watch for external changes to modelValue
watch(
  () => props.multiple,
  (newValue) => {
    updateModelType(newValue ?? false)
  },
  { immediate: true },
)

watch(
  () => props.dense,
  () => {
    isMenuOpen.value = false
  },
)

watch(
  () => props.items,
  (newValue) => {
    updateItemsPool(newValue ?? [])
  },
)
</script>

<style lang="scss">
.s_autocomplete {
  position: relative;

  &__inputFieldContent {
    @include s_borderRadius();
    position: relative;
    display: flex;
    flex: 1 0 auto;
    flex-wrap: wrap;
    gap: $s_spacer;
    align-items: center;
    width: 100%;
    max-width: 100%;
    padding: $s_spacer;
    font-family: $s_inputFontFamily;
    line-height: 1.1;
    background-color: s_getAppColor('card');
    border: thin s_getAppColor('border') solid;

    &--focus {
      // Unfortuantly outline do not following the curve of border-radius below iOS 16.4,
      // Therefore we have to use ::before pseudo-element for outline effect on focus.
      // https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes
      &::before {
        position: absolute;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        pointer-events: none;
        content: '';
        border: 2px solid s_getAppColor('text');
        border-radius: 4px;
      }
    }
  }

  &__selectedItemContainer {
    display: flex;
    align-items: center;
  }

  &__selectedItem {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }

  &__inputContainer {
    display: inline-flex;
    flex: 1 1 auto;
    align-items: center;
  }

  &__input {
    width: 100%;
    min-width: 100px;
    height: 100%;
    font-size: 1rem;
    color: s_getAppColor('card', true);
    outline: none;
    background-color: transparent;
    border: 0;
  }

  &__list {
    @include s_menuContent();
    @include s_elevation(2);
    @include s_borderRadius();

    // width: 100%;
    max-height: 80vh;
    overflow-y: auto;
  }

  &__selectedItemCloseIcon {
    padding-left: $s_spacer;
    cursor: pointer;
  }
}
</style>
