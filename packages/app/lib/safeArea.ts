import type { SafeAreaSide } from '@/app/types'

// The notch / home-indicator inset on one side, read from the `--s-safe-area-<side>` variable SApp sets
// (falling back to `env()` outside SApp). It is 0px without a safe area, so layouts stay unchanged there.
export const getSafeAreaInset = (side: SafeAreaSide) => {
  return `var(--s-safe-area-${side}, env(safe-area-inset-${side}, 0px))`
}

// A CSS length plus the inset on one side, e.g. a fixed app bar's height plus the notch.
export const getLengthWithSafeArea = (length: string | undefined, side: SafeAreaSide) => {
  return `calc(${length ?? '0px'} + ${getSafeAreaInset(side)})`
}
