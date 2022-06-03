import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { BigNumber, utils, providers } from 'ethers'
import { claimTokens, correctClaimChain, fetchClaim, getContractBalance, getAirdropSupply } from './claims'
import { toTokenDisplay } from 'src/utils'
import { parseUnits, getAddress, isAddress, formatUnits } from 'ethers/lib/utils'
import { useEns } from 'src/hooks'
import Address from 'src/models/Address'
import { formatError } from 'src/utils/format'
import { claimChainId } from './config'
import { networkIdToSlug } from 'src/utils/networks'
import { useInterval } from 'react-use'

export interface TokenClaim {
  entry: {
    balance: BigNumber
  }
  proof: string[]
  address: Address
  isClaimed?: boolean
}

export interface Delegate {
  ensName: string
  address: Address | null
  votes: BigNumber
  votesFormatted: string
  avatar: string
  infoUrl: string
  info: string
}

const initialDelegate: Delegate = { ensName: '', address: null, votes: BigNumber.from(0), votesFormatted: '', avatar: '', infoUrl: '', info: '' }

export function useClaim() {
  const { provider, address, connectedNetworkId, checkConnectedNetworkId } = useWeb3Context()
  const [warning, setWarning] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [claimableTokens, setClaimableTokens] = useState<BigNumber>(BigNumber.from(0))
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [claim, setClaim] = useState<TokenClaim>()
  const [inputValue, setInputValue] = useState('')
  const [claimTokensTx, setClaimTokensTx] = useState<providers.TransactionResponse>()
  const [delegate, setDelegate] = useState<Delegate>(initialDelegate)
  const { ensName, ensAvatar, ensAddress } = useEns(inputValue)
  const [error, setError] = useState('')
  const [contractBalance, setContractBalance] = useState<BigNumber>(BigNumber.from(0))
  const [airdropSupply, setAirdropSupply] = useState<BigNumber>(BigNumber.from(0))
  const [claimProvider] = useState(() => {
    return providers.getDefaultProvider(networkIdToSlug(claimChainId))
  })

  useEffect(() => {
    const update = async () => {
      const _contractBalance = await getContractBalance(claimProvider)
      setContractBalance(_contractBalance)
      const _airdropSupply = await getAirdropSupply(claimProvider)
      setAirdropSupply(_airdropSupply)
    }

    update().catch(console.error)
  }, [])

  useEffect(() => {
    try {
      if (!inputValue) {
        return setDelegate(initialDelegate)
      }

      if (isAddress(inputValue?.toLowerCase())) {
        return setDelegate({
          ensName: ensName || '',
          address: new Address(getAddress(inputValue.toLowerCase())),
          votes: parseUnits('1', 18),
          votesFormatted: '1',
          avatar: ensAvatar || '',
          infoUrl: '',
          info: '',
        })
      }

      if (ensName && ensAddress) {
        return setDelegate({
          ensName,
          address: new Address(ensAddress),
          votes: parseUnits('1', 18),
          votesFormatted: '1',
          avatar: ensAvatar || '',
          infoUrl: '',
          info: ''
        })
      }

      setDelegate(undefined!)
    } catch (err) {
      console.error(err)
    }
  }, [inputValue, ensName, ensAddress, ensAvatar])

  // Sets claimable tokens
  useEffect(() => {
    if (claim) {
      if (claim.isClaimed) {
        setClaimableTokens(BigNumber.from(0))
      } else {
        setClaimableTokens(BigNumber.from(claim.entry.balance ?? 0))
      }
    }
  }, [claim, delegate])

  // Sets warning about correct connected network
  useEffect(() => {
    if (Number(connectedNetworkId) === correctClaimChain.id) {
      setCorrectNetwork(true)
    } else {
      setClaimableTokens(BigNumber.from(0))
      setWarning(`Please connect your wallet to the ${correctClaimChain.name} network`)
      setCorrectNetwork(false)
    }
  }, [connectedNetworkId])

  // Retrieves claim from files
  async function getClaim(address: Address) {
    try {
      const _claim = await fetchClaim(claimProvider, address)
      if (_claim) {
        if (!claim || (claim && !(_claim.address === claim.address && _claim.isClaimed === claim.isClaimed))) {
          setClaim(_claim)
        }
      }
    } catch (error: any) {
      if (
        error.message.includes('Cannot find module') ||
        error.message.includes('Invalid Entry')
      ) {
        setClaimableTokens(BigNumber.from(0))
        setWarning('Sorry, the connected account is not eligible for the airdrop')
      }
    }
  }

  // Triggers getClaim() if valid address is connected to correct chain
  useEffect(() => {
    const update = async () => {
      try {
        if (address?.address && utils.isAddress(address.address)) {
          setClaimableTokens(BigNumber.from(0))
          setWarning('')
          setClaim(undefined)
          setLoading(true)
          await getClaim(address)
        }
      } catch (err) {
      }
      setLoading(false)
    }
    update().catch(console.error)
  }, [address, provider])

  const checkClaim = () => {
    try {
      if (address?.address && utils.isAddress(address.address)) {
        getClaim(address)
      }
    } catch (err) {
    }
  }

  useInterval(checkClaim, 5 * 1000)

  // Sets warning about claimable tokens
  useEffect(() => {
    if (claim && claimableTokens) {
      const tokenClaims = BigNumber.from(claimableTokens)
      if (tokenClaims.eq(0)) {
        if (claim?.entry.balance) {
          return setWarning(
            `You have already claimed ${toTokenDisplay(claim?.entry.balance, 18)} tokens`
          )
        }

        return setWarning('Sorry, the connected account is not eligible for the airdrop')
      }

      setWarning('')
    }
  }, [claimableTokens, claim])

  // Send tx to claim tokens
  const sendClaimTokens = useCallback(async () => {
    if (provider && claim?.entry) {
      try {
        setClaiming(true)

        const isNetworkConnected = await checkConnectedNetworkId(claimChainId)
        if (!isNetworkConnected) {
          setClaiming(false)
          return
        }

        const tx = await claimTokens(provider.getSigner(), claim, delegate)
        setClaimTokensTx(tx)

        const receipt = await tx.wait()
        if (receipt.status === 1) {
          setClaimed(true)
        }

        setClaiming(false)
        return receipt
      } catch (err: any) {
        console.error(err)
        setClaiming(false)
        setClaimed(false)
        setError(formatError(err.message))
      }
    } else {
      setWarning('Provider or claim entry not found')
    }
    setClaiming(false)
  }, [provider, claim, delegate])

  const canClaim = claimableTokens.gt(0)

  async function hasManyVotes (_delegate: any) {
    try {
      if (contractBalance.eq(0) || airdropSupply.eq(0) || !_delegate?.votes || delegate.votes?.eq(0)) {
        return false
      }
      const totalSupply = Number(formatUnits(airdropSupply.toString(), 18))
      const allDelegatedVotes = Number(formatUnits(airdropSupply.sub(contractBalance).toString(), 18))

      const minTotalThreshold = 0.2 // 20%
      const isMinMet = (totalSupply / allDelegatedVotes) > minTotalThreshold
      if (!isMinMet) {
        return false
      }

      const newAmount = Number(formatUnits(_delegate.votes.add(claimableTokens).toString(), 18))
      const diff = newAmount / allDelegatedVotes
      const threshold = 0.05 // 5%
      const tooMany = diff > threshold
      return tooMany
    } catch (err) {
      console.error(err)
    }
    return false
  }

  return {
    claim,
    claimableTokens,
    canClaim,
    sendClaimTokens,
    loading,
    warning,
    claimed,
    claiming,
    inputValue,
    setInputValue,
    claimTokensTx,
    delegate,
    setDelegate,
    error,
    setError,
    hasManyVotes,
    contractBalance,
    airdropSupply
  }
}
