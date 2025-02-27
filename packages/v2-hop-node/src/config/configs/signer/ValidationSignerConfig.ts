import { isValidUrl } from '#utils/isValidUrl.js'
import { validateRequiredKeys } from '../../utils.js'

export interface IValidationSignerConfig {
  calldataValidationClientUrl: string
  stateValidationClientUrl: string
}

export async function validate(config: IValidationSignerConfig): Promise<void> {
  const requiredKeys: Array<keyof IValidationSignerConfig> = ['calldataValidationClientUrl', 'stateValidationClientUrl']
  validateRequiredKeys<IValidationSignerConfig>(config, requiredKeys)

  const { calldataValidationClientUrl, stateValidationClientUrl } = config
  if (calldataValidationClientUrl.length !== 0 && !isValidUrl(calldataValidationClientUrl)) {
    throw new Error('Invalid calldataValidationClientUrl')
  }

  if (stateValidationClientUrl.length !== 0 && !isValidUrl(stateValidationClientUrl)) {
    throw new Error('Invalid stateValidationClientUrl')
  }
}
