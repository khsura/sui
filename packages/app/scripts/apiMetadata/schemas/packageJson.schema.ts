import { z } from 'zod'

export const packageVersionSchema = z.object({ version: z.string() })
