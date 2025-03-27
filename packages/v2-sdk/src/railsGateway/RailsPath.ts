import { Base, TxOverrides, SignersOrProviders } from '#common/index.js'
import { Addresses } from '#addresses/types.js'
import { BigNumber, BigNumberish, Contract, Signer, providers, utils } from 'ethers'
import { getNetwork, NetworkSlug } from '@hop-protocol/sdk'
import { ERC20__factory } from '#contracts/factories/ERC20__factory.js'
import { RailsPath__factory } from '#contracts/factories/RailsPath__factory.js'
import { EthersEventWithDecodedTypes, EthersEventWithDecodedTypesAndBaseContext } from '#events/index.js'
import { TransferSent, TransferSentEventFetcher, TransferSentIndexes } from '#railsGateway/events/TransferSent.js'
import { TransferBonded, TransferBondedEventFetcher, TransferBondedIndexes } from '#railsGateway/events/TransferBonded.js'
import { ClaimPushed, ClaimPushedEventFetcher, ClaimPushedIndexes } from '#railsGateway/events/ClaimPushed.js'
import { ClaimReadded, ClaimReaddedEventFetcher, ClaimReaddedIndexes } from '#railsGateway/events/ClaimReadded.js'
import { ClaimRemoved, ClaimRemovedEventFetcher, ClaimRemovedIndexes } from '#railsGateway/events/ClaimRemoved.js'
import { ClaimWithdrawn, ClaimWithdrawnEventFetcher, ClaimWithdrawnIndexes } from '#railsGateway/events/ClaimWithdrawn.js'
import { HopStructInput } from '#railsGateway/index.js'
import { ConfigError, InputError, InsufficientBalanceError, InsufficientApprovalError } from '#error/index.js'

const { getAddress: checksumAddress } = utils

export type EventFetcher = TransferSentEventFetcher | TransferBondedEventFetcher | ClaimPushedEventFetcher | ClaimReaddedEventFetcher | ClaimRemovedEventFetcher | ClaimWithdrawnEventFetcher

export type GetEventFilterInput = TransferSentIndexes | TransferBondedIndexes | ClaimPushedIndexes | ClaimReaddedIndexes | ClaimRemovedIndexes | ClaimWithdrawnIndexes

export type GetEventsInBatchesInput = {
  eventName: EventName
  fromBlock: number
  toBlock: number
  fetchTxData?: boolean
}

export enum EventName {
  TransferSent = 'TransferSent',
  TransferBonded = 'TransferBonded',
  ClaimPushed = 'ClaimPushed',
  ClaimReadded = 'ClaimReadded',
  ClaimRemoved = 'ClaimRemoved',
  ClaimWithdrawn = 'ClaimWithdrawn',
}

export type GetEventFromTransactionHashInput = {
  eventName: EventName
  transactionHash: string
}

export type GetEventFromTransactionReceiptInput = {
  eventName: EventName
  receipt: providers.TransactionReceipt
}

export type GetEventFromTransferIdInput = {
  fromBlock?: number
  eventName: EventName
  transferId: string
}

export type BondInput = {
  claimId: string
  bonderFee: BigNumberish
  nextHops: HopStructInput[]
}

export type ClaimChainInput = {
  index: BigNumberish
}

export type ConfirmClaimInput = {
  claimId: string
}

export type GetAmountOutInput = {
  amount: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
}

export type Bucket = {
  completedAt: BigNumber
  finalClaimId: string
  totalAttested: BigNumber
  maxConfirmed: BigNumber
}

export type GetBucketInput = {
  index: BigNumberish
}

export type GetBucketIndexInput = {
  claimId: string
}

export type GetClaimInput = {
  claimId: string
}

export type GetTransferInput = {
  transferId: string
}

export type Claim = {
  createdAt: BigNumber
  index: BigNumber
  to: string
  amountOut: BigNumber
  maxBonderFee: BigNumber
  totalClaims: BigNumber
  nextHopsHash: string
  totalAttested: BigNumber
  totalAddedToBucketMaxConfirmed: BigNumber
  bondedOrWithdrawnBy: string
}

export type GetNextHopsHashInput = {
  nextHops: HopStructInput[]
}

export type GetNextHopsHashFromHopsInput = {
  hops: HopStructInput[]
}

export type Path = {
  chainId: string
  token: string
  counterpartToken: string
  counterpartChainId: string
  initialReserve: BigNumber
}

export type GetSourcePoolInput = {
  attestedClaimId: string
}

