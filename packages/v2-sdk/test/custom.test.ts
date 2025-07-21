import { Hop } from '#index.js'
import { providers, Wallet, utils } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

// TODO: get ll this from config
const NETWORK = 'sepolia'

enum CHAINS {
  SEPOLIA = 'sepolia',
  OPTIMISM_SEPOLIA = 'optimismSepolia',
  BASE_SEPOLIA = 'baseSepolia'
}

const rpcUrls = {
  [CHAINS.SEPOLIA]: process.env.ETHEREUM_RPC_PROVIDER,
  [CHAINS.OPTIMISM_SEPOLIA]: process.env.OPTIMISM_RPC_PROVIDER,
  [CHAINS.BASE_SEPOLIA]: process.env.BASE_RPC_PROVIDER
}

const chainIds = {
  [CHAINS.SEPOLIA]: 11155111,
  [CHAINS.OPTIMISM_SEPOLIA]: 11155420,
  [CHAINS.BASE_SEPOLIA]: 84532
}

const mockTokens = {
  [CHAINS.SEPOLIA]: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
  [CHAINS.OPTIMISM_SEPOLIA]: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56',
  [CHAINS.BASE_SEPOLIA]: '0xA1d20347a0Aa549fC43dA9570e1E666E58614d56'
}

describe('Custom tests', () => {
  // Config
  const fromChain = CHAINS.BASE_SEPOLIA
  const toChain = CHAINS.SEPOLIA

  const provider = new providers.StaticJsonRpcProvider(rpcUrls[fromChain])
  const signer = new Wallet(privateKey, provider)
  const sdk = new Hop({
    network: NETWORK, 
    signersOrProviders: Object.assign({
      [chainIds[CHAINS.SEPOLIA]]: new providers.StaticJsonRpcProvider(rpcUrls[CHAINS.SEPOLIA]),
      [chainIds[CHAINS.OPTIMISM_SEPOLIA]]: new providers.StaticJsonRpcProvider(rpcUrls[CHAINS.OPTIMISM_SEPOLIA]),
      [chainIds[CHAINS.BASE_SEPOLIA]]: new providers.StaticJsonRpcProvider(rpcUrls[CHAINS.BASE_SEPOLIA])
    })
  })

  it.only('send a transfer', async () => {
    const fromChainId = chainIds[fromChain]
    const fromToken = mockTokens[fromChain]
    const toChainId = chainIds[toChain]
    const toToken = mockTokens[toChain]

    console.log(rpcUrls)

    const amount = parseUnits('1', 18)
    const minAmountOut = parseUnits('1', 18)
    const to = await signer.getAddress()

    console.log('a0')
    const txOptions = {
      gasPrice: 10_000_000_000, // 100 gwei
    }

    const txData = await sdk.populateTransaction.sendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut,
      to
    }, txOptions)
    console.log('a1', txData)
    console.log(txData)
    expect(txData).toBeDefined()

    await sdk.sendTransaction(txData, fromChainId, signer)
    console.log('a2')
  }, 60 * 1000)
})
