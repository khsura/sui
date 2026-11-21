import packageJson from '../../package.json' with { type: 'json' }
import { SERVER_NAME } from '../constants'

export const serverInfo = {
  name: SERVER_NAME,
  version: packageJson.version,
}
