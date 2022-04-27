import React, { useEffect, useState } from 'react'
import { BigNumberish } from 'ethers'
import Address from 'src/models/Address'
import { find } from 'lodash'
import { data } from './data'

export interface HopAirdropPreview {
  address: string
  bridgeTxs: 0 | 1 | 2
  volume: BigNumberish
  lp: boolean
}

interface Eligibility {
  isEligible: boolean
  bridgeUserAirdrop: boolean
  lpAirdrop: boolean
}

const initialEligibility = {
  isEligible: false,
  bridgeUserAirdrop: false,
  lpAirdrop: false,
}

export function useAirdropPreview(address?: Address) {
  const [preview, setPreview] = useState<HopAirdropPreview>()
  const [eligibility, setEligibility] = useState<Eligibility>(initialEligibility)

  useEffect(() => {
    if (address) {
      const userPreview = find(data, ['address', address.address])
      return setPreview(userPreview)
    }

    setPreview(undefined)
  }, [data, address])

  useEffect(() => {
    if (preview) {
      console.log(`preview:`, preview)

      const bridgeUserAirdrop = preview.bridgeTxs === 2 && preview.volume > 250
      const lpAirdrop = preview.lp === true
      const isEligible = bridgeUserAirdrop || lpAirdrop

      return setEligibility({
        isEligible,
        bridgeUserAirdrop,
        lpAirdrop,
      })
    }

    setEligibility(initialEligibility)
  }, [preview])

  return {
    preview,
    eligibility,
  }
}
