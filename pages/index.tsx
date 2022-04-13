import { useInterval } from 'react-use'
import toHex from 'to-hex'
import Clipboard from 'clipboard'
import {ethers} from 'ethers'
import * as luxon from 'luxon'
import type {NextPage} from 'next'
import {chunk} from 'lodash'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import React, {useEffect, useState} from 'react'

function Spinner() {
  useEffect(() => {
    const duration = 600
    let element: any
    const frames = '▙▛▜▟'.split('')

    const step = function (timestamp: number) {
      const frame = Math.floor(timestamp*frames.length/duration) % frames.length
      if (!element) {
        element = window.document.getElementById('spinner')
      }
      if (element) {
        element.innerHTML = frames[frame]
      }
      return window.requestAnimationFrame(step)
    }

    window.requestAnimationFrame(step)
  }, [])

  return (
    <div id="spinner"></div>
  )
}

const poll = true
const pollInterval = 60 * 1000
const enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH', 'WBTC']
const enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism']

let queryParams: any = {}
  try {
    const query = window.location.search.substr(1)
    queryParams = query.split('&').reduce((acc: any, x: any) => {
      const split = x.split('=')
      acc[split[0]] = split[1]
      return acc
    }, {})
  } catch (err) {
  }

const currentDate = luxon.DateTime.now().toFormat('yyyy-MM-dd')

const chainToIndexMapSource: any = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapSource[enabledChains[i]] = i
}

const chainToIndexMapDestination: any = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapDestination[enabledChains[i]] = i + enabledChains.length
}

const chainIdToSlugMap: any = {
  1: 'ethereum',
  42: 'ethereum',
  10: 'optimism',
  69: 'optimism',
  77: 'gnosis',
  100: 'gnosis',
  137: 'polygon',
  42161: 'arbitrum',
  421611: 'arbitrum'
}

const chainSlugToNameMap: any = {
  ethereum: 'Ethereum',
  gnosis: 'Gnosis',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
}

const colorsMap: any = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  fallback: '#9f9fa3'
}

const chainLogosMap: any = {
  ethereum: 'https://assets.hop.exchange/logos/ethereum.svg',
  gnosis: 'https://assets.hop.exchange/logos/gnosis.svg',
  polygon: 'https://assets.hop.exchange/logos/polygon.svg',
  optimism: 'https://assets.hop.exchange/logos/optimism.svg',
  arbitrum: 'https://assets.hop.exchange/logos/arbitrum.svg'
}

const tokenLogosMap: any = {
  USDC: 'https://assets.hop.exchange/logos/usdc.svg',
  USDT: 'https://assets.hop.exchange/logos/usdt.svg',
  DAI: 'https://assets.hop.exchange/logos/dai.svg',
  MATIC: 'https://assets.hop.exchange/logos/matic.svg',
  ETH: 'https://assets.hop.exchange/logos/eth.svg'
}

const tokenDecimals :any = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18
}

function padHex(hex: string) {
  return toHex(hex, {evenLength: true, addPrefix: true})
}

function explorerLink (chain: string) {
  let base = ''
  if (chain === 'gnosis') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
  } else if (chain === 'optimism') {
    base = 'https://optimistic.etherscan.io'
  } else if (chain === 'arbitrum') {
    base = 'https://arbiscan.io'
  } else {
    base = 'https://etherscan.io'
  }

  return base
}

function explorerLinkAddress (chain: string, address: string) {
  const base = explorerLink(chain)
  return `${base}/address/${address}`
}

function explorerLinkTx (chain: string, transactionHash: string) {
  const base = explorerLink(chain)
  return `${base}/tx/${transactionHash}`
}

function getUrl (chain: string) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }

  if (chain === 'mainnet') {
    return 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
  }

  return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
}

async function queryFetch (url: string, query: string, variables?: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: variables || {}
    })
  })
  const jsonRes = await res.json()
  if (jsonRes.errors) {
    throw new Error(jsonRes.errors[0].message)
  }
  return jsonRes.data
}

async function fetchBonds (chain: string, transferIds: string[]) {
  const query = `
    query WithdrawalBondeds($transferIds: [String]) {
      withdrawalBondeds1: withdrawalBondeds(
        where: {
          transferId_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
        from
      },
      withdrawalBondeds2: withdrawalBondeds(
        where: {
          transactionHash_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc,
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
        from
      }
    }
  `

  transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
  const url = getUrl(chain)
  let bonds: any = []
  const chunkSize = 1000
  const allChunks = chunk(transferIds, chunkSize)
  for (const _transferIds of allChunks) {
    const data = await queryFetch(url, query, {
      transferIds: _transferIds
    })

    bonds = bonds.concat((data.withdrawalBondeds1 || []).concat(data.withdrawalBondeds2 || []))
  }

  return bonds
}

async function fetchWithdrews (chain: string, transferIds: string[]) {
  const query = `
    query Withdrews($transferIds: [String]) {
      withdrews(
        where: {
          transferId_in: $transferIds
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
      }
    }
  `
  transferIds = transferIds?.filter(x => x).map((x: string) => padHex(x)) ?? []
  const url = getUrl(chain)
  let withdrawals: any = []
  const chunkSize = 1000
  const allChunks = chunk(transferIds, chunkSize)
  for (const _transferIds of allChunks) {
    const data = await queryFetch(url, query, {
      transferIds: _transferIds
    })

    withdrawals = withdrawals.concat(data.withdrews)
  }

  return withdrawals
}

async function fetchTransferFromL1Completeds (chain: string, startTime: number, endTime: number, skip?: number) {
  const query = `
    query TransferFromL1Completed($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int) {
      events: transferFromL1Completeds(
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
      ) {
        recipient
        amount
        amountOutMin
        deadline
        transactionHash
        from
        timestamp
      }
    }
  `

  const url = getUrl(chain)
  if (!skip) {
    skip = 0
  }
  const data = await queryFetch(url, query, {
    perPage: 1000,
    startTime,
    endTime,
    skip
  })
  let events = data.events || []

  if (events.length === 1000) {
    try {
      events = events.concat(...(await fetchTransferFromL1Completeds(
        chain,
        startTime,
        endTime,
        skip + 1000
      )))
    } catch (err: any) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return events
}

async function fetchTvl (chain: string) {
  const query = `
    query Tvl {
      tvls(
        orderDirection: desc
      ) {
        id
        amount
        token
      }
    }
  `
  const url = getUrl(chain)
  const data = await queryFetch(url, query)
  return data.tvls
}

async function fetchVolume (chain: string) {
  const query = `
    query Volume {
      volumes(
        orderDirection: desc
      ) {
        id
        amount
        token
      }
    }
  `
  const url = getUrl(chain)
  const data = await queryFetch(url, query)
  return data.volumes
}

function formatCurrency (value: any, token: any) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD'
  })

  if (token === 'MATIC' || token === 'ETH') {
    return Number(value || 0).toFixed(5)
  }

  return `$${currencyFormatter.format(value)}`
}


