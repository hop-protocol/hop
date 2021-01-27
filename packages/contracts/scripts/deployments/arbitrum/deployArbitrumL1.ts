require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract, BigNumber } from 'ethers'
import { getMessengerWrapperDefaults } from '../../../test/shared/utils'
import {
  CHAIN_IDS,
  IGetMessengerWrapperDefaults
} from '../../../test/shared/constants'

async function deployArbitrum () {
  // Factories
  let L1_Bridge: ContractFactory
  let MockERC20: ContractFactory
  let MessengerWrapper: ContractFactory

  // L1
  let l1_poolToken: Contract
  let messengerWrapper: Contract
  let l1_bridge: Contract

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')
  L1_Bridge = await ethers.getContractFactory('contracts/bridges/L1_Bridge.sol:L1_Bridge')
  MessengerWrapper = await ethers.getContractFactory('contracts/wrappers/OptimismMessengerWrapper.sol:OptimismMessengerWrapper')

  const DAI_ADDRESS = '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9'
  l1_poolToken = MockERC20.attach(DAI_ADDRESS)

  const COMMITTEE_ADDRESS = '0x02b260F6f47FF328496Be632678d06a564B8c4AB'

  /**
   * Deployments
   */

  // l1_bridge = await L1_Bridge.deploy(l1_poolToken.address, COMMITTEE_ADDRESS)
  // await l1_bridge.deployed()

  // Deploy Messenger Wrapper
  const l2ChainId: BigNumber = CHAIN_IDS.OPTIMISM_HOP_TESTNET
  // TODO: This will not work, as we need access to the not-yet-deployed L2 bridge address.
  // TODO: This whole section will be removed when DRYing up and optimizing the script/test deployments and assertions
  const l1BridgeAddress = '0xe74EFb19BBC46DbE28b7BaB1F14af6eB7158B4BE'
  const l2BridgeAddress = '0x6d2f304CFF4e0B67dA4ab38C6A5C8184a2424D05'
  const l1MessengerAddress = '0x77eeDe6CC8B46C76e50979Ce3b4163253979c519'
  const messengerWrapperDefaults: IGetMessengerWrapperDefaults[] = getMessengerWrapperDefaults(
    l2ChainId,
    l1BridgeAddress,
    l2BridgeAddress,
    l1MessengerAddress
  )
  messengerWrapper = await MessengerWrapper.deploy(...messengerWrapperDefaults)
  await messengerWrapper.deployed()

  // console.log('L1 Bridge            :', l1_bridge.address)
  console.log('L1 Messenger Wrapper :', messengerWrapper.address)
}

/* tslint:disable-next-line */
(async () => {
  await deployArbitrum()
})()