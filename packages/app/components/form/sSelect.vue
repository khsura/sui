<template>
  <div class="s_select" :class="selectClasses" :style="styleListBorder">
    <label v-if="label" v-show="!hideDetails" :id="labelId" class="s_select__label" @click="focusActivator">{{
      label
    }}</label>
    <!-- Not rendered (display: none): it only carries `name` and the value for a native form submit -->
    <select :value="modelValue" class="s_select__input" :name="name ?? undefined" tabindex="-1" aria-hidden="true">
      <option v-for="(item, id) in objectItems" :key="id" :value="getItemValue(item)">{{ getItemText(item) }}</option>
    </select>
    <div ref="activatorElement">
      <!-- A select-only combobox: focus stays here and the arrow keys move the highlighted option -->
      <div
        :id="inputId"
        class="s_select__activator"
        role="combobox"
        aria-haspopup="listbox"
        v-bind="{ ...activatorAttrs, ...ariaAttributesFormInput, ...comboboxAttrs }"
        :class="activatorClasses"
        v-on="activatorOn"
        @keydown="onActivatorKeydown"
      >
        <span class="s_select__selection">
          <span class="s_select__selectionText" :class="{ 's_select__selectionText--placeholder': !selectedItem }">
            <slot name="activator" :item="selectedItem" :value="menuModel">
              {{ displayText }}
            </slot>
          </span>
          <!-- Invisible copies of every option, so the field is as wide as its longest option, like a native select -->
          <span v-for="(item, index) in objectItems" :key="index" class="s_select__sizer" aria-hidden="true">{{
            getItemText(item)
          }}</span>
          <span v-if="placeholder" class="s_select__sizer" aria-hidden="true">{{ placeholder }}</span>
        </span>
        <span class="s_select__spacer"></span>
        <slot name="dropdownIcon" :color="color" :value="menuModel">
          <SIcon icon="mdi-chevron-down" :rotated="menuModel"></SIcon>
        </slot>
      </div>
    </div>

    <SFormInputError v-if="!hideDetails && !hideError" :id="errorId" :errors="errors"></SFormInputError>

    <SOverlay v-slot="{ attrs }" :value="menuModel">
      <OnClickOutside @trigger="onClickOutside">
        <div ref="contentElement" class="s_select__list" :style="contentStyles" :class="contentClasses" v-bind="attrs">
          <SList
            :id="listboxId"
            role="listbox"
            :aria-labelledby="label ? labelId : undefined"
            link
            :dense="dense"
            :color="color"
            :text="text"
            :divided="divided"
          >
            <SListItem
              v-for="(item, index) in objectItems"
              :id="getOptionId(index)"
              :key="index"
              role="option"
              :aria-selected="getIsSelected(item)"
              :aria-disabled="getIsDisabled(item) || undefined"
              :disabled="getIsDisabled(item)"
              :class="{
                's_select__listItem--selected': getIsSelected(item),
                's_select__listItem--active': index === activeIndex,
              }"
              @click="selectItem(item)"
            >
              <SListItemContent>
                <SListItemSubtitle class="s_select__item" :title="getItemText(item)">
                  {{ getItemText(item) }}
                </SListItemSubtitle>
              </SListItemContent>
            </SListItem>
          </SList>
          <!-- Outside the listbox: it is a message, not an option. role="status" announces it. -->
          <div v-if="showNoData" class="s_select__noData" role="status">
            <NoDataContent></NoDataContent>
          </div>
        </div>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script setup lang="ts" generic="T extends string | number = string | number">
import { OnClickOutside } from '@vueuse/components'
import { computed, watch, nextTick, useTemplateRef, type VNode, type VNodeChild } from 'vue'
import { keyboardKey } from '@/app/constants'
import SFormInputError from '@/app/components/form/common/sFormInputError.vue'
import { SList, SListItem, SListItemContent, SListItemSubtitle } from '@/app/components/list'
import SIcon from '@/app/components/sIcon.vue'
import SOverlay from '@/app/components/sOverlay.vue'
import { type PropsSelect } from '@/app/definitions'
import {
  useBorderService,
  useComponentDefaultsService,
  useDisabledService,
  useFieldLayoutService,
  useFormInputService,
  useListboxNavigationService,
  useMenuService,
} from '@/app/services'
import { type SelectItem, type EmitFormInput } from '@/app/types'

// Outlined by default, so a select matches the SInput and SDatePickerInput fields next to it.
const rawProps = withDefaults(defineProps<PropsSelect>(), {
  outlined: true,
})

