import { getLengthWithSafeArea, getSafeAreaInset } from '@/app/lib'

describe('safeArea', () => {
  test('reads the SApp variable and falls back to env(), then 0px', () => {
    expect(getSafeAreaInset('bottom')).toBe('var(--s-safe-area-bottom, env(safe-area-inset-bottom, 0px))')
  })

  test('adds the inset to a length', () => {
    expect(getLengthWithSafeArea('56px', 'bottom')).toBe(
      'calc(56px + var(--s-safe-area-bottom, env(safe-area-inset-bottom, 0px)))',
    )
  })

  test('treats a missing length as 0px', () => {
    expect(getLengthWithSafeArea(undefined, 'top')).toBe(
      'calc(0px + var(--s-safe-area-top, env(safe-area-inset-top, 0px)))',
    )
  })
})
