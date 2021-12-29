import { useCallback, useState } from 'react'
import { Token } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { networkIdToSlug, wait } from 'src/utils'

export function useAddTokenToMetamask(
  token?: Token | null,
  destNetworkName?: string | null
): {
  addToken: () => void
  addTokenToDestNetwork: () => void
  success?: boolean
} {
  const { sdk } = useApp()
  const { connectedNetworkId, provider } = useWeb3Context()
  const [success, setSuccess] = useState<boolean>(false)

  const addToken = useCallback(
    (networkId?: number) => {
      if (provider && token) {
        const { symbol, image, decimals } = token
        const networkName = networkIdToSlug(networkId || connectedNetworkId)
        const params = {
          type: 'ERC20',
          options: {
            address: sdk.getL2CanonicalTokenAddress(symbol, networkName),
            symbol,
            decimals,
            image,
          },
        }

        provider
          .send('wallet_watchAsset', params as any)
          .then(() => setSuccess(true))
          .catch(() => setSuccess(false))
      } else {
        setSuccess(false)
      }
    },
    [token, provider, connectedNetworkId]
  )

  const addTokenToDestNetwork = useCallback(async () => {
    if (provider && token && destNetworkName) {
      const destinationChain = sdk.toChainModel(destNetworkName)
      if (destinationChain.chainId !== token.chain.chainId) {
        await provider.send('wallet_switchEthereumChain', [
          {
            chainId: `0x${Number(destinationChain?.chainId).toString(16)}`,
          },
        ])
      }

      await wait(1500)
      await addToken(destinationChain.chainId)
    } else {
      setSuccess(false)
    }
  }, [provider, token, destNetworkName])

  return { addToken, addTokenToDestNetwork, success }
}
