import { type useI18n } from 'vue-i18n'
import { type FormInputModelValueRule } from '@khsura/sui/types'

export const getFormInputModelValueRules = (i18n: Pick<ReturnType<typeof useI18n>, 't'>) => {
  return {
    /** @example `${options.target}を入力してください。` */
    required: (options: { target: string }): FormInputModelValueRule => {
      return (v) => !!v || i18n.t('formRules.required', options)
    },
    /** @example `${options.target}は${options.maxLength}文字以内で入力してください。` */
    maxLength: (options: { target: string; maxLength: number }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && v.toString().length <= options.maxLength) ||
          i18n.t('formRules.maxLength', options)
        )
      }
    },
    length: (options: { target: string; length: number }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && v.toString().length === options.length) ||
          i18n.t('formRules.length', options)
        )
      }
    },
    lengthNumeric: (options: { target: string; length: number }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && v.toString().length === options.length) ||
          i18n.t('formRules.lengthNumeric', options)
        )
      }
    },
    match: (options: { target: string; comparator: string; matchTo: RegExp }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && options.matchTo.test(v.toString())) ||
          i18n.t('formRules.lengthNumeric', options)
        )
      }
    },
    /** @example `${options.target}を${formatNumber(options.max)}${options.unit ?? ''}までの範囲で入力してください。` */
    maxUnit: (options: {
      target: string
      multiplier?: number
      max: number
      unit?: string
    }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && Number(v) * (options.multiplier ?? 1) <= options.max) ||
          i18n.t('formRules.maxUnit', options)
        )
      }
    },
    max: (options: { target: string; multiplier?: number; max: number }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && Number(v) * (options.multiplier ?? 1) <= options.max) ||
          i18n.t('formRules.max', options)
        )
      }
    },
    /** @example `${options.target}を${formatNumber(options.step)}${options.unit}単位で入力してください。` */
    step: (options: { target: string; multiplier?: number; step: number; unit: string }): FormInputModelValueRule => {
      return (v) => {
        return (
          (v !== null && v !== undefined && (Number(v) * (options.multiplier ?? 1)) % options.step === 0) ||
          i18n.t('formRules.step', options)
        )
      }
    },
    select: (options: { target: string }): FormInputModelValueRule => {
      return (v) => (v !== null && v !== undefined) || i18n.t('formRules.select', options)
    },
    shouldFix: (options: { target: string; pattern: RegExp }): FormInputModelValueRule => {
      return (v) =>
        (v !== null && v !== undefined && options.pattern.test(v.toString())) || i18n.t('formRules.shouldFix', options)
    },
    badInput: (options: { target: string; pattern: RegExp }): FormInputModelValueRule => {
      return (v) =>
        (v !== null && v !== undefined && options.pattern.test(v.toString())) || i18n.t('formRules.badInput', options)
    },
    matchPattern: (options: { target: string; pattern: RegExp }): FormInputModelValueRule => {
      return (v) =>
        (v !== null && v !== undefined && options.pattern.test(v.toString())) ||
        i18n.t('formRules.matchPattern', options)
    },
    numeric: (options: { target: string }): FormInputModelValueRule => {
      return (v) => (v !== null && v !== undefined && !Number.isNaN(Number(v))) || i18n.t('formRules.numeric', options)
    },
    integer: (options: { target: string }): FormInputModelValueRule => {
      return (v) =>
        (v !== null && v !== undefined && !Number.isNaN(Number(v)) && Number.isInteger(Number(v))) ||
        i18n.t('formRules.integer', options)
    },
  }
}
