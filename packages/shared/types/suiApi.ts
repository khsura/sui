import type { z } from 'zod'
import type {
  suiApiComponentSchema,
  suiApiEventSchema,
  suiApiPropSchema,
  suiApiSchema,
  suiApiSlotSchema,
} from '../schemas'

export type SuiApi = z.infer<typeof suiApiSchema>
export type SuiApiComponent = z.infer<typeof suiApiComponentSchema>
export type SuiApiProp = z.infer<typeof suiApiPropSchema>
export type SuiApiSlot = z.infer<typeof suiApiSlotSchema>
export type SuiApiEvent = z.infer<typeof suiApiEventSchema>
