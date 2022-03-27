import { useEffect, useState } from 'react'
import { useWeb3Context } from 'src/contexts/Web3Context'
import logger from 'src/logger'
import { formatError } from 'src/utils'

export default function useIsSmartContractWallet() {
  const { provider, address } = useWeb3Context()
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false)

  useEffect(() => {
    const checkAddress = async () => {
      if (!provider || !address) return

      try {
        const code = await provider.getCode(address.address)
        setIsSmartContractWallet(code !== '0x')
      } catch (error) {
        logger.error(formatError(error))
      }
    }

    checkAddress()
  }, [provider, address])

  return {
    isSmartContractWallet,
  }
}
