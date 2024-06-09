import { Base } from '#common/Base.js'
import { providers, Wallet } from 'ethers'
import dotenv from 'dotenv'
import { randomBytes } from 'crypto'

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe.skip('Base', () => {
  const base = new Base({
    network: 'mainnet'
  })
  it('should get contract addresses', () => {
    const addresses = base.getContractAddresses()
    console.log(addresses)
    expect(addresses).toBeDefined()
  })
  it('should set contract addresses', () => {
    let addresses = base.getContractAddresses()
    addresses['99999'] = {
      chainId: '99999',
      startBlock: 0,
      spokeCoreMessenger: '',
      connector: '',
      railsGateway: ''
    }
    base.setContractAddresses(addresses)
    addresses = base.getContractAddresses()
    console.log(addresses)
    expect(addresses['99999']).toBeDefined()
  })
  it('should get default chain rpc provider', () => {
    const chainId = 1
    const providers = base.getDefaultChainRpcProvider(chainId)
    // console.log(provider)
    expect(providers).toBeDefined()
  })
  it('should get default chain rpc providers', () => {
    const providers = base.getDefaultChainRpcProviders()
    // console.log(providers)
    expect(providers).toBeDefined()
  })
  it('should connect signer', () => {
    expect(base.signer).toBeUndefined()
    const signer = new Wallet(privateKey)
    const baseWithSigner = base.connect(signer)
    expect(baseWithSigner.signer).toBeDefined()
  })
  it('should return boolean if chain id valid', () => {
    expect(base.utils.isValidChainId(1)).toBe(true)
    expect(base.utils.isValidChainId(222222)).toBe(false)
  })
  it('should return boolean if tx hash is valid', () => {
    expect(base.utils.isValidTxHash('0x'+'1'.repeat(64))).toBe(true)
    expect(base.utils.isValidTxHash('0x')).toBe(false)
  })
  it('should get chain slug from chain id', () => {
    expect(base.utils.getChainSlug(1)).toBe('ethereum')
  })
  it('should set chain rpc provider', () => {
    base.setChainRpcProvider('1', new providers.StaticJsonRpcProvider('http://localhost:8545'))
    expect(base.getRpcProviderForChainId('1')).toBeDefined()
  })
  it('should set chain rpc provider url', () => {
    base.setChainRpcProviderUrl('1', 'http://localhost:8545')
    expect(base.getRpcProviderForChainId('1')).toBeDefined()
  })
  it('should set chain rpc providers', () => {
    base.setChainRpcProviders({
      '1': new providers.StaticJsonRpcProvider('http://localhost:8545')
    })
    expect(base.getRpcProviderForChainId('1')).toBeDefined()
  })
  it('should set chain rpc provider urls', () => {
    base.setChainRpcProviderUrls({
      '1': 'http://localhost:8545'
    })
    expect(base.getRpcProviderForChainId('1')).toBeDefined()
  })
  it('should get rpc provider for chain id', () => {
    expect(base.getRpcProviderForChainId('1')).toBeDefined()
  })
  it('should get config address', () => {
    const address = base.getConfigAddress('1', 'hubCoreMessenger')
    console.log(address)
    expect(address).toBeDefined()
  })
  it('should return boolean if contract address exists on chain', async () => {
    const address = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
    const chainId = 1
    const provider = base.getDefaultChainRpcProvider(chainId)
    const exists = await base.getContractExists(address, provider)
    console.log(exists)
    expect(exists).toBeDefined()
  })
  it('should get bumped gas price', async () => {
    const chainId = 1
    const provider = base.getDefaultChainRpcProvider(chainId)
    const percent = 0.20
    const gasPrice = await base.utils.getBumpedGasPrice(provider, percent)
    console.log(gasPrice)
    expect(gasPrice).toBeDefined()
  })
  it('should get signer', async () => {
    const signer = base.connect(new Wallet(privateKey)).getSigner()
    console.log(signer)
    expect(signer).toBeDefined()
  })
  it('should get signer address', async () => {
    const signer = new Wallet(privateKey)
    const address = base.connect(signer).getSignerAddress()
    console.log(address)
    expect(address).toBeDefined()
  })
  it('should get signer or provider given chain id', async () => {
    const chainId = 1
    const provider = await base.getSignerOrProvider(1)
    console.log(provider)
    expect(provider).toBeDefined()
  })
  it('should get tx overrides', async () => {
    const fromChainId = 1
    const toChainId = 10
    const txOverrides = await base.getTxOverrides(fromChainId, toChainId)
    console.log(txOverrides)
    expect(txOverrides).toBeDefined()
  })
  it('should estimate gas', async () => {
    const tx = {
      to: '0x'+ '1'.repeat(40),
      value: 0,
    }
    const chainId = 1
    const provider = base.getDefaultChainRpcProvider(1)
    const gas = await base.utils.estimateGas(provider, tx)
    console.log(gas)
    expect(gas).toBeDefined()
  })
  it.skip('should get gas price', async () => {
    const provider = await base.getSignerOrProvider(1)
    const gasPrice = await base.utils.getGasPrice(provider)
    console.log(gasPrice)
    expect(gasPrice).toBeDefined()
  }, 60 * 1000)
  it.skip('should send transaction', async () => {
    const txRequest = {
      to: '0x'+ '1'.repeat(40),
      value: 0,
      chainId: 1
    }
    const chainId = 1
    const signer = base.getSigner()
    const tx = await base.sendTransaction(txRequest)
    expect(tx.hash).toBeDefined()
  })
})
