/** How SNumberInput lays out its increment and decrement buttons. */
export const numberInputControlVariants = ['stacked', 'split'] as const
/** Layout of the controls when `controlVariant` is not set: both buttons stacked at the end of the field. */
export const numberInputDefaultControlVariant = 'stacked'
/** Amount one increment, decrement or arrow key adds or removes when `step` is not set. */
export const numberInputDefaultStep = 1
/** Decimal places kept when `precision` is not set: whole numbers only. */
export const numberInputDefaultPrecision = 0
/** Default accessible name of the increment button. */
export const numberInputIncrementLabel = 'Increase'
/** Default accessible name of the decrement button. */
export const numberInputDecrementLabel = 'Decrease'
/** Icon of the increment button. */
export const numberInputIncrementIcon = 'mdi-plus'
/** Icon of the decrement button. */
export const numberInputDecrementIcon = 'mdi-minus'
/** Icon of the increment button when the buttons are stacked. */
export const numberInputStackedIncrementIcon = 'mdi-chevron-up'
/** Icon of the decrement button when the buttons are stacked. */
export const numberInputStackedDecrementIcon = 'mdi-chevron-down'
/** Most decimal places `Number.prototype.toFixed` accepts. */
export const numberInputMaxPrecision = 100
