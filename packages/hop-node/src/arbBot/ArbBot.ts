import '../moduleAlias'
import L1Bridge from 'src/watchers/classes/L1Bridge'
import L2Bridge from 'src/watchers/classes/L2Bridge'
import contracts from 'src/contracts'
import getTransferId from 'src/theGraph/getTransfer'
import getTransferRoot from 'src/theGraph/getTransferRoot'
import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import lineaAbi from './lineaAbi'
import wethAbi from './wethAbi'
import { BigNumber, Contract, Wallet, constants, providers } from 'ethers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { CrossChainMessenger } from '@eth-optimism/sdk'
import { Erc20Bridger, EthBridger, getL2Network } from '@arbitrum/sdk'
import { FxPortalClient } from '@fxportal/maticjs-fxportal'
import { Logger } from 'src/logger'
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { chainSlugToId } from 'src/utils/chainSlugToId'
import { defaultAbiCoder, parseEther, parseUnits } from 'ethers/lib/utils'
import { getRpcProvider } from 'src/utils/getRpcProvider'
import { getTransferIdFromTxHash } from 'src/theGraph/getTransferId'
import { getUnwithdrawnTransfers } from 'src/theGraph/getUnwithdrawnTransfers'
import { getWithdrawalProofData } from 'src/cli/shared'
import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { use } from '@maticnetwork/maticjs'
import { wait } from 'src/utils/wait'

export type Options = {
  label?: string
  privateKey?: string
  dryMode?: boolean
  network?: string
  l1ChainSlug?: string
  l2ChainSlug?: string
  tokenSymbol?: string
  amount?: number
  slippageTolerance?: number
  pollIntervalSeconds?: number
  ammDepositThresholdAmount?: number
  waitConfirmations?: number
}

export class ArbBot {
  network: string = 'goerli'
  sdk: Hop
  bridge: HopBridge
  tokenSymbol: string = 'ETH'
  l1ChainSlug: string = 'ethereum'
  l2ChainSlug: string = 'linea'
  l1ChainId: number
  l2ChainId: number
  ammSigner: any
  dryMode: boolean = false
  logger: Logger
  slippageTolerance: number = 5 // 5%
  pollIntervalMs: number = 60 * 1000
  ammDepositThresholdAmount: number = 10
  amount: BigNumber = parseUnits('100', 18)
  waitConfirmations: number = 1
  l1ChainProvider: any
  l2ChainProvider: any
  l2ChainWriteProvider: any

