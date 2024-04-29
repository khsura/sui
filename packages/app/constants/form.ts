export const formEmitters = {
  'update:error': (_: boolean) => true,
  'update:errors': (_: string[]) => true,
} as const

export const formInputEmitters = {
  'update:dirty': (_: boolean) => true,
  ...formEmitters,
} as const
