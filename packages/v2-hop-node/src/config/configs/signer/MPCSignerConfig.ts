import { isValidUrl } from '#utils/isValidUrl.js'
import { validateRequiredKeys } from '../../utils.js'

export interface IMPCSignerConfig {
  mpcClientUrl: string
}

export async function validate(config: IMPCSignerConfig): Promise<void> {
  const requiredKeys: Array<keyof IMPCSignerConfig> = ['mpcClientUrl']
  validateRequiredKeys<IMPCSignerConfig>(config, requiredKeys)

  const { mpcClientUrl } = config
  if (mpcClientUrl.length !== 0 && !isValidUrl(mpcClientUrl)) {
    throw new Error('Invalid mpcClientUrl')
  }
}
