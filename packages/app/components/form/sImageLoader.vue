<template>
  <div class="s_imageLoader" :class="{ 's_imageLoader--empty': !model || model.length === 0 }">
    <label class="s_imageLoader__label" :for="id">{{ label }}</label>
    <SDroppable
      v-slot="{ supportsDragAndDrop }"
      :disabled="disabled"
      class="s_imageLoader__dropzone"
      @drop="onFileDrop"
    >
      <div>
        <div v-if="images.length" class="s_imageLoader__images">
          <slot name="images" :images="images">
            <div v-for="(source, index) in images" :key="index" class="s_imageLoader__imageColumn">
              <div class="s_imageLoader__imageWrapper">
                <SImage :src="source.url" :alt="`Upload image ${index + 1}`" class="s_imageLoader__image">
                  <div class="s_imageLoader__imageContent">
                    <SButton v-if="!hideRemoveButton" fab color="secondary" size="small" @click="source.remove()">
                      <SIcon icon="mdi-close"></SIcon>
                    </SButton>
                  </div>
                </SImage>
              </div>
            </div>
          </slot>
        </div>
        <template v-else>
          <div v-if="supportsDragAndDrop" class="s_imageLoader__info">
            <SIcon icon="mdi-camera-outline" size="extra"></SIcon>
            <div>Drag/Drop</div>
          </div>
          <div v-else no-gutters class="s_imageLoader__info">
            <SIcon v-if="multiple" icon="mdi-file-multiple-outline" size="extra"></SIcon>
            <SIcon v-else icon="mdi-file-outline" size="extra"></SIcon>
          </div>
        </template>

        <div class="s_imageLoader__action">
          <input
            :id="id"
            ref="input"
            class="s_imageLoader__input"
            type="file"
            :disabled="disabled ?? false"
            :accept="accept"
            :multiple="multiple"
            @change="onFileInputChange"
          />
          <slot name="activator" :on="{ click }" :attrs="{ disabled }" :disabled="disabled">
            <SButton aria-label="Upload file" rounded outlined :disabled="disabled" @click="click">
              <SIcon icon="mdi-image-area"></SIcon>
              Upload Image
            </SButton>
          </slot>
          <SFormInputError v-if="!hideDetails" :errors="errors"></SFormInputError>
          <SSnackbar
            :model-value="warningMessage !== null"
            location="bottom"
            @update:model-value="updateSnackbar($event)"
          >
            <div>{{ warningMessage }}</div>
            <template #action>
              <SButton text color="error" @click="updateSnackbar(false)">閉じる</SButton>
            </template>
          </SSnackbar>
        </div>
      </div>
    </SDroppable>
  </div>
</template>
<script setup lang="ts">
import SFormInputError from '@sui/app/components/form/common/sFormInputError.vue'
import SButton from '@sui/app/components/sButton.vue'
import SDroppable from '@sui/app/components/sDroppable.vue'
import SIcon from '@sui/app/components/sIcon.vue'
import SImage from '@sui/app/components/sImage.vue'
import SSnackbar from '@sui/app/components/sSnackbar.vue'
import { propsImageLoader } from '@sui/app/props'
import { useImageLoaderService, useFormInputService } from '@sui/app/services'
import { ref } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  hideRemoveButton: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  ...propsImageLoader(),
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: File[] | null): void
  (event: 'change', value: File[] | null): void
  (event: 'update:error', value: boolean): void
  (event: 'update:errors', value: string[]): void
  (event: 'update:dirty', value: boolean): void
}>()

const input = ref<HTMLInputElement | null>(null)
const { updateFormInput, errors } = useFormInputService<File[] | null>(props, emit)

const { model, onFileDrop, warningMessage, onFileInputChange, images } = useImageLoaderService(props, emit, {
  onChange: async (value) => {
    await updateFormInput(value ?? null, true)
    if (input.value) {
      input.value.files = null
      input.value.value = ''
    }
  },
})

const click = () => {
  if (!props.disabled) {
    input.value?.click()
  }
}

const updateSnackbar = (value: boolean | null | undefined) => {
  if (!value) {
    warningMessage.value = null
  }
}
</script>

<style lang="scss">
@import '@sui/app/styles/components/icon';

.s_imageLoader {
  @include s_outlined();
  padding: calc($s_spacer * 6);
  text-align: center;

  &__input {
    display: none;
  }

  &--empty {
    background-color: s_getPresetColor('warning');
  }

  &__label {
    font-weight: 700;
  }

  &__dropzone {
    @include s_outlined('secondary', 1.5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: calc($s_spacer * 8) calc($s_spacer * 8) calc($s_spacer * 4) calc($s_spacer * 8);
    border-width: 3px;
  }

  &__label + &__dropzone {
    margin-top: calc($s_spacer * 5);
  }

  &__info {
    @include s_typography('body__2');
    user-select: none;
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
  }

  &__image {
    padding: 4px;

    &Column {
      flex: 0 0 100%;
    }

    &Wrapper {
      display: inline-block;
    }

    &Content {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      height: 100%;
    }
  }

  &__action {
    padding-top: calc($s_spacer * 4);
  }
}
</style>