  constructor (options?: Partial<Options>) {
    if (process.env.ARB_BOT_NETWORK) {
      this.network = process.env.ARB_BOT_NETWORK
    }
    if (process.env.ARB_BOT_TOKEN) {
      this.tokenSymbol = process.env.ARB_BOT_TOKEN
    }
    if (process.env.ARB_BOT_L1_CHAIN) {
      this.l1ChainSlug = process.env.ARB_BOT_L1_CHAIN
    }
    if (process.env.ARB_BOT_L2_CHAIN) {
      this.l2ChainSlug = process.env.ARB_BOT_L2_CHAIN
    }
    if (process.env.ARB_BOT_POLL_INTERVAL_SECONDS) {
      this.pollIntervalMs = Number(process.env.ARB_BOT_POLL_INTERVAL_SECONDS) * 1000
    }
    if (process.env.ARB_BOT_SLIPPAGE_TOLERANCE) {
      this.slippageTolerance = Number(process.env.ARB_BOT_SLIPPAGE_TOLERANCE)
    }
    if (process.env.ARB_BOT_AMM_THRESHOLD_AMOUNT) {
      this.ammDepositThresholdAmount = Number(process.env.ARB_BOT_AMM_THRESHOLD_AMOUNT)
    }
    if (process.env.ARB_BOT_WAIT_CONFIRMATIONS) {
      this.waitConfirmations = Number(process.env.ARB_BOT_WAIT_CONFIRMATIONS)
    }

    if (options?.dryMode) {
      this.dryMode = options.dryMode
    }
    if (options?.network) {
      this.network = options.network
    }
    if (options?.tokenSymbol) {
      this.tokenSymbol = options.tokenSymbol
    }
    if (options?.l1ChainSlug) {
      this.l1ChainSlug = options.l1ChainSlug
    }
    if (options?.l2ChainSlug) {
      this.l2ChainSlug = options.l2ChainSlug
    }
    if (options?.pollIntervalSeconds) {
      this.pollIntervalMs = options.pollIntervalSeconds * 1000
    }
    if (options?.slippageTolerance) {
      this.slippageTolerance = options.slippageTolerance
    }
    if (options?.ammDepositThresholdAmount) {
      this.ammDepositThresholdAmount = options.ammDepositThresholdAmount
    }
    if (options?.waitConfirmations) {
      this.waitConfirmations = options.waitConfirmations
    }

    this.l1ChainId = this.network === 'mainnet' ? 1 : 5
    this.l2ChainId = chainSlugToId(this.l2ChainSlug)
    this.logger = new Logger(`ArbBot${options?.label ? `:${options?.label}` : ''}`)
    this.sdk = new Hop({
      network: this.network,
      chainProviders: {
        ethereum: getRpcProvider('ethereum')!,
        polygon: getRpcProvider('polygon')!,
        gnosis: getRpcProvider('gnosis')!,
        arbitrum: getRpcProvider('arbitrum')!,
        optimism: getRpcProvider('optimism')!,
        linea: getRpcProvider('linea')!
      }
    })

    this.bridge = this.sdk.bridge(this.tokenSymbol)

    if (process.env.ARB_BOT_AMOUNT) {
      this.amount = this.bridge.parseUnits(process.env.ARB_BOT_AMOUNT)
    }

    if (options?.amount) {
      this.amount = this.bridge.parseUnits(options.amount)
    }

    this.logger.log('dryMode:', this.dryMode)
    this.logger.log('network:', this.network)
    this.logger.log('tokenSymbol:', this.tokenSymbol)
    this.logger.log('l2ChainSlug:', this.l2ChainSlug)
    this.logger.log('l1ChainSlug:', this.l1ChainSlug)
    this.logger.log('l1ChainId:', this.l1ChainId)
    this.logger.log('amount:', this.bridge.formatUnits(this.amount))
    this.logger.log('pollIntervalMs:', this.pollIntervalMs)
    this.logger.log('slippageTolerance:', this.slippageTolerance)
    this.logger.log('waitConfirmations:', this.waitConfirmations)

    const privateKey = process.env.ARB_BOT_PRIVATE_KEY ?? options?.privateKey

    if (!privateKey) {
      throw new Error('ARB_BOT_PRIVATE_KEY is required')
    }

    this.l1ChainProvider = getRpcProvider(this.l1ChainSlug)
    if (!this.l1ChainProvider) {
      throw new Error('expected l1ChainProvider')
    }
    this.l2ChainProvider = getRpcProvider(this.l2ChainSlug)
    if (!this.l2ChainProvider) {
      throw new Error('expected l2ChainProvider')
    }
    this.l2ChainWriteProvider = this.l2ChainProvider
    if (this.l2ChainSlug === 'linea') {
      this.l2ChainWriteProvider = new providers.StaticJsonRpcProvider('https://rpc.goerli.linea.build')
    }

    this.ammSigner = new Wallet(privateKey)
  }

  async start () {
    while (true) {
      try {
        // test
        // const tx = await this.l1CanonicalBridgeSendToL2()
        // console.log('tx', tx.hash)

        await this.pollAmmWithdraw()
        await this.pollAmmDeposit()
        await this.pollUnwithdrawnTransfers()
      } catch (err: any) {
        this.logger.error('ArbBot error:', err)
      }
      // break
      this.logger.log('poll end')
      this.logger.log(`waiting for next poll ${this.pollIntervalMs / 1000}s`)
      await wait(this.pollIntervalMs)
    }
  }

  async pollUnwithdrawnTransfers () {
    this.logger.log('pollUnwithdrawnTransfers()')
    await wait(60 * 1000) // wait for theGraph to sync
    const account = await this.ammSigner.getAddress()
    const unwithdrawnTransfers = await getUnwithdrawnTransfers(this.network, this.l2ChainSlug, this.l1ChainSlug, this.tokenSymbol, { account })

    this.logger.info('unwithdrawnTransfers count:', unwithdrawnTransfers.length)

    for (const transfer of unwithdrawnTransfers) {
      const tx = await this.withdrawTransferOnL1(transfer.transactionHash)
      this.logger.info('l1 withdraw tx:', tx?.hash)
      await tx?.wait(this.waitConfirmations)
    }

    this.logger.log('pollUnwithdrawnTransfers() end')
  }

