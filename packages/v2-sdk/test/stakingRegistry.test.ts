import { StakingRegistry, EventName } from '#railsGateway/index.js'
import { providers, Wallet, utils, BigNumber, constants } from 'ethers'
import { randomBytes } from 'crypto'
import dotenv from 'dotenv'

const { parseUnits } = utils

dotenv.config()

export const privateKey = process.env.PRIVATE_KEY ?? randomBytes(32).toString('hex')

describe('StakingRegistry', () => {
  const ethereumRpcUrl = process.env.ETHEREUM_RPC_PROVIDER ?? 'https://rpc2.sepolia.org'
  const provider = new providers.StaticJsonRpcProvider(ethereumRpcUrl)
  const signer = new Wallet(privateKey)

  it.skip('should set bonder preference', async () => {
    const chainId = 84532
    const provider = StakingRegistry.getDefaultProvider(chainId)
    const signer = new Wallet(privateKey, provider)
    const stakingRegistry = new StakingRegistry({
      chainId,
      signerOrProvider: signer,
    })
    const address = await stakingRegistry.getSignerAddress(chainId)
    expect(address).toBeDefined()

    const pathId = '0xa120523a25f1970cfe391c4b364152104f93cd56b30748986f6e1a9087706414'
    const feeTier = '1'
    const liquidity = '1'
    const tx = await stakingRegistry.signalPreference({ pathId, feeTier, liquidity })
    console.log(tx.hash)
    expect(tx.hash).toBeDefined()
  })
})

  // it.only('should get HOP balance', async () => {
  //   const chainId = 11155111
  //   const address = await signer.getAddress()
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const balance = await railsGateway.getHopBalance(address)
  //   expect(balance).toBeDefined()
  // })

  // it.only('should get min bonder stake', async () => {
  //   const chainId = 11155111
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const amount = await railsGateway.getMinBonderStake()
  //   expect(amount).toBeDefined()
  // })


  // it.skip('TODO should initiate stake hop approval tx', async () => {
  //   const chainId = 11155111
  //   const role = '0xTODO'
  //   const staker = await signer.getAddress()
  //   const amount = parseUnits('1', 18)
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const txData = railsGateway.populateTransaction.approveStakeHop({
  //     role,
  //     staker,
  //     amount
  //   })
  //   expect(txData).toBeDefined()
  // })


  // it.skip('TODO should stake HOP', async () => {
  //   const chainId = 11155111
  //   const role = '0xTODO'
  //   const staker = await signer.getAddress()
  //   const amount = parseUnits('1', 18)
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const tx = await railsGateway.stakeHop({
  //     role,
  //     staker,
  //     amount
  //   })
  //   expect(tx.hash).toBeDefined()
  // })

  // it.skip('TODO should unstake HOP', async () => {
  //   const chainId = 11155111
  //   const role = '0xTODO'
  //   const amount = parseUnits('1', 18)
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const tx = await railsGateway.unstakeHop({
  //     role,
  //     amount
  //   })
  //   expect(tx.hash).toBeDefined()
  // })


  // it.skip('TODO should initiate withdraw hop tx', async () => {
  //   const chainId = 11155111
  //   const role = '0xTODO'
  //   const railsGateway = new RailsGateway({
  //     chainId,
  //     signerOrProvider: RailsGateway.getDefaultProvider(chainId)
  //   })
  //   const txData = await railsGateway.populateTransaction.withdrawHop({
  //     role,
  //   })
  //   expect(txData).toBeDefined()
  // })
