import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { BigNumber, providers, utils } from 'ethers'
import { claimTokens, correctClaimChain, fetchClaim } from 'src/utils/claims'
import { toTokenDisplay } from 'src/utils'
import { getAddress, isAddress } from 'ethers/lib/utils'
import { useEns } from 'src/hooks'

export interface TokenClaim {
  entry: {
    balance: BigNumber
  }
  proof: string[]
  address: string
  isClaimed?: boolean
}

export interface Delegate {
  ensName: string
  address: string
  votes: number
  avatar: string
}

const initialDelegate: Delegate = { ensName: '', address: '', votes: 0, avatar: '' }

export function useClaim() {
  const { provider, address, connectedNetworkId } = useWeb3Context()
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

  useEffect(() => {
    if (!inputValue) {
      return
    }

    if (isAddress(inputValue?.toLowerCase())) {
      return setDelegate({
        ensName: ensName || '',
        address: getAddress(inputValue.toLowerCase()),
        votes: 1,
        avatar: ensAvatar || '',
      })
    }

    if (ensName && ensAddress) {
      return setDelegate({
        ensName,
        address: ensAddress,
        votes: 1,
        avatar: ensAvatar || '',
      })
    }

    setDelegate(undefined!)
  }, [inputValue, ensName, ensAddress, ensAvatar])

  // Sets claimable tokens
  useEffect(() => {
    console.log(`delegate:`, delegate)
    if (claim) {
      console.log(`claim:`, claim)
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
  async function getClaim(address: string) {
    if (provider) {
      setLoading(true)

      try {
        const claim = await fetchClaim(provider, address)
        setClaim(claim)
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
      if (provider && address?.address && utils.isAddress(address.address) && correctNetwork) {
        setClaimableTokens(BigNumber.from(0))
        setWarning('')
        setClaim(undefined)
        getClaim(address.address)
      }
    } catch (err) {
      getClaim('')
    }
  }, [address, provider, correctNetwork])

  // Send tx to claim tokens
  const sendClaimTokens = useCallback(async () => {
    if (provider && claim?.entry) {
      setClaiming(true)

      try {
        const tx = await claimTokens(provider.getSigner(), claim, delegate)
        setClaimTokensTx(tx)

        const receipt = await tx.wait()
        if (receipt.status === 1) {
          setClaiming(false)
          setClaimed(true)
        }

        return receipt
      } catch (error) {
        console.log(`error:`, error)
        // TODO: catch replaced txs
        setClaiming(false)
        setClaimed(false)
      }
    } else {
      setWarning('Provider or claim entry not found')
    }
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
  }
}
