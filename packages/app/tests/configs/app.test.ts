import { defaultAppConfig } from '@/app/configs'
import { AppTheme, minimumTextContrast } from '@/app/constants'
import { getContrastRatio, getReadableTextColor } from '@/app/lib'

const { themes } = defaultAppConfig
const lightText = themes[AppTheme.dark].appColors.text
const darkText = themes[AppTheme.light].appColors.text

// Each preset colour is drawn with the theme text colour SApp picks for it (`--s-color-<name>--text`).
describe.each(Object.values(AppTheme))('default %s theme contrast', (theme) => {
  const { appColors, presetColors } = themes[theme]

  test.each(Object.entries(presetColors))('text on %s (%s) reaches 4.5:1', (_name, background) => {
    const onColor = getReadableTextColor(background, lightText, darkText)

    expect(getContrastRatio(background, onColor)).toBeGreaterThanOrEqual(minimumTextContrast)
  })

  test.each([appColors.background, appColors.card])('form error text on %s reaches 4.5:1', (surface) => {
    expect(getContrastRatio(appColors.textError, surface)).toBeGreaterThanOrEqual(minimumTextContrast)
  })
})
