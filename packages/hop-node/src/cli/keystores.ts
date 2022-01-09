import clearConsole from 'console-clear'
import entropyToMnemonic from 'src/keystore/entropyToMnemonic'
import fs from 'fs'
import path from 'path'
import { HDNode } from '@ethersproject/hdnode'
import { actionHandler, parseBool, parseString, root } from './shared'
import {
  defaultKeystoreFilePath
} from 'src/config'
import { generateKeystore, recoverKeystore } from 'src/keystore'
import { hopArt } from './shared/art'
import { prompt, promptPassphrase } from 'src/prompt'
import { randomBytes } from 'crypto'

enum Actions {
  Generate = 'generate',
  Decrypt = 'decrypt',
  Reencrypt = 'reencrypt',
  Address = 'address'
}

root
  .command('keystore')
  .description('Keystore')
  .option('--pass <secret>', 'Passphrase to encrypt keystore with.', parseString)
  .option('--path <path>', 'File path of encrypted keystore.', parseString)
  .option('--override [boolean]', 'Override existing keystore if it exists.', parseBool)
  .option('--private-key <private-key>', 'The private key to encrypt.', parseString)
  .action(actionHandler(main))

async function main (source: any) {
  let { override, args, pass: passphrase, path: keystoreFilePath, privateKey } = source
  const action = args[0]
  const actionOptions = Object.values(Actions)

  if (!action) {
    throw new Error('please specify subcommand')
  }
  if (!actionOptions.includes(action)) {
    throw new Error(`Please choose a valid option. Valid options include ${actionOptions}.`)
  }
  keystoreFilePath = keystoreFilePath || defaultKeystoreFilePath
  if (!keystoreFilePath) {
    throw new Error('please specify keystore filepath')
  }

  if (action === Actions.Generate) {
    if (!passphrase) {
      passphrase = await generatePassphrase()
    }
    let mnemonic: string | undefined
    const hdpath = 'm/44\'/60\'/0\'/0/0'
    if (!privateKey) {
      const entropy = randomBytes(32)
      mnemonic = entropyToMnemonic(entropy)
      let hdnode = HDNode.fromMnemonic(mnemonic)
      hdnode = hdnode.derivePath(hdpath)
      privateKey = hdnode.privateKey

      clearConsole()
      prompt.start()
      prompt.message = ''
      prompt.delimiter = ''
      await prompt.get({
        properties: {
          blank: {
            message: `
This is your seed phrase. Write it down and store it safely.

${mnemonic}

Press [Enter] when you have written down your mnemonic.`
          }
        }
      } as any)
    }

    clearConsole()
    if (mnemonic) {
      let mnemonicConfirmed = false
      while (!mnemonicConfirmed) {
        let { mnemonicConfirm } = await prompt.get({
          properties: {
            mnemonicConfirm: {
              message:
                'Please type mnemonic (separated by spaces) to confirm you have written it down\n\n:'
            }
          }
        } as any)

        clearConsole()
        mnemonicConfirm = (mnemonicConfirm as string).trim()
        if (mnemonicConfirm === mnemonic) {
          mnemonicConfirmed = true
        } else {
          await prompt.get({
            properties: {
              blank: {
                message: `
The seed phrase you entered was incorrect.

Press [Enter] to try again.`
              }
            }
          } as any)
          clearConsole()
        }
      }
    }

    const keystore = await generateKeystore(privateKey, passphrase)
    const filepath = path.resolve(keystoreFilePath)
    const exists = fs.existsSync(filepath)
    if (exists) {
      if (!override) {
        throw new Error(
          'ERROR: file exists. Did not override. Use --override flag to override.'
        )
      }
    }
    fs.writeFileSync(filepath, JSON.stringify(keystore), 'utf8')

    await prompt.get({
      properties: {
        blank: {
          message: `
ㅤ${hopArt}
Creating your keys
Creating your keystore
Public address: 0x${keystore.address}
Your keys can be found at: ${filepath}

Keystore generation is complete.
Press [Enter] to exit.
`
        }
      }
    } as any)
    clearConsole()
  } else if (action === Actions.Decrypt) {
    if (!passphrase) {
      passphrase = await promptPassphrase()
    }
    const keystore = getKeystore(keystoreFilePath)
    const recoveredPrivateKey = await recoverKeystore(keystore, passphrase)
    console.log(recoveredPrivateKey) // intentional log
  } else if (action === Actions.Reencrypt) {
    if (!passphrase) {
      passphrase = await promptPassphrase()
    }
    const oldPassphrase = passphrase
    let keystore = getKeystore(keystoreFilePath)
    const recoveredPrivateKey = await recoverKeystore(keystore, oldPassphrase)

    const newPassphrase = await generatePassphrase()
    keystore = await generateKeystore(recoveredPrivateKey, newPassphrase)
    fs.writeFileSync(keystoreFilePath, JSON.stringify(keystore), 'utf8')
    console.log(`
ㅤ${hopArt}
Public address: 0x${keystore.address}
Your keys can be found at: ${keystoreFilePath}

Keystore reencryption is complete.
`
    )
  } else if (action === Actions.Address) {
    const keystore = getKeystore(keystoreFilePath)
    const address = keystore.address
    console.log(`0x${address}`) // intentional log
  }
}

async function generatePassphrase(): Promise<string> {
  const passphrase = await promptPassphrase(
    'Enter new keystore encryption passphrase'
  )
  const passphraseConfirm = await promptPassphrase('Confirm passphrase')
  if (passphrase !== passphraseConfirm) {
    throw new Error('ERROR: passphrases did not match')
  }

  return (passphrase as string)
}

function getKeystore(filepath: string): any{
  try {
    return JSON.parse(
      fs.readFileSync(path.resolve(filepath), 'utf8')
    )
  } catch (err) {
    throw new Error(`keystore does not exist at ${filepath}`)
  }
}