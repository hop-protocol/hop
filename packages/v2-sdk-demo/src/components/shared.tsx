import { useApp } from '../hooks/useApp.js'

export function useShared() {
  const { network, chainIds, defaultChainIds } = useApp()

  const hopInstantiateDisplayString = `
    const hop = new Hop({
        chainProviders: Hop.getDefaultChainRpcProviders('${network}')
    })
  `.trim()

  return {
    hopInstantiateDisplayString,
    chainIds,
    defaultChainIds
  }
}
