import { providers, Signer } from 'ethers'
import { useEffect, useState } from 'react'

export function useChainProviders(sourceChain, destinationChain) {
  const [sourceProvider, _setSourceProvider] = useState<providers.JsonRpcProvider>()
  const [sourceSigner, _setSourceSigner] = useState<Signer>()
  const [destinationProvider, _setDestinationProvider] = useState<providers.JsonRpcProvider>()

  useEffect(() => {
    if (sourceChain?.provider) {
      _setSourceProvider(sourceChain.provider)

      const sourceSigner = sourceChain.provider.getSigner()
      // TODO: check connected network id
      if (sourceSigner) {
        _setSourceSigner(sourceSigner)
      }
    }
    if (destinationChain?.provider) {
      const destinationProvider = destinationChain.provider
      _setDestinationProvider(destinationProvider)
    }
  }, [sourceChain, destinationChain])

  return {
    sourceProvider,
    sourceSigner,
    destinationProvider,
  }
}
