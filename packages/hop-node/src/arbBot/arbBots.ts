import arbBotsConfig from './example/arbBotsConfig.json'
import fs from 'fs'
import path from 'path'
import { ArbBot } from './ArbBot'

export type Options = {
  dryMode?: boolean
  configFilePath?: string
}

export async function startArbBots (options?: Options) {
  let configJson = arbBotsConfig as any
  if (options?.configFilePath) {
    configJson = JSON.parse(fs.readFileSync(path.resolve(options.configFilePath)).toString())
  }
  const globalDryMode = options?.dryMode
  const hasConfig = Object.keys(configJson).length > 0
  if (!hasConfig) {
    return new ArbBot({
      dryMode: globalDryMode
    }).start()
  }

  const bots: any = []

  for (const label in configJson) {
    const conf: any = configJson[label]
    if (!conf) {
      throw new Error('expected config')
    }
    const dryMode = conf.dryMode ?? globalDryMode
    const {
      network,
      l1ChainSlug,
      l2ChainSlug,
      tokenSymbol,
      amount,
      slippageTolerance,
      pollIntervalSeconds,
      ammDepositThresholdAmount,
      waitConfirmations
    } = conf

    console.log(`arb bot "${label}" enabled: ${!!conf.enabled}`)
    if (conf.enabled === false) {
      continue
    }

    const privateKey = process.env[`ARB_BOT_${label.toUpperCase()}_PRIVATE_KEY`]

    bots.push(
      new ArbBot({
        label,
        dryMode,
        network,
        l1ChainSlug,
        l2ChainSlug,
        tokenSymbol,
        amount,
        slippageTolerance,
        pollIntervalSeconds,
        ammDepositThresholdAmount,
        waitConfirmations,
        privateKey
      }).start()
    )
  }

  return Promise.all(bots)
}
