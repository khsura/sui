export const propsStepperStep = () => {
  return {
    step: {
      type: Number,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  }
}