export type GetTotalClaimsAtClaimIdInput = {
  claimId: string
}

export type Transfer = {
  index: BigNumber
  totalSent: BigNumber
}

export type GetWithdrawableBalanceInput = {
  bonder: string
  claimId: string
}

export type IsValidClaimInput = {
  claimId: string
}

export type IsValidTransferInput = {
  claimId: string
}

export type PushClaimInput = {
  claimId: string
  to: string
  amount: BigNumberish
  maxBonderFee: BigNumberish
  attestedClaimId: string
  sourcePool: BigNumberish
  nextHopsHash: string
}

export type ReaddClaimInput = {
  transferDataHash: string
  claimId: string
}

export type RemoveClaimInput = {
  claimId: string
}

export type GetRemovedBalanceInput = {
  bonder: string
}

export type SendInput = {
  to: string
  amount: BigNumberish
  hops: HopStructInput[]
  fee: BigNumberish
}

export type ApproveSendInput = {
  amount: BigNumberish
}

export type LastBondedClaimIdForBonderInput = {
  bonder: string
}

export type GetTotalWithdrawableAtClaimIdInput = {
  bonder: string
  claimId: string
}

export type TransferChainInput = {
  index: BigNumberish
}

export type WithdrawBondsInput = {
  claimId: string
}

export type WithdrawClaimInput = {
  claimId: string
  nextHops: HopStructInput[]
}

export type WithdrawnInput = {
  bonder: string
}

export type RailsPathConstructorInput = {
  network?: string
  address?: string
  gasPriceMultiplier?: number
  signersOrProviders?: SignersOrProviders
  contractAddresses?: Addresses
  chainId: BigNumberish
  signerOrProvider?: Signer | providers.Provider
}

export class RailsPath extends Base {
  static EventName = EventName
  chainId: BigNumberish
  address: string

  constructor ({ contractAddresses, chainId, signerOrProvider, signersOrProviders, network, address }: RailsPathConstructorInput) {
    super({
      contractAddresses,
      signersOrProviders: {
        [chainId?.toString()]: signerOrProvider! || signersOrProviders![chainId?.toString()]
      },
      network: network ?? RailsPath.deriveNetwork(chainId)
    })
    if (address) {
      this.address = address
    }
    this.chainId = chainId
  }

  getRailsPathContractAddress (): string {
    return this.address
  }