function truncateAddress (address :string) {
  return truncateString(address, 4)
}

function truncateHash (hash: string) {
  return truncateString(hash, 6)
}

function truncateString (str: string, splitNum: number) {
  if (!str) return ''
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}

async function getPreRegenesisBondEvent (transferId: string, token: string) {
  const rpcUrl = 'https://mainnet-replica-4.optimism.io'
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
  const bridgeAddresses: any = {
    USDC: '0xa81D244A1814468C734E5b4101F7b9c0c577a8fC',
    USDT: '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61',
    DAI: '0x7191061D5d4C60f598214cC6913502184BAddf18',
    ETH: '0x83f6244Bd87662118d96D9a6D44f09dffF14b30E'
  }

  const bridgeAddress = bridgeAddresses[token]
  if (!bridgeAddress) {
    return
  }

  const contract = new ethers.Contract(bridgeAddress, bridgeAbi, provider)
  const logs = await contract.queryFilter(
    contract.filters.WithdrawalBonded(transferId)
  )

  return logs[0]
}

function updateQueryParams (params: any) {
    try {
      const url = new URL(window.location.href)
      if ('URLSearchParams' in window) {
        const searchParams = new URLSearchParams(url.search)
        for (const key in params) {
          const value = params[key]
          if (value) {
            searchParams.set(key, value)
          } else {
            searchParams.delete(key)
          }
        }

        url.search = searchParams.toString()
        const newUrl = url.toString()

        window.history.replaceState({}, document.title, newUrl)
      }
    } catch (err) {
      //console.log(err)
    }
}

async function getPriceHistory (coinId: string, days: number) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!json.prices) {
        console.log(json)
      }
      return json.prices.map((data: any) => {
        data[0] = Math.floor(data[0] / 1000)
        return data
      })
    })
}

function nearestDate (dates: any[], target: any) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  let nearest = Infinity
  let winner = -1

  dates.forEach(function (date: any, index: number) {
    if (date instanceof Date) {
      date = date.getTime()
    }
    const distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
  })

  return winner
}

const bridgeAbi = [{ inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }, { internalType: 'contract HopBridgeToken', name: '_hToken', type: 'address' }, { internalType: 'address', name: '_l1BridgeAddress', type: 'address' }, { internalType: 'uint256[]', name: '_activeChainIds', type: 'uint256[]' }, { internalType: 'address[]', name: 'bonders', type: 'address[]' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'newBonder', type: 'address' }], name: 'BonderAdded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousBonder', type: 'address' }], name: 'BonderRemoved', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalBondsSettled', type: 'uint256' }], name: 'MultipleWithdrawalsSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Stake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'relayer', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'TransferFromL1Completed', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'TransferRootSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'uint256', name: 'chainId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'TransferSent', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'rootCommittedAt', type: 'uint256' }], name: 'TransfersCommitted', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Unstake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }], name: 'WithdrawalBondSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'WithdrawalBonded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }], name: 'Withdrew', type: 'event' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'activeChainIds', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'addActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'addBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'ammWrapper', outputs: [{ internalType: 'contract L2_AmmWrapper', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }], name: 'bondWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'bondWithdrawalAndDistribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }], name: 'commitTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'address', name: 'relayer', type: 'address' }, { internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'distribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'getBondedWithdrawalAmount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getChainId', outputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getCredit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getDebitAndAdditionalDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'maybeBonder', type: 'address' }], name: 'getIsBonder', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getNextTransferNonce', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getRawDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'getTransferId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRoot', outputs: [{ components: [{ internalType: 'uint256', name: 'total', type: 'uint256' }, { internalType: 'uint256', name: 'amountWithdrawn', type: 'uint256' }, { internalType: 'uint256', name: 'createdAt', type: 'uint256' }], internalType: 'struct Bridge.TransferRoot', name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRootId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [], name: 'hToken', outputs: [{ internalType: 'contract HopBridgeToken', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'isTransferIdSpent', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeAddress', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeCaller', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1Governance', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'lastCommitTimeForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'maxPendingTransfers', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderBps', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderFeeAbsolute', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minimumForceCommitDelay', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingAmountForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }, { internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingTransferIdsForChainId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'removeActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'removeBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'originalAmount', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }], name: 'rescueTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'send', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract L2_AmmWrapper', name: '_ammWrapper', type: 'address' }], name: 'setAmmWrapper', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'setHopBridgeTokenOwner', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeAddress', type: 'address' }], name: 'setL1BridgeAddress', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeCaller', type: 'address' }], name: 'setL1BridgeCaller', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }], name: 'setL1Governance', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_maxPendingTransfers', type: 'uint256' }], name: 'setMaxPendingTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minBonderBps', type: 'uint256' }, { internalType: 'uint256', name: '_minBonderFeeAbsolute', type: 'uint256' }], name: 'setMinimumBonderFeeRequirements', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minimumForceCommitDelay', type: 'uint256' }], name: 'setMinimumForceCommitDelay', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'setTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'settleBondedWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32[]', name: 'transferIds', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'settleBondedWithdrawals', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'stake', outputs: [], stateMutability: 'payable', type: 'function' }, { inputs: [], name: 'transferNonceIncrementer', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'unstake', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }]

