import { network } from '../config'

export const hopInstantiateDisplayString = `
  const hop = new Hop({
      chainProviders: Hop.getDefaultChainRpcProviders('${network}')
  })
`.trim()
