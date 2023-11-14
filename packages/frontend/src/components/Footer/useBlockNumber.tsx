import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useQuery } from 'react-query'

export function useBlockNumber() {
  const { data: blockNumber } = useQuery(
    [
      'useBlockNumber',
    ],
    async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213')
      const blockNumber = await provider.getBlockNumber()
      return blockNumber.toString()
    },
    {
      enabled: true,
      refetchInterval: 10 * 1000
    }
  )

  return {
    blockNumber
  }
}
