import { createI18n } from 'vue-i18n'
import { getFormInputModelValueRules } from '@/app/repositories/form'
import { i18nConfig } from '@/app/configs'

// Regression: focusing an empty number SInput runs updateFormInput(null), which renders
// the `max` rule message. The message used to abuse vue-i18n linked-message-with-modifier
// syntax (@.formatNumber:{'max'}), passing the literal "max" into formatNumber and throwing
// "expected number, received NaN". The max value must now be formatted and interpolated.
describe('formRules max/maxUnit/step number formatting', () => {
  const buildRules = (locale: string, legacy: boolean) => {
    const i18n = createI18n({ ...i18nConfig, legacy, locale })

    // global.t is present in both legacy and composition modes
    return getFormInputModelValueRules(i18n.global as unknown as Parameters<typeof getFormInputModelValueRules>[0])
  }

  for (const legacy of [false, true]) {
    describe(`legacy: ${legacy}`, () => {
      test('max rule renders without throwing for a null value (focus path)', () => {
        const rules = buildRules('en', legacy)
        const maxRule = rules.max({ target: 'amount', max: 9000 })

        expect(() => maxRule(null)).not.toThrow()
      })

      test('max rule formats the limit (en -> 9,000)', () => {
        const rules = buildRules('en', legacy)
        const message = rules.max({ target: 'amount', max: 9000 })(99999)

        expect(typeof message).toBe('string')
        expect(message).toContain('9,000')
      })

      test('maxUnit rule formats the limit and keeps the unit (mn)', () => {
        const rules = buildRules('mn', legacy)
        const message = rules.maxUnit({ target: 'amount', max: 9000, unit: '₮' })(99999)

        expect(typeof message).toBe('string')
        expect(message as string).toContain('9,000')
        expect(message as string).toContain('₮')
      })

      test('step rule renders without throwing (ja)', () => {
        const rules = buildRules('ja', legacy)
        const stepRule = rules.step({ target: 'amount', step: 100, unit: '円' })

        expect(() => stepRule(150)).not.toThrow()
        expect(stepRule(150)).toContain('100')
      })
    })
  }
})
