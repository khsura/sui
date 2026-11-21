import { z } from 'zod'

// The subset of Storybook's `index.json` (static build output) the visual harness reads.
export const storyIndexEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  name: z.string(),
  type: z.string(),
  tags: z.array(z.string()),
})

export const storyIndexSchema = z.object({
  entries: z.record(z.string(), storyIndexEntrySchema),
})
