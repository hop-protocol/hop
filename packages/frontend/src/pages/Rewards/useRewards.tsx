import { useMemo, useState, useEffect } from 'react'
import { useInterval } from 'react-use'
import { formatError } from 'src/utils/format'
import { BigNumber, Contract } from 'ethers'
import { ShardedMerkleTree } from './merkle'
import useQueryParams from 'src/hooks/useQueryParams'
import useAsyncMemo from 'src/hooks/useAsyncMemo'
import erc20Abi from '@hop-protocol/core/abi/generated/ERC20.json'
import { getProviderByNetworkName } from 'src/utils/getProvider'
import { networkIdToSlug, findNetworkBySlug } from 'src/utils/networks'
import merkleRewardsAbi from 'src/abis/MerkleRewards.json'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { DateTime } from 'luxon'
import { getTokenImage } from 'src/utils/tokens'
import { reactAppNetwork } from 'src/config'

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
  const [entryTotal, setEntryTotal] = useState(BigNumber.from(0))
  const [onchainRoot, setOnchainRoot] = useState('')
  const [onchainRootSet, setOnchainRootSet] = useState(false)
  const [latestRoot, setLatestRoot] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState<number|null>(null)
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [latestRootTotal, setLatestRootTotal] = useState(BigNumber.from(0))
  const [estimatedDate, setEstimatedDate] = useState(0)
  const claimRecipient = queryParams.address as string ?? address?.address
  const [countdown, setCountdown] = useState('')
  const apiBaseUrl = reactAppNetwork === 'goerli' ? 'https://hop-merkle-rewards-backend.hop.exchange' : 'https://optimism-fee-refund-api.hop.exchange'
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
    } catch (err) {
      console.error(err)
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
    } catch (err) {
      console.error(err)
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

  useInterval(getOnchainRoot, 30 * 1000)

  useEffect(() => {
    getOnchainRoot().catch(console.error)
  }, [contract])

  useInterval(getOnchainRoot, 30 * 1000)

  const getLatestRoot = async () => {
    try {
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
    getLatestRoot().catch(console.error)
  }, [contract, merkleBaseUrl])

  useInterval(getLatestRoot, 30 * 1000)

  const getClaimableAmount = async () => {
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
      const withdrawn = await contract.withdrawn(claimRecipient)
      const amount = total.sub(withdrawn)
      setClaimableAmount(amount)
      setEntryTotal(total)
    } catch (err) {
      console.error(err)
      setClaimableAmount(BigNumber.from(0))
    }
    setLoading(false)
  }

  useEffect(() => {
    getClaimableAmount().catch(console.error)
  }, [contract, claimRecipient, onchainRoot, onchainRootSet, merkleBaseUrl])

  useInterval(getClaimableAmount, 10 * 1000)

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
        entryTotal
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
      let amount = total.sub(entryTotal)
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
  }, [onchainRoot, claimRecipient, latestRoot, merkleBaseUrl, claimableAmount, entryTotal])

  useInterval(getUnclaimableAmountFromRepo, 10 * 1000)

  const getUnclaimableAmountFromBackend = async () => {
    try {
      if (!pollUnclaimableAmountFromBackend) {
        return
      }
      if (!claimRecipient) {
        return
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
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    getUnclaimableAmountFromBackend().catch(console.error)
  }, [claimRecipient])

  useInterval(getUnclaimableAmountFromBackend, 10 * 1000)

  const getRewardsInfoFromBackend = async () => {
    try {
      if (!pollUnclaimableAmountFromBackend) {
        return
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
      if (!(
        contract &&
        provider &&
        address &&
        claimRecipient &&
        onchainRoot &&
        merkleBaseUrl
      )) {
        return
      }
      const isNetworkConnected = await checkConnectedNetworkId(requiredChainId)
      if (!isNetworkConnected) {
        throw new Error('wrong network connected')
      }
      if (!onchainRootSet) {
        return
      }

      setClaiming(true)
      const shardedMerkleTree = await ShardedMerkleTree.fetchTree(merkleBaseUrl, onchainRoot)
      const [entry, proof] = await shardedMerkleTree.getProof(claimRecipient)
      console.log('entry', entry)
      console.log('proof', proof)
      if (!entry) {
        throw new Error('no entry')
      }
      const totalAmount = BigNumber.from(entry.balance)
      console.log('totalAmount:', totalAmount.toString())
      const tx = await contract.connect(provider.getSigner()).claim(claimRecipient, totalAmount, proof)
      console.log(tx)
      await tx.wait()
    } catch (err: any) {
      console.error(err)
      setError(formatError(err))
    }
    setClaiming(false)
  }

  const hasRewards = !!(address && claimableAmount?.gt(0))
  let txHistoryLink = `https://${reactAppNetwork === 'goerli' ? 'goerli.explorer' : 'explorer'}.hop.exchange/?startDate=2022-09-23`
  if (address) {
   txHistoryLink += `&account=${address}`
  }
  if (claimChain) {
   txHistoryLink += `&destination=optimism`
  }

  const repoUrl = (merkleBaseUrl ?? '').replace(/.*\.com\/(.*)\/master/gi, 'https://github.com/$1')

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
    countdown
  }
}