  async pollAmmWithdraw () {
    this.logger.log('pollAmmWithdraw()')
    const shouldWithdraw = await this.checkAmmShouldWithdraw()
    this.logger.log('shouldWithdraw:', shouldWithdraw)
    if (shouldWithdraw) {
      const tx1 = await this.withdrawAmmHTokens()
      this.logger.info('withdraw amm hTokens tx:', tx1?.hash)
      await tx1?.wait(this.waitConfirmations)
    }

    const shouldSendHTokensToL1 = await this.checkShouldSendHTokensToL1()
    if (shouldSendHTokensToL1) {
      const tx2 = await this.sendHTokensToL1()
      this.logger.info('send hTokens to L1 tx:', tx2?.hash)
      await tx2?.wait(this.waitConfirmations)

      const tx3 = await this.commitTransfersToL1()
      this.logger.info('l2 commit transfers tx:', tx3?.hash)
      await tx3?.wait(this.waitConfirmations)
      if (!this.dryMode) {
        await wait(5 * 60 * 1000) // wait for theGraph to index event
      }

      const shouldBondRoot = true
      if (shouldBondRoot && tx3?.hash) {
        const tx4 = await this.bondTransferRootOnL1(tx3?.hash)
        this.logger.info('l1 bond transfer root tx:', tx4?.hash)
        await tx4?.wait(this.waitConfirmations)
      } else {
        if (!this.dryMode) {
          await wait(24 * 60 * 60 * 1000) // wait for transferRoot to be bonded
        }
      }

      if (tx2?.hash) {
        await wait(5 * 60 * 1000) // wait for root bond to be indexed by the graph
        const tx5 = await this.withdrawTransferOnL1(tx2?.hash)
        this.logger.info('l1 withdraw tx:', tx5?.hash)
        await tx5?.wait(this.waitConfirmations)
      }
    }

    const shouldSendTokensToL2 = await this.checkShouldSendTokensToL2()
    if (shouldSendTokensToL2) {
      const tx6 = await this.l1CanonicalBridgeSendToL2()
      this.logger.info('l1 canonical send to l2 tx:', tx6?.hash)
      await tx6?.wait(this.waitConfirmations)
    }
    this.logger.log('pollAmmWithdraw() end')
  }

  async pollAmmDeposit () {
    this.logger.log('pollAmmDeposit()')
    const arrived = await this.checkCanonicalBridgeTokensArriveOnL2()
    if (arrived) {
      const tx7 = await this.wrapEthToWethOnL2()
      this.logger.info('l2 wrap eth tx:', tx7?.hash)
      await tx7?.wait(this.waitConfirmations)
    }

    this.logger.log('amm deposit loop poll')
    if (this.tokenSymbol === 'ETH') {
      const l2WethBalance = await this.getL2WethBalance()
      if (l2WethBalance.eq(0)) {
        this.logger.log('no weth balance')
        return
      }
    } else {
      const tokenBalance = await this.getTokenBalance(this.l2ChainSlug)
      if (tokenBalance.eq(0)) {
        this.logger.log('no token balance')
        return
      }
    }

    const shouldDeposit = await this.checkAmmShouldDeposit()
    if (!shouldDeposit) {
      this.logger.log('should not deposit yet')
      return
    }
    const tx8 = await this.depositAmmCanonicalTokens()
    this.logger.info('l2 amm deposit canonical tokens tx:', tx8?.hash)
    await tx8?.wait(this.waitConfirmations)

    this.logger.log('pollAmmDeposit() end')
  }

  async checkAmmShouldWithdraw () {
    this.logger.log('checkAmmShouldWithdraw()')
    const [canonicalTokenBalanceBn, hTokenBalanceBn] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    const canonicalTokenBalance = this.bridge.formatUnits(canonicalTokenBalanceBn)
    const hTokenBalance = this.bridge.formatUnits(hTokenBalanceBn)

    this.logger.log('canonicalTokenBalance:', canonicalTokenBalance)
    this.logger.log('hTokenBalance:', hTokenBalance)

    if (canonicalTokenBalance > hTokenBalance) {
      return false
    }

    const amount = this.bridge.formatUnits(this.amount)
    if (hTokenBalance < amount) {
      this.logger.log('reserve hToken balance < amount')
      return false
    }

    const recipient = await this.ammSigner.getAddress()
    const lpBalance = await this.bridge.getAccountLpBalance(this.l2ChainSlug, recipient)

    if (lpBalance.lt(this.amount)) {
      this.logger.log('user lp balance < amount')
      return false
    }

    const diff = hTokenBalance - canonicalTokenBalance

    const thresholdMet = diff >= amount
    return thresholdMet
  }

  async withdrawAmmHTokens () {
    this.logger.log('withdrawAmmHTokens()')
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const lpBalance = await this.bridge.getAccountLpBalance(this.l2ChainSlug, recipient)

    if (lpBalance.lt(amount)) {
      amount = lpBalance
    }

    this.logger.log('amount:', this.bridge.formatUnits(amount))

    const amountMin = this.bridge.calcAmountOutMin(amount, this.slippageTolerance)

    const deadline = this.getDeadline()
    const hTokenIndex = 1

    const lpToken = this.bridge.connect(this.ammSigner.connect(this.l2ChainProvider)).getSaddleLpToken(this.l2ChainSlug)
    const amm = this.bridge.getAmm(this.l2ChainSlug)
    const saddleSwap = await amm.getSaddleSwap()
    const spender = saddleSwap.address
    const allowance = await lpToken.allowance(spender)
    if (allowance.lt(lpBalance)) {
      if (this.dryMode) {
        this.logger.log('skipping amm withdraw approval tx, dryMode: true')
      } else {
        const tx = await lpToken.approve(spender, constants.MaxUint256)
        this.logger.log('amm withdraw approval tx:', tx.hash)
        await tx.wait(this.waitConfirmations)
      }
    }

    if (this.dryMode) {
      this.logger.log('skipping amm remove liquidity tx, dryMode: true')
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(this.l2ChainWriteProvider))
      .removeLiquidityOneToken(amount, hTokenIndex, this.l2ChainSlug, {
        amountMin,
        deadline
      })
  }