const props = useComponentDefaultsService('SSelect', rawProps)
const emit = defineEmits<EmitFormInput<T | null>>()
const { classListBorder, styleListBorder } = useBorderService(props)
const model = defineModel<T | null>()

const { errors, hasError, updateFormInput, inputId, errorId, ariaAttributesFormInput } = useFormInputService<T | null>(
  props,
  emit,
  model,
)

const labelId = computed(() => `${inputId.value}-label`)
const menuModel = defineModel<boolean>('menu')
const { classListDisabled } = useDisabledService(props)
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')

const { activatorOn, updateLocation, activatorAttrs, contentClasses, contentStyles } = useMenuService(
  props,
  menuModel,
  {
    activatorElement,
    contentElement,
  },
  // Flip or shift the list so it stays inside the viewport, also at the bottom and right edges.
  { keepInViewport: true },
)

const onClickOutside = () => {
  if (menuModel.value) {
    menuModel.value = false
  }
}

const {
  activeIndex,
  activeOptionId,
  listboxId,
  getOptionId,
  setActiveIndex,
  resetActiveIndex,
  moveActive,
  moveToFirst,
  moveToLast,
} = useListboxNavigationService({
  idPrefix: inputId,
  getOptionCount: () => objectItems.value.length,
  getIsOptionDisabled: (index) => getIsDisabled(objectItems.value[index]),
})

const comboboxAttrs = computed(() => ({
  tabindex: props.disabled ? -1 : 0,
  'aria-expanded': !!menuModel.value,
  'aria-controls': listboxId.value,
  'aria-labelledby': props.label ? labelId.value : undefined,
  'aria-label': props.label ? undefined : (props.ariaLabel ?? props.placeholder ?? undefined),
  'aria-activedescendant': menuModel.value ? activeOptionId.value : undefined,
  'aria-disabled': props.disabled ? true : undefined,
  'aria-readonly': props.readonly ? true : undefined,
}))

const focusActivator = () => {
  activatorElement.value?.querySelector<HTMLElement>('[role="combobox"]')?.focus()
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

    model.value = item.value as T
  },
})

const slots = defineSlots<{
  /** Replaces the selected item's text in the field. */
  activator?: (props: { item: SelectItem | null; value: boolean | undefined }) => VNode[]
  /** Replaces the chevron icon. */
  dropdownIcon?: (props: { color: string | undefined; value: boolean | undefined }) => VNode[]
  /** Replaces `noDataText` when `items` is empty, such as an `SEmptyState`. */
  noData?: () => VNode[]
}>()

// Rendered through a function, not a <slot> outlet: an outlet inside the SOverlay slot would make that slot
// dynamic and re-render the whole menu on every update of the field.
const NoDataContent = (): VNodeChild => slots.noData?.() ?? props.noDataText
// Opt-in: with neither `noDataText` nor the `noData` slot an empty menu looks exactly as before.
const showNoData = computed(() => objectItems.value.length === 0 && (!!slots.noData || !!props.noDataText))

const { classListField } = useFieldLayoutService(
  computed(() => ({
    hasLabel: !!props.label && !props.hideDetails,
    hasDetails: !props.hideDetails && !props.hideError,
  })),
)

const selectClasses = computed(() => {
  return {
    's_select--grow': props.grow,
    ...classListField.value,
  }
})