function useData () {
  const [loadingData, setLoadingData] = useState(false)
  const [minDate, setMinDate] = useState('2020-07-01')
  const [maxDate, setMaxDate] = useState(currentDate)
  const [filterDate, setFilterDate] = useState(queryParams.date || currentDate)
  const [filterBonded, setFilterBonded] = useState(queryParams.bonded || '')
  const [filterToken, setFilterToken] = useState(queryParams.token || '')
  const [filterSource, setFilterSource] = useState(queryParams.source || '')
  const [filterDestination, setFilterDestination] = useState(queryParams.destination || '')
  const [filterAmount, setFilterAmount] = useState(queryParams.amount || '')
  const [filterAmountComparator, setFilterAmountComparator] = useState(queryParams.amountCmp || 'gt')
  const [filterAmountUsd, setFilterAmountUsd] = useState(queryParams.amountUsd || '')
  const [filterAmountUsdComparator, setFilterAmountUsdComparator] = useState(queryParams.amountUsdCmp || 'gt')
  const [filterBonder, setFilterBonder] = useState(queryParams.bonder || '')
  const [filterAccount, setFilterAccount] = useState(queryParams.account || '')
  const [filterTransferId, setFilterTransferId] = useState(queryParams.transferId || '')
  const [chartAmountSize, setChartAmountSize] = useState(false)
  const [chartSelection, setChartSelection] = useState('')
  const [allTransfers, setAllTransfers] = useState<any>([])
  const [transfers, setTransfers] = useState<any>([])
  const [prices, setPrices] = useState<any>(() => {
      try {
        const cached = JSON.parse(localStorage.getItem('prices') || '')
        if (cached) {
          return cached
        }
      } catch (err) {
        //console.error(err)
      }
      return null
    })
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(() => {
      try {
        const cached = Number(localStorage.getItem('perPage'))
        if (cached) {
          return cached
        }
      } catch (err) {
        //console.error(err)
      }
    return 25
  })
  const hasPreviousPage = page > 0
  const hasNextPage = page < (allTransfers.length / perPage) - 1

  useEffect(() => {
    async function update() {
      try {
        const priceDays = 2
        const pricesArr = await Promise.all([
          getPriceHistory('usd-coin', priceDays),
          getPriceHistory('tether', priceDays),
          getPriceHistory('dai', priceDays),
          getPriceHistory('ethereum', priceDays),
          getPriceHistory('matic-network', priceDays),
          getPriceHistory('wrapped-bitcoin', priceDays)
        ])
        const prices = {
          USDC: pricesArr[0],
          USDT: pricesArr[1],
          DAI: pricesArr[2],
          ETH: pricesArr[3],
          MATIC: pricesArr[4],
          WBTC: pricesArr[5]
        }
        setPrices(prices)
        localStorage.setItem('prices', JSON.stringify({...prices, cached: true}))
      } catch (err) {
        console.error(err)
      }

      try {
        const data = JSON.parse(localStorage.getItem('data') || '')
        if (data) {
          setAllTransfers(data)
        }
      } catch (err) {
        //console.error(err)
      }

      new Clipboard('.clipboard')
    }

    update().catch(console.error)
  }, [])

  async function updateChart (data: any[]) {
    const links = data.map((x: any) => {
      return {
        source: chainToIndexMapSource[x.sourceChainSlug],
        target: chainToIndexMapDestination[x.destinationChainSlug],
        value: chartAmountSize ? x.formattedAmount : 1,
        displayAmount: x.displayAmount,
        token: x.token,
        transferId: x.transferId
      }
    })

    const nodes = []
    for (let i = 0; i < enabledChains.length; i++) {
      const chain = enabledChains[i]
      nodes.push({ node: chainToIndexMapSource[chain], name: chainSlugToNameMap[chain], id: chain })
    }
    for (let i = 0; i < enabledChains.length; i++) {
      const chain = enabledChains[i]
      nodes.push({ node: chainToIndexMapDestination[chain], name: chainSlugToNameMap[chain], id: chain })
    }

    const graph = {
      nodes,
      links
    }

    const render = () => {
      const d3 = (window as any).d3
      d3.select('#chart svg').remove()
      const chart = d3.select('#chart').append('svg').chart('Sankey.Path')
      chart
        .name(label)
        .colorNodes(function (name: string, node: any) {
          return color(node, 1) || colorsMap.fallback
        })
        .colorLinks(function (link: any) {
          return color(link.source, 4) || color(link.target, 1) || colorsMap.fallback
        })
        .nodeWidth(15)
        .nodePadding(10)
        .spread(true)
        .iterations(0)
        .draw(graph)

      chart.on('link:mouseout', function (item: any) {
        setChartSelection('')
      })
      chart.on('link:mouseover', function (item: any) {
        const value = `${item.source.name}⟶${item.target.name} ${item.displayAmount} ${item.token}`
        setChartSelection(value)
      })

      function label (node: any) {
        return node.name.replace(/\s*\(.*?\)$/, '')
      }

      function color (node: any, depth: number): any {
        const id = node.id.replace(/(_score)?(_\d+)?$/, '')
        if (colorsMap[id]) {
          return colorsMap[id]
        } else if (depth > 0 && node.targetLinks && node.targetLinks.length === 1) {
          return color(node.targetLinks[0].source, depth - 1)
        } else {
          return null
        }
      }
    }

    render()

    window.removeEventListener('resize', render)
    window.addEventListener('resize', render)
  }

  function populateTransfer (x: any, i: number) {
    x.transactionHashTruncated = truncateHash(x.transactionHash)

    const transferTime = luxon.DateTime.fromSeconds(x.timestamp)
    x.transferIdTruncated = truncateHash(x.transferId)
    x.isoTimestamp = transferTime.toISO()
    x.relativeTimestamp = transferTime.toRelative()

    x.sourceChainSlug = chainIdToSlugMap[x.sourceChain]
    x.destinationChainSlug = chainIdToSlugMap[x.destinationChain]

    x.sourceChainName = chainSlugToNameMap[x.sourceChainSlug]
    x.destinationChainName = chainSlugToNameMap[x.destinationChainSlug]

    x.sourceChainImageUrl = chainLogosMap[x.sourceChainSlug]
    x.destinationChainImageUrl = chainLogosMap[x.destinationChainSlug]

    x.sourceTxExplorerUrl = explorerLinkTx(x.sourceChainSlug, x.transactionHash)
    x.bondTxExplorerUrl = x.bondTransactionHash ? explorerLinkTx(x.destinationChainSlug, x.bondTransactionHash) : ''
    if (x.preregenesis) {
      x.bondTxExplorerUrl = `https://expedition.dev/tx/${x.bondTransactionHash}?rpcUrl=https%3A%2F%2Fmainnet-replica-4.optimism.io`
    }
    x.bonderTruncated = truncateAddress(x.bonder)
    x.bonderUrl = x.bonder ? explorerLinkAddress(x.destinationChainSlug, x.bonder) : ''
    x.bondTransactionHashTruncated = x.bondTransactionHash ? truncateHash(x.bondTransactionHash) : ''

    x.receiveStatusUnknown = x.sourceChain === 1 && !x.bondTxExplorerUrl && luxon.DateTime.now().toSeconds() > transferTime.toSeconds() + (60 * 60 * 2)
    if (x.receiveStatusUnknown) {
      x.bonded = true
    }

    if (x.bondedTimestamp) {
      const bondedTime = luxon.DateTime.fromSeconds(x.bondedTimestamp)
      x.isoBondedTimestamp = bondedTime.toISO()
      x.relativeBondedTimestamp = bondedTime.toRelative()
      const diff = bondedTime.diff(transferTime, ['days', 'hours', 'minutes']).toObject()
      let hours = Number(diff.hours!.toFixed(0))
      let minutes = Number(diff.minutes!.toFixed(0))
      if (hours < 0) {
        hours = 0
      }
      if (minutes < 1) {
        minutes = 1
      }
      if (hours || minutes) {
        x.relativeBondedWithinTimestamp = `${hours ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
      }
    }

    const decimals = tokenDecimals[x.token]
    x.formattedAmount = Number(ethers.utils.formatUnits(x.amount, decimals))
    x.displayAmount = x.formattedAmount.toFixed(4)
    x.formattedBonderFee = x.bonderFee ? Number(ethers.utils.formatUnits(x.bonderFee, decimals)) : 0
    x.displayBonderFee = x.formattedBonderFee.toFixed(4)
    x.tokenImageUrl = tokenLogosMap[x.token]

    x.amountUsd = ''
    x.displayAmountUsd = ''
    x.tokenPriceUsd = ''
    x.displayTokenPriceUsd = ''
    x.bonderFeeUsd = ''
    x.displayBonderFeeUsd = ''

    if (prices && prices[x.token]) {
      const dates = prices[x.token].reverse().map((x: any) => x[0])
      const nearest = nearestDate(dates, x.timestamp)
      if (prices[x.token][nearest]) {
        const price = prices[x.token][nearest][1]
        x.amountUsd = price * x.formattedAmount
        x.displayAmountUsd = formatCurrency(x.amountUsd, 'USD')
        x.tokenPriceUsd = price
        x.displayTokenPriceUsd = formatCurrency(x.tokenPriceUsd, 'USD')
        x.bonderFeeUsd = x.tokenPriceUsd * x.formattedBonderFee
        x.displayBonderFeeUsd = formatCurrency(x.bonderFeeUsd, 'USD')
      }
    }

    return x
  }

  async function updateData () {
    setLoadingData(true)
    try {
      const populatedData = await getTransfersData()
      setAllTransfers(populatedData)
      try {
        localStorage.setItem('data', JSON.stringify(populatedData.slice(0, 50)))
      } catch (err) {
        console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
    setLoadingData(false)
  }

  async function fetchTransfers (chain: string, startTime: number, endTime: number, skip?: number) {
    const transferId = filterTransferId ? padHex(filterTransferId) : undefined
    const account = filterAccount?.toLowerCase()
    const queryL1 = `
      query TransferSentToL2($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) {
        transferSents: transferSentToL2S(
        ${
        account
  ? `
          where: {
            from: $account
          },
          first: $perPage,
          orderBy: timestamp,
          orderDirection: desc
        `
          : (transferId
  ? `
          where: {
            transactionHash: $transferId
          },
          first: $perPage,
          orderBy: timestamp,
          orderDirection: desc
        `
        : `
          where: {
            timestamp_gte: $startTime,
            timestamp_lte: $endTime
          },
          first: $perPage,
          orderBy: timestamp,
          orderDirection: desc,
          skip: $skip
          `)}
        ) {
          id
          destinationChainId
          amount
          amountOutMin
          relayerFee
          recipient
          deadline
          transactionHash
          timestamp
          token
        }
      }
    `
    const queryL2 = `
      query TransferSents($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) {
        transferSents(
          where: {
            ${account ? 'from: $account' : (transferId ? 'transferId: $transferId' : 'timestamp_gte: $startTime, timestamp_lte: $endTime')}
          },
          first: $perPage,
          orderBy: timestamp,
          orderDirection: desc,
          skip: $skip
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
        }
        ${transferId
        ? `,transferSents2: transferSents(
          where: {
            transactionHash: $transferId
          },
          first: $perPage,
          orderBy: timestamp,
          orderDirection: desc
        ) {
          id
          transferId
          destinationChainId
          amount
          amountOutMin
          bonderFee
          recipient
          deadline
          transactionHash
          timestamp
          token
        }`
  : ''}
      }
    `
    const url = getUrl(chain)
    let query = queryL1
    if (chain !== 'mainnet') {
      query = queryL2
    }
    if (!skip) {
      skip = 0
    }
    const data = await queryFetch(url, query, {
      perPage: 1000,
      startTime,
      endTime,
      skip,
      transferId,
      account
    })

    let transfers = (data ? data.transferSents.concat(data.transferSents2) : [])
      .filter((x: any) => x)
      .map((x: any) => {
        x.destinationChainId = Number(x.destinationChainId)
        return x
      })

    if (transfers.length === 1000) {
      try {
        transfers = transfers.concat(...(await fetchTransfers(
          chain,
          startTime,
          endTime,
          skip + 1000
        )))
      } catch (err: any) {
        if (!err.message.includes('The `skip` argument must be between')) {
          throw err
        }
      }
    }

    return transfers
  }

  function refreshTransfers () {
    const start = page * perPage
    const end = start + perPage
    const paginated = allTransfers
      .filter((x: any) => {
        if (filterToken) {
          if (x.token !== filterToken) {
            return false
          }
        }

        if (filterSource) {
          if (x.sourceChainSlug !== filterSource) {
            return false
          }
        }

        if (filterDestination) {
          if (x.destinationChainSlug !== filterDestination) {
            return false
          }
        }

        if (filterBonded) {
          if (filterBonded === 'pending') {
            if (x.bonded) {
              return false
            }
          } else if (filterBonded === 'bonded') {
            if (!x.bonded) {
              return false
            }
          }
        }

        if (filterBonder) {
          if (!x.bonder) {
            return false
          }
          if (x.bonder && filterBonder.toLowerCase() !== x.bonder.toString()) {
            return false
          }
        }

        if (filterAmount && filterAmountComparator) {
          if (filterAmountComparator === 'eq') {
            if (Number(x.formattedAmount) !== Number(filterAmount)) {
              return false
            }
          } else if (filterAmountComparator === 'gt') {
            if (Number(x.formattedAmount) <= Number(filterAmount)) {
              return false
            }
          } else if (filterAmountComparator === 'lt') {
            if (Number(x.formattedAmount) >= Number(filterAmount)) {
              return false
            }
          }
        }

        if (filterAmountUsd && filterAmountUsdComparator) {
          if (filterAmountUsdComparator === 'eq') {
            if (Number(x.amountUsd) !== Number(filterAmountUsd)) {
              return false
            }
          } else if (filterAmountUsdComparator === 'gt') {
            if (Number(x.amountUsd) <= Number(filterAmountUsd)) {
              return false
            }
          } else if (filterAmountUsdComparator === 'lt') {
            if (Number(x.amountUsd) >= Number(filterAmountUsd)) {
              return false
            }
          }
        }

        return true
      })
      .slice(start, end)
      setTransfers(paginated)
  }

  async function getTransfersData () {
    let data :any[] = []
    const endDate = luxon.DateTime.fromFormat(filterDate, 'yyyy-MM-dd').endOf('day').toUTC()
    let startTime = Math.floor(endDate.minus({ days: 1 }).startOf('day').toSeconds())
    let endTime = Math.floor(endDate.toSeconds())
    const [
      gnosisTransfers,
      polygonTransfers,
      optimismTransfers,
      arbitrumTransfers,
      mainnetTransfers
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? fetchTransfers('gnosis', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('polygon') ? fetchTransfers('polygon', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('optimism') ? fetchTransfers('optimism', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? fetchTransfers('arbitrum', startTime, endTime) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? fetchTransfers('mainnet', startTime, endTime) : Promise.resolve([])
    ])

    for (const x of gnosisTransfers) {
      data.push({
        sourceChain: 100,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: x.deadline,
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token
      })
    }
    for (const x of polygonTransfers) {
      data.push({
        sourceChain: 137,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: x.deadline,
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token
      })
    }
    for (const x of optimismTransfers) {
      data.push({
        sourceChain: 10,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: x.deadline,
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token
      })
    }
    for (const x of arbitrumTransfers) {
      data.push({
        sourceChain: 42161,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        bonderFee: x.bonderFee,
        recipient: x.recipient,
        deadline: x.deadline,
        transferId: x.transferId,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token
      })
    }
    for (const x of mainnetTransfers) {
      data.push({
        sourceChain: 1,
        destinationChain: x.destinationChainId,
        amount: x.amount,
        amountOutMin: x.amountOutMin,
        recipient: x.recipient,
        bonderFee: x.relayerFee,
        deadline: x.deadline,
        transferId: x.id,
        transactionHash: x.transactionHash,
        timestamp: Number(x.timestamp),
        token: x.token
      })
    }

    data = data.sort((a, b) => b.timestamp - a.timestamp)
    startTime = data.length ? data[data.length - 1].timestamp : 0
    endTime = data.length ? data[0].timestamp : 0

    if (startTime) {
      startTime = Math.floor(luxon.DateTime.fromSeconds(startTime).minus({ days: 1 }).toSeconds())
    }

    if (endTime) {
      endTime = Math.floor(luxon.DateTime.fromSeconds(endTime).plus({ days: 1 }).toSeconds())
    }

    let transferId = filterTransferId
    if (data.length === 1) {
      if (data[0].transferId) {
        transferId = data[0].transferId
      }
    }

    const transferIds = data.map(x => x.transferId)
    const _transferId = filterAccount ? transferIds : transferId
    const filterTransferIds = transferId ? [transferId] : transferIds

    const [
      gnosisBondedWithdrawals,
      polygonBondedWithdrawals,
      optimismBondedWithdrawals,
      arbitrumBondedWithdrawals,
      mainnetBondedWithdrawals,
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? fetchBonds('gnosis', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('polygon') ? fetchBonds('polygon', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('optimism') ? fetchBonds('optimism', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? fetchBonds('arbitrum', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? fetchBonds('mainnet', filterTransferIds) : Promise.resolve([]),
    ])

    const [
      gnosisWithdrews,
      polygonWithdrews,
      optimismWithdrews,
      arbitrumWithdrews,
      mainnetWithdrews,
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? fetchWithdrews('gnosis', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('polygon') ? fetchWithdrews('polygon', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('optimism') ? fetchWithdrews('optimism', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? fetchWithdrews('arbitrum', filterTransferIds) : Promise.resolve([]),
      enabledChains.includes('ethereum') ? fetchWithdrews('mainnet', filterTransferIds) : Promise.resolve([]),
    ])

    const [
      gnosisFromL1Completeds,
      polygonFromL1Completeds,
      optimismFromL1Completeds,
      arbitrumFromL1Completeds
    ] = await Promise.all([
      enabledChains.includes('gnosis') ? fetchTransferFromL1Completeds('gnosis', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('polygon') ? fetchTransferFromL1Completeds('polygon', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('optimism') ? fetchTransferFromL1Completeds('optimism', startTime, endTime, undefined) : Promise.resolve([]),
      enabledChains.includes('arbitrum') ? fetchTransferFromL1Completeds('arbitrum', startTime, endTime, undefined) : Promise.resolve([])
    ])

    const gnosisBonds = [...gnosisBondedWithdrawals, ...gnosisWithdrews]
    const polygonBonds = [...polygonBondedWithdrawals, ...polygonWithdrews]
    const optimismBonds = [...optimismBondedWithdrawals, ...optimismWithdrews]
    const arbitrumBonds = [...arbitrumBondedWithdrawals, ...arbitrumWithdrews]
    const mainnetBonds = [...mainnetBondedWithdrawals, ...mainnetWithdrews]

    const bondsMap: any = {
      gnosis: gnosisBonds,
      polygon: polygonBonds,
      optimism: optimismBonds,
      arbitrum: arbitrumBonds,
      ethereum: mainnetBonds
    }

    const l1CompletedsMap: any = {
      gnosis: gnosisFromL1Completeds,
      polygon: polygonFromL1Completeds,
      optimism: optimismFromL1Completeds,
      arbitrum: arbitrumFromL1Completeds
    }

    for (const x of data) {
      const bonds = bondsMap[chainIdToSlugMap[x.destinationChain]]
      if (bonds) {
        for (const bond of bonds) {
          if (bond.transferId === x.transferId) {
            x.bonded = true
            x.bonder = bond.from
            x.bondTransactionHash = bond.transactionHash
            x.bondedTimestamp = Number(bond.timestamp)
            continue
          }
        }
      }
    }

    for (const x of data) {
      const sourceChain = chainIdToSlugMap[x.sourceChain]
      if (sourceChain !== 'ethereum') {
        continue
      }
      const events = l1CompletedsMap[chainIdToSlugMap[x.destinationChain]]
      if (events) {
        for (const event of events) {
          if (
            event.recipient === x.recipient &&
            event.amount === x.amount &&
            event.amountOutMin === x.amountOutMin &&
            event.deadline === x.deadline
          ) {
            x.bonded = true
            x.bonder = event.from
            x.bondTransactionHash = event.transactionHash
            x.bondedTimestamp = Number(event.timestamp)
            continue
          }
        }
      }
    }

    const unbondableTransfers = [
      '0xf78b17ccced6891638989a308cc6c1f089330cd407d8c165ed1fbedb6bda0930',
      '0x5a37e070c256e37504116e351ec3955679539d6aa3bd30073942b17afb3279f4',
      '0x185b2ba8f589119ede69cf03b74ee2b323b23c75b6b9f083bdf6123977576790',
      '0x0131496b64dbd1f7821ae9f7d78f28f9a78ff23cd85e8851b8a2e4e49688f648'
    ]

    if (data.length === 1) {
      const item = data[0]
      const regenesisTimestamp = 1636531200
      if (!item.bonded && item.timestamp < regenesisTimestamp && chainIdToSlugMap[item.destinationChain] === 'optimism') {
        try {
          const event = await getPreRegenesisBondEvent(item.transferId, item.token)
          if (event) {
            const [receipt, block] = await Promise.all([event.getTransactionReceipt(), event.getBlock()])
            item.bonded = true
            item.bonder = receipt.from
            item.bondTransactionHash = event.transactionHash
            item.bondedTimestamp = Number(block.timestamp)
            item.preregenesis = true
          }
        } catch (err) {
          console.error(err)
        }
      }
    }

    const populatedData = data
      .filter(x => enabledTokens.includes(x.token))
      .filter(x => x.destinationChain && x.transferId)
      .filter(x => {
        return !unbondableTransfers.includes(x.transferId)
      })
      .map(populateTransfer)
      .filter(x => enabledChains.includes(x.sourceChainSlug) && enabledChains.includes(x.destinationChainSlug))
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((x, i) => {
        x.index = i
        return x
      })

    return populatedData
  }

  function previousPage () {
    const _page = Math.max(page - 1, 0)
    setPage(_page)
  }

  function nextPage () {
    const _page = (Math.min(page + 1, Math.floor(allTransfers.length / perPage)))
    setPage(_page)
  }

  function updatePerPage (event: any) {
    const value = event.target.value
    const _perPage = Number(value)
    setPerPage(_perPage)
      try {
        localStorage.setItem('perPage', perPage.toString())
      } catch (err) {
        //console.error(err)
      }
  }

  function updateFilterBonded (event: any) {
    const value = event.target.value
    setFilterBonded(value)
    updateQueryParams({ bonded: value })
  }

  function updateFilterSource (event: any) {
    const value = event.target.value
    setFilterSource(value)
    updateQueryParams({ source: value })
  }

  function updateFilterDestination (event: any) {
    const value = event.target.value
    setFilterDestination(value)
    updateQueryParams({ destination: value })
  }

  function updateFilterToken (event: any) {
    const value = event.target.value
    setFilterToken(value)
    updateQueryParams({ token: value })
  }

  function updateFilterAmount (event: any) {
    const value = event.target.value
    setFilterAmount(value)
    updateQueryParams({ amount: value })
  }

  function updateFilterAmountComparator (event: any) {
    const value = event.target.value
    setFilterAmountComparator(value)
    updateQueryParams({ amountCmp: value })
  }

  function updateFilterAmountUsd (event: any) {
    const value = event.target.value
    setFilterAmountUsd(value)
    updateQueryParams({ amountUsd: value })
  }

  function updateFilterAmountUsdComparator (event: any) {
    const value = event.target.value
    setFilterAmountUsdComparator(value)
    updateQueryParams({ amountUsdCmp: value })
  }

  function updateFilterBonder (event: any) {
    const value = event.target.value
    setFilterBonder(value)
    updateQueryParams({ bonder: value })
  }

  function updateFilterAccount (event: any) {
    const value = event.target.value
    setFilterAccount(value)
    updateQueryParams({ account: value })
  }

  function updateFilterTransferId (event: any) {
    const value = event.target.value
    setFilterTransferId(value)
    updateQueryParams({ transferId: value })
  }

  function enableChartAmountSize (event: any) {
    const value = event.target.checked
    setChartAmountSize(value)
  }

  function updateChartSelection (value: string) {
    setChartSelection(value)
  }

  function updateFilterDate (event: any) {
    const value = event.target.value
    setFilterDate(value)
  }

  useEffect(() => {
    if (prices && !prices.cached) {
      updateData()
    }
  }, [prices])

  useInterval(() => {
    if (poll) {
      updateData()
    }
  }, pollInterval)

  useEffect(() => {
    updateChart(transfers)
  }, [transfers, chartAmountSize])

  useEffect(() => {
    refreshTransfers()
  }, [page, perPage, allTransfers])

  useEffect(() => {
    if (page === 0) {
      refreshTransfers()
    } else {
      resetPage()
    }
  }, [filterBonded, filterSource, filterDestination, filterToken, filterAmount, filterAmountComparator, filterAmountUsd, filterAmountUsdComparator, filterBonder])

  useEffect(() => {
    updateData()
  }, [filterAccount, filterTransferId, filterDate])

  function resetPage () {
    setPage(0)
  }

  function resetFilters(event: any) {
    event.preventDefault()
    setFilterDate(currentDate)
    setFilterBonded('')
    setFilterToken('')
    setFilterSource('')
    setFilterDestination('')
    setFilterAmount('')
    setFilterAmountComparator('gt')
    setFilterAmountUsd('')
    setFilterAmountUsdComparator('gt')
    setFilterBonder('')
    setFilterAccount('')
    setFilterTransferId('')
    setChartAmountSize(false)
    updateQueryParams({
      bonded: null,
      source: null,
      destination: null,
      token: null,
      amount: null,
      amountCmp: null,
      amountUsd: null,
      amountUsdCmp: null,
      bonder: null,
      account: null,
      transferId: null
    })
  }

  return {
    filterDate,
    minDate,
    maxDate,
    enableChartAmountSize,
    chartAmountSize,
    chartSelection,
    filterSource,
    updateFilterSource,
    filterDestination,
    updateFilterDestination,
    updateFilterDate,
    filterToken,
    updateFilterToken,
    filterBonded,
    updateFilterBonded,
    filterBonder,
    updateFilterBonder,
    filterAmountComparator,
    updateFilterAmountComparator,
    filterAmount,
    updateFilterAmount,
    filterAmountUsdComparator,
    updateFilterAmountUsdComparator,
    filterAmountUsd,
    updateFilterAmountUsd,
    filterAccount,
    updateFilterAccount,
    filterTransferId,
    updateFilterTransferId,
    transfers,
    page,
    perPage,
    updatePerPage,
    previousPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    loadingData,
    resetFilters
  }
}

const Index: NextPage = () => {
  const {
    filterDate,
    minDate,
    maxDate,
    enableChartAmountSize,
    chartAmountSize,
    chartSelection,
    filterSource,
    updateFilterSource,
    filterDestination,
    updateFilterDestination,
    updateFilterDate,
    filterToken,
    updateFilterToken,
    filterBonded,
    updateFilterBonded,
    filterBonder,
    updateFilterBonder,
    filterAmountComparator,
    updateFilterAmountComparator,
    filterAmount,
    updateFilterAmount,
    filterAmountUsdComparator,
    updateFilterAmountUsdComparator,
    filterAmountUsd,
    updateFilterAmountUsd,
    filterAccount,
    updateFilterAccount,
    filterTransferId,
    updateFilterTransferId,
    transfers,
    page,
    perPage,
    updatePerPage,
    previousPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    loadingData,
    resetFilters
  } = useData()

  return (
    <>
      <Script strategy="beforeInteractive" src="/lib/d3.v3.min.js" />
      <Script strategy="beforeInteractive" src="/lib/d3.chart.min.js" />
      <Script strategy="beforeInteractive" src="/lib/sankey.patched.js" />
      <Script strategy="beforeInteractive" src="/static.js" />
      <Head>
        <title>Hop Explorer</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="content-language" content="en-us" />
        <meta name="description" content="Hop Explorer" />
        <meta name="keywords" content="hop, hop exchange, hop explorer, hop transfers, hop transactions, hop visualizations" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Hop" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="banner">
        <div>
          ⚠️ The <a href="https://thegraph.com/legacy-explorer/subgraph/hop-protocol/hop-polygon?ve
    rsion=pending" target="_blank" rel="noreferrer noopener">subgraphs</a> are currently experiencing some issues so the table
    might not reflect the latest state.
        </div>
      </div>
      <div id="app">
        <div className="chartView">
          <details open>
            <summary>Chart ▾</summary>
            <header className="header">
              <h1 className="rainbow rainbow-animated">Hop transfers</h1>
            </header>
            <div className="chartHeader">
              <label>Source</label>
              <label className="arrow rainbow rainbow-animated animation-delay">⟶</label>
              <label>Destination</label>
            </div>
            <div className="chartContainer">
              <div id="chart"></div>
            </div>
            <label htmlFor="amountSizeCheckbox">
              <input type="checkbox" id="amountSizeCheckbox" value={chartAmountSize.toString()} onChange={enableChartAmountSize} />
              Amount size
            </label>
            <div id="chartSelection">{ chartSelection }</div>
          </details>
        </div>
        <details open>
        <summary>
          <span>Transfers ▾</span>
          {loadingData && (
            <span className="loadingData">
              <Spinner /> Loading...
            </span>
          )}
        </summary>
          <div className="tableHeader">
            <div className="filters">
              <div>
                <label>Per page:</label>
                <select className="perPageSelection select" value={perPage} onChange={updatePerPage}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div>
                <label>Source:</label>
                <select className="select" value={filterSource} onChange={updateFilterSource}>
                  <option value="">All</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="gnosis">Gnosis</option>
                  <option value="optimism">Optimism</option>
                  <option value="arbitrum">Arbitrum</option>
                </select>
              </div>
              <div>
                <label>Destination:</label>
                <select className="select" value={filterDestination} onChange={updateFilterDestination}>
                  <option value="">All</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="gnosis">Gnosis</option>
                  <option value="optimism">Optimism</option>
                  <option value="arbitrum">Arbitrum</option>
                </select>
              </div>
              <div>
                <label>Token:</label>
                <select className="select" value={filterToken} onChange={updateFilterToken}>
                  <option value="">All</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                  <option value="MATIC">MATIC</option>
                  <option value="ETH">ETH</option>
                  <option value="DAI">DAI</option>
                  <option value="WBTC">WBTC</option>
                </select>
              </div>
              <div>
                <label>Bonded:</label>
                <select className="select" value={filterBonded} onChange={updateFilterBonded}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="bonded">Bonded</option>
                </select>
              </div>
              <div>
                <label>Amount:</label>
                <select className="select selectSmall" value={filterAmountComparator} onChange={updateFilterAmountComparator}>
                  <option value="eq">=</option>
                  <option value="gt">&gt;</option>
                  <option value="lt">&lt;</option>
                </select>
                <input className="filterAmount" value={filterAmount} onChange={updateFilterAmount} placeholder="amount" />
              </div>
              <div>
                <label>Amount USD:</label>
                <select className="select selectSmall" value={filterAmountUsdComparator} onChange={updateFilterAmountUsdComparator}>
                  <option value="eq">=</option>
                  <option value="gt">&gt;</option>
                  <option value="lt">&lt;</option>
                </select>
                <input className="filterAmountUsd" value={filterAmountUsd} onChange={updateFilterAmountUsd} placeholder="amount USD" />
              </div>
              <div>
                <label>Bonder:</label>
                <input className="filterBonder" value={filterBonder} onChange={updateFilterBonder} placeholder="bonder" />
              </div>
              <div>
                <label>Transfer ID:</label>
                <input className="filterTransferId" value={filterTransferId} onChange={updateFilterTransferId} placeholder="transfer ID or tx hash" />
              </div>
              <div>
                <label>Account:</label>
                <input className="filterAccount" value={filterAccount} onChange={updateFilterAccount} placeholder="Account address" />
              </div>
              <div>
                <label>Date:</label>
                <input type="date" id="date" name="date"
                value={filterDate}
                min={minDate}
                max={maxDate}
                onChange={updateFilterDate}
                 />
              </div>
              <div>
                <button onClick={resetFilters}>Reset</button>
              </div>
            </div>
            <div className="pagination">
            {hasPreviousPage && (
              <button onClick={previousPage} className="paginationButton">previous page</button>
            )}
            {hasNextPage && (
              <button onClick={nextPage} className="paginationButton">next page</button>
            )}
            </div>
          </div>
        </details>
        <div id="transfers">
          <table>
            <thead>
              <tr>
                <th></th><th>Date</th><th>Source</th><th>Destination</th><th>Transfer ID</th><th>Transfer Tx</th><th>Token</th><th>Amount</th><th>Amount USD</th><th>Bonder Fee</th><th>Bonder Fee USD</th><th>Bonded</th><th>Bonded Tx</th><th>Bonded Date</th><th>Bonded Within</th><th>Bonder</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((x: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className="index">{ ((page * perPage) + index + 1) }</td>
                    <td className="timestamp" title={x.isoTimestamp}>{ x.relativeTimestamp }</td>
                    <td className={x.sourceChainSlug}>
                      <Image width="16" height="16" src={x.sourceChainImageUrl} alt={x.sourceChainName} />
                      { x.sourceChainName }
                      <span className="small-arrow">⟶</span>
                    </td>
                    <td className={x.destinationChainSlug}>
                      <Image width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                      { x.destinationChainName }
                    </td>
                    <td className="transferId">
                      <a className="clipboard" data-clipboard-text={x.transferId} rel="noreferrer noopener" title="Copy transfer ID to clipboard" onClick={(event: any) => { event.target.innerText='✅';setTimeout(()=>event.target.innerText='📋',1000)}}>📋</a>
                      <a className={x.sourceChainSlug} href={x.sourceTxExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transferId}`}>
                        { x.transferIdTruncated }
                      </a>
                    </td>
                    <td className="transferTx">
                      <a className="clipboard" data-clipboard-text={x.transactionHash} rel="noreferrer noopener" title="Copy transaction hash to clipboard" onClick={(event: any) => { event.target.innerText='✅';setTimeout(()=>event.target.innerText='📋',1000)}}>📋</a>
                      <a className={x.sourceChainSlug} href={x.sourceTxExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transactionHash}`}>
                        { x.transactionHashTruncated }
                      </a>
                    </td>
                    <td className="token">
                      <Image width="16" height="16" src={x.tokenImageUrl} alt={x.token} />
                      { x.token }
                    </td>
                    <td className="amount number" title={x.amount}>{ x.displayAmount }</td>
                    <td className="amount number" title={`${x.displayAmountUsd} @ ${x.displayTokenPriceUsd}`}>{ x.displayAmountUsd }</td>
                    <td className="bonderFee number" title={x.bonderFee}>
                      {x.sourceChain !== 1 && (
                        <span>
                          { x.displayBonderFee }
                        </span>
                      )}
                      {x.sourceChain === 1 && (
                        <span className="na">
                          <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                        </span>
                      )}
                    </td>
                    <td className="bonderFee number" title={`${x.displayBonderFeeUsd} @ ${x.displayTokenPriceUsd}`}>
                      {x.sourceChain !== 1 && (
                        <span>
                          { x.displayBonderFeeUsd }
                        </span>
                      )}
                      {x.sourceChain === 1 && (
                        <span className="na">
                          <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                        </span>
                      )}
                    </td>
                    <td className="bonded">
                      {!!x.bondTxExplorerUrl && (
                      <a className={`${x.bonded ? 'yes' : 'no'}`} href={x.bondTxExplorerUrl} target="_blank" rel="noreferrer noopener" title="View on block explorer">
                        <Image width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                        {x.sourceChain !== 1 && (
                          <span>
                            Bonded
                          </span>
                        )}
                        {x.sourceChain === 1 && (
                          <span>
                            Received
                          </span>
                        )}
                      </a>
                      )}
                      {(!x.receiveStatusUnknown && !x.bondTxExplorerUrl) && (
                        <span className="no">
                          <Image width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="bondTx">
                      {x.preregenesis && (
                        <span title="This transaction occurred before the Optimism Regenesis">
                          (pre-regenesis)
                        </span>
                      )}
                      {x.bondTransactionHash && (
                        <span>
                          <a className="clipboard" data-clipboard-text={x.bondTransactionHash} title="Copy transaction hash to clipboard" onClick={(event: any) => { event.target.innerText='✅';setTimeout(()=>event.target.innerText='📋',1000)}}>📋</a>
                          <a className={x.destinationChainSlug} href={x.bondTxExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bondTransactionHash}`}>
                            { x.bondTransactionHashTruncated }
                          </a>
                        </span>
                      )}
                    </td>
                    <td className="bondedDate" title={x.isoBondedTimestamp}>
                      { x.relativeBondedTimestamp }
                    </td>
                    <td className="bondedWithin" title={x.isoBondedTimestamp}>
                      { x.relativeBondedWithinTimestamp }
                    </td>
                    <td className="bondedWithin" title={x.bonder}>
                      {x.bonderUrl && (
                        <a className="bonder" href={x.bonderUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bonder}`}>
                          { x.bonderTruncated }
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="tableFooter">
          <div>
            <select className="perPageSelection" value={perPage} onChange={updatePerPage}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="pagination">
            {hasPreviousPage && (
              <button onClick={previousPage} className="paginationButton">previous page</button>
            )}
            {hasNextPage && (
              <button onClick={nextPage} className="paginationButton">next page</button>
            )}
          </div>
        </div>
      </div>
  </>
  )
}

export default Index
