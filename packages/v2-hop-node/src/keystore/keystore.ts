import keythereum from 'keythereum'
import { randomBytes } from 'node:crypto'

function generateKeystore (
  privateKey?: Buffer | string | null,
  passphrase?: string,
  options?: any
): any {
  let privateKeyBuffer: Buffer
  if (!privateKey) {
    privateKey = randomBytes(32)
  }

  if (!passphrase) {
    throw new Error('passphrase is required')
  }

  if (typeof privateKey === 'string') {
    privateKey = privateKey.trim().replace(/^0x/i, '')
    privateKeyBuffer = Buffer.from(privateKey, 'hex')
  } else {
    privateKeyBuffer = privateKey
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
      Buffer.from(passphrase),
      Buffer.from(privateKeyBuffer),
      salt,
      iv,
      options,
      (keyObject: any) => resolve(keyObject)
    )
  })
}

async function recoverKeystore (
  keystore: any,
  passphrase: string
): Promise<any> {
  if (typeof keystore === 'string') {
    keystore = JSON.parse(keystore.trim())
  }

  if (!passphrase) {
    passphrase = ''
  }

  try {
    // @ts-expect-error keythereum does not have an exported recover as of 20231227, even though they do
    const privateKey = await keythereum.recover(passphrase, keystore).toString('hex')
    return privateKey
  } catch (err) {
    if (err.message === 'message authentication code mismatch') {
      throw new Error('keystore passphrase is invalid')
    }
    throw err
  }
}

export { generateKeystore, recoverKeystore }
