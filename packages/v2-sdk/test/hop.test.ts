import { Hop } from '#index.js'
import { providers, Wallet, utils } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('Hop', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)
  const sdk = new Hop({
    network: 'sepolia',
    signersOrProviders: Object.assign({
      ...Hop.getDefaultProviders('sepolia'),
      '11155420': new providers.StaticJsonRpcProvider('https://sepolia.optimism.io')
    })
  })

  it('should get version', async () => {
    console.log(sdk.version)
    expect(sdk.version).toBeDefined()
  })

  it('should get rails gateway instance', async () => {
    expect(sdk.getRailsGateway(11155111)).toBeDefined()
  })

  it('should get messenger instance', async () => {
    expect(sdk.getMessenger(11155111)).toBeDefined()
  })

  it.skip('TODO should get hub connector contract address', async () => {
    const chainId = 11155111
    const address = sdk.getHubConnectorContractAddress(chainId)
    expect(address).toBeDefined()
  })

  it('should get rails gateway contract address', async () => {
    const chainId = 11155111
    const address = sdk.getRailsGatewayContractAddress(chainId)
    expect(address).toBeDefined()
  })

  it.skip('should initiate token send tx', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const toToken = '0xaCa72C8D5360dC237001cD963566F411732980B0'
    const amount = parseUnits('1', 18)
    const minAmountOut = parseUnits('1', 18)
    const to = await signer.getAddress()
    const txData = await sdk.populateTransaction.sendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut,
      to
    })
    console.log(txData)
    expect(txData).toBeDefined()
  }, 60 * 1000)

  it.skip('should initiate approve tokens to send tx', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const toToken = '0xaCa72C8D5360dC237001cD963566F411732980B0'
    const amount = parseUnits('1', 18)
    const txData = await sdk.populateTransaction.approveSendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
    })
    console.log(txData)
    expect(txData).toBeDefined()
  }, 60 * 1000)

  it.skip('should return boolean from send tokens approval check', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const toToken = '0xaCa72C8D5360dC237001cD963566F411732980B0'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const needsApproval = await sdk.getNeedsApprovalForSendTokens({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      account
    })
    console.log(needsApproval)
    expect(typeof needsApproval).toBe('boolean')
  }, 60 * 1000)

  it.skip('should get pathInfo', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const pathInfo = await sdk.getPathInfo({
      chainId,
      pathId
    })
    console.log(pathInfo)
    expect(pathInfo.token).toBeDefined()
  })

  it.skip('TODO should connect targets', async () => {
    const hubChainId = 11155111
    const spokeChainId = 11155420
    const target1 = '0xTODO'
    const target2 = '0xTODO'
    const tx = await sdk.connectTargets({
      hubChainId,
      spokeChainId,
      target1,
      target2,
    })
    console.log(tx)
    expect(tx).toBeDefined()
  })

  it.skip('TODO should switch provider chain id', async () => {
    const newChainId = 10
    let error = ''
    try {
      await sdk.switchChain(newChainId)
    } catch (err) {
      console.error(err)
      error = err
    }
    expect(error).toBe('')
  }, 60 * 1000)

  it.skip('should get send tokens fee', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const toToken = '0xaCa72C8D5360dC237001cD963566F411732980B0'
    const fee = await sdk.getSendFee({
      fromChainId,
      toChainId,
      fromToken,
      toToken
    })
    console.log(fee)
    expect(fee).toBeDefined()
  }, 60 * 1000)

  it('should get token contract', async () => {
    const chainId = 11155420
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const contract = sdk.getTokenContract({
      chainId,
      address
    })
    expect(contract).toBeDefined()
  })

  it('should get transfer status for transactionHash', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const transactionHash = '0x626de21dccc66e8fcca457643d6ffb7c0331488295efecc228d102273445c2c4'
    // sdk.setExplorerApiBaseUrl('http://localhost:8000')
    const transferStatus = await sdk.getTransferStatus({
      fromChainId,
      toChainId,
      transactionHash
    })
    console.log(JSON.stringify(transferStatus, null, 2))
    expect(transferStatus).toBeDefined()
    // expect(transferStatus.transferId).toBe(transferId)
    // expect(transferStatus.state).toBe(TransferState.Bonded)
    // expect(transferStatus.transferSentEvent).toBeDefined()
    // expect(transferStatus.transferBondedEvents.length).toBe(2)
  }, 10 * 60 * 1000)

  it.skip('should get transfer status for transfer Id - 2', async () => {
    const fromChainId = 11155420
    const toChainId = 84532
    const transferId = '0x7e77249238adda4f7d2b725881339fa6eed7c95c0e493fb65f8e5b68a8574090'
    const transferStatus = await sdk.getTransferStatus({
      fromChainId,
      toChainId,
      transferId
    })
    console.log(transferStatus)
    expect(transferStatus).toBeDefined()
  }, 10 * 60 * 1000)


  it.skip('should get events', async () => {
    const chainId = 11155111
    const fromBlock = 6598795
    const toBlock = 6598796
    const eventNames = ['MessageSent', 'TransferSent']
    const events = await sdk.getEvents({
      eventNames,
      chainId,
      fromBlock,
      toBlock
    })
    console.log(events)
    expect(events.some(event => event.context!.eventName === 'MessageSent')).toBeTruthy()
    expect(events.some(event => event.context!.eventName === 'TransferSent')).toBeTruthy()
    expect(events.length > 0).toBeTruthy()
  }, 60 * 1000)

  it.skip('TODO should return true if send tokens transaction will fail', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xTODO'
    const toToken = '0xTODO'
    const to = '0xTODO'
    const amount = parseUnits('1', 18)
    const minAmountOut = '0'
    const from = '0xTODO'

    const willFail = await sdk.getWillSendTokensFail({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      to,
      amount,
      minAmountOut,
      from
    })
    console.log(willFail)
    expect(willFail).toBeDefined()
  }, 60 * 1000)

  it.skip('TODO should get estimated received amount', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xTODO'
    const toToken = '0xTODO'
    const amount = parseUnits('1', 18)
    const minAmountOut = '0'

    const estimated = await sdk.getEstimatedReceived({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut,
    })
    console.log(estimated)
    expect(estimated).toBeDefined()
  }, 60 * 1000)

  it.skip('TODO should get send data', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const fromToken = '0xTODO'
    const toToken = '0xTODO'
    const amount = parseUnits('1', 18)
    const minAmountOut = '0'

    const data = await sdk.getSendData({
      fromChainId,
      toChainId,
      fromToken,
      toToken,
      amount,
      minAmountOut,
    })
    console.log(data)
    expect(data).toBeDefined()
  }, 60 * 1000)
  it('should calc amountOutMin', async () => {
    const amountOut = parseUnits('1', 18)
    const slippageTolerance = 0.01
    const amountOutMin = Hop.calcAmountOutMin({
      amountOut,
      slippageTolerance
    })
    expect(amountOutMin).toBeDefined()
  })
})
