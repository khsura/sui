import type { z } from 'zod'
import type { visualThemes } from '../constants'
import type { storyIndexEntrySchema } from '../schemas'

export type StoryIndexEntry = z.infer<typeof storyIndexEntrySchema>

export type VisualTheme = (typeof visualThemes)[number]

export type VisualOptions = {
  theme: VisualTheme
}
