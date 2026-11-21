import { z } from 'zod'
import { MIN_GUIDE_TOPIC_LENGTH } from '../constants'

// A plain string (not an enum) so an unknown topic reaches the tool and gets the topic list back.
export const getGuideInputSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(MIN_GUIDE_TOPIC_LENGTH)
    .describe('Guide topic, e.g. `installation`, `theming`, `display`. Call list_guides for all topics.'),
})