  async checkShouldSendHTokensToL1 () {
    this.logger.log('checkShouldSendHTokensToL1()')
    const amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const hToken = await this.bridge.getL2HopToken(this.l2ChainSlug)
    const hTokenBalance = await hToken.balanceOf(recipient)
    const shouldSend = hTokenBalance.gte(amount.sub(parseEther('10')))
    return shouldSend
  }

  async sendHTokensToL1 () {
    this.logger.log('sendHTokensToL1()')
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const hToken = await this.bridge.getL2HopToken(this.l2ChainSlug)
    const hTokenBalance = await hToken.balanceOf(recipient)
    if (hTokenBalance.lt(amount)) {
      amount = hTokenBalance
    }

    this.logger.log('amount:', this.bridge.formatUnits(amount))

    const isHTokenTransfer = true
    const needsApproval = await this.bridge.needsHTokenApproval(amount, this.l2ChainSlug, recipient)
    if (needsApproval) {
      this.logger.log('needs approval')

      if (this.dryMode) {
        this.logger.log('skipping send hTokens approval tx, dryMode: true')
      } else {
        const tx = await this.bridge
          .connect(this.ammSigner.connect(this.l2ChainWriteProvider))
          .sendApproval(amount, this.l2ChainSlug, this.l1ChainSlug, isHTokenTransfer)
        await tx.wait(this.waitConfirmations)
      }
    }

    const sendData = await this.bridge.getSendData(amount, this.l2ChainSlug, this.l1ChainSlug, isHTokenTransfer)
    const bonderFee = sendData.totalFee
    const deadline = 0
    const amountOutMin = 0
    // const { amountOutMin } = this.bridge.getSendDataAmountOutMins(sendData, this.slippageTolerance)

    if (this.dryMode) {
      this.logger.log('skipping send hTokens tx, dryMode: true')
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(this.l2ChainWriteProvider))
      .sendHToken(amount, this.l2ChainSlug, this.l1ChainSlug, {
        recipient,
        bonderFee,
        amountOutMin,
        deadline,
        destinationAmountOutMin: 0,
        destinationDeadline: 0
      })
  }

  async commitTransfersToL1 () {
    try {
      this.logger.log('commitTransfersToL1()')
      const destinationChainId = this.l1ChainId
      const tokenContracts = contracts.get(this.tokenSymbol, this.l2ChainSlug)
      const l2BridgeContract = tokenContracts.l2Bridge
      const l2Bridge = new L2Bridge(l2BridgeContract)

      if (this.dryMode) {
        this.logger.log('skipping commitTransfers tx, dryMode: true')
        return
      }

      return await l2Bridge.commitTransfers(destinationChainId)
    } catch (err: any) {
      if (err.message.includes('Must commit at least 1 Transfer') || err.message.includes('NonceTooLow')) {
        return
      }
      throw err
    }
  }

  async bondTransferRootOnL1 (l2CommitTransfersTxHash?: string) {
    this.logger.log('bondTransferRootOnL1()')
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

    this.logger.log(
      transferRootHash,
      destinationChainId,
      totalAmount
    )

    const transferRootId = l1Bridge.getTransferRootId(transferRootHash, totalAmount)
    const isBonded = await l1Bridge.isTransferRootIdBonded(transferRootId)

    if (!isBonded) {
      this.logger.error('transfer root already bonded')
      return
    }

    if (this.dryMode) {
      this.logger.log('skipping bondTransferRoot tx, dryMode: true')
      return
    }

    return l1Bridge.bondTransferRoot(
      transferRootHash,
      destinationChainId,
      totalAmount
    )
  }

