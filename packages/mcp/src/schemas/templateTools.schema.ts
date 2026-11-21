import { z } from 'zod'
import { MIN_TEMPLATE_CODE_LENGTH } from '../constants'

export const validateSuiTemplateInputSchema = z.object({
  code: z
    .string()
    .min(MIN_TEMPLATE_CODE_LENGTH)
    .describe('A full `.vue` SFC (with a `<template>` block) or a bare template fragment that uses SUI components.'),
})
