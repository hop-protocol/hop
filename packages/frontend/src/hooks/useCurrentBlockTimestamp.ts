import { useEffect, useState } from 'react'
import { useWeb3Context } from '#contexts/Web3Context.js'

const useCurrentBlockTimestamp = (): number | undefined => {
  const { provider } = useWeb3Context()
  const [timestamp, setTimestamp] = useState<number>()
  useEffect(() => {
    async function fetchTimestamp() {
      const blockNumber: any = await provider?.getBlockNumber()
      const blockData = await provider?.getBlock(blockNumber)
      blockData && setTimestamp(blockData.timestamp)
    }
    if (!timestamp) {
      fetchTimestamp()
    }
  }, [provider, timestamp])
  return timestamp
}

export default useCurrentBlockTimestamp
