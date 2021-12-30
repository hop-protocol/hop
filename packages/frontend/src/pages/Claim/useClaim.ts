import React, { useCallback, useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { BigNumber, providers, utils } from 'ethers'
import { claimTokens, correctClaimChain, fetchClaim } from 'src/utils/claims'
import { toTokenDisplay } from 'src/utils'
import { isAddress } from 'ethers/lib/utils'

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
  const [claimableTokens, setClaimableTokens] = useState<string>('0')
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [claim, setClaim] = useState<TokenClaim>()
  const [inputValue, setInputValue] = useState('')
  const [claimTokensTx, setClaimTokensTx] = useState<providers.TransactionResponse>()
  const [delegate, setDelegate] = useState<Delegate>(initialDelegate)

  useEffect(() => {
    if (inputValue) {
      if (isAddress(inputValue)) {
        return setDelegate({
          // TODO: lookup or resolve
          ensName: inputValue,
          address: inputValue,
          votes: 1,
          avatar: '',
        })
      }

      setDelegate(undefined!)
    }
  }, [inputValue])

  // Sets claimable tokens
  useEffect(() => {
    if (claim) {
      console.log(`claim:`, claim)
      if (claim.isClaimed) {
        setClaimableTokens('0')
        // setWarning('Already claimed')
      } else {
        setClaimableTokens(claim.entry.balance.toString())
      }
    }
  }, [claim])

  // Sets warning about correct connected network
  useEffect(() => {
    if (connectedNetworkId === correctClaimChain.id) {
      setCorrectNetwork(true)
    } else {
      setClaimableTokens('0')
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
            `You have already claimed ${toTokenDisplay(claim.entry.balance, 18)} tokens`
          )
        }

        return setWarning('The connected account is not eligible for the airdrop :(')
      }

      setWarning('')
    }
  }, [claimableTokens, claim, correctNetwork])

  // Retrieves claim from files
  async function getClaim(address) {
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
          setClaimableTokens('0')
          setWarning('The connected account is not eligible for the airdrop :(')
        }
      }

      setLoading(false)
    }
  }

  // Triggers getClaim() if valid address is connected to correct chain
  useEffect(() => {
    if (provider && address?.address && utils.isAddress(address.address) && correctNetwork) {
      setClaimableTokens('0')
      setWarning('')
      setClaim(undefined)
      getClaim(address.address)
    }
    console.log(`correctNetwork:`, correctNetwork)
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