const activatorClasses = computed(() => {
  return {
    's_select__activator--empty': model.value === null || model.value === undefined,
    's_select__activator--dense': props.dense,
    's_select__activator--error': hasError.value,
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

// Opens the list with the selected option highlighted (or the first / last enabled one).
const openList = (fromEnd: boolean) => {
  const selectedIndex = objectItems.value.findIndex((item) => getIsSelected(item))

  menuModel.value = true

  if (selectedIndex >= 0) {
    setActiveIndex(selectedIndex)
  } else if (fromEnd) {
    moveToLast()
  } else {
    moveToFirst()
  }
}

const listNavigationKeys: Record<string, () => void> = {
  [keyboardKey.arrowDown]: () => moveActive(1),
  [keyboardKey.arrowUp]: () => moveActive(-1),
  [keyboardKey.home]: moveToFirst,
  [keyboardKey.end]: moveToLast,
}

const listOpenKeys: string[] = [keyboardKey.arrowDown, keyboardKey.arrowUp, keyboardKey.enter, keyboardKey.space]

const onActivatorKeydown = (event: KeyboardEvent) => {
  if (props.disabled || props.readonly) {
    return
  }

  if (!menuModel.value) {
    if (listOpenKeys.includes(event.key)) {
      event.preventDefault()
      openList(event.key === keyboardKey.arrowUp)
    }

    return
  }

  const navigate = listNavigationKeys[event.key]

  if (navigate) {
    event.preventDefault()
    navigate()
  } else if (event.key === keyboardKey.enter || event.key === keyboardKey.space) {
    event.preventDefault()
    const activeItem = objectItems.value[activeIndex.value]

    if (activeItem && !getIsDisabled(activeItem)) {
      void selectItem(activeItem)
    } else {
      menuModel.value = false
    }
  } else if (event.key === keyboardKey.escape) {
    // stop here, so an SDialog around the select stays open
    event.preventDefault()
    event.stopPropagation()
    menuModel.value = false
  } else if (event.key === keyboardKey.tab) {
    menuModel.value = false
  }
}

// Keep the highlighted option visible while the arrow keys move through a long list.
watch(activeIndex, async (index) => {
  await nextTick()
  const optionElement = contentElement.value?.ownerDocument.getElementById(getOptionId(index))

  optionElement?.scrollIntoView?.({ block: 'nearest' })
})

const selectItem = async (value: SelectItem | null) => {
  selectedItem.value = value
  menuModel.value = false
  await updateFormInput()
}

watch([() => props.grow, () => props.disabled, () => props.label], () => {
  menuModel.value = false
})

watch(menuModel, async () => {
  if (!menuModel.value) {
    resetActiveIndex()
  }

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

// The label is already shown above the field, so an empty select shows its placeholder, never the label again.
const displayText = computed(() => {
  return selectedItem.value?.text ?? props.placeholder ?? ''
})
</script>

<style lang="scss">
// Matches the SInput field: a 16px font at line-height 1.1, 8px vertical padding and a 1px border.
$s_select__fontSize: 16px;
$s_select__lineHeight: 1.1;
$s_select__fieldHeight: calc(#{$s_select__fontSize} * #{$s_select__lineHeight} + #{$s_spacer * 4} + 2px);

.s_select {
  position: relative;

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
    color: s_getAppColor('secondaryText');
  }

  &__activator {
    @include s_button();

    // The same box as an SInput field: 16px text inset by 16px, and the same height and font.
    justify-content: flex-start;
    max-width: 100%;
    height: auto;
    min-height: $s_select__fieldHeight;
    padding: 0 calc($s_spacer * 2) 0 calc($s_spacer * 4);
    font-family: $s_inputFontFamily;
    font-size: $s_select__fontSize;
    line-height: $s_select__lineHeight;
    text-indent: 0;
    background-color: s_getAppColor('card');

    &--empty {
      color: s_getAppColor('textSecondary');
    }

    &--dense {
      min-height: #{map.get($s_button--sizes, 'small')}px;
    }

    // Kept visible even when `hideError` / `hideDetails` hides the message text.
    // `::before` is taken by the button hover overlay, so the frame uses `::after`.
    &--error::after {
      position: absolute;
      inset: 0;
      pointer-events: none;
      content: '';
      border: thin solid s_getPresetColor('error');
      border-radius: inherit;
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

  // The selected text and the invisible option copies share one grid cell, so
  // the field fits its longest option. A long text is clipped inside the field
  // instead of widening it.
  &__selection {
    display: grid;
    flex: 0 1 auto;
    grid-template-columns: minmax(0, max-content);
    min-width: 0;
  }

  &__selectionText,
  &__sizer {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__selectionText--placeholder {
    color: s_getAppColor('secondaryText');
  }

  &__sizer {
    height: 0;
    visibility: hidden;
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

    // The option the arrow keys highlight (focus itself stays on the field)
    &Item--active {
      @include s_focusRing(-2px);
    }
  }

  // A long option stays on one line and ends in an ellipsis (as in SAutocomplete) instead of the
  // two-line clamp of SListItemSubtitle; its `title` shows the full text.
  &__item {
    display: block;
    padding: 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }

  // Only rendered with `noDataText` or the `noData` slot, so the default empty menu is unchanged.
  &__noData {
    padding: calc($s_spacer * 3) calc($s_spacer * 4);

    // secondaryText, not disabled: the message must stay readable (4.5:1)
    color: s_getAppColor('secondaryText');
    text-align: center;
  }
}
</style>
