import { useWeb3Context } from 'src/contexts/Web3Context'
import { useState, useEffect } from 'react'

const useTimestampFromBlock = (block: number | undefined): number | undefined => {
  const { provider } = useWeb3Context()
  const [timestamp, setTimestamp] = useState<number>()
  useEffect(() => {
    async function fetchTimestamp() {
      if (block) {
        const blockData = await provider?.getBlock(block)
        blockData && setTimestamp(blockData.timestamp)
      }
    }
    if (!timestamp) {
      fetchTimestamp()
    }
  }, [block, provider, timestamp])
  return timestamp
}

export default useTimestampFromBlock