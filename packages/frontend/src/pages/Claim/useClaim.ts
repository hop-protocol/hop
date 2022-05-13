import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { BigNumber, utils, providers } from 'ethers'
import { claimTokens, correctClaimChain, fetchClaim } from './claims'
import { toTokenDisplay } from 'src/utils'
import { parseUnits, getAddress, isAddress } from 'ethers/lib/utils'
import { useEns } from 'src/hooks'
import Address from 'src/models/Address'
import { formatError } from 'src/utils/format'
import { claimChainId } from './config'
import { networkIdToSlug } from 'src/utils/networks'

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
}

const initialDelegate: Delegate = { ensName: '', address: null, votes: BigNumber.from(0), votesFormatted: '', avatar: '', infoUrl: '' }

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
  const [claimProvider] = useState(() => {
    return providers.getDefaultProvider(networkIdToSlug(claimChainId))
  })

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
          infoUrl: ''
        })
      }

      if (ensName && ensAddress) {
        return setDelegate({
          ensName,
          address: new Address(ensAddress),
          votes: parseUnits('1', 18),
          votesFormatted: '1',
          avatar: ensAvatar || '',
          infoUrl: ''
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
        // setWarning('Already claimed')
      } else {
        setClaimableTokens(BigNumber.from(claim.entry.balance ?? 0))
      }
    }
  }, [claim, delegate])

  // Sets warning about correct connected network
  useEffect(() => {
    if (Number(connectedNetworkId) === Number(correctClaimChain.id)) {
      setCorrectNetwork(true)
    } else {
      setClaimableTokens(BigNumber.from(0))
      setWarning(`Please connect your wallet to the ${correctClaimChain.name} network`)
      setCorrectNetwork(false)
    }
  }, [connectedNetworkId])

  // Sets warning about claimable tokens
  useEffect(() => {
    if (correctNetwork && claim && claimableTokens) {
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
  }, [claimableTokens, claim, correctNetwork])

  // Retrieves claim from files
  async function getClaim(address: Address) {
    if (claimProvider) {
      setLoading(true)

      try {
        const claim = await fetchClaim(claimProvider, address)
        if (claim) {
          setClaim(claim)
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

      setLoading(false)
    }
  }

  // Triggers getClaim() if valid address is connected to correct chain
  useEffect(() => {
    try {
      if (address?.address && utils.isAddress(address.address)) {
        setClaimableTokens(BigNumber.from(0))
        setWarning('')
        setClaim(undefined)
        getClaim(address)
      }
    } catch (err) {
    }
  }, [address, provider])

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

  return {
    claim,
    claimableTokens,
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
    setError
  }
}