  async withdrawTransferOnL1 (l2TransferTxHash: string) {
    this.logger.log('withdrawTransferOnL1()')
    if (!l2TransferTxHash) {
      throw new Error('expected l2TransferTxHash')
    }

    this.logger.log('withdrawTransferOnL1()')
    const { transferId } = await getTransferIdFromTxHash(l2TransferTxHash, this.l2ChainSlug)
    if (!transferId) {
      throw new Error('transferId not found on theGraph')
    }

    const tokenContracts = contracts.get(this.tokenSymbol, this.l1ChainSlug)
    const l1BridgeContract = tokenContracts.l1Bridge
    const l1Bridge = new L1Bridge(l1BridgeContract)
    const isBonded = await l1Bridge.isTransferIdSpent(transferId)
    if (isBonded) {
      this.logger.log('transfer id already bonded or withdrawn')
      return
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

    if (this.dryMode) {
      this.logger.log('skipping withdraw tx, dryMode: true')
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

  async checkShouldSendTokensToL2 () {
    this.logger.log('checkShouldSendTokensToL2()')
    const recipient = await this.ammSigner.getAddress()
    const amount = this.amount
    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      const shouldSend = ethBalance.gte(amount)
      return shouldSend
    } else {
      const tokenBalance = await this.getTokenBalance(this.l1ChainSlug)
      const shouldSend = tokenBalance.gte(amount)
      return shouldSend
    }
  }

  async getTokenBalance (chain: string) {
    const recipient = await this.ammSigner.getAddress()
    const token = this.bridge.getCanonicalToken(chain)
    const balance = await token.balanceOf(recipient)
    return balance
  }

  async l1CanonicalBridgeSendToL2 () {
    this.logger.log('l1CanonicalBridgeSendToL2()')

    if (this.l2ChainSlug === Chain.Linea.slug) {
      return this.lineal1CanonicalBridgeSendToL2()
    }

    if (this.l2ChainSlug === Chain.Base.slug) {
      return this.basel1CanonicalBridgeSendToL2()
    }

    if (this.l2ChainSlug === Chain.Optimism.slug) {
      return this.optimisml1CanonicalBridgeSendToL2()
    }

    if (this.l2ChainSlug === Chain.Arbitrum.slug) {
      return this.arbitruml1CanonicalBridgeSendToL2()
    }

    if (this.l2ChainSlug === Chain.Polygon.slug) {
      return this.polygonl1CanonicalBridgeSendToL2()
    }

    throw new Error('l1CanonicalBridgeSendToL2 not implemented')
  }

  async lineal1CanonicalBridgeSendToL2 () {
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()

    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      if (amount.lt(ethBalance)) {
        amount = ethBalance.sub(parseEther('1')) // account for message fee and gas fee
      }

      this.logger.log('amount:', this.bridge.formatUnits(amount))

      if (amount.lte(0)) {
        throw new Error('expected amount to be greater than 0')
      }

      const l1MessengerAddress = '0xe87d317eb8dcc9afe24d9f63d6c760e52bc18a40'
      const fee = this.bridge.parseUnits('0.01')
      const deadline = this.getDeadline()
      const calldata = '0x'

      const messenger = new Contract(l1MessengerAddress, lineaAbi, this.ammSigner.connect(this.l1ChainProvider))
      const txOptions = await this.txOverrides(this.l1ChainSlug)

      if (this.dryMode) {
        this.logger.log('skipping canonical send tx, dryMode: true')
        return
      }

      return messenger.dispatchMessage(recipient, fee, deadline, calldata, {
        ...txOptions,
        value: this.tokenSymbol === 'ETH' ? amount : 0
      })
    } else if (this.tokenSymbol === 'USDC') {
      const tokenBalance = await this.getTokenBalance(this.l1ChainSlug)
      if (amount.lt(tokenBalance)) {
        amount = tokenBalance
      }

      const deadlineSeconds = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60)
      const method = '0xf0634c82000000000000000000000000'
      const address = recipient.replace('0x', '').toLowerCase()
      const fee = BigNumber.from('0x2aa1efb94dffff')
      const feeHex = defaultAbiCoder.encode(['uint256'], [fee]).replace('0x', '')
      const deadline = defaultAbiCoder.encode(['uint256'], [deadlineSeconds]).replace('0x', '')
      const amountHex = defaultAbiCoder.encode(['uint256'], [amount]).replace('0x', '')
      const data = `${method}${address}${feeHex}${deadline}${amountHex}`

      this.logger.log('amount:', this.bridge.formatUnits(amount))

      if (amount.lte(0)) {
        throw new Error('expected amount to be greater than 0')
      }

      const tokenWrapper = '0x73feE82ba7f6B98D27BCDc2bEFc1d3f6597fb02D'
      const txOptions = await this.txOverrides(this.l1ChainSlug)

      const spender = tokenWrapper
      const token = this.bridge.connect(this.ammSigner.connect(this.l1ChainProvider)).getCanonicalToken(this.l1ChainSlug)

      const allowance = await token.allowance(spender)
      if (allowance.lt(amount)) {
        if (this.dryMode) {
          this.logger.log('lineal1CanonicalBridgeSendToL2 approval tx, dryMode: true')
        } else {
          const tx = await token.approve(spender)
          this.logger.log('lineal1CanonicalBridgeSendToL2 approval tx:', tx.hash)
          await tx.wait(this.waitConfirmations)
        }
      }

      if (this.dryMode) {
        this.logger.log('skipping canonical send tx, dryMode: true')
        return
      }

      return this.ammSigner.connect(this.l1ChainProvider).sendTransaction({
        ...txOptions,
        gasLimit: 900000,
        value: parseEther('0.012'),
        to: tokenWrapper,
        data
      })
    } else {
      throw new Error('lineal1CanonicalBridgeSendToL2 token not supported')
    }
  }

