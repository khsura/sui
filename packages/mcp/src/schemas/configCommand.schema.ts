import { z } from 'zod'
import { MCP_CLIENT_IDS } from '../constants'

export const mcpClientIdSchema = z.enum(MCP_CLIENT_IDS)
