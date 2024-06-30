import * as bip39 from 'bip39'

export const entropyToMnemonic = (entropy: Buffer): string => {
  return bip39.entropyToMnemonic(entropy)
}
