import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import contracts from 'src/contracts'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import { constructWallet } from 'src/wallets'
import { BigNumber, Contract } from 'ethers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { abi } from './lineaAbi'
import { getWithdrawalProofData } from 'src/cli/shared'
import { wait } from 'src/utils/wait'

export type Options = {
  dryMode: boolean
}

export class ArbBot {
  network: string
  sdk: Hop
  bridge: HopBridge
  tokenSymbol: string
  l2ChainSlug: string
  l1ChainSlug: string
  l1ChainId: number
  ammSigner: any
  dryMode: boolean = false

  constructor (options?: Partial<Options>) {
    if (options?.dryMode) {
      this.dryMode = options.dryMode
    }
    this.network = 'goerli'
    this.sdk = new Hop(this.network)
    this.tokenSymbol = 'ETH'
    this.l1ChainSlug = Chain.Ethereum.slug
    this.l1ChainId = 5
    this.l2ChainSlug = Chain.Linea.slug
    this.bridge = this.sdk.bridge(this.tokenSymbol)

    const privateKey = process.env.ARB_BOT_PRIVATE_KEY

    if (!privateKey) {
      throw new Error('ARB_BOT_PRIVATE_KEY is required')
    }

    this.ammSigner = constructWallet(this.network, privateKey)
  }

  async start () {
    while (true) {
      try {
        console.log('poll')
        await this.poll()
      } catch (err: any) {
        console.error('ArbBot error:', err)
      }
      console.log('poll end')
      await wait(60 * 1000)
    }
  }

  async poll () {
    const poolThresholdMet = await this.checkPools()
    if (!poolThresholdMet) {
      return
    }
    const tx = await this.withdrawAmmHTokens()
    await tx?.wait()
    await wait(10 * 1000)
    const tx2 = await this.sendHTokensToL1()
    await tx2?.wait()
    await wait(10 * 1000)
    const tx3 = await this.commitTransfersToL1()
    await tx3?.wait()
    await wait(10 * 1000)
    const tx4 = await this.bondTransferRootOnL1(tx3.hash)
    await tx4?.wait()
    await wait(10 * 1000)
    const tx5 = await this.withdrawTransferOnL1()
    await tx5?.wait()
    await wait(10 * 1000)
    const tx6 = await this.l1CanonicalBridgeSendToL2()
    await tx6?.wait()
  }

  async checkPools () {
    console.log('checkPools()')
    const [canonicalTokenBalanceBn, hTokenBalanceBn] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    const canonicalTokenBalance = this.bridge.formatUnits(canonicalTokenBalanceBn)
    const hTokenBalance = this.bridge.formatUnits(hTokenBalanceBn)

    console.log('canonicalTokenBalance:', canonicalTokenBalance)
    console.log('hTokenBalance:', hTokenBalance)

    if (canonicalTokenBalance > hTokenBalance) {
      return false
    }

    const ratio = canonicalTokenBalance / hTokenBalance
    const threshold = 0.3

    // if canonicalTokenBalance is 30% or less than hTokenBalance
    const thresholdMet = ratio < threshold
    return thresholdMet
  }

  async withdrawAmmHTokens () {
    console.log('withdrawAmmHTokens()')
    const amount = this.bridge.parseUnits('3000')

    // TODO
    const amountMin = BigNumber.from(0)

    const deadline = this.getDeadline()
    const hTokenIndex = 1

    if (this.dryMode) {
      return
    }

    return this.bridge
      .connect(this.ammSigner)
      .removeLiquidityOneToken(amount, hTokenIndex, this.l2ChainSlug, {
        amountMin,
        deadline
      })
  }

  async sendHTokensToL1 () {
    console.log('sendHTokensToL1()')
    const amount = this.bridge.parseUnits('3000')
    const isHTokenTransfer = true
    const sendData = await this.bridge.getSendData(amount, this.l2ChainSlug, this.l1ChainSlug, isHTokenTransfer)
    const recipient = await this.ammSigner.getAddress()
    const bonderFee = sendData.totalFee
    const slippageTolerance = 0.5 // 0.5%
    const deadline = this.getDeadline()
    const { amountOutMin } = this.bridge.getSendDataAmountOutMins(sendData, slippageTolerance)

    if (this.dryMode) {
      return
    }

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

    if (this.dryMode) {
      return
    }

    return l2Bridge.commitTransfers(destinationChainId)
  }

  async bondTransferRootOnL1 (l2CommitTransfersTxHash: string) {
    console.log('bondTransferRootOnL1()')
    const tokenContracts = contracts.get(this.tokenSymbol, this.l1ChainSlug)
    const l1BridgeContract = tokenContracts.l1Bridge
    const l1Bridge = new L1Bridge(l1BridgeContract)
    const destinationChainId = this.l1ChainId
    // TODO: fetch data from thegraph
    const transferRootHash = ''
    const totalAmount = BigNumber.from(0)

    if (this.dryMode) {
      return
    }

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

    if (this.dryMode) {
      return
    }

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

    if (this.dryMode) {
      return
    }

    return this.lineal1CanonicalBridgeSendToL2()
  }

  async lineal1CanonicalBridgeSendToL2 () {
    const recipient = await this.ammSigner.getAddress()
    const l1MessengerAddress = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
    const fee = this.bridge.parseUnits('0.01')
    const deadline = this.getDeadline()
    const calldata = '0x'

    const messenger = new Contract(l1MessengerAddress, abi, this.ammSigner)
    return messenger.dispatchMessage(recipient, fee, deadline, calldata)
  }

  getDeadline () {
    const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    return deadline
  }
}
