import { useCallback, useState } from 'react'
import { Token, ChainSlug, CanonicalToken } from '@hop-protocol/sdk'
import { useApp } from 'src/contexts/AppContext'
import { useWeb3Context } from 'src/contexts/Web3Context'
import { ensTokenAddress, networkIdToSlug, wait } from 'src/utils'
import { ChainName } from '@hop-protocol/sdk/dist/src/constants'

interface AddTokenToMetamask {
  addToken: (networkId: number) => void
  addHopToken: () => void
  addTokenToDestNetwork: () => void
  success?: boolean
}

export function useAddTokenToMetamask(
  token?: Token | null,
  destNetworkName?: string | null
): AddTokenToMetamask {
  const { sdk } = useApp()
  const { connectedNetworkId, provider } = useWeb3Context()
  const [success, setSuccess] = useState<boolean>(false)

  const addToken = useCallback(
    (networkId: number) => {
      if (provider && token) {
        let { symbol, image, decimals } = token

        const networkName = networkIdToSlug(networkId || connectedNetworkId)
        if (symbol === 'XDAI' && networkName !== ChainSlug.Gnosis) {
          symbol = CanonicalToken.DAI
        }

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

  const addHopToken = useCallback(() => {
    // const tokenImageUrl = getTokenImage('HOP')
    // const tokenModel = sdk.toTokenModel('HOP')
    const networkName = networkIdToSlug(connectedNetworkId)
    if (networkName === ChainName.Ethereum) {
      return
    }
    // const addr = sdk.getL2CanonicalTokenAddress('HOP', networkName)
    if (typeof (window as any)?.ethereum !== 'undefined') {
      ;(window as any).ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: ensTokenAddress,
              symbol: 'HOP',
              decimals: 18,
              image: 'https://hop.exchange/static/media/hop-logo.5138ac11.svg',
            },
          },
        })
        .then(success => setSuccess(!!success))
        .catch(() => setSuccess(false))
    }
  }, [token, sdk, connectedNetworkId])

  return { addToken, addHopToken, addTokenToDestNetwork, success }
}
