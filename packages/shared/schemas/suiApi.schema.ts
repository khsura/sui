import { z } from 'zod'

export const suiApiPropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string(),
  enumValues: z.array(z.string()).optional(),
})

export const suiApiSlotSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
  /** Regex source for a dynamic slot family (e.g. `^item\\..+$` for `item.<column>`); `name` is then a readable label. */
  pattern: z.string().optional(),
})

export const suiApiEventSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string(),
})

export const suiApiComponentSchema = z.object({
  name: z.string(),
  family: z.string(),
  file: z.string(),
  props: z.array(suiApiPropSchema),
  slots: z.array(suiApiSlotSchema),
  events: z.array(suiApiEventSchema),
})

export const suiApiSchema = z.object({
  package: z.literal('@khsura/sui'),
  version: z.string(),
  generatedAt: z.iso.datetime(),
  components: z.array(suiApiComponentSchema),
})
