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
const pollInterval = 10 * 1000
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
  const hasNextPage = true // page < (allTransfers.length / perPage) - 1

  useEffect(() => {
    async function update() {
      try {
        //const data = JSON.parse(localStorage.getItem('data') || '')
        //if (data) {
          //setAllTransfers(data)
        //}
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
        amountDisplay: x.amountDisplay,
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
        const value = `${item.source.name}⟶${item.target.name} ${item.amountDisplay} ${item.token}`
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

  async function updateData () {
    setLoadingData(true)
    try {
      const populatedData = await getTransfersData()
      setAllTransfers(populatedData)
      setTransfers(populatedData)
      try {
        //localStorage.setItem('data', JSON.stringify(populatedData.slice(0, 50)))
      } catch (err) {
        //console.error(err)
      }
    } catch (err) {
      console.error(err)
    }
    setLoadingData(false)
  }

  function refreshTransfers () {
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
          if (!x.bonderAddress) {
            return false
          }
          if (x.bonderAddress && filterBonder.toLowerCase() !== x.bonderAddress.toString()) {
            return false
          }
        }

        if (filterAmount && filterAmountComparator) {
          if (filterAmountComparator === 'eq') {
            if (x.amountFormatted !== Number(filterAmount)) {
              return false
            }
          } else if (filterAmountComparator === 'gt') {
            if (x.amountFormatted <= Number(filterAmount)) {
              return false
            }
          } else if (filterAmountComparator === 'lt') {
            if (x.amountFormatted >= Number(filterAmount)) {
              return false
            }
          }
        }

        if (filterAmountUsd && filterAmountUsdComparator) {
          if (filterAmountUsdComparator === 'eq') {
            if (x.amountUsd !== Number(filterAmountUsd)) {
              return false
            }
          } else if (filterAmountUsdComparator === 'gt') {
            if (x.amountUsd <= Number(filterAmountUsd)) {
              return false
            }
          } else if (filterAmountUsdComparator === 'lt') {
            if (x.amountUsd >= Number(filterAmountUsd)) {
              return false
            }
          }
        }

        return true
      })
      setTransfers(paginated)
  }

  async function getTransfersData () {
    const apiBaseUrl = 'http://localhost:8000'
    const params: any = {
      page,
      perPage
    }
    const serializedParams = new URLSearchParams(params).toString()
    const url = `${apiBaseUrl}/transfers?${serializedParams}`
    console.log(url)
    const res = await fetch(url)
    const json = await res.json()
    const data = json.data
    return data
  }

  function previousPage () {
    const _page = Math.max(page - 1, 0)
    setPage(_page)
  }

  function nextPage () {
    //const _page = (Math.min(page + 1, Math.floor(allTransfers.length / perPage)))
    //setPage(_page)
    setPage(page + 1)
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

  useInterval(() => {
    if (poll) {
      updateData()
    }
  }, pollInterval)

  useEffect(() => {
    updateChart(transfers)
  }, [transfers, chartAmountSize])

  useEffect(() => {
    //refreshTransfers()
    updateData()
  }, [page, perPage])

  useEffect(() => {
    if (page === 0) {
      //refreshTransfers()
      updateData()
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
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="10000">10000</option>
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
                    <td className="timestamp" title={x.timestampIso}>{ x.timestampRelative }</td>
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
                      <a className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transferId}`}>
                        { x.transferIdTruncated }
                      </a>
                    </td>
                    <td className="transferTx">
                      <a className="clipboard" data-clipboard-text={x.transactionHash} rel="noreferrer noopener" title="Copy transaction hash to clipboard" onClick={(event: any) => { event.target.innerText='✅';setTimeout(()=>event.target.innerText='📋',1000)}}>📋</a>
                      <a className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transactionHash}`}>
                        { x.transactionHashTruncated }
                      </a>
                    </td>
                    <td className="token">
                      <Image width="16" height="16" src={x.tokenImageUrl} alt={x.token} />
                      { x.token }
                    </td>
                    <td className="amount number" title={x.amount}>{ x.amountDisplay }</td>
                    <td className="amount number" title={`${x.amountUsdDisplay} @ ${x.tokenPriceUsdDisplay}`}>{ x.amountUsdDisplay }</td>
                    <td className="bonderFee number" title={x.bonderFee}>
                      {x.sourceChainId !== 1 && (
                        <span>
                          { x.bonderFeeDisplay }
                        </span>
                      )}
                      {x.sourceChainId === 1 && (
                        <span className="na">
                          <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                        </span>
                      )}
                    </td>
                    <td className="bonderFee number" title={`${x.bonderFeeUsdDisplay} @ ${x.tokenPriceUsdDisplay}`}>
                      {x.sourceChainId !== 1 && (
                        <span>
                          { x.bonderFeeUsdDisplay }
                        </span>
                      )}
                      {x.sourceChainId === 1 && (
                        <span className="na">
                          <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                        </span>
                      )}
                    </td>
                    <td className="bonded">
                      {!!x.bondTransactionHashExplorerUrl && (
                      <a className={`${x.bonded ? 'yes' : 'no'}`} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title="View on block explorer">
                        <Image width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                        {x.sourceChainId !== 1 && (
                          <span>
                            Bonded
                          </span>
                        )}
                        {x.sourceChainId === 1 && (
                          <span>
                            Received
                          </span>
                        )}
                      </a>
                      )}
                      {(!x.receiveStatusUnknown && !x.bondTransactionHashExplorerUrl) && (
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
                          <a className={x.destinationChainSlug} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bondTransactionHash}`}>
                            { x.bondTransactionHashTruncated }
                          </a>
                        </span>
                      )}
                    </td>
                    <td className="bondedDate" title={x.bondTimestampIso}>
                      { x.bondTimestampRelative }
                    </td>
                    <td className="bondedWithin" title={x.bondTimestampIso}>
                      { x.bondWithinTimestampRelative }
                    </td>
                    <td className="bondedWithin" title={x.bonderAddress}>
                      {x.bonderAddressExplorerUrl && (
                        <a className="bonder" href={x.bonderAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bonderAddress}`}>
                          { x.bonderAddressTruncated }
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
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="10000">10000</option>
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
