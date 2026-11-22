import { z } from 'zod'
import { COMPONENT_NAME_PATTERN } from '../constants'

export const componentNameSchema = z
  .string()
  .regex(
    COMPONENT_NAME_PATTERN,
    'Use a PascalCase name such as `Avatar` or `SkeletonLoader` (the `S` prefix is optional).',
  )
