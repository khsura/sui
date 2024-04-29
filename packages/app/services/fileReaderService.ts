import { mimeTypeToFileType } from '@sui/app/constants'
import { type FileMimeType } from '@sui/app/constants'
import { type PropsImageLoader } from '@sui/app/definitions'
import { type EmitFormInput } from '@sui/app/types'
import { ref } from 'vue'
import { type Ref } from 'vue'
import { useModelService } from './core'

export const useFileReaderService = (
  props: PropsImageLoader,
  emit: EmitFormInput<File[] | null>,
  options?: { onChange?: undefined | ((value: PropsImageLoader['modelValue']) => void) },
) => {
  const warningMessage: Ref<string | null> = ref(null)

  const model = useModelService(props, emit, 'modelValue', {
    noParsing: true,
    noEmitOnWatch: true,
    onChange: options?.onChange,
  })

  const getValidatedFiles = (newFiles: FileList | File[] | null | undefined): File[] => {
    const falbackValue = [...(model.value ?? [])]
    const incommingValue = [...(newFiles ? Array.from(newFiles) : [])]
    const files = props.incremental ? [...falbackValue, ...incommingValue] : incommingValue

    const getWarningMessage = () => {
      if (!props.multiple && files.length > 1) {
        return '複数ファイル選択は不可能です。'
      }

      if (incommingValue.some((newFile) => falbackValue.find((oldFile) => oldFile.name === newFile.name))) {
        return '同名のファイル画像は指定できません'
      }

      if (props.multiple && props.maxCount && files.length > props.maxCount) {
        return `ファイル画像は最大${props.maxCount}枚まで指定できます`
      }

      if (props.maxSize && !files.every((file) => file.size <= props.maxSize)) {
        return 'サイズ上限を超えたファイルがあります。'
      }

      if (props.fileTypes.length > 0 && !files.every((file) => props.fileTypes.includes(file.type as FileMimeType))) {
        const types = props.fileTypes
          .map((type) => mimeTypeToFileType[type] ?? type.replace(/^image\//, ''))
          .join('または')

        return `ファイル画像は${types}を指定してください`
      }

      return null
    }

    warningMessage.value = getWarningMessage()

    return warningMessage.value === null ? files : falbackValue
  }

  return {
    getValidatedFiles,
    warningMessage,
    model,
  }
}
