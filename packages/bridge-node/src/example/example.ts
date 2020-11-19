import '../moduleAlias'
import assert from 'assert'
import * as ethers from 'ethers'
import MerkleTree from '@authereum/utils/core/MerkleTree'
import Transfer from 'src/lib/Transfer'
import { ARBITRUM_MESSENGER_ID } from 'src/constants'
import L1PoolTokenContract from 'src/contracts/L1PoolTokenContract'
import L1BridgeContract from 'src/contracts/L1BridgeContract'
import L2BridgeContract from 'src/contracts/L2BridgeContract'
import { L1BridgeAddress } from 'src/config'
import L1Wallet from 'src/wallets/L1Wallet'

async function main () {
  const accountAddress = L1Wallet.getAddress()
  const parsedAmount = 0.01
  const amount = ethers.utils.parseUnits(parsedAmount.toString(), 18)
  console.log('using amount', parsedAmount)

  const tx1 = await L1PoolTokenContract.approve(L1BridgeAddress, amount)
  console.log('L1 token approve', tx1.hash)
  const receipt1 = await tx1.wait()
  assert(receipt1.status === 1)
  const tx2 = await L1BridgeContract.committeeStake(amount)
  console.log('L1 committee stake', tx2.hash)
  const receipt2 = await tx2.wait()
  assert(receipt2.status === 1)

  const committeeBond = await L1BridgeContract.committeeBond()
  const parsedCommitteeBond = Number(
    ethers.utils.formatUnits(committeeBond, 18)
  )
  console.log('L1 committee bond', parsedCommitteeBond)

  const bridgeBalance = await L2BridgeContract.balanceOf(accountAddress)
  const parsedBridgeBalance = Number(
    ethers.utils.formatUnits(bridgeBalance.toString(), 18)
  )
  console.log('L2 bridge balance', parsedBridgeBalance)

  const tokenBalance = await L1PoolTokenContract.balanceOf(accountAddress)
  const parsedTokenBalance = Number(
    ethers.utils.formatUnits(tokenBalance.toString(), 18)
  )
  console.log('L1 token balance', parsedTokenBalance)

  if (parsedTokenBalance < 0.01) {
    const mintAmount = ethers.utils.parseUnits('100', 18)
    const tx = await L1PoolTokenContract.mint(accountAddress, mintAmount)
    console.log('L1 token mint tx', tx.hash)
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }

  const approved = await L1PoolTokenContract.allowance(
    accountAddress,
    L1BridgeAddress
  )
  const parsedApproved = Number(
    ethers.utils.formatUnits(approved.toString(), 18).toString()
  )
  if (parsedApproved < parsedAmount) {
    const approveAmount = ethers.utils.parseUnits('100', 18)
    const tx = await L1PoolTokenContract.approve(L1BridgeAddress, approveAmount)
    console.log('L1 token approve tx', tx.hash)
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }

  if (parsedBridgeBalance <= parsedAmount) {
    const tx = await L1BridgeContract.sendToL2(
      ARBITRUM_MESSENGER_ID,
      accountAddress,
      amount,
      {
        //gasLimit: 100000
      }
    )
    console.log('L1 sendToL2 tx', tx.hash)
    const receipt = await tx.wait()
    assert(receipt.status === 1)
  }

  const transferNonce = 8
  const relayerFee = '0'
  const tx3 = await L2BridgeContract.sendToMainnet(
    accountAddress,
    amount,
    transferNonce,
    relayerFee
  )
  console.log('L2 sendToMainnet tx', tx3.hash)
  const receipt3 = await tx3.wait()
  assert(receipt3.status === 1)

  const recipient = await L1Wallet.getAddress()
  const transfer = new Transfer({
    recipient,
    amount,
    nonce: transferNonce,
    relayerFee: ethers.BigNumber.from(relayerFee)
  })

  const leaves = [transfer.getTransferHash()]
  const tree = new MerkleTree(leaves)
  const proof = tree.getProof(leaves[0])
  const root = tree.getHexRoot()
  console.log('tree root for withdrawal', root)

  const tx5 = await L1BridgeContract.withdraw(
    transfer.recipient,
    transfer.amount,
    transfer.nonce,
    transfer.relayerFee,
    root,
    proof,
    {
      // gasLimit: 100000
    }
  )

  console.log('L1 withdraw tx', tx5.hash)
  const receipt5 = await tx5.wait()
  assert(receipt5.status)

  console.log('complete')
}

main()
