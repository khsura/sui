<template>
  <div :class="classList" :style="styleListBorder">
    <!-- The whole option is the radio's <label>: a click anywhere on it reaches the native input, which is
         the only interactive element (no button around it), so arrow keys move between the group's radios -->
    <label :class="classListButton" :for="computedId">
      <input
        :id="computedId"
        type="radio"
        :name="groupProps?.name ?? name ?? groupName ?? undefined"
        :value="value"
        :checked="isSelected"
        :class="classListInput"
        :disabled="groupProps?.disabled || !!disabled"
        :aria-label="ariaLabel ?? undefined"
        @click="updateValue"
      />
      <span :class="classListRadio">
        <slot name="label" :attrs="{ class: classListLabel }">
          <!-- The option's own text: the group's `hideDetails` hides only its error area, not this -->
          <span v-if="label" :class="classListLabel">{{ label }}</span>
        </slot>
      </span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { computed, inject, nextTick, useId } from 'vue'
import { ProviderName, ProviderPropsName } from '@/app/configs'
import {
  useBorderService,
  useComponentDefaultsService,
  useDisabledService,
  useSingleGroupItemService,
} from '@/app/services'
import type { PropsBorder, PropsDisabled, PropsSingleGroupItem } from '@/app/definitions'
import type { ButtonTypeType } from '@/app/types'

const rawProps = defineProps<
  {
    id?: string
    name?: string | null
    label?: string | null
    /** Accessible name for a radio without a visible `label` (for example an icon-only option). */
    ariaLabel?: string | null
    /** @deprecated The option is a native radio inside a label now; `type` has no effect. */
    type?: ButtonTypeType
  } & PropsDisabled &
    PropsSingleGroupItem &
    PropsBorder
>()

const props = useComponentDefaultsService('SRadio', rawProps)
const emit = defineEmits<(event: 'update:checked', value: boolean) => void>()
const groupProps = inject(ProviderPropsName.radioGroupProps)
// The group's generated name, so its radios form one arrow-key group even without a `name` prop
const groupName = inject(ProviderName.radioGroupName, null)
const { toggleGroupItem, isSelected } = useSingleGroupItemService(props)
const generatedId = useId()
const computedId = computed(() => props.id ?? generatedId)

const { classListDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: props.disabled ?? groupProps?.disabled,
      readonly: props.readonly ?? groupProps?.readonly,
    }
  }),
)

const { classListBorder, styleListBorder } = useBorderService(groupProps)

const { classListDisabled: classListRadioGroupDisabled } = useDisabledService(
  computed(() => {
    return {
      disabled: groupProps?.disabled,
      readonly: groupProps?.readonly,
    }
  }),
)

const classList = computed(() => {
  return {
    s_radio: true,
    's_radio--column': groupProps?.column,
    's_radio--grow': groupProps?.grow,
  }
})

const classListButton = computed(() => {
  return {
    s_radio__button: true,
    's_radio__button--notSet': groupProps?.modelValue === null || groupProps?.modelValue === undefined,
    [`s_radio__button--color__${groupProps?.color}`]: !!groupProps?.color,
    ...classListBorder.value,
    's_radio__button--grow': groupProps?.grow,
    // TODO (Sura) classListBorder.value['s_outlined'] is not good. because it's hard to refer. improve in the future
    s_outlined: !!props.outlined || classListBorder.value.s_outlined,
    s_disabled: classListDisabled.value.s_disabled || classListRadioGroupDisabled.value.s_disabled,
  }
})

const classListInput = computed(() => {
  return {
    s_radio__input: true,
  }
})

const classListRadio = computed(() => {
  return {
    s_radio__radio: true,
    's_radio__radio--checked': isSelected.value,
  }
})

const classListLabel = computed(() => {
  return {
    s_radio__label: true,
    's_radio__label--checked': isSelected.value,
  }
})

const updateValue = async () => {
  toggleGroupItem()
  await nextTick()
  emit('update:checked', isSelected.value)
}
</script>

<style lang="scss">
.s_radio {
  &--column {
    display: flex;
    flex: 0 0 100%;
  }

  &--grow {
    display: flex;
    flex: 1;
  }

  &__button {
    @include s_button();
    // A long label wraps inside its column instead of running out of it.
    max-width: 100%;
    height: auto;
    min-height: #{map.get($s_button--sizes, 'default')}px;
    padding-block: $s_spacer;
    line-height: 1.25;
    text-align: start;
    text-indent: 0;
    white-space: normal;

    @each $colorName in $s_presetColorNames {
      &--color__#{$colorName} {
        .s_radio__label {
          /* stylelint-disable-next-line max-nesting-depth */
          &::before {
            border: 2px solid s_getPresetColor($colorName);
          }
          /* stylelint-disable-next-line max-nesting-depth */
          &--checked::after {
            background-color: s_getPresetColor($colorName);
          }
        }
      }
    }

    &--notSet {
      background-color: s_getAppColor('inputPlaceholderShown');
    }

    &--grow {
      flex: 1;
      justify-content: start;
    }
  }

  // Hidden from sight only: it stays in the accessibility tree and is the
  // radio's single Tab stop. `__button` (position: relative) keeps it in place.
  &__input {
    @include s_visuallyHidden();
  }

  &__radio {
    position: relative;
    padding-left: 32px;
    color: s_getAppColor('secondaryText');

    &::before {
      position: absolute;
      top: calc(50% - 12px);
      left: 0;
      width: 24px;
      height: 24px;
      cursor: pointer;
      content: '';
      background-color: s_getAppColor('card');
      border: 2px solid s_getAppColor('secondaryText');
      border-radius: 50%;
    }

    &--checked {
      color: s_getAppColor('textColor');

      &::before {
        border: 2px solid s_getPresetColor('info');
      }

      &::after {
        position: absolute;
        top: calc(50% - 6px);
        left: 6px;
        z-index: 2;
        width: 12px;
        height: 12px;
        content: '';
        background-color: s_getPresetColor('info');
        border-radius: 50%;
      }
    }
  }

  &__label {
    position: relative;
    pointer-events: none;
    cursor: inherit;
  }

  // Keyboard focus only, so a mouse click does not leave a ring behind
  &__input:focus-visible + &__radio::before {
    @include s_focusRing();
  }
}
</style>
