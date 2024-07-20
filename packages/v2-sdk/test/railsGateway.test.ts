import { RailsGateway } from '#railsGateway/index.js'
import { providers, Wallet, utils } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe.skip('RailsGateway', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)
  const railsGateway = new RailsGateway({
    network: 'sepolia'
  })
  it('should get signer address', async () => {
    const address = await railsGateway.getSignerAddress()
    expect(address).toBeDefined()
  })
  it('should fetch TransferSent event filter', async () => {
    const chainId = 11155111
    const filter = railsGateway.getTransferSentEventFilter({
      chainId
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(1)
  })
  it('should fetch TransferSent transferId event filter', async () => {
    const chainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const filter = railsGateway.getTransferSentEventFilter({
      chainId,
      indexes: {
        transferId
      }
    })

    console.log(filter)

    expect(filter).toBeTruthy()
    expect(filter.topics!.length).toBe(2)
  })
  it('should fetch TransferSent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const eventsGenerator = railsGateway.getTransferSentEventsInBatches({
      chainId,
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
      ],
      fromBlock,
      toBlock
    })

    console.log(ethersEvents)

    const events = railsGateway.addDecodedTypesToEvents(ethersEvents)
    console.log(events)

    expect(events.length).toBe(1)
    expect(events[0].decoded).toBeTruthy()
  }, 60 * 1000)
  it('should fetch TransferBonded events', async () => {
    const chainId = 11155420
    const fromBlock = 11394756
    const toBlock = 11394756
    const events = await railsGateway.getTransferBondedEvents({
      chainId,
      fromBlock,
      toBlock
    })

    expect(events.length).toBe(1)
  })
  it('should get RailsGateway contract instance', async () => {
    const chainId = 11155420
    const contract = await railsGateway.getRailsGatewayContract(chainId)
    expect(contract).toBeDefined()
  })
  it('should get pathId', async () => {
    const pathId = await railsGateway.getPathId({
      chainId0: 11155111,
      token0: '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32',
      chainId1: 11155420,
      token1: '0xaca72c8d5360dc237001cd963566f411732980b0'
    })
    console.log(pathId)
    expect(pathId).toBeDefined()
  })
  it('should get pathInfo', async () => {
    {
      const chainId = 11155111
      const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
      const pathInfo = await railsGateway.getPathInfo({
        chainId,
        pathId
      })
      console.log(pathInfo)
      expect(pathInfo.token).toBeDefined()
      expect(pathInfo.pathId).toBe('0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a')
      expect(pathInfo.chainId.toString()).toBe('11155111')
      expect(pathInfo.token).toBe('0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32')
      expect(pathInfo.counterpartChainId.toString()).toBe('11155420')
      expect(pathInfo.counterpartToken).toBe('0xaCa72C8D5360dC237001cD963566F411732980B0')
    }
    {
      const chainId = 11155420
      const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
      const pathInfo = await railsGateway.getPathInfo({
        chainId,
        pathId
      })
      console.log(pathInfo)
      expect(pathInfo.token).toBeDefined()
      expect(pathInfo.pathId).toBe('0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a')
      expect(pathInfo.chainId.toString()).toBe('11155420')
      expect(pathInfo.token).toBe('0xaCa72C8D5360dC237001cD963566F411732980B0')
      expect(pathInfo.counterpartChainId.toString()).toBe('11155111')
      expect(pathInfo.counterpartToken).toBe('0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32')
    }
  }, 60 * 1000)
  it('should get fee for pathId', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const fee = await railsGateway.getFee({
      chainId,
      pathId
    })
    console.log(fee)
    expect(fee).toBeDefined()
  })
  it('should initiate a token transfer', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const to = await signer.getAddress()
    const minAmountOut = '0'
    const attestedCheckpoint = ''
    const txData = await railsGateway.populateTransaction.send({
      chainId,
      pathId,
      amount,
      to,
      minAmountOut,
      attestedCheckpoint
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it('should initiate a bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const to = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const checkpoint = '0xa4d0565cde09d28138df2d24c94188c628fc09689ea7bce609129abf9a85c96e'
    const totalSent = '0'
    const nonce = '1'
    const attestedCheckpoint = ''
    const txData = await railsGateway.populateTransaction.bond({
      chainId,
      pathId,
      to,
      amount,
      checkpoint,
      totalSent,
      nonce,
      attestedCheckpoint
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it('should post claim', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const head = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const totalSent = parseUnits('1', 18)
    const txData = await railsGateway.populateTransaction.postClaim({
      chainId,
      pathId,
      transferId,
      head,
      totalSent
    })
    console.log(txData)
    expect(txData).toBeDefined()
  })
  it.skip('TODO should get withdrawable balance', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const recipient = await signer.getAddress()
    const timeWindow = 1
    const balance = await railsGateway.getWithdrawableBalance({
      chainId,
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
    const txData = await railsGateway.populateTransaction.withdrawClaim({
      chainId,
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
    const txData = await railsGateway.populateTransaction.withdrawAllClaims({
      chainId,
      pathId,
      timeWindow
    })
    expect(txData).toBeDefined()
  })
  it.skip('should get HOP token address', async () => {
    const chainId = 11155111
    const address = await railsGateway.getHopTokenAddress(chainId)
    expect(address).toBeDefined()
  })
  it.skip('TODO should get min bonder stake', async () => {
    const chainId = 11155111
    const amount = await railsGateway.getMinBonderStake(chainId)
    expect(amount).toBeDefined()
  })
  it.skip('TODO should get HOP balance', async () => {
    const chainId = 11155111
    const address = await signer.getAddress()
    const balance = await railsGateway.getHopBalance(chainId, address)
    expect(balance).toBeDefined()
  })
  it.skip('TODO should get HOP token contract', async () => {
    const chainId = 11155111
    const contract = await railsGateway.getHopTokenContract(chainId)
    expect(contract).toBeDefined()
  })
  it.skip('TODO should stake HOP', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const staker = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const tx = await railsGateway.stakeHop({
      chainId,
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
    const tx = await railsGateway.unstakeHop({
      chainId,
      role,
      amount
    })
    expect(tx.hash).toBeDefined()
  })
  it('should calc amountOutMin', async () => {
    const amountOut = parseUnits('1', 18)
    const slippageTolerance = 0.01
    const amountOutMin = railsGateway.calcAmountOutMin({
      amountOut,
      slippageTolerance
    })
    expect(amountOutMin).toBeDefined()
  })
  it('should get event names', async () => {
    const eventNames = railsGateway.getEventNames()
    expect(eventNames.length > 0).toBeTruthy()
  })
  it('should get transfer sent events', async () => {
    const chainId = 11155111
    const fromBlock = 5816945
    const toBlock = 5816945
    const events = await railsGateway.getTransferSentEvents({
      chainId,
      fromBlock,
      toBlock
    })
    expect(events.length > 0).toBeTruthy()
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
    const events = railsGateway.addDecodedTypesToTransferBondedEvents(rawEvents)
    console.log(events)
    expect(events.length > 0).toBeTruthy()
    expect(events[0].decoded).toBeDefined()
  })
  it('should get rails gateway contract address', async () => {
    const chainId = 11155111
    const address = railsGateway.getRailsGatewayContractAddress(chainId)
    expect(address).toBeDefined()
  })
  it('should initiate approve send tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const txData = railsGateway.populateTransaction.approveSend({
      chainId,
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it('should initiate approve bond tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const txData = railsGateway.populateTransaction.approveBond({
      chainId,
      pathId,
      amount
    })
    expect(txData).toBeDefined()
  })
  it('should initiate remove claim tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const checkpoint = '0xa4d0565cde09d28138df2d24c94188c628fc09689ea7bce609129abf9a85c96e'
    const nonce = '1'
    const txData = railsGateway.populateTransaction.removeClaim({
      chainId,
      pathId,
      checkpoint,
      nonce
    })
    expect(txData).toBeDefined()
  })
  it('should initiate confirm checkpoint tx', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const checkpoint = '0xa4d0565cde09d28138df2d24c94188c628fc09689ea7bce609129abf9a85c96e'
    const txData = railsGateway.populateTransaction.confirmCheckpoint({
      chainId,
      pathId,
      checkpoint,
    })
    expect(txData).toBeDefined()
  })
  it.skip('TODO should initiate stake hop approval tx', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const staker = await signer.getAddress()
    const amount = parseUnits('1', 18)
    const txData = railsGateway.populateTransaction.approveStakeHop({
      chainId,
      role,
      staker,
      amount
    })
    expect(txData).toBeDefined()
  })
  it.skip('TODO should initiate withdraw hop tx', async () => {
    const chainId = 11155111
    const role = '0xTODO'
    const txData = await railsGateway.populateTransaction.withdrawHop({
      chainId,
      role,
    })
    expect(txData).toBeDefined()
  })
  it('should return boolean if needs approval for send', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const needsApproval = await railsGateway.getNeedsApprovalForSend({
      chainId,
      pathId,
      amount,
      account
    })
    expect(needsApproval).toBeDefined()
  })
  it('should return boolean if needs approval for bond', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const needsApproval = await railsGateway.getNeedsApprovalForBond({
      chainId,
      pathId,
      amount,
      account
    })
    expect(needsApproval).toBeDefined()
  })
  it('should get latest claim hash', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const latestClaim = await railsGateway.getLatestClaim({
      chainId,
      pathId,
    })
    console.log(latestClaim)
    expect(latestClaim).toBeDefined()
  })
  it('should return boolean for checkpoint validity', async () => {
    const chainId = 11155111
    const pathId = '0xf47a641595157206fd457efb304ec553834dffaf756de8dc6d3a639ba379557a'
    const checkpoint = '0xa4d0565cde09d28138df2d24c94188c628fc09689ea7bce609129abf9a85c96e'
    const isValid = await railsGateway.getIsCheckpointValid({
      chainId,
      pathId,
      checkpoint
    })
    console.log(isValid)
    expect(isValid).toBeDefined()
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
    const transferId = await railsGateway.getTransferId({
      chainId,
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
  it('should get transfer sent event from transaction receipt', async () => {
    const fromChainId = 11155111
    const txHash = '0xced84d48d165a5efa5382c638ab0645b6e3b9c5b3725b54f90650724138cba9f'
    const receipt = await provider.getTransactionReceipt(txHash)
    const event = await railsGateway.getTransferSentEventFromTransactionReceipt({
      fromChainId,
      receipt
    })
    expect(event).toBeDefined()
  })
  it('should get transfer sent event from transaction hash', async () => {
    const fromChainId = 11155111
    const transactionHash = '0xced84d48d165a5efa5382c638ab0645b6e3b9c5b3725b54f90650724138cba9f'
    const event = await railsGateway.getTransferSentEventFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get transfer sent event from transfer id', async () => {
    const fromChainId = 11155111
    const transferId = '0xf3aeea1f3ca2c666e582879bc7dba467ce96af3ac8183ac423d74ca0dacdd221'
    const event = await railsGateway.getTransferSentEventFromTransferId({
      fromChainId,
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it.skip('TODO should get transfer sent event from checkpoint', async () => {
    const fromChainId = 11155111
    const checkpoint = '0xa4d0565cde09d28138df2d24c94188c628fc09689ea7bce609129abf9a85c96e'
    const event = await railsGateway.getTransferSentEventFromCheckpoint({
      fromChainId,
      checkpoint
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it('should get transfer bonded event from transaction receipt', async () => {
    const fromChainId = 11155420
    const txHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const provider = new providers.StaticJsonRpcProvider('https://sepolia.optimism.io')
    const receipt = await provider.getTransactionReceipt(txHash)
    const event = await railsGateway.getTransferBondedEventFromTransactionReceipt({
      fromChainId,
      receipt
    })
    expect(event).toBeDefined()
  })
  it('should get transfer bonded event from transaction hash', async () => {
    const fromChainId = 11155420
    const transactionHash = '0x65bdde1040b2623f10c5b70ed31e2f9f7150cb5745055dcbc70a1bb1e65e8888'
    const event = await railsGateway.getTransferBondedEventFromTransactionHash({
      fromChainId,
      transactionHash
    })
    expect(event).toBeDefined()
  })
  it.skip('TODO should get transfer bonded event from transfer id', async () => {
    const fromChainId = 11155420
    const transferId = '0x7132cf97b6dcbabd2cabc72f36c1036f6e51dbd73d78a9f97d85b864d0f12640'
    const event = await railsGateway.getTransferBondedEventFromTransferId({
      fromChainId,
      transferId
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it.skip('TODO should get transfer bonded event from checkpoint', async () => {
    const fromChainId = 11155420
    const checkpoint = '0x3c7d7dc380724b4a03247d1ece8a6b0b1409de6771682468a4a2034a8b95bfec'
    const event = await railsGateway.getTransferBondedEventFromCheckpoint({
      fromChainId,
      checkpoint
    })
    expect(event).toBeDefined()
  }, 60 * 1000)
  it('should get token info', async () => {
    const chainId = 11155111
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const tokenInfo = await railsGateway.getTokenInfo({
      chainId,
      address
    })
    expect(tokenInfo).toBeDefined()
  })
  it('should get token contract', async () => {
    const chainId = 11155420
    const address = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const contract = railsGateway.getTokenContract({
      chainId,
      address
    })
    expect(contract).toBeDefined()
  })
  it('should return boolean for sufficient balance check', async () => {
    const chainId = 11155111
    const tokenAddress = '0xF0da7a70e0F5E06372A3c407c4FB0c1F25162c32'
    const amount = parseUnits('1', 18)
    const account = await signer.getAddress()
    const sufficientBalance = await railsGateway.getHasSufficientBalance({
      chainId,
      tokenAddress,
      amount,
      account
    })
    expect(sufficientBalance).toBeDefined()
  })
  it.skip('TODO should get transfer status for checkpoint', async () => {
    const fromChainId = 11155111
    const toChainId = 11155420
    const checkpoint = '0x3c7d7dc380724b4a03247d1ece8a6b0b1409de6771682468a4a2034a8b95bfec'
    const transferStatus = await railsGateway.getTransferStatus({
      fromChainId,
      toChainId,
      checkpoint
    })
    console.log(transferStatus)
    expect(transferStatus).toBeDefined()
  }, 60 * 1000)
})

