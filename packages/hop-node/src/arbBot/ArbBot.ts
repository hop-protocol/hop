import '../moduleAlias'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import contracts from 'src/contracts'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import lineaAbi from './lineaAbi'
import wethAbi from './wethAbi'
import { BigNumber, Contract, Wallet, providers } from 'ethers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { getRpcProvider } from 'src/utils/getRpcProvider'
import { getTransferIdFromTxHash } from 'src/theGraph/getTransferId'
import { getWithdrawalProofData } from 'src/cli/shared'
import { parseUnits } from 'ethers/lib/utils'
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

  amount: BigNumber = parseUnits('3000', 18)
  // amount: BigNumber = parseUnits('0.01', 18)

  constructor (options?: Partial<Options>) {
    if (options?.dryMode) {
      this.dryMode = options.dryMode
    }
    console.log('dryMode:', this.dryMode)
    this.network = 'goerli'
    this.sdk = new Hop({
      network: this.network,
      chainProviders: {
        linea: new providers.StaticJsonRpcProvider('https://rpc.goerli.linea.build')
      }
    })
    this.tokenSymbol = 'ETH'
    this.l1ChainSlug = Chain.Ethereum.slug
    this.l1ChainId = 5
    this.l2ChainSlug = Chain.Linea.slug
    this.bridge = this.sdk.bridge(this.tokenSymbol)

    const privateKey = process.env.ARB_BOT_PRIVATE_KEY

    if (!privateKey) {
      throw new Error('ARB_BOT_PRIVATE_KEY is required')
    }

    this.ammSigner = new Wallet(privateKey)
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
    const shouldWithdraw = await this.checkAmmShouldWithdraw()
    if (!shouldWithdraw) {
      return
    }

    const tx1 = await this.withdrawAmmHTokens()
    console.log('withdraw amm hTokens tx:', tx1?.hash)
    await tx1?.wait()
    await wait(10 * 1000)

    const tx2 = await this.sendHTokensToL1()
    console.log('send hTokens to L1 tx:', tx2?.hash)
    await tx2?.wait()
    await wait(10 * 1000)

    const tx3 = await this.commitTransfersToL1()
    console.log('l2 commit transfers tx:', tx3?.hash)
    await tx3?.wait()
    await wait(2 * 60 * 1000) // wait for theGraph to index event

    const tx4 = await this.bondTransferRootOnL1(tx3?.hash)
    console.log('l1 bond transfer root tx:', tx4?.hash)
    await tx4?.wait()
    await wait(10 * 1000)

    const tx5 = await this.withdrawTransferOnL1(tx2?.hash)
    console.log('l1 withdraw tx:', tx5?.hash)
    await tx5?.wait()
    await wait(10 * 1000)

    const tx6 = await this.l1CanonicalBridgeSendToL2()
    console.log('l1 canonical send to l2 tx:', tx6?.hash)
    await tx6?.wait()
    await wait(20 * 60 * 1000) // wait to receive tokens on L2

    const tx7 = await this.wrapEthToWethOnL2()
    console.log('l2 wrap eth tx:', tx7?.hash)
    await tx7?.wait()

    while (true) {
      console.log('amm deposit loop poll')
      const l2WethBalance = await this.getL2WethBalance()
      if (l2WethBalance.eq(0)) {
        console.log('no weth balance')
        break
      }
      const shouldDeposit = await this.checkAmmShouldDeposit()
      if (!shouldDeposit) {
        console.log('should not deposit yet')
        await wait(60 * 1000)
        continue
      }
      const tx8 = await this.depositAmmCanonicalTokens()
      console.log('l2 amm deposit canonical tokens tx:', tx8?.hash)
      await tx8?.wait()
      console.log('amm deposit loop wait')
      await wait(60 * 1000)
      console.log('amm deposit loop end')
    }
  }

  async checkAmmShouldWithdraw () {
    console.log('checkAmmShouldWithdraw()')
    const [canonicalTokenBalanceBn, hTokenBalanceBn] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    const canonicalTokenBalance = this.bridge.formatUnits(canonicalTokenBalanceBn)
    const hTokenBalance = this.bridge.formatUnits(hTokenBalanceBn)

    console.log('canonicalTokenBalance:', canonicalTokenBalance)
    console.log('hTokenBalance:', hTokenBalance)

    if (canonicalTokenBalance > hTokenBalance) {
      return false
    }

    const amount = this.bridge.formatUnits(this.amount)
    if (amount < hTokenBalance) {
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
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const lpBalance = await this.bridge.getAccountLpBalance(this.l2ChainSlug, recipient)

    if (lpBalance.lt(amount)) {
      amount = lpBalance
    }

    console.log('amount:', this.bridge.formatUnits(amount))

    const slippageTolerance = 5
    const amountMin = this.bridge.calcAmountOutMin(amount, slippageTolerance)

    const deadline = this.getDeadline()
    const hTokenIndex = 1
    const provider = getRpcProvider(this.l2ChainSlug)

    if (this.dryMode) {
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(provider))
      .removeLiquidityOneToken(amount, hTokenIndex, this.l2ChainSlug, {
        amountMin,
        deadline
      })
  }

  async sendHTokensToL1 () {
    console.log('sendHTokensToL1()')
    let amount = this.amount

    const hTokenBalance = await this.bridge.getL2HopToken(this.l2ChainSlug)
    if (hTokenBalance.lt(amount)) {
      amount = hTokenBalance
    }

    console.log('amount:', this.bridge.formatUnits(amount))

    const recipient = await this.ammSigner.getAddress()
    const isHTokenTransfer = true
    const sendData = await this.bridge.getSendData(amount, this.l2ChainSlug, this.l1ChainSlug, isHTokenTransfer)
    const bonderFee = sendData.totalFee
    const slippageTolerance = 5
    const deadline = this.getDeadline()
    const { amountOutMin } = this.bridge.getSendDataAmountOutMins(sendData, slippageTolerance)
    const provider = getRpcProvider(this.l2ChainSlug)

    if (this.dryMode) {
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(provider))
      .send(amount, this.l2ChainSlug, this.l1ChainSlug, {
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

  async bondTransferRootOnL1 (l2CommitTransfersTxHash?: string) {
    console.log('bondTransferRootOnL1()')
    if (!l2CommitTransfersTxHash) {
      throw new Error('expected l2CommitTransfersTxHash')
    }
    const tokenContracts = contracts.get(this.tokenSymbol, this.l1ChainSlug)
    const l1BridgeContract = tokenContracts.l1Bridge
    const l1Bridge = new L1Bridge(l1BridgeContract)
    const destinationChainId = this.l1ChainId

    const rootData = await this.getTransferRootHashDataFromCommitHash(l2CommitTransfersTxHash)
    if (!rootData) {
      throw new Error('theGraph root data not found for commit tx hash')
    }

    const { transferRootHash, totalAmount } = rootData

    console.log(
      transferRootHash,
      destinationChainId,
      totalAmount
    )

    if (this.dryMode) {
      return
    }

    return l1Bridge.bondTransferRoot(
      transferRootHash,
      destinationChainId,
      totalAmount
    )
  }

  async withdrawTransferOnL1 (l2TransferTxHash: string) {
    console.log('withdrawTransferOnL1()')
    const { transferId } = await getTransferIdFromTxHash(l2TransferTxHash, this.l2ChainSlug)

    if (!transferId) {
      throw new Error('transferId not found on theGraph')
    }

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
      deadline
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

    if (this.l2ChainSlug === Chain.Linea.slug) {
      return this.lineal1CanonicalBridgeSendToL2()
    }

    throw new Error('l1CanonicalBridgeSendToL2 not implemented')
  }

  async lineal1CanonicalBridgeSendToL2 () {
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const provider = getRpcProvider(this.l1ChainSlug)
    if (!provider) {
      throw new Error('expected provider')
    }

    const ethBalance = await provider.getBalance(recipient)
    if (amount.lt(ethBalance)) {
      amount = ethBalance.sub(BigNumber.from(parseUnits('0.02', 18))) // account for message fee and gas fee
    }

    console.log('amount:', this.bridge.formatUnits(amount))

    const l1MessengerAddress = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
    const fee = this.bridge.parseUnits('0.01')
    const deadline = this.getDeadline()
    const calldata = '0x'

    const messenger = new Contract(l1MessengerAddress, lineaAbi, this.ammSigner.connect(provider))

    if (this.dryMode) {
      return
    }

    return messenger.dispatchMessage(recipient, fee, deadline, calldata, {
      value: amount
    })
  }

  async wrapEthToWethOnL2 () {
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const provider = getRpcProvider(this.l2ChainSlug)
    if (!provider) {
      throw new Error('expected provider')
    }

    const ethBalance = await provider.getBalance(recipient)
    if (amount.lt(ethBalance)) {
      amount = ethBalance.sub(BigNumber.from(parseUnits('0.01', 18))) // account for fee
    }

    console.log('amount:', this.bridge.formatUnits(amount))

    const l2WethAddress = '0x2C1b868d6596a18e32E61B901E4060C872647b6C' // linea weth
    const weth = new Contract(l2WethAddress, wethAbi, this.ammSigner.connect(provider))

    if (this.dryMode) {
      return
    }

    return weth.deposit({
      value: amount
      // gasPrice: parseUnits('2', 9)
    })
  }

  async checkAmmShouldDeposit () {
    console.log('checkAmmShouldDeposit()')
    const [canonicalTokenBalanceBn, hTokenBalanceBn] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    const canonicalTokenBalance = this.bridge.formatUnits(canonicalTokenBalanceBn)
    const hTokenBalance = this.bridge.formatUnits(hTokenBalanceBn)

    console.log('canonicalTokenBalance:', canonicalTokenBalance)
    console.log('hTokenBalance:', hTokenBalance)

    if (canonicalTokenBalance > hTokenBalance) {
      return false
    }

    const thresholdEth = 500
    const thresholdMet = (hTokenBalance - canonicalTokenBalance) <= thresholdEth
    return thresholdMet
  }

  async getL2WethBalance () {
    const provider = getRpcProvider(this.l2ChainSlug)
    const recipient = await this.ammSigner.getAddress()
    const l2WethAddress = '0x2C1b868d6596a18e32E61B901E4060C872647b6C' // linea weth
    const weth = new Contract(l2WethAddress, wethAbi, this.ammSigner.connect(provider))
    const l2WethBalance = await weth.balanceOf(recipient)

    console.log('l2WethBalance:', this.bridge.formatUnits(l2WethBalance))

    return l2WethBalance
  }

  async depositAmmCanonicalTokens () {
    console.log('depositAmmCanonicalTokens()')
    let amount = this.amount

    const l2WethBalance = await this.getL2WethBalance()
    if (l2WethBalance.lt(amount)) {
      amount = l2WethBalance
    }

    console.log('amount:', this.bridge.formatUnits(amount))

    const amount0Desired = amount
    const amount1Desired = 0

    const slippageTolerance = 5
    const minToMint = this.bridge.calcAmountOutMin(amount, slippageTolerance)
    const deadline = this.getDeadline()

    const provider = getRpcProvider(this.l2ChainSlug)

    if (this.dryMode) {
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(provider))
      .addLiquidity(amount0Desired, amount1Desired, this.l2ChainSlug, {
        minToMint,
        deadline
      })
  }

  getDeadline () {
    const deadline = Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60)
    return deadline
  }

  async getTransferRootHashDataFromCommitHash (l2CommitTxHash: string) {
    const startTimestamp = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)
    const items = await getTransfersCommitted(this.l2ChainSlug, this.tokenSymbol, startTimestamp, this.l1ChainId)

    for (const item of items) {
      if (item.transactionHash === l2CommitTxHash) {
        return {
          totalAmount: item.totalAmount,
          transferRootHash: item.rootHash
        }
      }
    }
  }
}
