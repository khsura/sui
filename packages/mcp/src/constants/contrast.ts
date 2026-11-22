/** `#rgb` or `#rrggbb` (case-insensitive): the hex digits. */
export const HEX_COLOR_PATTERN = /^#([\da-f]{3}|[\da-f]{6})$/i
export const SHORT_HEX_LENGTH = 3
export const HEX_RADIX = 16
export const SRGB_CHANNEL_MAX = 255

// WCAG 2.x relative luminance (sRGB linearisation and channel weights) and contrast flare.
export const SRGB_LINEAR_THRESHOLD = 0.04045
export const SRGB_LINEAR_DIVISOR = 12.92
export const SRGB_GAMMA_OFFSET = 0.055
export const SRGB_GAMMA_DIVISOR = 1.055
export const SRGB_GAMMA = 2.4
export const LUMINANCE_WEIGHT_RED = 0.2126
export const LUMINANCE_WEIGHT_GREEN = 0.7152
export const LUMINANCE_WEIGHT_BLUE = 0.0722
export const CONTRAST_FLARE = 0.05

/** WCAG AA minimum contrast for body text. */
export const MINIMUM_TEXT_CONTRAST = 4.5
