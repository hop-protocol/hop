import clearConsole from 'console-clear'
import entropyToMnemonic from 'src/utils/entropyToMnemonic'
import fs from 'fs'
import path from 'path'
import {
  FileConfig,
  defaultKeystoreFilePath,
  parseConfigFile,
  setGlobalConfigFromConfigFile
} from 'src/config'
import { HDNode } from '@ethersproject/hdnode'
import { generateKeystore, recoverKeystore } from 'src/keystore'
import { hopArt } from './shared/art'
import { logger, program } from './shared'
import { prompt, promptPassphrase } from 'src/prompt'
import { randomBytes } from 'crypto'

program
  .command('keystore')
  .description('Keystore')
  .option('--config <string>', 'Config file to use.')
  .option('--env <string>', 'Environment variables file')
  .option('--pass <string>', 'Passphrase to encrypt keystore with.')
  .option('-o, --output <string>', 'Output file path of encrypted keystore.')
  .option('--override', 'Override existing keystore if it exists.')
  .option('--private-key <string>', 'The private key to encrypt.')
  .action(async (source: any) => {
    try {
      const configPath = source?.config || source?.parent?.config
      if (configPath) {
        const config: FileConfig = await parseConfigFile(configPath)
        await setGlobalConfigFromConfigFile(config)
      }
      const action = source.args[0]
      let passphrase = source.pass
      const output = source.output || defaultKeystoreFilePath
      if (!action) {
        throw new Error('please specify subcommand')
      }
      if (action === 'generate') {
        if (!passphrase) {
          passphrase = await promptPassphrase(
            'Enter new keystore encryption password'
          )
          const passphraseConfirm = await promptPassphrase('Confirm password')
          if (passphrase !== passphraseConfirm) {
            throw new Error('ERROR: passwords did not match')
          }
        }
        let mnemonic: string
        const hdpath = 'm/44\'/60\'/0\'/0/0'
        let privateKey: string | null = source.privateKey || null
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
          if (mnemonicConfirm !== mnemonic) {
            throw new Error('ERROR: mnemonic entered is incorrect')
          }
        }

        const keystore = await generateKeystore(privateKey, passphrase)
        const filepath = path.resolve(output)
        const exists = fs.existsSync(filepath)
        if (exists) {
          const override = !!source.override
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
      } else if (action === 'decrypt') {
        if (!passphrase) {
          passphrase = await promptPassphrase()
        }
        const filepath = source.args[1] || defaultKeystoreFilePath
        if (!filepath) {
          throw new Error('please specify filepath')
        }
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        const privateKey = await recoverKeystore(keystore, passphrase)
        console.log(privateKey) // intentional log
      } else if (action === 'address') {
        const filepath = source.args[1] || defaultKeystoreFilePath
        if (!filepath) {
          throw new Error('please specify filepath')
        }
        const keystore = JSON.parse(
          fs.readFileSync(path.resolve(filepath), 'utf8')
        )
        const address = keystore.address
        console.log('0x' + address) // intentional log
      } else {
        console.log(`unsupported command: "${action}"`) // intentional log
      }
    } catch (err) {
      logger.error(err.message)
      process.exit(1)
    }
  })
