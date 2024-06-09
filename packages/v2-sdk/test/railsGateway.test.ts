import { RailsGateway } from '#railsGateway/index.js'
import { providers, Wallet, utils } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe.skip('RailsGateway', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER!
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)
  const address = '0xTODO'
  const railsGateway = new RailsGateway({
    network: 'mainnet'
  })
  it.skip('TODO should get signer address', async () => {
    const address = await railsGateway.getSignerAddress()
    expect(address).toBeDefined()
  })
  it.skip('TODO should fetch TransferSent events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await railsGateway.getTransferSentEvents({
      chainId,
      fromBlock,
      toBlock
    })

    expect(events.length).toBe(1)
  })
  it.skip('TODO should fetch TransferBonded events', async () => {
    const chainId = 1
    const fromBlock = 0
    const toBlock = 1000
    const events = await railsGateway.getTransferBondedEvents({
      chainId,
      fromBlock,
      toBlock
    })

    expect(events.length).toBe(1)
  })
  it.skip('TODO should get RailsGateway contract instance', async () => {
    const chainId = 1
    const contract = await railsGateway.getRailsGatewayContract(chainId)
    expect(contract).toBeDefined()
  })
  it.skip('TODO should get pathId', async () => {
    const pathId = await railsGateway.getPathId({
      chainId0: 1,
      token0: '0xTODO',
      chainId1: 2,
      token1: '0xTODO'
    })
    expect(pathId).toBe('')
  })
  it.skip('TODO should get pathInfo', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const pathInfo = await railsGateway.getPathInfo({
      chainId,
      pathId
    })
    expect(pathInfo.token).toBe('')
  })
  it.skip('TODO should get fee for pathId', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const fee = await railsGateway.getFee({
      chainId,
      pathId
    })
    expect(fee).toBeDefined()
  })
  it.skip('TODO should initiate a token transfer', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const amount = parseUnits('1', 18)
    const to = '0xTODO'
    const minAmountOut = '0'
    const attestedCheckpoint = '0xTODO'
    const tx = await railsGateway.send({
      chainId,
      pathId,
      amount,
      to,
      minAmountOut,
      attestedCheckpoint
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should initiate a bond', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const to = '0xTODO'
    const amount = parseUnits('1', 18)
    const checkpoint = '0xTODO'
    const totalSent = '0'
    const nonce = '0xTODO'
    const attestedCheckpoint = '0xTODO'
    const tx = await railsGateway.bond({
      chainId,
      pathId,
      to,
      amount,
      checkpoint,
      totalSent,
      nonce,
      attestedCheckpoint
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should post claim', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const transferId = '0xTODO'
    const head = '0xTODO'
    const totalSent = parseUnits('1', 18)
    const tx = await railsGateway.postClaim({
      chainId,
      pathId,
      transferId,
      head,
      totalSent
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should get withdrawable balance', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const recipient = '0xTODO'
    const timeWindow = 1
    const balance = await railsGateway.getWithdrawableBalance({
      chainId,
      pathId,
      recipient,
      timeWindow
    })
    expect(balance).toBeDefined()
  })
  it.skip('TODO should withdraw claim', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const amount = parseUnits('1', 18)
    const timeWindow = 1
    const tx = await railsGateway.withdrawClaim({
      chainId,
      pathId,
      amount,
      timeWindow
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should withdraw all claims', async () => {
    const chainId = 1
    const pathId = '0xTODO'
    const timeWindow = 1
    const tx = await railsGateway.withdrawAllClaims({
      chainId,
      pathId,
      timeWindow
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should get HOP token address', async () => {
    const chainId = 1
    const address = await railsGateway.getHopTokenAddress(chainId)
    expect(address).toBeDefined()
  })
  it.skip('TODO should get min bonder stake', async () => {
    const chainId = 1
    const amount = await railsGateway.getMinBonderStake(chainId)
    expect(amount).toBeDefined()
  })
  it.skip('TODO should get HOP balance', async () => {
    const chainId = 1
    const address = '0xTODO'
    const balance = await railsGateway.getHopBalance(chainId, address)
    expect(balance).toBeDefined()
  })
  it.skip('TODO should get HOP token contract', async () => {
    const chainId = 1
    const contract = await railsGateway.getHopTokenContract(chainId)
    expect(contract).toBeDefined()
  })
  it.skip('TODO should stake HOP', async () => {
    const chainId = 1
    const role = '0xTODO'
    const staker = '0xTODO'
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
    const chainId = 1
    const role = '0xTODO'
    const amount = parseUnits('1', 18)
    const tx = await railsGateway.unstakeHop({
      chainId,
      role,
      amount
    })
    expect(tx.hash).toBeDefined()
  })
  it.skip('TODO should calc amountOutMin', async () => {
    const amountOut = parseUnits('1', 18)
    const slippageTolerance = 0.01
    const amountOutMin = railsGateway.calcAmountOutMin({
      amountOut,
      slippageTolerance
    })
    expect(amountOutMin).toBeDefined()
  })
})
