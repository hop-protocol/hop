import { Base } from '#common/Base.js'
import { providers, Wallet } from 'ethers'
import dotenv from 'dotenv'
import { randomBytes } from 'crypto'
import { ContractFunctionRevertedError } from '#error/index.js'

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('Base', () => {
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
  it('should return boolean if option is object', () => {
    expect(base.utils.isValidObject({})).toBe(true)
    expect(base.utils.isValidObject(222222)).toBe(false)
  })
  it('should return boolean if chain id valid', () => {
    expect(base.utils.isValidChainId(1)).toBe(true)
    expect(base.utils.isValidChainId(222222)).toBe(false)
  })
  it('should return boolean if string is bytes32', () => {
    expect(base.utils.isValidBytes32('0x'+'1'.repeat(64))).toBe(true)
    expect(base.utils.isValidBytes32('0x123')).toBe(false)
    expect(base.utils.isValidBytes32('0xYZ')).toBe(false)
  })
  it('should return boolean if string is bytes', () => {
    expect(base.utils.isValidBytes('0x')).toBe(true)
    expect(base.utils.isValidBytes('0x123')).toBe(true)
    expect(base.utils.isValidBytes('abc')).toBe(false)
  })
  it('should return boolean if address is valid', () => {
    expect(base.utils.isValidAddress('0x'+'1'.repeat(40))).toBe(true)
    expect(base.utils.isValidAddress('0x123')).toBe(false)
  })
  it('should return boolean if filter block is valid', () => {
    expect(base.utils.isValidFilterBlock('latest')).toBe(true)
    expect(base.utils.isValidFilterBlock('pending')).toBe(true)
    expect(base.utils.isValidFilterBlock('earliest')).toBe(true)
    expect(base.utils.isValidFilterBlock('foo')).toBe(false)
    expect(base.utils.isValidFilterBlock('123')).toBe(true)
  })
  it('should return boolean if is numeric value', () => {
    expect(base.utils.isValidNumericValue(1)).toBe(true)
    expect(base.utils.isValidNumericValue('100')).toBe(true)
    expect(base.utils.isValidNumericValue('abc')).toBe(false)
  })
  it('should return boolean if tx hash is valid', () => {
    expect(base.utils.isValidTxHash('0x'+'1'.repeat(64))).toBe(true)
    expect(base.utils.isValidTxHash('0x')).toBe(false)
  })
  it('should get chain slug from chain id', () => {
    expect(base.utils.getChainSlug(1)).toBe('ethereum')
  })
  it('should get bumped gas price', async () => {
    const chainId = 1
    const provider = base.getDefaultChainRpcProvider(chainId)
    const percent = 0.20
    const gasPrice = await base.utils.getBumpedGasPrice(provider, percent)
    console.log(gasPrice)
    expect(gasPrice).toBeDefined()
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
  it('should get gas price', async () => {
    const provider = await base.getSignerOrProvider(1)
    const gasPrice = await base.utils.getGasPrice(provider)
    console.log(gasPrice)
    expect(gasPrice).toBeDefined()
  }, 60 * 1000)
  it('should get connected chain id', async () => {
    const provider = await base.getSignerOrProvider(1)
    const connectedChainId = await base.utils.getConnectedChainId(provider as providers.Provider)
    console.log(connectedChainId)
    expect(connectedChainId).toBeDefined()
  }, 60 * 1000)
  it('should get transaction explorer url', async () => {
    const txHash = '0x' + '1'.repeat(64)
    const chainId = 1
    const explorerUrl = base.utils.getTransactionHashExplorerUrl(txHash, chainId)
    console.log(explorerUrl)
    expect(explorerUrl).toBeDefined()
  })
  it('should get address explorer url', async () => {
    const txHash = '0x' + '1'.repeat(40)
    const chainId = 1
    const explorerUrl = base.utils.getAddressExplorerUrl(txHash, chainId)
    console.log(explorerUrl)
    expect(explorerUrl).toBeDefined()
  })
  it('should get token explorer url', async () => {
    const txHash = '0x' + '1'.repeat(40)
    const chainId = 1
    const explorerUrl = base.utils.getTokenExplorerUrl(txHash, chainId)
    console.log(explorerUrl)
    expect(explorerUrl).toBeDefined()
  })
  it('should get logo image url for chain id', async () => {
    const imageUrl = base.utils.getLogoForChainId(11155111)
    console.log(imageUrl)
    expect(imageUrl).toBeDefined()
  })
  it('should get logo image url for chain slug', async () => {
    const imageUrl = base.utils.getLogoForChainSlug('arbitrum')
    console.log(imageUrl)
    expect(imageUrl).toBeDefined()
  })
  it('should get logo image url token symbol', async () => {
    const imageUrl = base.utils.getLogoForTokenSymbol('USDC')
    console.log(imageUrl)
    expect(imageUrl).toBeDefined()
  })
  it('should get chain info', async () => {
    const chainId = 1
    const info = base.utils.getChainInfo(chainId)
    console.log(info)
    expect(info).toBeDefined()
  })
  it('should return boolean if is contract error', () => {
    const maxTotalSentError = new ContractFunctionRevertedError(`
    cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (error={"reason":"execution reverted: RailsPathLib: maxTotalSent exceeded","code":"UNPREDICTABLE_GAS_LIMIT","method":"estimateGas","transaction":{"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x59682f00"},"maxFeePerGas":{"type":"BigNumber","hex":"0x016bd855d8"},"to":"0x3791ed182b54e4DBB2522E97A86bC5a7c0cE8D6A","value":{"type":"BigNumber","hex":"0x065dd0837000"},"data":"0x0dd74f555be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e60000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000","type":2,"accessList":null},"error":{"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"id\":47,\"error\":{\"code\":3,\"message\":\"execution reverted: RailsPathLib: maxTotalSent exceeded\",\"data\":\"0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000235261696c73506174684c69623a206d6178546f74616c53656e742065786365656465640000000000000000000000000000000000000000000000000000000000\"}}\n","error":{"code":3,"data":"0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000235261696c73506174684c69623a206d6178546f74616c53656e742065786365656465640000000000000000000000000000000000000000000000000000000000"},"requestBody":"{\"method\":\"eth_estimateGas\",\"params\":[{\"type\":\"0x2\",\"maxFeePerGas\":\"0x16bd855d8\",\"maxPriorityFeePerGas\":\"0x59682f00\",\"value\":\"0x65dd0837000\",\"from\":\"0x6020aad5cafb06c33bbf44dbabd9f55f42ff2bca\",\"to\":\"0x3791ed182b54e4dbb2522e97a86bc5a7c0ce8d6a\",\"data\":\"0x0dd74f555be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e60000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000\"}],\"id\":47,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"https://rpc2.sepolia.org"}}, tx={"data":"0x0dd74f555be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e60000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca000000000000000000000000000000000000000000000000016345785d8a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000000","to":{},"value":{"type":"BigNumber","hex":"0x065dd0837000"},"chainId":{},"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","type":2,"maxFeePerGas":{"type":"BigNumber","hex":"0x016bd855d8"},"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x59682f00"},"nonce":{},"gasLimit":{}}, code=UNPREDICTABLE_GAS_LIMIT, version=abstract-signer/5.7.0)
    `)

    const falseAssertError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","to":"0x991A09826587E2544a9c1C34EEaa3b29846538C4","data":"0xf8d07084","accessList":null}, error={"code":-32603,"message":"execution reverted: assert(false)","data":{"originalError":{"data":"0x4e487b710000000000000000000000000000000000000000000000000000000000000001","code":3}}}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    const falseRequireError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","to":"0x991A09826587E2544a9c1C34EEaa3b29846538C4","data":"0x7afe3548","accessList":null}, error={"code":-32000,"message":"execution reverted"}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    const falseRequireMessageError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","to":"0x991A09826587E2544a9c1C34EEaa3b29846538C4","data":"0x4d04c2e4","accessList":null}, error={"code":-32603,"message":"execution reverted: Custom revert message thrown","data":{"originalError":{"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001c437573746f6d20726576657274206d657373616765207468726f776e00000000","code":3}}}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    const internalTokenTransferError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","to":"0x991A09826587E2544a9c1C34EEaa3b29846538C4","data":"0x41ccff7f","accessList":null}, error={"code":-32000,"message":"execution reverted"}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    const intrinsicGasLowError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","gasLimit":{"type":"BigNumber","hex":"0x5208"},"to":"0x4BfD4F70148552fC89786aa650E258015379d074","data":"0x71a6a333","accessList":null}, error={"code":-32000,"message":"err: intrinsic gas too low: have 21000, want 21064 (supplied gas 21000)"}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    const outOfGasError = new Error(`
      Error: missing revert data in call exception; Transaction reverted without a reason string [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (data="0x", transaction={"from":"0x6020aAD5CAFB06c33BBF44DBaBD9F55f42fF2BcA","gasLimit":{"type":"BigNumber","hex":"0x5248"},"to":"0x4BfD4F70148552fC89786aa650E258015379d074","data":"0x71a6a333","accessList":null}, error={"code":-32000,"message":"out of gas"}, code=CALL_EXCEPTION, version=providers/5.7.2)
    `)

    expect(base.utils.isContractError(maxTotalSentError)).toBe(true)
    expect(base.utils.isContractError(falseAssertError)).toBe(true)
    expect(base.utils.isContractError(falseRequireError)).toBe(true)
    expect(base.utils.isContractError(falseRequireMessageError)).toBe(true)
    expect(base.utils.isContractError(intrinsicGasLowError)).toBe(false)
    expect(base.utils.isContractError(outOfGasError)).toBe(false)
    expect(base.utils.isContractError(new Error('processing error'))).toBe(false)
    expect(base.utils.isContractError(new Error('SERVER_ERROR'))).toBe(false)
    expect(base.utils.isContractError('an error string')).toBe(false)
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
  it('should get supported chain ids', async () => {
    const base = new Base({
      network: 'sepolia'
    })
    const supportedChainIds = base.getSupportedChainIds()
    console.log(supportedChainIds)
    expect(supportedChainIds.length > 0).toBe(true)
  }, 60 * 1000)
  it('should get supported token symbols', async () => {
    const base = new Base({
      network: 'sepolia'
    })
    const supportedTokens = base.getSupportedTokenSymbols()
    console.log(supportedTokens)
    expect(supportedTokens.length > 0).toBe(true)
  }, 60 * 1000)
  it('should get supported token symbols by chain id', async () => {
    const base = new Base({
      network: 'sepolia'
    })
    const supportedTokens = base.getSupportedTokenSymbolsByChainId(11155111)
    console.log(supportedTokens)
    expect(supportedTokens.length > 0).toBe(true)
  }, 60 * 1000)
  it('should get supported chain ids by token symbol', async () => {
    const base = new Base({
      network: 'sepolia'
    })
    const tokenSymbol = 'USDC'
    const supportedChainIds = base.getChainIdsSupportedByTokenSymbol(tokenSymbol)
    console.log(supportedChainIds)
    expect(supportedChainIds.length > 0).toBe(true)
  }, 60 * 1000)
  it('should get token address by token symbol', async () => {
    const base = new Base({
      network: 'sepolia'
    })
    const chainId = 11155111
    const tokenSymbol = 'USDC'
    const address = base.getTokenAddressByTokenSymbol(chainId, tokenSymbol)
    console.log(address)
    expect(address).toBeTruthy()
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
  it.skip('should switch provider chain id', async () => {
    const chainId = 1
    const newChainId = 10
    const externalProvider = {} // window.ethereum // TODO
    const provider = new providers.Web3Provider(externalProvider, 'any')
    let error = ''
    try {
      await base.utils.switchChain(newChainId, provider)
    } catch (err) {
      console.error(err)
      error = err
    }
    expect(error).toBe('')
  }, 60 * 1000)
  it('should get color for chain id', () => {
    const chainId = 1
    const color = base.getColorForChainId(chainId)
    console.log(color)
    expect(color).toBeDefined()
  })
})
