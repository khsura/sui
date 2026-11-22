<template>
  <section class="s_fileInput" :class="classList">
    <label v-if="label" v-show="!hideDetails" :for="inputId" class="s_fileInput__label">{{ label }}</label>
    <SDroppable class="s_fileInput__droppable" draggable="false" :disabled="isInactive" @drop="onDrop">
      <template #default="{ isDraggingOver }">
        <div
          class="s_fileInput__field"
          :aria-disabled="disabled || undefined"
          :class="{
            's_fileInput__field--drag': isDraggingOver,
            's_fileInput__field--error': hasError,
            ...classListDisabled,
          }"
        >
          <SIcon v-if="iconName" class="s_fileInput__icon" :icon="iconName" aria-hidden="true"></SIcon>
          <div class="s_fileInput__body">
            <span v-if="isDropzone" class="s_fileInput__dropText">{{ dropText }}</span>
            <span v-if="files.length === 0" class="s_fileInput__placeholder">{{ placeholder }}</span>
            <span v-else-if="display === 'chips'" class="s_fileInput__chips">
              <SChip
                v-for="(file, index) in files"
                :key="`${index}-${file.name}`"
                class="s_fileInput__chip"
                size="small"
              >
                <span class="s_fileInput__chipText">{{ getFileLabel(file) }}</span>
              </SChip>
            </span>
            <span v-else class="s_fileInput__text">{{ selectionText }}</span>
          </div>
          <input
            :id="inputId"
            ref="inputElement"
            v-bind="
              getCleanSetObject({
                ...ariaAttributesFormInput,
                'aria-label': ariaLabel ?? (hideDetails ? label : undefined),
                'aria-labelledby': ariaLabelledby,
                'aria-busy': loading || undefined,
                accept,
                multiple,
                name,
                disabled: isInactive,
              })
            "
            class="s_fileInput__input"
            type="file"
            @change="onChange"
            @keydown="onKeydown"
          />
          <SProgressCircular
            v-if="loading"
            class="s_fileInput__loader"
            :size="loaderSize"
            :aria-label="loadingAriaLabel"
            indeterminate
          ></SProgressCircular>
          <SButton
            v-else-if="clearable && files.length > 0 && !disabled && !readonly"
            class="s_fileInput__clear"
            :aria-label="clearAriaLabel"
            variant="icon"
            size="small"
            @click="clear"
          >
            <SIcon icon="mdi-close"></SIcon>
          </SButton>
        </div>
      </template>
    </SDroppable>
    <span class="s_fileInput__status" role="status">{{ announcement }}</span>
    <SFormInputError v-if="!hideDetails && !hideError" :id="errorId" :errors="errors"></SFormInputError>
  </section>
</template>
<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import SButton from './sButton.vue'
import SChip from './sChip.vue'
import SDroppable from './sDroppable.vue'
import SIcon from './sIcon.vue'
import SProgressCircular from './progress/sProgressCircular.vue'
import { SFormInputError } from './form/common'
import { fileInputDefaultIcons } from '@/app/configs'
import {
  FileInputDisplay,
  FileInputVariant,
  fileInputLoaderSize,
  fileInputNameSeparator,
  keyboardKey,
} from '@/app/constants'
import type { PropsFileInput } from '@/app/definitions'
import { formatFileSize, getIsFileAccepted } from '@/app/helpers'
import { getCleanSetObject } from '@/app/lib'
import {
  useComponentDefaultsService,
  useDisabledService,
  useFieldLayoutService,
  useFormInputService,
  useSizeService,
} from '@/app/services'
import { type EmitFileInput } from '@/app/types'

const rawProps = withDefaults(defineProps<PropsFileInput>(), {
  display: 'names',
  variant: 'input',
  clearAriaLabel: 'Clear',
  loadingAriaLabel: 'Loading',
  countText: '{count} files',
  dropText: 'Drop files here or click to browse',
})

const props = useComponentDefaultsService('SFileInput', rawProps)
const emit = defineEmits<EmitFileInput>()
const model = defineModel<File[] | null>()
const inputElement = useTemplateRef<HTMLInputElement>('inputElement')
/** The last change, read by screen readers from the `role="status"` element. */
const announcement = ref('')

