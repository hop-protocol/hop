import fetch from 'node-fetch'
import rateLimitRetry from 'src/utils/rateLimitRetry'
import { Chain } from 'src/constants'

export default async function makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  return await rateLimitRetry(_makeRequest)(chain, query, params)
}

async function _makeRequest (
  chain: string,
  query: string,
  params: any = {}
) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }
  let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  if (chain === Chain.Ethereum) {
    // url = `${url}-mainnet`
    url = 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
  } else {
    url = `${url}-${chain}`
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
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}
