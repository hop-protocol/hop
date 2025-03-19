import { apiUrl, networkSlug } from '@/app/config'
import { utils } from 'ethers'
import { Hop } from '@hop-protocol/v2-sdk'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import { fetchEvents } from './fetchEvents'

const { formatUnits, formatEther } = utils

export async function fetchEventDetails (options: any = {}) {
  const { transferId } = options
  const filter = { transferId }
  const response = await fetchEvents({ eventName: 'explorer', filter })
  
  // Return the full response with the event details and lastUpdated
  if (response && response.events && response.events[0]) {
    return {
      ...response.events[0],
      lastUpdated: response.lastUpdated
    }
  }
  
  return null
}
