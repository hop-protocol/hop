import * as bip39 from 'bip39'

const entropyToMnemonic = (entropy: Buffer): string => {
  return bip39.entropyToMnemonic(entropy)
}

export default entropyToMnemonic
