import fetch from 'node-fetch'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { Chain } from 'src/constants'

export default async function makeRequest (
  chain: string,
  query: string,
  params: any = {},
  isGoerli: boolean = false
) {
  return await rateLimitRetry(_makeRequest)(chain, query, params, isGoerli)
}

async function _makeRequest (
  chain: string,
  query: string,
  params: any = {},
  isGoerli: boolean = false
) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }

  let url
  if (chain === Chain.Nova) {
    url = 'https://nova.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop'
  } else {
    url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  }
  if (chain === Chain.Ethereum) {
    if (isGoerli) {
      url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop-goerli'
    } else {
      // In order to use the decentralized service, please ensure the decentralized subgraph is pushed and published. This
      // is a different process than the centralized subgraph.
      url = `${url}-mainnet`
      // url = 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
    }
  } else {
    url = `${url}-${chain}`
  }

  if (chain === 'linea') {
    // TODO: read from config
    const isGoerli = true
    if (isGoerli) {
      url = 'https://linea-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-linea-goerli'
    } else {
      throw new Error(`chain "${chain}" is not supported on mainnet subgraphs`)
    }
  }

  if (chain === 'base') {
    // TODO: read from config
    const isGoerli = true
    if (isGoerli) {
      url = 'https://base-goerli.subgraph.hop.exchange/subgraphs/name/hop-protocol/hop-base-goerli'
    } else {
      throw new Error(`chain "${chain}" is not supported on mainnet subgraphs`)
    }
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: params
    })
  })
  const jsonRes = await res.json()
  if (Array.isArray(jsonRes.errors) && jsonRes.errors.length) {
    console.error('query:', query)
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}
