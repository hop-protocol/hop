import { erc20Abi } from '@hop-protocol/core/abi'
import merkleRewardsAbi from 'src/abis/MerkleRewards.json'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import useQueryParams from 'src/hooks/useQueryParams'
import { BigNumber, Contract } from 'ethers'
import { DateTime } from 'luxon'
import { ShardedMerkleTree } from './merkle'
import { findNetworkBySlug, networkIdToSlug } from 'src/utils/networks'
import { formatError } from 'src/utils/format'
import { getAddress } from 'ethers/lib/utils'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { getTokenImage } from 'src/utils/tokens'
import { isGoerli, isMainnet, reactAppNetwork } from 'src/config'
import { useEffect, useMemo, useState } from 'react'
import { useInterval } from 'usehooks-ts'
import { useWeb3Context } from 'src/contexts/Web3Context'

interface Props {
  rewardsContractAddress: string
  merkleBaseUrl: string
  requiredChainId: number
}

export const useRewards = (props: Props) => {
  const { queryParams } = useQueryParams()
  const { rewardsContractAddress, merkleBaseUrl, requiredChainId } = props
  const { checkConnectedNetworkId, address, provider, connectedNetworkId } = useWeb3Context()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimableAmount, setClaimableAmount] = useState(BigNumber.from(0))
  const [unclaimableAmount, setUnclaimableAmount] = useState(BigNumber.from(0))
  const [claimProofBalance, setClaimProofBalance] = useState(BigNumber.from(0))
  const [claimProof, setClaimProof] = useState<any>(null)
  const [onchainRoot, setOnchainRoot] = useState('')
  const [onchainRootSet, setOnchainRootSet] = useState(false)
  const [latestRoot, setLatestRoot] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState<number|null>(null)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [latestRootTotal, setLatestRootTotal] = useState(BigNumber.from(0))
  const [estimatedDate, setEstimatedDate] = useState(0)
  const [claimRecipient, setClaimRecipient] = useState(queryParams.address as string ?? address?.address)
  const [countdown, setCountdown] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [withdrawn, setWithdrawn] = useState(BigNumber.from(0))
  const apiBaseUrl = isMainnet ? 'https://optimism-fee-refund-api.hop.exchange' : (isGoerli ? 'https://hop-merkle-rewards-backend.hop.exchange' : '')
  // const apiBaseUrl = 'http://localhost:8000'
  const pollUnclaimableAmountFromBackend = true
  const contract = useMemo(() => {
    try {
      if (rewardsContractAddress) {
        let _provider: any = provider
        if (connectedNetworkId !== requiredChainId) {
          _provider = getProviderByNetworkName(networkIdToSlug(requiredChainId))
        }
        return new Contract(rewardsContractAddress, merkleRewardsAbi, _provider)
      }
    } catch (err) {
      console.error(err)
    }
  }, [provider, rewardsContractAddress])
  const claimChain = findNetworkBySlug(networkIdToSlug(requiredChainId))
  const tokenImageUrl = tokenSymbol ? getTokenImage(tokenSymbol) : ''

  const token = useAsyncMemo(async () => {
    try {
      if (contract) {
        const tokenAddress = await contract.rewardsToken()
        return new Contract(tokenAddress, erc20Abi, contract.provider)
      }
    } catch (err: any) {
      if (!/noNetwork/.test(err.message)) {
        console.error(err)
      }
    }
  }, [contract])

  const getOnchainRoot = async () => {
    try {
      if (contract) {
        const root = await contract.merkleRoot()
        if (root) {
          const isSet = !BigNumber.from(root).eq(BigNumber.from(0))
          setOnchainRoot(root)
          setOnchainRootSet(isSet)
        }
      }
    } catch (err: any) {
      if (!/noNetwork/.test(err.message)) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    async function update() {
      if (token) {
        setTokenDecimals(await token.decimals())
        setTokenSymbol(await token.symbol())
      }
    }

    update().catch(console.error)
  }, [token])

  useEffect(() => {
    getOnchainRoot().catch(console.error)
  }, [contract])

  useInterval(getOnchainRoot, 10 * 60 * 1000)

  const getLatestRootFromRepo = async () => {
    try {
      if (pollUnclaimableAmountFromBackend) {
        return
      }
      if (!merkleBaseUrl) {
        return
      }
      const url = `${merkleBaseUrl}/latest.json`
      const res = await fetch(url)
      const json = await res.json()
      setLatestRoot(json.root)
      const { root, total } = await ShardedMerkleTree.fetchRootFile(merkleBaseUrl, json.root)
      if (root === json.root) {
        setLatestRootTotal(total)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getLatestRootFromRepo().catch(console.error)
  }, [contract, merkleBaseUrl])

  useInterval(getLatestRootFromRepo, 10 * 60 * 1000)

  const getClaimableAmountFromRepo = async () => {
    try {
      if (pollUnclaimableAmountFromBackend) {
        return
      }
      if (!(
        onchainRoot &&
        contract &&
        merkleBaseUrl &&
        claimRecipient
      )) {
        setClaimableAmount(BigNumber.from(0))
        return
      }
      if (!onchainRootSet) {
        return
      }
      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
      const [entry] = await shardedMerkleTree.getProof(claimRecipient)
      if (!entry) {
        setClaimableAmount(BigNumber.from(0))
        return
      }
      const total = BigNumber.from(entry.balance)
      const withdrawnAmount = await contract.withdrawn(claimRecipient)
      const amount = total.sub(withdrawnAmount)
      setClaimableAmount(amount)
      setClaimProofBalance(total)
    } catch (err) {
      console.error(err)
      setClaimableAmount(BigNumber.from(0))
    }
    setLoading(false)
  }

  useEffect(() => {
    getClaimableAmountFromRepo().catch(console.error)
  }, [contract, claimRecipient, onchainRoot, onchainRootSet, merkleBaseUrl])

  useInterval(getClaimableAmountFromRepo, 10 * 60 * 1000)

  const getUnclaimableAmountFromRepo = async () => {
    try {
      if (pollUnclaimableAmountFromBackend) {
        return
      }
      if (!(
        onchainRoot &&
        latestRoot &&
        contract &&
        merkleBaseUrl &&
        claimRecipient &&
        claimableAmount &&
        claimProofBalance
      )) {
        setUnclaimableAmount(BigNumber.from(0))
        return
      }
      if (latestRoot === onchainRoot) {
        setUnclaimableAmount(BigNumber.from(0))
        return
      }
      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, latestRoot)
      const [entry] = await shardedMerkleTree.getProof(claimRecipient)
      if (!entry) {
        setUnclaimableAmount(BigNumber.from(0))
        return
      }
      const total = BigNumber.from(entry.balance)
      let amount = total.sub(claimProofBalance)
      if (amount.lt(0)) {
        amount = BigNumber.from(0)
      }
      setUnclaimableAmount(amount)
    } catch (err) {
      console.error(err)
      setUnclaimableAmount(BigNumber.from(0))
    }
  }

  useEffect(() => {
    getUnclaimableAmountFromRepo().catch(console.error)
  }, [onchainRoot, claimRecipient, latestRoot, merkleBaseUrl, claimableAmount, claimProofBalance])

  useInterval(getUnclaimableAmountFromRepo, 10 * 60 * 1000)

  const getUnclaimableAmountFromBackend = async () => {
    try {
      if (!pollUnclaimableAmountFromBackend) {
        return
      }
      if (!claimRecipient) {
        return
      }
      if (!apiBaseUrl) {
        throw new Error(`apiBasUrl not set for network ${reactAppNetwork}`)
      }
      const url = `${apiBaseUrl}/v1/rewards?address=${claimRecipient}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.error) {
        throw new Error(json.error)
      }
      if (json.data.rewards.lockedBalance) {
        setUnclaimableAmount(BigNumber.from(json.data.rewards.lockedBalance))
      }
      if (json.data.rewards.balance) {
        setClaimableAmount(BigNumber.from(json.data.rewards.balance))
      }
      if (json.data.rewards.claimableProofBalance) {
        setClaimProofBalance(BigNumber.from(json.data.rewards.claimableProofBalance))
      }
      if (json.data.rewards.claimableProof) {
        setClaimProof(json.data.rewards.claimableProof)
      }
    } catch (err: any) {
      if (!/Invalid Entry/.test(err.message)) {
        console.error('useRewards error:', err)
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    getUnclaimableAmountFromBackend().catch(console.error)
  }, [claimRecipient])

  useInterval(getUnclaimableAmountFromBackend, 2 * 60 * 1000)

  const getRewardsInfoFromBackend = async () => {
    try {
      if (!pollUnclaimableAmountFromBackend) {
        return
      }
      if (!apiBaseUrl) {
        throw new Error(`apiBasUrl not set for network ${reactAppNetwork}`)
      }
      const url = `${apiBaseUrl}/v1/rewards-info`
      const res = await fetch(url)
      const json = await res.json()
      if (json.error) {
        throw new Error(json.error)
      }
      if (json.data.estimatedDateMs) {
        if (json.data.estimatedDateMs) {
          setEstimatedDate(json.data.estimatedDateMs)
        }
      }
      if (json.data.repoLatestRoot) {
        setLatestRootTotal(json.data.repoLatestRoot)
      }
      if (json.data.repoLatestRootTotal) {
        setLatestRootTotal(BigNumber.from(json.data.repoLatestRootTotal))
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getRewardsInfoFromBackend().catch(console.error)
  }, [])

  async function updateCountdown() {
    if (!estimatedDate) {
      return
    }

    if (estimatedDate < Date.now()) {
      setCountdown('Claimable soon')
    } else {
      const end = DateTime.fromMillis(estimatedDate)
      const now = DateTime.now()
      const remaining = end.diff(now)
      setCountdown(remaining.toFormat(`d'd' h'h' m'm' ss`))
    }
  }

  useEffect(() => {
    updateCountdown().catch(console.error)
  }, [])

  useInterval(updateCountdown, 1 * 1000)

  async function claim() {
    try {
      setError('')
      if (!claimRecipient) {
        throw new Error('claim recipient value not found')
      }
      if (!address) {
        throw new Error('address value not found')
      }
      if (!contract) {
        throw new Error('contract value not found')
      }
      if (!provider) {
        throw new Error('provider value not found')
      }
      const isNetworkConnected = await checkConnectedNetworkId(requiredChainId)
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }

      setClaiming(true)
      let _totalAmount = BigNumber.from(0)
      let _claimProof :any[] = []
      if (pollUnclaimableAmountFromBackend) {
        if (claimProofBalance?.eq(0)) {
          throw new Error('claim total amount is required')
        }
        if (!claimProof) {
          throw new Error('claim proof not found')
        }
        _totalAmount = claimProofBalance
        _claimProof = claimProof
      } else {
        if (!merkleBaseUrl) {
          throw new Error('merkleBaseUrl value not found')
        }
        if (!onchainRoot) {
          throw new Error('onchain root value not found')
        }
        if (!onchainRootSet) {
          throw new Error('onchain root set value not found')
        }
        const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
        const [entry, proof] = await shardedMerkleTree.getProof(claimRecipient.toLowerCase())
        console.log('entry', entry)
        if (!entry) {
          throw new Error('no entry')
        }
        _totalAmount = BigNumber.from(entry.balance)
        _claimProof = proof
      }
      console.log('claimContractAddress', contract.address)
      console.log('claimAccount', claimRecipient)
      console.log('claimTotalAmount:', _totalAmount.toString())
      console.log('claimProof (bytes32[])', `${JSON.stringify(_claimProof).replaceAll('"', '').replaceAll('[', '').replaceAll(']', '')}`)
      console.log('claimProof (json array)', _claimProof)
      const tx = await contract.connect(provider.getSigner()).claim(claimRecipient, _totalAmount, _claimProof)
      console.log('tx sent:', tx)
      const receipt = await tx.wait()
      console.log('receipt:', receipt)
      setClaimableAmount(BigNumber.from(0))
    } catch (err: any) {
      console.error(err)
      if (!/ACTION_REJECTED|cancelled/gi.test(err.message)) {
        setError(formatError(err))
      }
    }
    setClaiming(false)
  }

  const hasRewards = !!(address && claimableAmount?.gt(0))
  let txHistoryLink = `https://${isGoerli ? 'goerli.explorer' : 'explorer'}.hop.exchange/?startDate=2022-09-23`
  if (address) {
   txHistoryLink += `&account=${address}`
  }
  if (claimChain) {
   txHistoryLink += `&destination=optimism`
  }

  const repoUrl = (merkleBaseUrl ?? '').replace(/.*\.com\/(.*)\/master/gi, 'https://github.com/$1')

  function handleInputChange (event: any) {
    event.preventDefault()
    const { value } = event.target
    setInputValue(value)
  }

  useEffect(() => {
    try {
      if (!inputValue) {
        if (address?.address) {
          setClaimRecipient(address?.address)
        }
      } else {
        const recipient = getAddress(inputValue)
        setClaimRecipient(recipient)
      }
    } catch (err) {
      console.error(err)
    }
  }, [inputValue, address])

  useEffect(() => {
    async function updateWithdrawnAmount() {
      if (contract && claimRecipient) {
        const withdrawnAmount = await contract.withdrawn(claimRecipient)
        setWithdrawn(withdrawnAmount)
      }
    }

    updateWithdrawnAmount().catch(console.error)
  }, [contract, claimRecipient])

  return {
    tokenDecimals,
    claimableAmount,
    unclaimableAmount,
    latestRootTotal,
    latestRoot,
    error,
    loading,
    claim,
    claiming,
    tokenSymbol,
    claimRecipient,
    onchainRoot,
    hasRewards,
    estimatedDate,
    claimChain,
    txHistoryLink,
    tokenImageUrl,
    repoUrl,
    countdown,
    inputValue,
    handleInputChange,
    withdrawn
  }
}
