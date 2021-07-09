import keythereum from 'keythereum'
import { randomBytes } from 'crypto'

const generateKeystore = (
  privateKey?: Buffer | string | null,
  passphrase?: string,
  options?: any
): any => {
  if (!privateKey) {
    privateKey = randomBytes(32)
  }

  if (!passphrase) {
    passphrase = ''
  }

  if (typeof privateKey === 'string') {
    privateKey = privateKey.trim().replace(/^0x/gi, '')
  }

  const salt = randomBytes(32)
  const iv = randomBytes(16)
  if (!options) {
    options = {
      kdf: 'pbkdf2',
      kdfparams: {
        c: 10000,
        dklen: 32,
        prf: 'hmac-sha256'
      },
      cipher: 'aes-128-ctr'
    }
  }

  if (typeof options === 'string') {
    options = JSON.parse(options.trim())
  }

  return new Promise(resolve => {
    keythereum.dump(
      passphrase,
      privateKey,
      salt,
      iv,
      options,
      (keyObject: any) => resolve(keyObject)
    )
  })
}

const recoverKeystore = async (
  keystore: any,
  passphrase: string
): Promise<any> => {
  if (typeof keystore === 'string') {
    keystore = JSON.parse(keystore.trim())
  }

  if (!passphrase) {
    passphrase = ''
  }

  try {
    const privateKey = await keythereum
      .recover(passphrase, keystore)
      .toString('hex')
    return privateKey
  } catch (err) {
    if (err.message === 'message authentication code mismatch') {
      throw new Error('keystore passphrase is invalid')
    }
    throw err
  }
}

export { generateKeystore, recoverKeystore }