  async getRailsPathContract (): Promise<Contract> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const address = this.getRailsPathContractAddress()
    const provider = await this.getSignerOrProvider(chainId)
    return RailsPath__factory.connect(address, provider)
  }

  get populateTransaction() {
    return {
      bond: async ({ claimId, bonderFee, nextHops = []}: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid transferId "${claimId}"`)
        }

        if (!this.utils.isValidNumericValue(bonderFee)) {
          throw new InputError(`Invalid bonderFee "${bonderFee}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.bond(claimId, bonderFee, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      confirmClaim: async ({ claimId }: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.confirmClaim(claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      pushClaim: async ({ claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, nextHopsHash }: PushClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid to "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!this.utils.isValidNumericValue(maxBonderFee)) {
          throw new InputError(`Invalid maxBonderFee "${maxBonderFee}"`)
        }

        if (!this.utils.isValidBytes32(attestedClaimId)) {
          throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
        }

        if (!this.utils.isValidNumericValue(sourcePool)) {
          throw new InputError(`Invalid sourcePool "${sourcePool}"`)
        }

        if (!this.utils.isValidBytes32(nextHopsHash)) {
          throw new InputError(`Invalid nextHopsHash "${nextHopsHash}"`)
        }

        const updateFee = BigNumber.from(0) // TODO
        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.pushClaim(claimId, to, amount, maxBonderFee, attestedClaimId, sourcePool, nextHopsHash)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      readdClaim: async ({ transferDataHash, claimId }: ReaddClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(transferDataHash)) {
          throw new InputError(`Invalid transferDataHash "${transferDataHash}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.readdClaim(transferDataHash, claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      removeClaim: async ({ claimId }: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const updateFee = BigNumber.from(0) // TODO
        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.removeClaim(claimId)

        return {
          ...txData,
          value: updateFee,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      send: async ({ to, amount, hops = [], fee }: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidAddress(to)) {
          throw new InputError(`Invalid "to" address "${to}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        if (!hops || !Array.isArray(hops)) {
          throw new InputError('Invalid hops. Expected array of hops')
        }

        if (!this.utils.isValidNumericValue(fee)) {
          throw new InputError(`Invalid amount "${fee}"`)
        }

        for (const hop of hops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsPathContract()

        const txData = await contract.populateTransaction.send(to, amount, hops, {
          value: fee
        })

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      approveSend: async ({ amount }: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidNumericValue(amount)) {
          throw new InputError(`Invalid amount "${amount}"`)
        }

        const path = await this.getPathInfo()
        const tokenAddress = path.token
        const provider = this.getProvider(chainId)
        if (!provider) {
          throw new ConfigError(`Provider not found for chainId: ${chainId}`)
        }
        console.log('hopV2Sdk: rails approval token', tokenAddress)
        const tokenContract = ERC20__factory.connect(tokenAddress, provider)
        const address = this.getRailsPathContractAddress()
        const txData = await tokenContract.populateTransaction.approve(address, amount)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId)
        }
      },

      withdrawBonds: async ({ claimId }: WithdrawBondsInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.withdrawBonds(claimId)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },

      withdrawClaim: async ({ claimId, nextHops }: WithdrawClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionRequest> => {
        const chainId = this.chainId

        if (!chainId || !this.utils.isValidChainId(chainId)) {
          throw new InputError(`Invalid chainId "${chainId}"`)
        }

        if (!this.utils.isValidBytes32(claimId)) {
          throw new InputError(`Invalid claimId "${claimId}"`)
        }

        if (!nextHops || !Array.isArray(nextHops)) {
          throw new InputError('Invalid nextHops')
        }

        for (const hop of nextHops) {
          if (!this.utils.isValidBytes32(hop.pathId)) {
            throw new InputError(`Invalid pathId "${hop.pathId}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxTotalSent)) {
            throw new InputError(`Invalid maxTotalSent "${hop.maxTotalSent}"`)
          }

          if (!this.utils.isValidNumericValue(hop.maxBonderFee)) {
            throw new InputError(`Invalid maxBonderFee "${hop.maxBonderFee}"`)
          }

          if (hop.attestedClaimId) {
            if (!this.utils.isValidBytes32(hop.attestedClaimId)) {
              throw new InputError(`Invalid attestedClaimId "${hop.attestedClaimId}"`)
            }
          } else {
            hop.attestedClaimId = '0x' + '0'.repeat(64)
          }
        }

        const contract = await this.getRailsPathContract()
        const txData = await contract.populateTransaction.withdrawClaim(claimId, nextHops)

        return {
          ...txData,
          ...txOverrides,
          chainId: Number(chainId),
        }
      },
    }
  }

  get helpers() {
    return {
      approveSend: async (input: ApproveSendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> => {
        const txData = await this.populateTransaction.approveSend(input, txOverrides)
        return this.sendTransaction(txData)
      },
    }
  }

  async bond (input: BondInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.bond(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async confirmClaim (input: ConfirmClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.confirmClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async claimChain ({ index }: ClaimChainInput): Promise<string> {
    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.claimChain(index)
  }

  async counterpartChainId(): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.counterpartChainId()
  }

  async counterpartToken (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.counterpartToken()
  }

  async gateway (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.gateway()
  }

  async getAmountOut ({ amount, attestedClaimId, sourcePool }: GetAmountOutInput): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.getAmountOut(amount, attestedClaimId, sourcePool)
  }

  async getBucket ({ index }: GetBucketInput): Promise<Bucket> {
    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsPathContract()
    const bucket = await contract.getBucket(index)

    return {
      completedAt: bucket.completedAt,
      finalClaimId: bucket.finalClaimId,
      totalAttested: bucket.totalAttested,
      maxConfirmed: bucket.maxConfirmed
    }
  }

  async getBucketIndex ({ claimId }: GetBucketIndexInput): Promise<number> {
    const contract = await this.getRailsPathContract()
    const index = await contract.getBucketIndex(claimId)
    return Number(index)
  }

  async getClaim ({ claimId }: GetClaimInput): Promise<Claim> {
    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimid "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()

    try {
      const claim = await contract.getClaim(claimId)

      return {
        createdAt: claim[0],
        index: claim[1],
        to: claim[2],
        amountOut: claim[3],
        maxBonderFee: claim[4],
        totalClaims: claim[5],
        nextHopsHash: claim[6],
        totalAttested: claim[7],
        totalAddedToBucketMaxConfirmed: claim[8],
        bondedOrWithdrawnBy: claim[9]
      }
    } catch (err: unknown) {
      return this.throwError(err) as Claim
    }
  }

  async getHeadClaimId (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.getHeadClaimId()
  }

  async getHeadTransferId (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.getHeadTransferId()
  }

  async getInitialId(): Promise<string> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.getInitialId(chainId)
  }

  async getNextHopsHash ({ nextHops }: GetNextHopsHashInput): Promise<string> {
    if (!nextHops || !Array.isArray(nextHops)) {
      throw new InputError('Invalid nextHops')
    }

    const contract = await this.getRailsPathContract()
    return contract.getNextHopsHash(nextHops)
  }

  async getNextHopsHashFromHops ({ hops }: GetNextHopsHashFromHopsInput): Promise<string> {
    if (!hops || !Array.isArray(hops)) {
      throw new InputError('Invalid hops')
    }

    const contract = await this.getRailsPathContract()
    return contract.getNextHopsHashFromHops(hops)
  }

  async getPathInfo (): Promise<Path> {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const contract = await this.getRailsPathContract()
    const pathInfoArray = await contract.getPathInfo()
    console.log('hopV2Sdk: pathInfo', pathInfoArray)
    const pathInfo: Path = {
      chainId: pathInfoArray[0].toString(),
      token: checksumAddress(pathInfoArray[1]),
      counterpartChainId: pathInfoArray[2].toString(),
      counterpartToken: checksumAddress(pathInfoArray[3]),
      initialReserve: pathInfoArray[4]
    }

    console.log('hopV2Sdk: pathInfo', pathInfo)
    return pathInfo
  }

  async getSourcePool({ attestedClaimId }: GetSourcePoolInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(attestedClaimId)) {
      throw new InputError(`Invalid attestedClaimId "${attestedClaimId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.getSourcePool(attestedClaimId)
  }

  async withdrawn ({ bonder }: WithdrawnInput): Promise<BigNumber> {
    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.withdrawn(bonder)
  }

  async getTotalClaimsAtClaimId ({ claimId }: GetTotalClaimsAtClaimIdInput): Promise<BigNumber> {
    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()
    const totalClaims = await contract.getTotalClaimsAtClaimId(claimId)
    return totalClaims
  }

  async getTotalConfirmed (): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    const totalConfirmed = await contract.getTotalConfirmed()
    return totalConfirmed
  }

  async getTransfer ({ transferId }: GetTransferInput): Promise<Transfer> {
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.getTransfer(transferId)
  }

  async removedBalance ({ bonder }: GetRemovedBalanceInput): Promise<Transfer> {
    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.removedBalance(bonder)
  }

  async getWithdrawableBalance ({ bonder, claimId }: GetWithdrawableBalanceInput): Promise<BigNumber> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()

    try {
      const balance = await contract.getWithdrawableBalance(bonder, claimId)
      return balance
    } catch (err: unknown) {
      return this.throwError(err) as BigNumber
    }
  }

  async hardConfirmedBucketIndex (): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.hardConfirmedBucketIndex()
  }

  async hardConfirmedClaimId (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.hardConfirmedClaimId()
  }

  async initialReserve(): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.initialReserve()
  }

  async pathId(): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.pathId()
  }

  async isValidClaim ({ claimId }: IsValidClaimInput ): Promise<boolean> {
    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.isValidClaim(claimId)
  }

  async isValidTransfer ({ claimId }: IsValidTransferInput ): Promise<boolean> {
    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.isValidTransfer(claimId)
  }

  async lastBondedClaimIdForBonder ({ bonder }: LastBondedClaimIdForBonderInput): Promise<string> {
    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.lastBondedClaimIdForBonder(bonder)
  }

  async pushClaim (input: PushClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.pushClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async readdClaim (input: ReaddClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.readdClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async removeClaim (input: RemoveClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.removeClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async send (input: SendInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const { amount, hops } = input
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    const pathId = hops?.[0]?.pathId

    if (!this.utils.isValidBytes32(pathId)) {
      throw new InputError(`Invalid pathId "${pathId}"`)
    }

    if (!this.utils.isValidNumericValue(amount)) {
      throw new InputError(`Invalid amount "${amount}"`)
    }

    const path = await this.getPathInfo()
    const tokenAddress = path.token
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }
    const tokenContract = ERC20__factory.connect(tokenAddress, provider)
    const signerAddress = (await this.getSignerAddress(chainId)) as string
    const balance = await tokenContract.balanceOf(signerAddress)
    if (balance.lt(amount)) {
      throw new InsufficientBalanceError('Insufficient balance ')
    }

    const address = this.getRailsPathContractAddress()
    const approved = await tokenContract.allowance(signerAddress, address)
    if (approved.lt(amount)) {
      throw new InsufficientApprovalError('Insufficient approval')
    }

    const populatedTx = await this.populateTransaction.send(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async token (): Promise<string> {
    const contract = await this.getRailsPathContract()
    return contract.token()
  }

  async totalSent (): Promise<BigNumber> {
    const contract = await this.getRailsPathContract()
    return contract.totalSent()
  }

  async totalWithdrawableAtClaimId({ bonder, claimId }: GetTotalWithdrawableAtClaimIdInput): Promise<BigNumber> {
    if (!this.utils.isValidAddress(bonder)) {
      throw new InputError(`Invalid bonder "${bonder}"`)
    }

    if (!this.utils.isValidBytes32(claimId)) {
      throw new InputError(`Invalid claimId "${claimId}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.totalWithdrawableAtClaimId(bonder, claimId)
  }

  async transferChain ({ index }: TransferChainInput): Promise<string> {
    if (!this.utils.isValidNumericValue(index)) {
      throw new InputError(`Invalid index "${index}"`)
    }

    const contract = await this.getRailsPathContract()
    return contract.transferChain(index)
  }

  async withdrawBonds (input: WithdrawBondsInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawBonds(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  async withdrawClaim (input: WithdrawClaimInput, txOverrides: TxOverrides = {}): Promise<providers.TransactionResponse> {
    const populatedTx = await this.populateTransaction.withdrawClaim(input, txOverrides)
    return this.sendTransaction(populatedTx)
  }

  /** EVENT HANDLERS */

  getEventNames (): string[] {
    return RailsPath.getEventNames()
  }

  getEventFetcher(eventName: EventName | string): any { // TODO: return type
    const chainId = this.chainId
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const address = this.getRailsPathContractAddress()
    const eventFetcher: Record<EventName, any> = {
      [EventName.TransferSent]: TransferSentEventFetcher,
      [EventName.TransferBonded]: TransferBondedEventFetcher,
      [EventName.ClaimPushed]: ClaimPushedEventFetcher,
      [EventName.ClaimReadded]: ClaimReaddedEventFetcher,
      [EventName.ClaimRemoved]: ClaimRemovedEventFetcher,
      [EventName.ClaimWithdrawn]: ClaimWithdrawnEventFetcher,
    }

    const EventFetcherClass = eventFetcher[eventName as EventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    return new EventFetcherClass(provider, chainId, this.batchBlocks, address)
  }

  async getEventFromTransactionHash<T>({ eventName, transactionHash }: GetEventFromTransactionHashInput): Promise<EthersEventWithDecodedTypes<T> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!transactionHash) {
      throw new InputError('transactionHash is required')
    }
    if (!this.utils.isValidTxHash(transactionHash)) {
      throw new InputError(`Invalid transaction hash "${transactionHash}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const receipt = await provider.getTransactionReceipt(transactionHash)

    if (!receipt) {
      return null
    }

    return this.getEventFromTransactionReceipt<T>({
      eventName,
      receipt
    })
  }

  async getEventFromTransactionReceipt<T>({ eventName, receipt }: GetEventFromTransactionReceiptInput): Promise<EthersEventWithDecodedTypes<T> | null> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!receipt) {
      throw new InputError('receipt is required')
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }
    const eventFetcher = this.getEventFetcher(eventName)
    const events = eventFetcher.decodeEventsFromTransactionReceipt(receipt)
    return events?.[0] ?? null
  }

  async getEventFromTransferId<T>({ eventName, transferId, fromBlock = 0 }: GetEventFromTransferIdInput): Promise<EthersEventWithDecodedTypes<T>> {
    const chainId = this.chainId

    if (!chainId || !this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }
    if (!this.utils.isValidBytes32(transferId)) {
      throw new InputError(`Invalid transferId "${transferId}"`)
    }
    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId "${chainId}"`)
    }

    const address = this.getRailsPathContractAddress()
    if (!address) {
      throw new ConfigError(`Contract address not found for chainId "${chainId}"`)
    }

    const eventFetcher = this.getEventFetcher(eventName)
    const filter = eventFetcher.getTransferIdFilter(transferId)
    const toBlock = await provider.getBlockNumber()
    const events = await eventFetcher.getEventsForRangeWithFilter(filter, fromBlock, toBlock, { returnOnFirstMatch: true })
    return events?.[0] ?? null
  }

  async *getEventsInBatches({ eventName, fromBlock, toBlock }: GetEventsInBatchesInput) {
    const chainId = this.chainId
    if (!this.utils.isValidChainId(chainId)) {
      throw new InputError(`Invalid chainId "${chainId}"`)
    }

    if (!this.utils.isValidFilterBlock(fromBlock)) {
      throw new InputError(`Invalid fromBlock "${fromBlock}"`)
    }

    if (toBlock && !this.utils.isValidFilterBlock(toBlock)) {
      throw new InputError(`Invalid toBlock "${toBlock}"`)
    }

    const provider = this.getProvider(chainId)
    if (!provider) {
      throw new ConfigError(`Provider not found for chainId: ${chainId}`)
    }

    const latestBlock = await provider.getBlockNumber()
    const resolvedToBlock = toBlock ?? latestBlock
    let resolvedFromBlock = fromBlock ?? (latestBlock - 1000)

    if (resolvedFromBlock < 0) {
      resolvedFromBlock = resolvedToBlock + resolvedFromBlock
    }

    const eventFetcher = this.getEventFetcher(eventName)
    const eventsGenerator = eventFetcher.getEventsForRangeAsGenerator(resolvedFromBlock, resolvedToBlock)

    for await (const events of eventsGenerator) {
      yield events
    }
  }

  getEventFilter(eventName: EventName, input: GetEventFilterInput = {}) {
    const eventFetcher = this.getEventFetcher(eventName)
    return eventFetcher.getFilterWithIndexes(input)
  }

  addDecodedTypesToEvent(event: any): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn> {
    return RailsPath.addDecodedTypesToEvent(event, this.chainId)
  }

  addDecodedTypesToEvents(events: any[]): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn>[] {
    return RailsPath.addDecodedTypesToEvents(events, this.chainId)
  }

  /** END EVENT HANDLERS */

  /** STATIC METHODS */

  static deriveNetwork (chainId: BigNumberish): string {
    chainId = chainId?.toString()
    const networks = [NetworkSlug.Mainnet, NetworkSlug.Sepolia]

    for (const net of networks) {
      const network = getNetwork(net)
      const chain = Object.values(network.chains).find((chain: any) => chain.chainId === chainId)

      if (chain) {
        return net
      }
    }

    throw new Error('could not derive network')
  }

  static getEventNames (): string[] {
    return Object.keys(EventName).sort()
  }

  static getEventSignature (eventName: EventName): string {
    const eventFetchers: Record<EventName, any> = {
      [EventName.TransferSent]: TransferSentEventFetcher,
      [EventName.TransferBonded]: TransferBondedEventFetcher,
      [EventName.ClaimPushed]: ClaimPushedEventFetcher,
      [EventName.ClaimReadded]: ClaimReaddedEventFetcher,
      [EventName.ClaimRemoved]: ClaimRemovedEventFetcher,
      [EventName.ClaimWithdrawn]: ClaimWithdrawnEventFetcher,
    }

    const EventFetcherClass = eventFetchers[eventName]
    if (!EventFetcherClass) {
      throw new ConfigError(`Event fetcher not found for event name: ${eventName}`)
    }

    const eventFetcher = new EventFetcherClass()
    return eventFetcher.getTopic0()
  }

  static addDecodedTypesToEvent(event: any, chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn> {
    const decoded = RailsPath.addDecodedTypesToEvents([event], chainId)

    return decoded?.[0]
  }

  static addDecodedTypesToEvents(events: any[], chainId?: BigNumberish): EthersEventWithDecodedTypesAndBaseContext<TransferSent | TransferBonded | ClaimPushed | ClaimReadded | ClaimRemoved | ClaimWithdrawn>[] {
    const eventFetchers: Record<EventName, any> = {
      [EventName.TransferSent]: TransferSentEventFetcher,
      [EventName.TransferBonded]: TransferBondedEventFetcher,
      [EventName.ClaimPushed]: ClaimPushedEventFetcher,
      [EventName.ClaimReadded]: ClaimReaddedEventFetcher,
      [EventName.ClaimRemoved]: ClaimRemovedEventFetcher,
      [EventName.ClaimWithdrawn]: ClaimWithdrawnEventFetcher,
    }

    const result = events.map(event => {
      for (const eventName in eventFetchers) {
        const fetcher = (eventFetchers as any)[eventName]
        if (fetcher.getEventNameFromTopic(event.topics[0]) === eventName) {
          return fetcher.addTypedEvent(event, chainId)
        }
      }

      return event
    })

    return result
  }
}