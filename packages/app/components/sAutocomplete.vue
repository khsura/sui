<template>
  <div
    class="s_autocomplete"
    :class="{ ...classListField, ...classListDensity, [`s_autocomplete--size__${size}`]: !!size }"
  >
    <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_autocomplete__label">{{ label }}</label>
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
          v-if="!isMultiple && chips && model"
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
            :id="inputId"
            class="s_autocomplete__input"
            :placeholder="placeholder"
            v-model="queryText"
            ref="inputElement"
            name="autocomplete"
            :autocomplete="autocomplete"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="isMenuOpen"
            :aria-controls="listboxId"
            :aria-activedescendant="isMenuOpen ? activeOptionId : undefined"
            :aria-label="label && !hideDetails ? undefined : (ariaLabel ?? label ?? placeholder)"
            @keydown="onComboboxKeydown"
            @keypress.enter="onEnter"
            @keydown.backspace="onBackspace"
            @focus="onFocus"
          />
          <SButton
            v-if="!loading && clearable && !isEmpty(model)"
            :aria-label="clearAriaLabel"
            @click="clear"
            variant="icon"
            size="small"
          >
            <SIcon icon="mdi-close"></SIcon>
          </SButton>
          <SProgressCircular v-if="loading" :size="20" :aria-label="loadingAriaLabel" indeterminate></SProgressCircular>
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
          <SList
            :id="listboxId"
            role="listbox"
            :aria-multiselectable="isMultiple || undefined"
            :divided="divided"
            :dense="dense"
            :density="resolvedDensity"
          >
            <SListItem
              v-for="(item, index) in filteredItems"
              :id="getOptionId(index)"
              :key="`${typeof item === 'string' ? item : item.value} - ${index}`"
              role="option"
              :aria-selected="getIsSelected(item)"
              :aria-disabled="getSelectItem(item).disabled || undefined"
              :class="{ 's_autocomplete__listItem--active': index === activeIndex }"
              :link="true"
              :disabled="getSelectItem(item).disabled"
              @click="onSelectItem(item)"
            >
              <!-- inert: a picture of the state only; the option itself is the control (aria-selected) -->
              <SListItemIcon v-if="isMultiple" class="s_autocomplete__checkboxIcon" inert>
                <SCheckbox :model-value="getIsSelected(item)" hide-details></SCheckbox>
              </SListItemIcon>
              <SListItemContent>
                <span class="s_autocomplete__itemText" :title="getItemText(item) ?? undefined">{{
                  getItemText(item)
                }}</span>
              </SListItemContent>
              <span></span>
            </SListItem>
            <SListItem
              v-if="showCreateOption"
              :id="getOptionId(filteredItems.length)"
              role="option"
              :aria-selected="false"
              :link="true"
              class="s_autocomplete__createOption"
              :class="{ 's_autocomplete__listItem--active': filteredItems.length === activeIndex }"
              @click="onSelectUnlisted"
            >
              <SListItemIcon v-if="isMultiple" class="s_autocomplete__checkboxIcon">
                <SIcon icon="mdi-plus" size="small"></SIcon>
              </SListItemIcon>
              <SListItemContent>Add "{{ queryText.trim() }}"</SListItemContent>
              <span></span>
            </SListItem>
          </SList>
          <!-- Outside the listbox: it is a message, not an option. role="status" announces it while typing. -->
          <div v-if="showNoData" class="s_autocomplete__noData" role="status">
            <NoDataContent></NoDataContent>
          </div>
        </SCard>
      </OnClickOutside>
    </SOverlay>
  </div>
</template>
<script lang="ts" setup generic="T extends boolean = false">
import { computed, nextTick, useId, useTemplateRef, watch, type VNode, type VNodeChild } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import { getSelectItem } from '../helpers'
import type { AutocompleteEmitEvents, AutocompleteModelType, AutocompleteModelTypeBase } from '../types/autocomplete'
import {
  useAutocompleteService,
  useComponentDefaultsService,
  useDensityService,
  useFieldLayoutService,
  useListboxNavigationService,
} from '../services'
import { keyboardKey } from '../constants'
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
  // The field draws its own menu; the browser's form-history list would open on top of it.
  autocomplete: 'off',
  clearAriaLabel: 'Clear',
  loadingAriaLabel: 'Loading',
})

const props = useComponentDefaultsService('SAutocomplete', rawProps)
const { classListDensity, density: resolvedDensity } = useDensityService(props)

// SAutocomplete reserves no details line under its field (it runs no rules).
const { classListField } = useFieldLayoutService(
  computed(() => ({ hasLabel: !!props.label && !props.hideDetails, hasDetails: false })),
)

const model = defineModel<AutocompleteModelType<T> | null>()
const emit = defineEmits<AutocompleteEmitEvents>()
const activatorElement = useTemplateRef('activatorElement')
const contentElement = useTemplateRef('contentElement')
const inputElement = useTemplateRef('inputElement')
const innerId = useId()
/** The input's id, so a `label` can point at it — the caller's, or a generated one. */
const inputId = computed(() => props.id ?? innerId)

const {
  queryText,
  contentClasses,
  contentStyles,
  filteredItems,
  showCreateOption,
  isFocused,
  isMenuOpen,
  isMultiple,
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
  onSelectUnlisted,
  updateModelType,
  updateItemsPool,
  getItemFromItemsPool,
} = useAutocompleteService(props, model, emit, {
  activatorElement,
  contentElement,
  inputElement,
})

updateItemsPool(props.items ?? [])

