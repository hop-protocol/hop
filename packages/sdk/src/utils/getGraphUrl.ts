export function getGraphUrl (network: string, chain: string) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }
  if (chain === 'ethereum') {
    chain = 'mainnet'
  }

  if (network === 'goerli') {
    if (chain === 'mainnet') {
      chain = 'goerli'
    }
    if (chain === 'polygon') {
      chain = 'mumbai'
    }
    if (chain === 'optimism') {
      chain = 'optimism-goerli'
    }
    if (chain === 'nova') {
      throw new Error(`chain "${chain}" is not supported on goerli subgraphs`)
    }
    if (chain === 'arbitrum') {
      return 'https://arbitrum-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-arbitrum-goerli'
    }
    if (chain === 'xdai') {
      throw new Error(`chain "${chain}" is not supported on goerli subgraphs`)
    }
    if (chain === 'zksync') {
      throw new Error(`chain "${chain}" is not supported on goerli subgraphs`)
    }
    if (chain === 'linea') {
      return 'https://linea-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea-goerli'
    }
    if (chain === 'scrollzk') {
      throw new Error(`chain "${chain}" is not supported on goerli subgraphs`)
    }
    if (chain === 'base') {
      throw new Error(`chain "${chain}" is not supported on goerli subgraphs`)
    }

    return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
  }

  if (chain === 'mainnet') {
    // In order to use the decentralized service, please ensure the decentralized subgraph is pushed and published. This
    // is a different process than the centralized subgraph.
    return 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet'
    // TODO: Reintroduce this
    // return 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
  } else if (chain === 'nova') {
    return `https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-${chain}`
  } else {
    return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
  }
}
