import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import contracts from 'src/contracts'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import wallets from 'src/wallets'
import { BigNumber, Contract } from 'ethers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { abi } from './lineaAbi'
import { getWithdrawalProofData } from 'src/cli/shared'
import { wait } from 'src/utils/wait'

export class ArbBot {
  sdk: Hop
  bridge: HopBridge
  tokenSymbol: string
  l2ChainSlug: string
  l1ChainSlug: string
  l1ChainId: number
  signer: any

  constructor () {
    this.sdk = new Hop('goerli')
    this.tokenSymbol = 'ETH'
    this.l1ChainSlug = Chain.Ethereum.slug
    this.l1ChainId = 5
    this.l2ChainSlug = Chain.Linea.slug
    this.bridge = this.sdk.bridge(this.tokenSymbol)
    this.signer = wallets.get(this.l2ChainSlug)
  }

  async start () {
    while (true) {
      try {
        await this.poll()
      } catch (err: any) {
        console.error('ArbBot error:', err)
      }
      await wait(60 * 1000)
    }
  }

  async poll () {
    const poolThresholdMet = await this.checkPools()
    if (!poolThresholdMet) {
      return
    }
    const tx = await this.withdrawAmmHTokens()
    await tx.wait()
    await wait(10 * 1000)
    const tx2 = await this.sendHTokensToL1()
    await tx2.wait()
    await wait(10 * 1000)
    const tx3 = await this.commitTransfersToL1()
    await tx3.wait()
    await wait(10 * 1000)
    const tx4 = await this.bondTransferRootOnL1()
    await tx4.wait()
    await wait(10 * 1000)
    const tx5 = await this.withdrawTransferOnL1()
    await tx5.wait()
    await wait(10 * 1000)
    const tx6 = await this.l1CanonicalBridgeSendToL2()
    await tx6.wait()
  }

  async checkPools () {
    console.log('checkPools()')
    const [canonicalTokenBalance, hTokenBalance] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    console.log('canonicalTokenBalance:', this.bridge.formatUnits(canonicalTokenBalance))
    console.log('hTokenBalance:', this.bridge.formatUnits(hTokenBalance))

    // TODO
    const thresholdMet = hTokenBalance.sub(canonicalTokenBalance).gt(0)
    return thresholdMet
  }

  async withdrawAmmHTokens () {
    console.log('withdrawAmmHTokens()')
    const amount = this.bridge.parseUnits('3000')

    // TODO
    const amountMin = BigNumber.from(0)

    const deadline = this.getDeadline()
    const tokenIndex = 1 // hToken

    return this.bridge
      .connect(this.signer)
      .removeLiquidityOneToken(amount, tokenIndex, this.l2ChainSlug, {
        amountMin,
        deadline
      })
  }

  async sendHTokensToL1 () {
    console.log('sendHTokensToL1()')
    const amount = this.bridge.parseUnits('3000')
    const isHTokenTransfer = true
    const sendData = await this.bridge.getSendData(amount, this.l2ChainSlug, this.l1ChainSlug, isHTokenTransfer)
    const recipient = await this.signer.getAddress()
    const bonderFee = sendData.totalFee
    const slippageTolerance = 0.5 // 0.5%
    const deadline = this.getDeadline()
    const { amountOutMin } = this.bridge.getSendDataAmountOutMins(sendData, slippageTolerance)

    return this.bridge.send(amount, this.l2ChainSlug, this.l1ChainSlug, {
      recipient,
      bonderFee,
      amountOutMin,
      deadline,
      destinationAmountOutMin: 0,
      destinationDeadline: 0
    })
  }

  async commitTransfersToL1 () {
    console.log('commitTransfersToL1()')
    const destinationChainId = this.l1ChainId
    const tokenContracts = contracts.get(this.tokenSymbol, this.l2ChainSlug)
    const l2BridgeContract = tokenContracts.l2Bridge
    const l2Bridge = new L2Bridge(l2BridgeContract)
    return l2Bridge.commitTransfers(destinationChainId)
  }

  async bondTransferRootOnL1 () {
    console.log('bondTransferRootOnL1()')
    const tokenContracts = contracts.get(this.tokenSymbol, this.l1ChainSlug)
    const l1BridgeContract = tokenContracts.l1Bridge
    const l1Bridge = new L1Bridge(l1BridgeContract)
    const destinationChainId = this.l1ChainId
    // TODO
    const transferRootHash = ''
    const totalAmount = BigNumber.from(0)
    return l1Bridge.bondTransferRoot(
      transferRootHash,
      destinationChainId,
      totalAmount
    )
  }

  async withdrawTransferOnL1 () {
    console.log('withdrawTransferOnL1()')
    // TODO
    const transferId = ''
    const chain = this.l2ChainSlug
    const token = this.tokenSymbol

    const transfer = await getTransferId(
      chain,
      token,
      transferId
    )

    const {
      transferRootHash,
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      destinationChainId
    } = transfer

    const transferRoot = await getTransferRoot(
      chain,
      token,
      transferRootHash
    )

    const {
      rootTotalAmount,
      numLeaves,
      proof,
      transferIndex
    } = getWithdrawalProofData(transferId, transferRoot)

    const tokenContracts = contracts.get(this.tokenSymbol, this.l1ChainSlug)
    const l1BridgeContract = tokenContracts.l1Bridge
    const l1Bridge = new L1Bridge(l1BridgeContract)

    return l1Bridge.withdraw(
      recipient,
      amount,
      transferNonce,
      bonderFee,
      amountOutMin,
      deadline,
      transferRootHash,
      rootTotalAmount,
      transferIndex,
      proof,
      numLeaves
    )
  }

  async l1CanonicalBridgeSendToL2 () {
    console.log('l1CanonicalBridgeSendToL2()')
    return this.lineal1CanonicalBridgeSendToL2()
  }

  async lineal1CanonicalBridgeSendToL2 () {
    const recipient = await this.signer.getAddress()
    const l1MessengerAddress = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
    const fee = this.bridge.parseUnits('0.01')
    const deadline = this.getDeadline()
    const calldata = '0x'

    const messenger = new Contract(l1MessengerAddress, abi, this.signer)
    return messenger.dispatchMessage(recipient, fee, deadline, calldata)
  }

  getDeadline () {
    const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    return deadline
  }
}
