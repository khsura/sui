import { type PropsImageLoader } from '@sui/app/definitions'
import { type EmitFormInput } from '@sui/app/types'
import { computed } from 'vue'
import { useFileReaderService } from './fileReaderService'

export const useImageLoaderService = (
  props: PropsImageLoader,
  emit: EmitFormInput<File[] | null>,
  options?: { onChange?: (value: PropsImageLoader['modelValue']) => void },
) => {
  const { model, getValidatedFiles, warningMessage } = useFileReaderService(props, emit, {
    onChange: options?.onChange,
  })

  const onFileDrop = (event: DragEvent) => {
    model.value = getValidatedFiles(event.dataTransfer?.files)
  }

  const removeFile = (file: File) => {
    const files = [...(model.value ?? [])]
    const index = files.indexOf(file)

    if (index > -1) {
      files.splice(index, 1)
    }

    model.value = files
  }

  const onFileInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement

    model.value = getValidatedFiles(input.files)
  }

  const files = computed(() => model.value ?? [])

  const images = computed(() => {
    return files.value.map((file) => {
      return {
        url: URL.createObjectURL(file),
        file,
        remove: () => {
          removeFile(file)
        },
      }
    })
  })

  return {
    model,
    onFileDrop,
    removeFile,
    files,
    images,
    getValidatedFiles,
    onFileInputChange,
    warningMessage,
  }
}