  async basel1CanonicalBridgeSendToL2 () {
    let amount = this.amount
    const recipient = await this.ammSigner.getAddress()

    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      if (amount.lt(ethBalance)) {
        amount = ethBalance.sub(parseEther('1')) // account for message fee and gas fee
      }
    } else {
      amount = await this.getTokenBalance(this.l1ChainSlug)
    }

    this.logger.log('amount:', this.bridge.formatUnits(amount))

    if (amount.lte(0)) {
      throw new Error('expected amount to be greater than 0')
    }

    const l1NativeBridgeAddress = '0xe93c8cd0d409341205a592f8c4ac1a5fe5585cfa'

    return this.ammSigner.connect(this.l1ChainProvider).sendTransaction({
      to: l1NativeBridgeAddress,
      value: this.tokenSymbol === 'ETH' ? amount : 0
    })
  }

  async optimisml1CanonicalBridgeSendToL2 () {
    const csm = new CrossChainMessenger({
      bedrock: true,
      l1ChainId: 5,
      l2ChainId: 420,
      l1SignerOrProvider: this.ammSigner.connect(this.l1ChainProvider),
      l2SignerOrProvider: this.l2ChainProvider
    })

    let amount = this.amount
    const recipient = await this.ammSigner.getAddress()

    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      if (amount.lt(ethBalance)) {
        amount = ethBalance.sub(parseEther('1')) // account for message fee and gas fee
      }

      if (amount.lte(BigNumber.from(0))) {
        this.logger.log('not enough eth to send')
        return
      }

      const tx = await csm.depositETH(amount)
      return tx
    } else {
      amount = await this.getTokenBalance(this.l1ChainSlug)

      if (amount.lte(BigNumber.from(0))) {
        this.logger.log('not enough tokens to send')
        return
      }

      const spender = '0x636Af16bf2f682dD3109e60102b8E1A089FedAa8' // optimism bridge
      const token = this.bridge.connect(this.ammSigner.connect(this.l1ChainProvider)).getCanonicalToken(this.l1ChainSlug)
      const allowance = await token.allowance(spender)
      if (allowance.lt(amount)) {
        if (this.dryMode) {
          this.logger.log('optimisml1CanonicalBridgeSendToL2 approval tx, dryMode: true')
        } else {
          const tx = await token.approve(spender)
          this.logger.log('optimisml1CanonicalBridgeSendToL2 approval tx:', tx.hash)
          await tx.wait(this.waitConfirmations)
        }
      }

      const addresses = this.network === 'mainnet' ? (mainnetAddresses as any) : (goerliAddresses as any)
      const l1TokenAddress = addresses?.bridges?.[this.tokenSymbol]?.[this.l1ChainSlug]?.l1CanonicalToken
      const l2TokenAddress = addresses?.bridges?.[this.tokenSymbol]?.[this.l2ChainSlug]?.l2CanonicalToken
      const tx = await csm.depositERC20(l1TokenAddress, l2TokenAddress, amount)
      return tx
    }
  }

  async arbitruml1CanonicalBridgeSendToL2 () {
    let amount = this.amount
    const recipient = await this.ammSigner.getAddress()
    const l2Network = await getL2Network(this.l2ChainProvider)

    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      if (amount.lt(ethBalance)) {
        amount = ethBalance.sub(parseEther('1')) // account for message fee and gas fee
      }

      if (amount.lte(BigNumber.from(0))) {
        this.logger.log('not enough eth to send')
        return
      }

      const ethBridger = new EthBridger(l2Network)
      const tx = await ethBridger.deposit({
        amount,
        l1Signer: this.ammSigner.connect(this.l1ChainProvider),
        l2Provider: this.l2ChainProvider
      })

      return tx
    } else {
      amount = await this.getTokenBalance(this.l1ChainSlug)

      if (amount.lte(BigNumber.from(0))) {
        this.logger.log('not enough tokens to send')
        return
      }

      const spender = '0x715d99480b77a8d9d603638e593a539e21345fdf'
      const token = this.bridge.connect(this.ammSigner.connect(this.l1ChainProvider)).getCanonicalToken(this.l1ChainSlug)
      const allowance = await token.allowance(spender)
      if (allowance.lt(amount)) {
        if (this.dryMode) {
          this.logger.log('arbitruml1CanonicalBridgeSendToL2 approval tx, dryMode: true')
        } else {
          const tx = await token.approve(spender)
          this.logger.log('arbitruml1CanonicalBridgeSendToL2 approval tx:', tx.hash)
          await tx.wait(this.waitConfirmations)
        }
      }

      const addresses = this.network === 'mainnet' ? (mainnetAddresses as any) : (goerliAddresses as any)
      const l1TokenAddress = addresses?.bridges?.[this.tokenSymbol]?.[this.l1ChainSlug]?.l1CanonicalToken
      const erc20Bridger = new Erc20Bridger(l2Network)
      const tx = await erc20Bridger.deposit({
        erc20L1Address: l1TokenAddress,
        amount,
        l1Signer: this.ammSigner.connect(this.l1ChainProvider),
        l2Provider: this.l2ChainProvider
      })

      return tx
    }
  }

  async polygonl1CanonicalBridgeSendToL2 () {
    let amount = this.amount
    const recipient = await this.ammSigner.getAddress()

    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l1ChainProvider.getBalance(recipient)
      if (amount.lt(ethBalance)) {
        // amount = ethBalance.sub(parseEther('1')) // account for message fee and gas fee
      }

      if (amount.lte(BigNumber.from(0))) {
        // this.logger.log('not enough eth to send')
        // return
      }

      const data = `0x4faa8a26000000000000000000000000${recipient.replace('0x', '').toLowerCase()}`
      const txOptions = await this.txOverrides(this.l2ChainSlug)

      return this.ammSigner.connect(this.l1ChainProvider).sendTransaction({
        ...txOptions,
        value: amount,
        to: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74',
        data
      })
    } else {
      amount = await this.getTokenBalance(this.l1ChainSlug)

      if (amount.lte(BigNumber.from(0))) {
        this.logger.log('not enough tokens to send')
        return
      }

      const spender = '0xdd6596f2029e6233deffaca316e6a95217d4dc34'
      const token = this.bridge.connect(this.ammSigner.connect(this.l1ChainProvider)).getCanonicalToken(this.l1ChainSlug)
      const allowance = await token.allowance(spender)
      if (allowance.lt(amount)) {
        if (this.dryMode) {
          this.logger.log('polygonl1CanonicalBridgeSendToL2 approval tx, dryMode: true')
        } else {
          const tx = await token.approve(spender)
          this.logger.log('polygonl1CanonicalBridgeSendToL2 approval tx:', tx.hash)
          await tx.wait(this.waitConfirmations)
        }
      }

      const addresses = this.network === 'mainnet' ? (mainnetAddresses as any) : (goerliAddresses as any)
      const l1TokenAddress = addresses?.bridges?.[this.tokenSymbol]?.[this.l1ChainSlug]?.l1CanonicalToken

      use(Web3ClientPlugin)

      const maticClient = new FxPortalClient()
      const rootTunnel = addresses?.bridges?.[this.tokenSymbol]?.[this.l2ChainSlug]?.l1FxBaseRootTunnel
      await maticClient.init({
        network: this.network === 'mainnet' ? 'mainnet' : 'testnet',
        version: this.network === 'mainnet' ? 'v1' : 'mumbai',
        parent: {
          provider: this.ammSigner.connect(this.l1ChainProvider),
          defaultConfig: {
            from: recipient
          }
        },
        child: {
          provider: this.l2ChainProvider,
          defaultConfig: {
            from: recipient
          }
        },
        erc20: {
          rootTunnel
        }
      })

      const tx = await maticClient.erc20(l1TokenAddress, true).deposit(this.bridge.formatUnits(amount), recipient)

      return {
        hash: await tx.getTransactionHash(),
        wait: async () => tx.getReceipt()
      }
    }
  }

  async wrapEthToWethOnL2 () {
    this.logger.log('wrapEthToWethOnL2()')
    let amount = this.amount

    const recipient = await this.ammSigner.getAddress()
    const ethBalance = await this.l2ChainProvider.getBalance(recipient)
    if (amount.lte(ethBalance)) {
      amount = ethBalance.sub(BigNumber.from(parseEther('1')))
    }

    this.logger.log('amount:', this.bridge.formatUnits(amount))

    if (amount.lte(0)) {
      this.logger.log('no eth to convert to weth')
      return
    }

    const weth = await this.getL2WethContract()
    const txOptions = await this.txOverrides(this.l2ChainSlug)

    if (this.dryMode) {
      this.logger.log('skipping weth deposit tx, dryMode: true')
      return
    }

    return weth.connect(this.ammSigner.connect(this.l2ChainWriteProvider)).deposit({
      ...txOptions,
      value: amount
    })
  }

  async checkAmmShouldDeposit () {
    this.logger.log('checkAmmShouldDeposit()')
    const [canonicalTokenBalanceBn, hTokenBalanceBn] = await this.bridge.getSaddleSwapReserves(this.l2ChainSlug)

    const canonicalTokenBalance = this.bridge.formatUnits(canonicalTokenBalanceBn)
    const hTokenBalance = this.bridge.formatUnits(hTokenBalanceBn)

    this.logger.log('canonicalTokenBalance:', canonicalTokenBalance)
    this.logger.log('hTokenBalance:', hTokenBalance)

    if (canonicalTokenBalance > hTokenBalance) {
      return false
    }

    const thresholdMet = (canonicalTokenBalance - hTokenBalance) <= this.ammDepositThresholdAmount
    return thresholdMet
  }

  async getL2WethContract () {
    const addresses = this.network === 'mainnet' ? (mainnetAddresses as any) : (goerliAddresses as any)
    const l2WethAddress = addresses?.bridges?.[this.tokenSymbol]?.[this.l2ChainSlug]?.l2CanonicalToken
    const weth = new Contract(l2WethAddress, wethAbi, this.ammSigner.connect(this.l2ChainProvider))
    return weth
  }

  async getL2WethBalance () {
    const weth = await this.getL2WethContract()
    const recipient = await this.ammSigner.getAddress()
    const l2WethBalance = await weth.balanceOf(recipient)

    this.logger.log('l2WethBalance:', this.bridge.formatUnits(l2WethBalance))

    return l2WethBalance
  }

  async depositAmmCanonicalTokens () {
    this.logger.log('depositAmmCanonicalTokens()')
    let amount = this.bridge.parseUnits(this.ammDepositThresholdAmount)
    const recipient = await this.ammSigner.getAddress()

    if (this.tokenSymbol === 'ETH') {
      const l2WethBalance = await this.getL2WethBalance()
      if (l2WethBalance.lt(amount)) {
        amount = l2WethBalance
      }
    } else {
      const tokenBalance = await this.getTokenBalance(this.l2ChainSlug)
      if (amount.lt(tokenBalance)) {
        amount = tokenBalance
      }
    }

    this.logger.log('amount:', this.bridge.formatUnits(amount))

    const amount0Desired = amount
    const amount1Desired = 0

    const minToMint = this.bridge.calcAmountOutMin(amount, this.slippageTolerance)
    const deadline = this.getDeadline()

    const amm = this.bridge.getAmm(this.l2ChainSlug)
    const saddleSwap = await amm.getSaddleSwap()
    const spender = saddleSwap.address
    let token = this.bridge.connect(this.ammSigner.connect(this.l2ChainProvider)).getCanonicalToken(this.l2ChainSlug)
    if (token.isNativeToken) {
      token = token.getWrappedToken()
    }

    const allowance = await token.allowance(spender)
    if (allowance.lt(amount0Desired)) {
      if (this.dryMode) {
        this.logger.log('skipping amm deposit approval tx, dryMode: true')
      } else {
        const tx = await token.approve(spender)
        this.logger.log('amm deposit approval tx:', tx.hash)
        await tx.wait(this.waitConfirmations)
      }
    }

    if (this.dryMode) {
      this.logger.log('skipping amm add liquidity tx, dryMode: true')
      return
    }

    return this.bridge
      .connect(this.ammSigner.connect(this.l2ChainWriteProvider))
      .addLiquidity(amount0Desired, amount1Desired, this.l2ChainSlug, {
        minToMint,
        deadline
      })
  }

  async txOverrides (chain: string) {
    const txOptions: any = {}

    if (chain === this.l2ChainSlug) {
      const multiplier = 2
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.l2ChainProvider,
        multiplier
      )
    }

    if (chain === this.l1ChainSlug) {
      const multiplier = 1.5
      txOptions.gasPrice = await this.getBumpedGasPrice(
        this.l1ChainProvider,
        multiplier
      )
    }

    return txOptions
  }

  async checkCanonicalBridgeTokensArriveOnL2 () {
    const recipient = await this.ammSigner.getAddress()
    if (this.tokenSymbol === 'ETH') {
      const ethBalance = await this.l2ChainProvider.getBalance(recipient)
      const arrived = ethBalance.gte(this.amount.sub(parseEther('1')))
      this.logger.log('eth balance:', this.bridge.formatUnits(ethBalance))
      return arrived
    } else {
      const tokenBalance = await this.getTokenBalance(this.l2ChainSlug)
      const arrived = tokenBalance.gte(this.amount)
      this.logger.log('token balance:', this.bridge.formatUnits(tokenBalance))
      return arrived
    }
  }

  async getBumpedGasPrice (provider: providers.Provider, percent: number): Promise<BigNumber> {
    const gasPrice = await provider.getGasPrice()
    return gasPrice.mul(BigNumber.from(percent * 100)).div(BigNumber.from(100))
  }

  getDeadline () {
    const deadline = Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60)
    return deadline
  }

  async getTransferRootHashDataFromCommitHash (l2CommitTxHash: string) {
    const startTimestamp = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)
    const items = await getTransfersCommitted(this.l2ChainSlug, this.tokenSymbol, this.l1ChainId, startTimestamp)

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
