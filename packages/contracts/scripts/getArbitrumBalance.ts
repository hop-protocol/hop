require('dotenv').config()

import { ethers } from 'hardhat'
import { ContractFactory, Contract } from 'ethers'

async function getArbitrumBalance () {
  // Factories
  let MockERC20: ContractFactory

  // L2
  let l2_poolToken: Contract
  let l2_ourToken: Contract

  // Get the contract Factories
  MockERC20 = await ethers.getContractFactory('contracts/test/MockERC20.sol:MockERC20')

  const POOL_TOKEN_ADDRESS = '0x7d669A64deb8a4A51eEa755bb0E19FD39CE25Ae9'
  const OUR_TOKEN_ADDRESS = '0xf8E96392b1Ba3B2FD88041894a93e089E93C0dcd'

  l2_poolToken = MockERC20.attach(POOL_TOKEN_ADDRESS)
  l2_ourToken = MockERC20.attach(OUR_TOKEN_ADDRESS)

  let addressToCheck = '0x92E5A4B202F57B3634d6352fBAbBA9Cf2908a14A'
  let l2_poolTokenBalance = (await l2_poolToken.balanceOf(addressToCheck)).toString()
  let l2_ourTokenBalance = (await l2_ourToken.balanceOf(addressToCheck)).toString()

  console.log("Canonical: ", addressToCheck, l2_poolTokenBalance)
  console.log("Our Token: ", addressToCheck, l2_ourTokenBalance)

  addressToCheck = '0x02b260F6f47FF328496Be632678d06a564B8c4AB'
  l2_poolTokenBalance = (await l2_poolToken.balanceOf(addressToCheck)).toString()
  l2_ourTokenBalance = (await l2_ourToken.balanceOf(addressToCheck)).toString()

  console.log("Canonical: ", addressToCheck, l2_poolTokenBalance)
  console.log("Our Token: ", addressToCheck, l2_ourTokenBalance)
}

/* tslint:disable-next-line */
(async () => {
  await getArbitrumBalance()
})()