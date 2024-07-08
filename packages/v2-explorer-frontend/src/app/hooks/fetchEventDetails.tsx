import { apiUrl } from '../config'
import { utils } from 'ethers'
import { networkSlug } from '../config'
import { Hop } from '@hop-protocol/v2-sdk'
import PendingIcon from '@mui/icons-material/Pending'
import Chip from '@mui/material/Chip'
import CheckIcon from '@mui/icons-material/Check'
import { fetchEvents } from './fetchEvents'

const { formatUnits, formatEther } = utils

export async function fetchEventDetails (options: any = {}) {
  const { transferId } = options
  const filter = { transferId }
  const { events } = await fetchEvents({ eventName: 'explorer', filter })
  return events?.[0]
}