const {
  updateFormInput,
  errors,
  hasError: hasRuleError,
  inputId,
  errorId,
  ariaAttributesFormInput,
} = useFormInputService<File[] | null>(props, emit, model)

const { classListDisabled } = useDisabledService(props)
const { classListSize } = useSizeService(props, { block: 'fileInput' })

const { classListField } = useFieldLayoutService(
  computed(() => ({
    hasLabel: !!props.label && !props.hideDetails,
    hasDetails: !props.hideDetails && !props.hideError,
  })),
)

const hasError = computed(() => !props.disabled && (hasRuleError.value || !!props.error))
const isDropzone = computed(() => props.variant === FileInputVariant.dropzone)
// `readonly` keeps the files shown but blocks picking, dropping and clearing.
const isInactive = computed(() => !!props.disabled || !!props.loading || !!props.readonly)
const files = computed(() => model.value ?? [])
const iconName = computed(() => props.icon ?? fileInputDefaultIcons[props.variant])
const loaderSize = fileInputLoaderSize

const classList = computed(() => {
  return {
    ...classListField.value,
    ...classListSize.value,
    [`s_fileInput--${props.variant}`]: true,
    's_fileInput--dense': !!props.dense,
    's_fileInput--disabled': !!props.disabled,
  }
})

const getFileLabel = (file: File) => (props.showSize ? `${file.name} (${formatFileSize(file.size)})` : file.name)
const getCountText = (count: number) => props.countText.replace('{count}', count.toString())

const selectionText = computed(() => {
  if (props.display === FileInputDisplay.count && files.value.length > 1) {
    return getCountText(files.value.length)
  }

  return files.value.map(getFileLabel).join(fileInputNameSeparator)
})

/** Mirrors the model into the native input, so its own state (and a plain form submit) matches what is shown. */
const syncNativeFiles = (nextFiles: File[]) => {
  const element = inputElement.value

  if (!element) {
    return
  }

  if (nextFiles.length === 0) {
    // An empty value lets the browser fire `change` again when the same file is picked after clearing.
    element.value = ''

    return
  }

  if (typeof DataTransfer === 'undefined') {
    return
  }

  const transfer = new DataTransfer()

  nextFiles.forEach((file) => transfer.items.add(file))
  element.files = transfer.files
}

watch(files, syncNativeFiles)

const setFiles = async (pickedFiles: File[]) => {
  const acceptedFiles = pickedFiles.filter((file) => getIsFileAccepted(file, props.accept))
  const keptFiles = props.multiple ? acceptedFiles : acceptedFiles.slice(0, 1)
  const rejectedFiles = pickedFiles.filter((file) => !keptFiles.includes(file))

  if (rejectedFiles.length > 0) {
    emit('reject', rejectedFiles)
  }

  if (keptFiles.length === 0) {
    // Nothing usable: keep the current files rather than emptying the field.
    syncNativeFiles(files.value)

    return
  }

  model.value = keptFiles
  announcement.value = keptFiles.length > 1 ? getCountText(keptFiles.length) : (keptFiles[0]?.name ?? '')
  await updateFormInput(keptFiles)
}

const onChange = async (event: Event) => {
  const element = event.target

  if (!(element instanceof HTMLInputElement)) {
    return
  }

  const pickedFiles = Array.from(element.files ?? [])

  // A cancelled picker reports no files: keep the current ones.
  if (pickedFiles.length === 0) {
    syncNativeFiles(files.value)

    return
  }

  await setFiles(pickedFiles)
}

const onDrop = async (event: DragEvent) => {
  if (isInactive.value) {
    return
  }

  await setFiles(Array.from(event.dataTransfer?.files ?? []))
}

/** Enter and Space open the picker in every browser, not only in those whose file input already does it. */
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== keyboardKey.enter && event.key !== keyboardKey.space) {
    return
  }

  event.preventDefault()
  inputElement.value?.click()
}

const clear = async () => {
  model.value = null
  announcement.value = ''
  emit('clear')
  inputElement.value?.focus()
  await updateFormInput(null)
}

