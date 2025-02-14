import React, { useEffect, useState } from 'react'
import { apiUrl, networkSlug } from '@/app/config'
import { utils } from 'ethers'
import { Hop } from '@hop-protocol/v2-sdk'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
// import { fetchEvents } from './fetchEvents'

const { formatUnits, formatEther } = utils

export async function fetchPathDetails (options: any = {}) {
  const { pathId } = options

  const url = `http://localhost:8000/v1/path-details?pathId=${pathId}`
  //fetch('https://v2-explorer-api-sepolia.hop.exchange/v1/path-details')
  console.log(url)
  const data = await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((json) => {
      return {
        items: Object.values(json.data),
        lastUpdated: json.lastUpdated
      }
    })
    console.log('data', data)

  return data
}
