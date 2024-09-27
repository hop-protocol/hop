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
    const provider = RailsGateway.getDefaultChainRpcProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: signer,
    })
    const address = await railsGateway.getSignerAddress()
    expect(address).toBeDefined()
  })
  it('should get event filter for an event name', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const filter = railsGateway.getTransferSentEventFilter({
      indexes: {
        transferId
      }
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const filter = railsGateway.getTransferSentEventFilter({
      indexes: {
        pathId,
        transferId,
        to
      }
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(4)
  })
  it('should get TransferBonded event filter', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const filter = railsGateway.getTransferBondedEventFilter()

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(1)
  })
  it.skip('should get TransferBonded transferId event filter', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const filter = railsGateway.getTransferBondedEventFilter({
      indexes: {
        transferId
      }
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(2)
  })
  it.skip('should fetch TransferSent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
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

    expect(size).toBe(1)
  }, 60 * 1000)
  it.skip('should add typedEvent to TransferSent events', async () => {
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const events = railsGateway.addDecodedTypesToTransferSentEvents(ethersEvents)
    console.log(events)

    expect(events.length).toBe(1)
    expect(events[0].decoded).toBeTruthy()
  }, 60 * 1000)
  it.skip('should add typedEvent to events', async () => {
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const events = railsGateway.addDecodedTypesToEvents(ethersEvents)
    console.log(events)

    expect(events.length).toBe(1)
    expect(events[0].decoded).toBeTruthy()
  }, 60 * 1000)
  it.skip('should add typedEvent to event', async () => {
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = railsGateway.addDecodedTypesToEvent(ethersEvents[0])
    console.log(event)

    expect(event.decoded).toBeTruthy()
  }, 60 * 1000)
  it.skip('should fetch TransferBonded events', async () => {
    const chainId = 11155420
    const fromBlock = 11394756
    const toBlock = 11394756
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const events = await railsGateway.getTransferBondedEvents({
      fromBlock,
      toBlock
    })

    expect(events.length).toBe(1)
  })
  it('should get RailsGateway contract instance', async () => {
    const chainId = 11155420
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const contract = await railsGateway.getRailsGatewayContract()
    expect(contract).toBeDefined()
  })
  it('should get pathId', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const pathId = await railsGateway.getPathId({
      chainId0: 11155111,
      token0: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      chainId1: 11155420,
      token1: '0xaca72c8d5360dc237001cd963566f411732980b0'
    })
    console.log(pathId)
    expect(pathId).toBeDefined()
  })
  it.skip('should get pathInfo on origin chain', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
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
  it.skip('should get pathInfo on counter chain', async () => {
    const chainId = 11155420
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
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
  it.skip('should get fee for pathId', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const fee = await railsGateway.getFee({
      pathId
    })
    console.log(fee)
    expect(fee).toBeDefined()
  })
  it.skip('should initiate a token transfer', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const to = await signer.getAddress()
    const attestedClaimId = '0xTODO'
    const maxTotalSent = parseUnits('1', 18)
    const nextHops = [{
      pathId,
      maxTotalSent: '0',
      attestedClaimId: '0xTODO'
    }]
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const fee = await railsGateway.getFee({
      pathId
    })
    const txData = await railsGateway.populateTransaction.send({
      pathId,
      to,
      amount,
      attestedClaimId,
      maxTotalSent,
      nextHops,
      fee
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it.skip('should initiate a bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xTODO'
    const amount = parseUnits('1', 18)
    const nextHops = [{
      pathId,
      maxTotalSent: '0',
      attestedClaimId: '0xTODO'
    }]
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = await railsGateway.populateTransaction.bond({
      pathId,
      transferId,
      amount,
      nextHops
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it.skip('should post claim', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const to = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const totalSent = parseUnits('1', 18)
    const attestedClaimId  = '0xTODO'
    const attestedTotalClaims = parseUnits('1', 18)
    const nextHopsHash = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = await railsGateway.populateTransaction.postClaim({
      pathId,
      transferId,
      to,
      amount,
      totalSent,
      attestedClaimId,
      attestedTotalClaims,
      nextHopsHash
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it.skip('TODO should get withdrawable balance', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const recipient = await signer.getAddress()
    const timeWindow = 1
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const balance = await railsGateway.getWithdrawableBalance({
      pathId,
      recipient,
      timeWindow
    })
    console.log(balance)
    expect(balance).toBeDefined()
  })
  it.skip('TODO should withdraw claim', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const timeWindow = 1
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = await railsGateway.populateTransaction.withdrawClaim({
      pathId,
      amount,
      timeWindow
    })
    expect(txData).toBeDefined()
  })
  it('should withdraw all claims', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const timeWindow = 1
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = await railsGateway.populateTransaction.withdrawAllClaims({
      pathId,
      timeWindow
    })
    expect(txData).toBeDefined()
  })
  it.skip('should get HOP token address', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const address = await railsGateway.getHopTokenAddress()
    expect(address).toBeDefined()
  })
  it.skip('TODO should get min bonder stake', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const amount = await railsGateway.getMinBonderStake()
    expect(amount).toBeDefined()
  })
  it.skip('TODO should get HOP balance', async () => {
    const chainId = 11155111
    const address = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const balance = await railsGateway.getHopBalance(address)
    expect(balance).toBeDefined()
  })
  it.skip('TODO should get HOP token contract', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const contract = await railsGateway.getHopTokenContract()
    expect(contract).toBeDefined()
  })
  it.skip('TODO should stake HOP', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const staker = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const tx = await railsGateway.stakeHop({
      role,
      staker,
      amount
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should unstake HOP', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const tx = await railsGateway.unstakeHop({
      role,
      amount
    })
    expect(tx.hash).toBeDefined()
  })
  it('should get event names', async () => {
    const eventNames = RailsGateway.getEventNames()
    expect(eventNames.length > 0).toBeTruthy()
  })
  it.skip('should get transfer sent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const events = await railsGateway.getTransferSentEvents({
      fromBlock,
      toBlock
    })
    console.log(events)
    expect(events.length > 0).toBeTruthy()
  })
  it.skip('should add decoded types to transfer bonded events', async () => {
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const events = railsGateway.addDecodedTypesToTransferBondedEvents(rawEvents)
    console.log(events)
    expect(events.length > 0).toBeTruthy()
    expect(events[0].decoded).toBeDefined()
  })
  it('should get rails gateway contract address', async () => {
    const chainId = 11155111
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const address = railsGateway.getRailsGatewayContractAddress()
    expect(address).toBeDefined()
  })
  it('should initiate approve send tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.approveSend({
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it('should initiate approve bond tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.approveBond({
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it.skip('should initiate remove claim tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.removeClaim({
      pathId,
      transferId
    })
    expect(txData).toBeDefined()
  })
  it.skip('should initiate confirm claim tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.confirmClaim({
      pathId,
      transferId
    })
    expect(txData).toBeDefined()
  })
  it.skip('TODO should initiate stake hop approval tx', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const staker = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = railsGateway.populateTransaction.approveStakeHop({
      role,
      staker,
      amount
    })
    expect(txData).toBeDefined()
  })
  it.skip('TODO should initiate withdraw hop tx', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const txData = await railsGateway.populateTransaction.withdrawHop({
      role,
    })
    expect(txData).toBeDefined()
  })
  it.skip('should return boolean if needs approval for send', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const needsApproval = await railsGateway.getNeedsApprovalForSend({
      pathId,
      amount,
      account
    })
    expect(needsApproval).toBeDefined()
  })
  it.skip('should return boolean if needs approval for bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const needsApproval = await railsGateway.getNeedsApprovalForBond({
      pathId,
      amount,
      account
    })
    expect(needsApproval).toBeDefined()
  })
  it.skip('should get latest claim hash', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const latestClaim = await railsGateway.getLatestClaim({
      pathId,
    })
    console.log(latestClaim)
    expect(latestClaim).toBeDefined()
  })
  it.skip('TODO should return computed transfer id', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const to = await signer.getAddress()
    const adjustedAmount = parseUnits('1', 18)
    const minAmountOut = parseUnits('1', 18)
    const totalSent = parseUnits('1', 18)
    const nonce = '1'
    const attestedCheckpoint = ''
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const transferId = await railsGateway.getTransferId({
      pathId,
      to,
      adjustedAmount,
      minAmountOut,
      totalSent,
      nonce,
      attestedCheckpoint
    })
    console.log(transferId)
    expect(transferId).toBeDefined()
  })
  it.skip('should get transfer sent event from transaction receipt', async () => {
    const chainId = 11155111
    const txHash = '0xced84d48d165a5efa5382c638ab0645b6e3b9c5b3725b54f90650724138cba9f'
    const receipt = await provider.getTransactionReceipt(txHash)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferSentEventFromTransactionReceipt({
      receipt
    })
    expect(event).toBeDefined()
  })
  it.skip('should get transfer sent event from transaction hash', async () => {
    const chainId = 11155111
    const transactionHash = '0x063287bb2b7c32fa457dfb9a8c1312043b471286b6226190b4503a969d32d971'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferSentEventFromTransactionHash({
      transactionHash
    })
    console.log(event)
    expect(event).toBeDefined()
    expect(event!.decoded).toBeDefined()
  })
  it.skip('TODO should get transfer sent event from transfer id', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferSentEventFromTransferId({
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it.skip('should get transfer bonded event from transaction receipt', async () => {
    const chainId = 11155420
    const txHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const provider = new providers.StaticJsonRpcProvider('https://sepolia.optimism.io')
    const receipt = await provider.getTransactionReceipt(txHash)
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferBondedEventFromTransactionReceipt({
      receipt
    })
    expect(event).toBeDefined()
  })
  it.skip('should get transfer bonded event from transaction hash', async () => {
    const chainId = 11155420
    const transactionHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferBondedEventFromTransactionHash({
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get transfer bonded event from transfer id', async () => {
    const chainId = 11155420
    const transferId = '0x7132cf97b6dcbabd2cabc72f36c1036f6e51dbd73d78a9f97d85b864d0f12640'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const event = await railsGateway.getTransferBondedEventFromTransferId({
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it.skip('should return boolean for claim id validity', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const claimId = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const isValid = await railsGateway.getIsClaimIdValid({
      pathId,
      claimId
    })
    console.log(isValid)
    expect(isValid).toBeDefined()
  })
  it.skip('should return total sent for path id', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const totalSent = await railsGateway.getTotalSent({
      pathId
    })
    console.log(totalSent)
    expect(totalSent).toBeDefined()
  })
  it.skip('should get token info', async () => {
    const chainId = 11155111
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
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
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const contract = railsGateway.getTokenContract({
      address
    })
    expect(contract).toBeDefined()
  })
  it.skip('should return boolean for sufficient balance check', async () => {
    const chainId = 11155111
    const tokenAddress = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const sufficientBalance = await railsGateway.getHasSufficientBalance({
      tokenAddress,
      amount,
      account
    })
    expect(sufficientBalance).toBeDefined()
  })

  it.skip('TODO should return true if transfer is bonded', async () => {
    const chainId = 11155111
    const transferId = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const bonded = await railsGateway.getIsTransferBonded({
      transferId
    })
    console.log(bonded)
    expect(typeof bonded).toBe('boolean')
  }, 60 * 1000)

  it.skip('TODO should return true if transfer is claimed', async () => {
    const chainId = 11155111
    const transferId = '0xTODO'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const claimed = await railsGateway.getIsTransferClaimed({
      transferId
    })
    console.log(claimed)
    expect(typeof claimed).toBe('boolean')
  }, 60 * 1000)

  it('getNextHopsHash - should return a keccak256 hash of the hops', () => {
    const nextHops = [
      {
        pathId: utils.formatBytes32String('path1'),
        maxTotalSent: BigNumber.from('1000000'),
        attestedClaimId: utils.formatBytes32String('claim1'),
      },
      {
        pathId: utils.formatBytes32String('path2'),
        maxTotalSent: BigNumber.from('2000000'),
        attestedClaimId: utils.formatBytes32String('claim2'),
      },
    ]

    const hash = RailsGateway.getNextHopsHash({ nextHops })
    console.log(hash)

    expect(typeof hash).toBe('string')
    expect(hash.length).toBe(66)
    expect(hash).toBe('0xaecd8bdc95baa83199d242ec7b87219b76ae0a12a858f2160a697408aa490fba')
  })

  it('getNextHopsHash - should return 0x0 hash if hops is empty', () => {
    const nextHops: any[] = []
    const hash = RailsGateway.getNextHopsHash({ nextHops })
    console.log(hash)
    expect(hash).toBe(constants.HashZero)
  })

  it.skip('should return boolean for getting is path id live', async () => {
    const chainId = 11155111
    const pathId = '0x5be8acd551732a476d4787319ec94ee95a1bd68656a30f577c6fc50f970180e6'
    const railsGateway = new RailsGateway({
      chainId,
      signerOrProvider: RailsGateway.getDefaultChainRpcProvider(chainId)
    })
    const isLive = await railsGateway.getIsPathIdLive({ pathId })
    console.log(isLive)
    expect(typeof isLive).toBe('boolean')
    expect(isLive).toBe(true)

    const invalidPathId = '0x1111111111111111111111111111111111111111111111111111111111111111'
    expect(await railsGateway.getIsPathIdLive({ pathId: invalidPathId })).toBe(false)
  })
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
})

