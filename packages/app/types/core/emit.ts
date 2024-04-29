export type EmitModelValue<ModelValue, ModelName extends string = 'modelValue'> = (
  event: `update:${ModelName}`,
  value: ModelValue,
) => void