defineExpose({
  validate: updateFormInput,
  clear,
})
</script>
<style lang="scss">
// Sizes come from !default variables, never hard-coded in a rule, so a global density can scale them later.
$s_fileInput--padding: calc($s_spacer * 2) !default;
$s_fileInput--horizontalPadding: calc($s_spacer * 4) !default;
$s_fileInput--gap: calc($s_spacer * 2) !default;
$s_fileInput--dropzonePadding: calc($s_spacer * 6) !default;
$s_fileInput--dropzoneIconSize: 2.5rem !default;
$s_fileInput--dropzoneBorderWidth: 2px !default;
$s_fileInput--fontSizes: (
  'mini': 1rem,
  'small': 1rem,
  'default': 1rem,
  'large': 1.25rem,
  'extra': 1.5rem,
) !default;

.s_fileInput {
  display: block;
  width: 100%;

  // A flex or grid parent must not stretch the field past its box when a file name is long.
  min-width: 0;
  max-width: 100%;

  &__label {
    @include s_typography('caption');
    display: block;
    padding: $s_spacer $s_fileInput--horizontalPadding;
    color: s_getAppColor('secondaryText');
  }

  &__field {
    @include s_borderRadius();
    position: relative;
    display: flex;
    gap: $s_fileInput--gap;
    align-items: center;
    min-width: 0;
    padding: $s_fileInput--padding $s_fileInput--horizontalPadding;
    font-family: $s_inputFontFamily;
    font-size: 1rem;
    line-height: 1.1;
    color: s_getAppColor('text');
    cursor: pointer;
    background-color: s_getAppColor('card');
    border: thin s_getAppColor('border') solid;

    // The native input covers the field, so the ring shows on the box it fills; keyboard focus only.
    &:has(.s_fileInput__input:focus-visible) {
      @include s_focusRing(-2px);
    }

    &--drag {
      outline: 2px dashed s_getPresetColor('primary');
      outline-offset: -2px;
      border-color: s_getPresetColor('primary');
    }

    &--error {
      border-color: s_getPresetColor('error');
    }

    &.s_disabled {
      color: s_getAppColor('disabled');
      cursor: default;
      background-color: transparent;
    }
  }

  &__icon {
    flex: 0 0 auto;
    color: s_getAppColor('secondaryText');
  }

  // A zero width: a long file name adds nothing to the field's own width, so in SFormRow the field shares the
  // line with its button instead of wrapping onto a line of its own.
  &__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: $s_spacer;
    width: 0;
    min-width: 0;
  }

  &__placeholder,
  &__text,
  &__chipText {
    display: block;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__placeholder {
    color: s_getAppColor('secondaryText');
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $s_spacer;
    min-width: 0;
    max-width: 100%;
  }

  &__chip {
    max-width: 100%;

    .s_chip__content {
      min-width: 0;
      max-width: 100%;
    }
  }

  // Invisible but real: it takes the clicks, the keyboard focus and the drops, and screen readers announce it.
  &__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: inherit;
    opacity: 0;

    &:disabled {
      cursor: default;
    }
  }

  // Above the native input, so it is clicked instead of opening the picker.
  &__clear,
  &__loader {
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
  }

  &__status {
    @include s_visuallyHidden();
  }

  &--size {
    @each $key, $size in $s_fileInput--fontSizes {
      &__#{$key} .s_fileInput__field {
        font-size: $size;
      }
    }
  }

  &--dense {
    .s_fileInput__field {
      padding: $s_fileInput--padding;
    }

    .s_fileInput__label {
      padding: $s_spacer $s_fileInput--padding;
    }
  }

  &--disabled .s_fileInput__label {
    color: s_getAppColor('disabled');
  }

  &--dropzone {
    .s_fileInput__field {
      flex-direction: column;
      justify-content: center;
      padding: $s_fileInput--dropzonePadding $s_fileInput--horizontalPadding;
      text-align: center;
      border-style: dashed;
      border-width: $s_fileInput--dropzoneBorderWidth;
    }

    .s_fileInput__icon {
      font-size: $s_fileInput--dropzoneIconSize;
    }

    .s_fileInput__body {
      align-items: center;
      width: 100%;
    }

    .s_fileInput__chips {
      justify-content: center;
    }

    .s_fileInput__placeholder,
    .s_fileInput__text,
    .s_fileInput__dropText {
      max-width: 100%;
    }

    .s_fileInput__clear,
    .s_fileInput__loader {
      position: absolute;
      top: $s_spacer;
      right: $s_spacer;
    }
  }
}
</style>
