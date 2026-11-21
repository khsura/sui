import { z } from 'zod'
import { MIN_COMPONENT_NAME_LENGTH } from '../constants'

export const getComponentApiInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(MIN_COMPONENT_NAME_LENGTH)
    .describe('Component name: `SButton`, `s-button` or `button` (case-insensitive).'),
})