// The "Add …" option counts as one more option after the filtered items.
const optionCount = computed(() => filteredItems.value.length + (showCreateOption.value ? 1 : 0))

const slots = defineSlots<{
  /** Replaces `noDataText` when no option is left, such as an `SEmptyState`. Receives the typed `query`. */
  noData?: (props: { query: string }) => VNode[]
}>()

// Rendered through a function, not a <slot> outlet: an outlet inside the SOverlay slot would make that slot
// dynamic and re-render the whole menu on every update of the field.
const NoDataContent = (): VNodeChild => slots.noData?.({ query: queryText.value }) ?? props.noDataText
// Opt-in: with neither `noDataText` nor the `noData` slot an empty menu looks exactly as before.
const showNoData = computed(() => optionCount.value === 0 && !props.loading && (!!slots.noData || !!props.noDataText))

const { activeIndex, activeOptionId, listboxId, getOptionId, resetActiveIndex, moveActive } =
  useListboxNavigationService({
    idPrefix: inputId,
    getOptionCount: () => optionCount.value,
    getIsOptionDisabled: (index) => {
      const item = filteredItems.value[index]

      return item === undefined ? false : !!getSelectItem(item).disabled
    },
  })

const listNavigationKeys: Record<string, () => void> = {
  [keyboardKey.arrowDown]: () => moveActive(1),
  [keyboardKey.arrowUp]: () => moveActive(-1),
}

const selectActiveOption = () => {
  const item = filteredItems.value[activeIndex.value]

  if (item !== undefined) {
    void onSelectItem(item)
  } else if (showCreateOption.value && activeIndex.value === filteredItems.value.length) {
    void onSelectUnlisted()
  }
}

// Arrow keys open the list and move the highlighted option; Enter picks it; Escape closes the list.
const onComboboxKeydown = (event: KeyboardEvent) => {
  const navigate = listNavigationKeys[event.key]

  if (navigate) {
    event.preventDefault()

    if (!isMenuOpen.value) {
      isMenuOpen.value = true
    }

    navigate()

    return
  }

  if (event.key === keyboardKey.enter && isMenuOpen.value && activeIndex.value >= 0) {
    // preventDefault also stops the keypress that would add the typed text
    event.preventDefault()
    selectActiveOption()

    return
  }

  if (event.key === keyboardKey.escape && isMenuOpen.value) {
    // stop here, so an SDialog around the field stays open
    event.preventDefault()
    event.stopPropagation()
    isMenuOpen.value = false

    return
  }

  onKeydown(event)
}

// A new query or a closed list starts the highlight over.
watch([queryText, isMenuOpen], () => {
  resetActiveIndex()
})

// Keep the highlighted option visible while the arrow keys move through a long list.
watch(activeIndex, async (index) => {
  await nextTick()
  inputElement.value?.ownerDocument.getElementById(getOptionId(index))?.scrollIntoView?.({ block: 'nearest' })
})

// Watch for external changes to modelValue
watch(
  isMultiple,
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
// The SInput metrics: a 16px font at line-height 1.1, 8px vertical padding and a 1px border.
$s_autocomplete__fontSize: 16px;
$s_autocomplete__fieldHeight: calc(#{$s_autocomplete__fontSize} * 1.1 + #{$s_spacer * 4} + 2px);

// The SInput size presets. None goes below 16px, a smaller one makes iOS zoom in on focus.
$s_autocomplete--fontSizes: (
  'mini': 1rem,
  'small': 1rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
);

.s_autocomplete {
  position: relative;

  @each $key, $size in $s_autocomplete--fontSizes {
    &--size__#{$key} .s_autocomplete__input {
      font-size: $size;
    }
  }

  // The label SSelect draws (`.s_select__label`), so an autocomplete beside a
  // select or an input reads as the same kind of field.
  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer calc($s_spacer * 4);
    color: s_getAppColor('secondaryText');
  }

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

    // As tall as an SInput field, with the text inset by the same 16px, so an
    // autocomplete in a row of selects and inputs lines up with them.
    min-height: $s_autocomplete__fieldHeight;
    padding: $s_spacer calc($s_spacer * 2) $s_spacer calc($s_spacer * 4);
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
    font-size: $s_autocomplete__fontSize;
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

  // A long option stays on one line and ends in an ellipsis; its `title` shows the full text.
  &__itemText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // The option the arrow keys highlight (focus itself stays in the input)
  &__listItem--active {
    @include s_focusRing(-2px);
  }

  &__selectedItemCloseIcon {
    padding-left: $s_spacer;
    cursor: pointer;
  }

  // Make the checkbox visual-only — clicks pass through to the SListItem so
  // we get a single toggle. Without this, clicking the <label> double-fires
  // (label click bubbles + browser-synthesized input click also bubbles).
  &__checkboxIcon {
    pointer-events: none;
  }

  // Only rendered with `noDataText` or the `noData` slot, so the default empty menu is unchanged.
  &__noData {
    padding: calc($s_spacer * 3) calc($s_spacer * 4);

    // secondaryText, not disabled: the message must stay readable (4.5:1)
    color: s_getAppColor('secondaryText');
    text-align: center;
  }

  // Density: one step removes 4px of field height, as SInput (the padding shrinks too, so the
  // native input's own line box still fits).
  @include s_density() {
    .s_autocomplete__inputFieldContent {
      min-height: calc(#{$s_autocomplete__fieldHeight} + var(--s-density-offset));
      padding-block: calc(#{$s_spacer} + var(--s-density-offset) / 4);
    }
  }
}
</style>
