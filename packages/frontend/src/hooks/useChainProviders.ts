import { providers, Signer } from 'ethers'
import { useEffect, useState } from 'react'
import Chain from 'src/models/Chain'

export function useChainProviders(sourceChain?: Chain, destinationChain?: Chain) {
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
  }, [sourceChain])

  useEffect(() => {
    if (destinationChain?.provider) {
      _setDestinationProvider(destinationChain.provider)
    }
  }, [destinationChain])

  return {
    sourceProvider,
    sourceSigner,
    destinationProvider,
  }
}
