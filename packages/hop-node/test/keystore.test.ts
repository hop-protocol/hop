import entropyToMnemonic from 'src/utils/entropyToMnemonic'
import { generateKeystore, recoverKeystore } from 'src/keystore'

test('generateKeystore - random', async () => {
  const keystore = await generateKeystore()
  expect(keystore.address.length).toBe(40)
})

test('generateKeystore - from private key', async () => {
  const privateKey =
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const keystore = await generateKeystore(privateKey)
  expect(keystore.address).toBe('90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
})

test('generateKeystore - with passphrase', async () => {
  const privateKey =
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const passphrase = 'mysecret'
  const keystore = await generateKeystore(privateKey, passphrase)
  expect(keystore.address).toBe('90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
})

test('generateKeystore - with options', async () => {
  const privateKey =
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  const passphrase = 'mysecret'
  const options = {
    kdf: 'pbkdf2',
    kdfparams: {
      c: 1000,
      dklen: 32,
      prf: 'hmac-sha256'
    },
    cipher: 'aes-128-ctr'
  }

  const keystore = await generateKeystore(privateKey, passphrase, options)
  expect(keystore.address).toBe('90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
  expect(keystore.crypto.kdfparams.c).toBe(1000)
})

test('recoverKeystore', async () => {
  const keystore = {
    address: '90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    crypto: {
      cipher: 'aes-128-ctr',
      ciphertext:
        '99261fb5cbc95fb91215e60bf65f7a5060bcc7e18df72bdaaf60379a93fab05c',
      cipherparams: { iv: '1b451e34514902201ab320a00a51c8a1' },
      mac: '964873dc9e21f4a5f59fd79844727aee7391c17b55bce7d3d178782b5de62a01',
      kdf: 'pbkdf2',
      kdfparams: {
        c: 1000,
        dklen: 32,
        prf: 'hmac-sha256',
        salt: 'b8f30f71c7db97becc69b991203808c70d02804c31e07802f8b82c6ccc51401b'
      }
    },
    id: 'daeeb6a6-c749-4457-9e3c-9c6c74bd747a',
    version: 3
  }
  const passphrase = 'mysecret'

  const privateKey = await recoverKeystore(keystore, passphrase)
  expect(privateKey).toBe(
    '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
  )
})

test('entropyToMnemonic', async () => {
  const entropy = Buffer.alloc(32, 'a')
  expect(entropyToMnemonic(entropy)).toEqual(
    'gesture arch flame security bid radar machine club gesture arch flame security bid radar machine club gesture arch flame security bid radar machine cherry'
  )
})
