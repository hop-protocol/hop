import React, { useEffect, useState } from 'react'
import { apiUrl, networkSlug, appApiHost } from '@/app/config'
import { utils } from 'ethers'
import { Hop } from '@hop-protocol/v2-sdk'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'

const { formatUnits, formatEther } = utils

export async function fetchMessageDetails (options: any = {}) {
  const { messageId } = options

  const hostname = typeof window === 'undefined' ? appApiHost : window.location.host
  const protocol = hostname.includes('localhost') ? 'http' : 'https'

  const pathname = `/message-details`
  const url = `${protocol}://${hostname}/api/?pathname=${pathname}&messageId=${messageId}`
  console.log(url)
  const data = await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    console.log('data', data)

  return data
}
