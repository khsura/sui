import { AppTheme } from '@sui/app/constants'
import * as states from '@sui/app/reactives/frameworkReactive'
import { createAppState } from '@sui/app/helpers/createAppState'
import { useAppService } from '@sui/app/services'
import { useTheme } from '@sui/app/index'

describe('app', () => {
  vi.spyOn(states, 'frameworkReactive', 'get').mockReturnValue(createAppState())
  const { styles } = useAppService({ app: true, name: null })
  const { setTheme, theme } = useTheme()

  beforeEach(() => {
    setTheme(AppTheme.light)
  })

  it('by default light theme will be used', () => {
    expect(theme.value).toBe(AppTheme.light)

    expect(
      Object.entries(styles.value)
        .filter(([key]) => !key.includes('--light') && !key.includes('--dark') && !key.includes('--text'))
        .every(([_, value]) => value.includes('Light')),
    ).toBe(true)
  })

  it('can change theme', () => {
    setTheme(AppTheme.dark)
    expect(theme.value).toBe(AppTheme.dark)
    expect(
      Object.entries(styles.value)
        .filter(([key]) => !key.includes('--light') && !key.includes('--dark') && !key.includes('--text'))
        .every(([_, value]) => value.includes('Dark')),
    ).toBe(true)
  })

  it('theme getter works', () => {
    states.frameworkReactive.theme = AppTheme.dark
    expect(theme.value).toBe(AppTheme.dark)
  })
})
