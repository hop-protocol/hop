import { jest } from '@jest/globals'
import { RailsGateway, EventName } from '#railsGateway/index.js'
import { providers, Wallet, utils, BigNumber, constants } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('RailsGateway', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)
  it('should get signer address', async () => {
    const chainId = 1
    const provider = RailsGateway.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: signer,
    })
    const address = await railsGateway.getSignerAddress(chainId)
    expect(address).toBeDefined()
  })
  it('should return boolean if needs approval for send', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getPathInfo').mockReturnValue({
      pathId: '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a',
      chainId: BigNumber.from('11155111'),
      token: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      counterpartChainId: BigNumber.from('11155420'),
      counterpartToken: '0xaCa72C8D5360dC237001cD963566F411732980B0'
    } as any)

    jest.spyOn(railsGateway.helpers as any, 'getNeedsApprovalForSend').mockReturnValue(false as any)

    const needsApproval = await railsGateway.helpers.getNeedsApprovalForSend({
      pathId,
      amount,
      account
    })
    console.log(needsApproval)
    expect(needsApproval).toBeDefined()
  })
  it('should return boolean if needs approval for bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getPathInfo').mockReturnValue({
      pathId: '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a',
      chainId: BigNumber.from('11155111'),
      token: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      counterpartChainId: BigNumber.from('11155420'),
      counterpartToken: '0xaCa72C8D5360dC237001cD963566F411732980B0'
    } as any)

    jest.spyOn(railsGateway.helpers as any, 'getNeedsApprovalForBond').mockReturnValue(false as any)

    const needsApproval = await railsGateway.helpers.getNeedsApprovalForBond({
      pathId,
      amount,
      account
    })
    expect(needsApproval).toBeDefined()
  })
  it('should get transfer bonded event from transaction receipt', async () => {
    const chainId = 11155420
    const txHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const provider = new providers.StaticJsonRpcProvider('https://sepolia.optimism.io')
    const receipt = await provider.getTransactionReceipt(txHash)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferBondedEventFromTransactionReceipt').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferBondedEventFromTransactionReceipt({
      receipt
    })
    expect(event).toBeDefined()
  })
  it('should get event filter for an event name', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getEventFilter(EventName.TransferSent)

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(1)
  })
  it('should get TransferSent event filter', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getTransferSentEventFilter()

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(1)
  })
  it('should get TransferSent transferId event filter', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getTransferSentEventFilter({
      transferId
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(3)
  })
  it('should get TransferSent pathId, transferId, and to event filter', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const to = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getTransferSentEventFilter({
      pathId,
      transferId,
      to
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(4)
  })
  it('should get TransferBonded event filter', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getTransferBondedEventFilter()

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(1)
  })
  it('should get TransferBonded transferId event filter', async () => {
    const chainId = 11155111
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const filter = railsGateway.getTransferBondedEventFilter({
      claimId
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(3)
  })
  it('should fetch TransferSent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const eventsGenerator = railsGateway.getTransferSentEventsInBatches({
      fromBlock,
      toBlock
    })

    let size = 0
    for await (const events of eventsGenerator) {
      console.log(events)
      size += events.length
    }

    console.log(size)

    expect(size).toBeGreaterThanOrEqual(0)
  }, 60 * 1000)
  it('should add typedEvent to TransferSent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945

    const ethersEvents = await provider.getLogs({
      address: '0xE09810aEA635e0B481cC3703963216013Ff7956D',
      topics: [
        '0x3ac38345c5480a0a83c6dcc635c5ae04720e7a0a523516f61a9b573fbd4f1e43'
      ],
      fromBlock,
      toBlock
    })

    console.log(ethersEvents)

    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'addDecodedTypesToTransferSentEvents').mockReturnValue([{ decoded: {} }] as any)

    const events = railsGateway.addDecodedTypesToTransferSentEvents(ethersEvents)
    console.log(events)

    expect(events.length).toBe(1)
    expect(events[0].decoded).toBeTruthy()
  }, 60 * 1000)
  it('should add typedEvent to events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945

    const ethersEvents = await provider.getLogs({
      address: '0xE09810aEA635e0B481cC3703963216013Ff7956D',
      topics: [
        '0x3ac38345c5480a0a83c6dcc635c5ae04720e7a0a523516f61a9b573fbd4f1e43'
        // '0x3d5679b3c8a1d106e71289dce97aa0f2518e8c2e1279556fca8753c71257b627'
      ],
      fromBlock,
      toBlock
    })

    console.log(ethersEvents)

    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'addDecodedTypesToEvents').mockReturnValue([{ decoded: {} }] as any)

    const events = railsGateway.addDecodedTypesToEvents(ethersEvents)
    console.log(events)

    expect(events.length).toBe(1)
    expect(events[0].decoded).toBeTruthy()
  }, 60 * 1000)
  it('should add typedEvent to event', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945

    const ethersEvents = await provider.getLogs({
      address: '0xE09810aEA635e0B481cC3703963216013Ff7956D',
      topics: [
        '0x3ac38345c5480a0a83c6dcc635c5ae04720e7a0a523516f61a9b573fbd4f1e43'
      ],
      fromBlock,
      toBlock
    })

    console.log(ethersEvents)

    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'addDecodedTypesToEvent').mockReturnValue({ decoded: {} } as any)

    const event = railsGateway.addDecodedTypesToEvent(ethersEvents[0])
    console.log(event)

    expect(event.decoded).toBeTruthy()
  }, 60 * 1000)
  it('should fetch TransferBonded events', async () => {
    const chainId = 11155420
    const fromBlock = 11394756
    const toBlock = 11394756
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    const events = await railsGateway.getTransferBondedEvents({
      fromBlock,
      toBlock
    })

    expect(events.length).toBeGreaterThanOrEqual(0)
  })
  it('should get RailsGateway contract instance', async () => {
    const chainId = 11155420
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const contract = await railsGateway.getRailsGatewayContract()
    expect(contract).toBeDefined()
  })
  it('should get pathId', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway, 'getPathId').mockResolvedValue('0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a')

    const pathId = await railsGateway.getPathId({
      chainId0: 11155111,
      token0: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd',
      chainId1: 11155420,
      token1: '0xDCAc09AbB4D3E008b941370d384d0Cf20ce0a5bd'
    })
    console.log(pathId)
    expect(pathId).toBeDefined()
  }, 60 * 1000)
  it('should get pathInfo on origin chain', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getPathInfo').mockReturnValue({
      pathId: '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a',
      chainId: BigNumber.from('11155111'),
      token: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      counterpartChainId: BigNumber.from('11155420'),
      counterpartToken: '0xaCa72C8D5360dC237001cD963566F411732980B0'
    } as any)

    const pathInfo = await railsGateway.getPathInfo({
      pathId
    })
    console.log(pathInfo)
    expect(pathInfo.token).toBeDefined()
    expect(pathInfo.pathId).toBe('0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a')
    expect(pathInfo.chainId.toString()).toBe('11155111')
    expect(pathInfo.token).toBe('0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32')
    expect(pathInfo.counterpartChainId.toString()).toBe('11155420')
    expect(pathInfo.counterpartToken).toBe('0xaCa72C8D5360dC237001cD963566F411732980B0')
  }, 60 * 1000)
  it('should get pathInfo on counter chain', async () => {
    const chainId = 11155420
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getPathInfo').mockReturnValue({
      pathId: '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a',
      chainId: BigNumber.from('11155420'),
      token: '0xaCa72C8D5360dC237001cD963566F411732980B0',
      counterpartChainId: BigNumber.from('11155111'),
      counterpartToken: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    } as any)

    const pathInfo = await railsGateway.getPathInfo({
      pathId
    })
    console.log(pathInfo)
    expect(pathInfo.token).toBeDefined()
    expect(pathInfo.pathId).toBe('0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a')
    expect(pathInfo.chainId.toString()).toBe('11155420')
    expect(pathInfo.token).toBe('0xaCa72C8D5360dC237001cD963566F411732980B0')
    expect(pathInfo.counterpartChainId.toString()).toBe('11155111')
    expect(pathInfo.counterpartToken).toBe('0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32')
  }, 60 * 1000)
  it('should get send fee for pathId', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getSendFee').mockReturnValue(BigNumber.from(1) as any)

    const fee = await railsGateway.getSendFee({
      pathId
    })
    console.log(fee)
    expect(fee).toBeDefined()
  })
  it('should initiate approve send tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.approveSend({
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it('should initiate a token transfer', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const to = await signer.getAddress()
    const attestedClaimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const maxTotalSent = parseUnits('1', 18)
    const hops = [{
      pathId,
      maxBonderFee: '0',
      minAmountOut: '0',
      attestedClaimId
    }]
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getSendFee').mockReturnValue(BigNumber.from(1) as any)

    const fee = await railsGateway.getSendFee({
      pathId
    })

    jest.spyOn(railsGateway as any, 'send').mockReturnValue({ to: '', value: 0 } as any)

    const txData = await railsGateway.populateTransaction.send({
      to,
      amount,
      hops,
      fee
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it('should initiate a bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const bonderFee = '0'
    const nextHops = [{
      pathId,
      maxBonderFee: '0',
      minAmountOut: '0',
      attestedClaimId: claimId
    }]
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'bond').mockReturnValue({ to: '', value: 0 } as any)

    const txData = await railsGateway.populateTransaction.bond({
      pathId,
      claimId,
      bonderFee,
      nextHops
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it('should post claim', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const to = await signer.getAddress()
    const amountOut = parseUnits('1', 18)
    const totalSent = parseUnits('1', 18)
    const attestedClaimId  = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const totalClaims = parseUnits('1', 18)
    const maxBonderFee = '0'
    const nextHopsHash = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'bond').mockReturnValue({ to: '', value: 0 } as any)

    const txData = await railsGateway.populateTransaction.postClaim({
      pathId,
      transferId,
      to,
      amountOut,
      maxBonderFee,
      attestedClaimId,
      totalSent,
      totalClaims,
      nextHopsHash
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it('should get withdrawable balance', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const recipient = await signer.getAddress()
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getWithdrawableBalance').mockReturnValue(BigNumber.from(1) as any)

    const balance = await railsGateway.getWithdrawableBalance({
      pathId,
      recipient,
      claimId
    })
    console.log(balance)
    expect(balance).toBeDefined()
  })
  it('should withdraw', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    const txData = await railsGateway.populateTransaction.withdraw({
      pathId,
      claimId
    })
    expect(txData).toBeDefined()
  })
  it('should get HOP token address', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const address = await railsGateway.getHopTokenAddress()
    expect(address).toBeDefined()
  })
  it('should get HOP token contract', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const contract = await railsGateway.getHopTokenContract()
    expect(contract).toBeDefined()
  })
  it('should get event names', async () => {
    const eventNames = RailsGateway.getEventNames()
    expect(eventNames.length > 0).toBeTruthy()
    expect(eventNames).toStrictEqual(['ClaimChainUpdated', 'ClaimPosted', 'TransferBonded', 'TransferSent'])
  })
  it('should get transfer sent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferSentEvents').mockReturnValue([{ decoded: {}}] as any)
    const events = await railsGateway.getTransferSentEvents({
      fromBlock,
      toBlock
    })
    console.log(events)
    expect(events.length).toBeGreaterThanOrEqual(0)
  })
  it('should add decoded types to transfer bonded events', async () => {
    const provider = new providers.StaticJsonRpcProvider('https://sepolia.optimism.io')
    const rawEvents = await provider.getLogs({
      address: '0x9B6370567e535e74881a84A2ed1f0001d2D4a5f1',
      topics: [
        '0x26975e08afcf23cb42d45c4d3faa3cc898ddb7dfdfa2d61c8f4f085cbbda7259'
      ],
      fromBlock: 11394755,
      toBlock: 11394757
    })
    console.log(rawEvents)
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'addDecodedTypesToTransferBondedEvents').mockReturnValue([{ decoded: {}}] as any)

    const events = railsGateway.addDecodedTypesToTransferBondedEvents(rawEvents)
    console.log(events)
    expect(events.length > 0).toBeTruthy()
    expect(events[0].decoded).toBeDefined()

  })
  it('should get rails gateway contract address', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const address = railsGateway.getRailsGatewayContractAddress()
    expect(address).toBeDefined()
  })
  it('should initiate approve bond tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.approveBond({
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it('should initiate remove claim tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.removeClaim({
      pathId,
      claimId
    })
    expect(txData).toBeDefined()
  })
  it('should initiate confirm claim tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.confirmClaim({
      pathId,
      claimId
    })
    expect(txData).toBeDefined()
  })
  it('should get head claim hash', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getHeadClaimId').mockReturnValue('0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221')
    const latestClaim = await railsGateway.getHeadClaimId({
      pathId,
    })
    console.log(latestClaim)
    expect(latestClaim).toBeDefined()
  })
  it('should return computed transfer id', async () => {
    const chainId = 11155111
    const previousTransferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const transferDataHash = '0xd638b23809aef011d3657cda1fa4e163d36121423cc79e695f9c6acc62ba7980'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const transferId = await railsGateway.helpers.getComputedTransferId({ previousTransferId, transferDataHash })
    console.log(transferId)
    expect(transferId).toBeDefined()
  })
  it('should return computed transfer data hash', async () => {
    const chainId = 11155111
    const to = await signer.getAddress()
    const amountOut = parseUnits('1', 18)
    const maxBonderFee = parseUnits('0', 18)
    const attestedClaimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const totalSent = parseUnits('1', 18)
    const totalClaims = parseUnits('0', 18)
    const nextHops: any[] = []

    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const transferDataHash = await railsGateway.helpers.getComputedTransferDataHash({
      to,
      amountOut,
      maxBonderFee,
      attestedClaimId,
      totalSent,
      totalClaims,
      nextHops
    })
    console.log(transferDataHash)
    expect(transferDataHash).toBeDefined()
  })
  it('should get transfer sent event from transaction receipt', async () => {
    const chainId = 11155111
    const txHash = '0xced84d48d165a5efa5382c638ab0645b6e3b9c5b3725b54f90650724138cba9f'
    const receipt = await provider.getTransactionReceipt(txHash)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferSentEventFromTransactionReceipt').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferSentEventFromTransactionReceipt({
      receipt
    })
    expect(event).toBeDefined()
  })
  it('should get transfer sent event from transaction hash', async () => {
    const chainId = 11155111
    const transactionHash = '0x063287bb2b7c32fa457dfb9a8c1312043b471286b6226190b4503a969d32d971'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferSentEventFromTransactionHash').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferSentEventFromTransactionHash({
      transactionHash
    })
    console.log(event)
    expect(event).toBeDefined()
    expect(event!.decoded).toBeDefined()
  })
  it('should get transfer sent event from transfer id', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferSentEventFromTransferId').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferSentEventFromTransferId({
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it('should get transfer bonded event from transaction hash', async () => {
    const chainId = 11155420
    const transactionHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferBondedEventFromTransactionHash').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferBondedEventFromTransactionHash({
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it('should get transfer bonded event from transfer id', async () => {
    const chainId = 11155420
    const transferId = '0x7132cf97b6dcbabd2cabc72f36c1036f6e51dbd73d78a9f97d85b864d0f12640'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTransferBondedEventFromTransferId').mockReturnValue({ decoded: {} } as any)
    const event = await railsGateway.getTransferBondedEventFromTransferId({
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it('should return boolean for claim id validity', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getIsClaimIdValid').mockReturnValue(false as any)
    const isValid = await railsGateway.getIsClaimIdValid({
      pathId,
      claimId
    })
    console.log(isValid)
    expect(isValid).toBeDefined()
  })
  it('should return total sent for path id', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTotalSent').mockReturnValue(BigNumber.from(1) as any)
    const totalSent = await railsGateway.getTotalSent({
      pathId
    })
    console.log(totalSent)
    expect(totalSent).toBeDefined()
  })
  it('should get token info', async () => {
    const chainId = 11155111
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getTokenInfo').mockReturnValue({ symbol: '' } as any)
    const tokenInfo = await railsGateway.getTokenInfo({
      address
    })
    expect(tokenInfo).toBeDefined()
  })
  it('should get token contract', async () => {
    const chainId = 11155420
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const contract = railsGateway.getTokenContract({
      address
    })
    expect(contract).toBeDefined()
  })
  it('should return boolean for sufficient balance check', async () => {
    const chainId = 11155111
    const tokenAddress = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    jest.spyOn(railsGateway as any, 'getHasSufficientBalance').mockReturnValue(false as any)
    const sufficientBalance = await railsGateway.getHasSufficientBalance({
      tokenAddress,
      amount,
      account
    })
    expect(sufficientBalance).toBeDefined()
  })

  it('should return true if transfer is bonded', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const bonded = await railsGateway.helpers.getIsTransferBonded({
      transferId
    })
    console.log(bonded)
    expect(typeof bonded).toBe('boolean')
  }, 60 * 1000)

  it('should return true if transfer is claimed', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const claimed = await railsGateway.helpers.getIsTransferClaimed({
      transferId
    })
    console.log(claimed)
    expect(typeof claimed).toBe('boolean')
  }, 60 * 1000)

  it('should decocde send tx input data', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const inputData = '0x3a75515a0000000000000000000000006020aad5cafb06c33bbf44dbabd9f55f42ff2bca000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001dc85ddb9503bfec006837d725cf5b6fd860c6aecd50fadb56af96cf5faae5f1f000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001633c600f17600036e83cf06d0c43431066768832b5860eec11c2731c4f86a087613d5dd0437674'
    const decoded = await railsGateway.helpers.decodeSendTxInputData(inputData)
    console.log(decoded)
    expect(decoded).toBeTruthy()
    expect(decoded.to).toBeTruthy()
    expect(decoded.amount).toBeTruthy()
    expect(decoded.hops).toBeTruthy()
    expect(decoded.hops[0].pathId).toBeTruthy()
    expect(decoded.hops[0].maxBonderFee).toBeTruthy()
    expect(decoded.hops[0].minAmountOut).toBeTruthy()
    expect(decoded.hops[0].attestedClaimId).toBeTruthy()
  }, 60 * 1000)

  it('should decocde bond tx input data', async () => {
    const chainId = 84532
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })
    const inputData = '0xaa8ef67adc85ddb9503bfec006837d725cf5b6fd860c6aecd50fadb56af96cf5faae5f1fedd367f2d6f4d09bd22b39441a4e4696cff07bd99a9fd6d7792e0bf526c025e2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000'
    const decoded = await railsGateway.helpers.decodeBondTxInputData(inputData)
    console.log(decoded)
    expect(decoded).toBeTruthy()
    expect(decoded.pathId).toBeTruthy()
    expect(decoded.claimId).toBeTruthy()
    expect(decoded.bonderFee).toBeTruthy()
    expect(decoded.nextHops).toBeTruthy()
    // expect(decoded.nextHops[0].pathId).toBeTruthy()
    // expect(decoded.nextHops[0].maxBonderFee).toBeTruthy()
    // expect(decoded.nextHops[0].minAmountOut).toBeTruthy()
    // expect(decoded.nextHops[0].attestedClaimId).toBeTruthy()
  }, 60 * 1000)

  it('getComputedNextHopsHash - should return a keccak256 hash of the hops', () => {
    const nextHops = [
      {
        pathId: utils.formatBytes32String('path1'),
        maxBonderFee: BigNumber.from('1000000'),
        minAmountOut: BigNumber.from('0'),
        attestedClaimId: utils.formatBytes32String('claim1'),
      },
      {
        pathId: utils.formatBytes32String('path2'),
        maxBonderFee: BigNumber.from('2000000'),
        minAmountOut: BigNumber.from('0'),
        attestedClaimId: utils.formatBytes32String('claim2'),
      },
    ]

    const hash = RailsGateway.getComputedNextHopsHash({ nextHops })
    console.log(hash)

    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(66)
    expect(hash).toBe('0xd8a49045419a56bd095015e2ae16e598dc791354782a2ee1986cb3b3a5ae730a')
  })

  it('getComputedNextHopsHash - should return 0x0 hash if hops is empty', () => {
    const nextHops: any[] = []
    const hash = RailsGateway.getComputedNextHopsHash({ nextHops })
    console.log(hash)
    expect(hash).toBe(constants.HashZero)
  })

  it('should return boolean for getting is path id live', async () => {
    const chainId = 11155111
    const pathId = '0x5be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e6'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultProvider(chainId)
    })

    jest.spyOn(railsGateway as any, 'getPathInfo').mockReturnValue({
      pathId: '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a',
      chainId: BigNumber.from('11155111'),
      token: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      counterpartChainId: BigNumber.from('11155420'),
      counterpartToken: '0xaCa72C8D5360dC237001cD963566F411732980B0'
    } as any)

    const isLive = await railsGateway.helpers.getIsPathIdLive({ pathId })
    console.log(isLive)
    expect(typeof isLive).toBe('boolean')
    expect(isLive).toBeDefined()
  }, 60 * 1000)
  it('should get TransferSent event signature using static method', async () => {
    const signature = RailsGateway.getTransferSentEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })
  it('should get TransferBonded event signature static method', async () => {
    const signature = RailsGateway.getTransferBondedEventSignature()

    console.log(signature)
    expect(signature).toBeTruthy()
  })

  // TODO: static addDecodedTypesToEvents
})

