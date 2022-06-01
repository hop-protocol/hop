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
import React, {useEffect, useState, useCallback} from 'react'

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
const pollInterval = 15 * 1000
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
const yesterdayDate = luxon.DateTime.now().minus({ days: 1 }).toFormat('yyyy-MM-dd')
const defaultSortBy = 'timestamp'
const defaultSortDirection = 'desc'

const chainToIndexMapSource: any = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapSource[enabledChains[i]] = i
}

const chainToIndexMapDestination: any = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapDestination[enabledChains[i]] = i + enabledChains.length
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

const queryTransfers = async (params: any) => {
  // const apiBaseUrl = 'http://localhost:8000'
  const apiBaseUrl = 'https://explorer-api.hop.exchange'
  let filtered: any = {}
  for (const key in params) {
    if (params[key]) {
      filtered[key] = params[key]
    }
  }
  if (!filtered['amount']) {
    delete filtered['amountCmp']
  }
  if (!filtered['amountUsd']) {
    delete filtered['amountUsdCmp']
  }
  if (filtered['endDate'] === currentDate) {
    delete filtered['endDate']
  }
  if (filtered['sortBy'] === defaultSortBy) {
    delete filtered['sortBy']
  }
  if (filtered['sortDirection'] === defaultSortDirection) {
    delete filtered['sortDirection']
  }
  const serializedParams = new URLSearchParams(filtered).toString()
  const url = `${apiBaseUrl}/v1/transfers?${serializedParams}`
  const res = await fetch(url)
  const json = await res.json()
  const data = json.data
  return data
}

function useData () {
  const [loadingData, setLoadingData] = useState(false)
  const [minDate] = useState('2020-07-01')
  const [maxDate] = useState(currentDate)
  const [filterStartDate, setFilterStartDate] = useState(queryParams.startDate || yesterdayDate)
  const [filterEndDate, setFilterEndDate] = useState(queryParams.endDate || queryParams.date || currentDate)
  const [filterSortBy, setFilterSortBy] = useState(queryParams.sortBy || defaultSortBy)
  const [filterSortDirection, setFilterSortDirection] = useState(queryParams.sortDirection || defaultSortDirection)
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
  const [transfers, setTransfers] = useState<any>([])
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [unsyncedSubgraphUrl, setUnsyncedSubgraphUrl] = useState<string>('')
  const [page, setPage] = useState(Number(queryParams.page || 0))
  const [perPage, setPerPage] = useState(() => {
      try {
        if (queryParams.perPage) {
          return queryParams.perPage
        }
        const cached = Number(localStorage.getItem('perPage'))
        if (cached) {
          return cached
        }
      } catch (err) {
        //console.error(err)
      }
    return 25
  })

  const hasFirstPage = page > 0
  const hasPreviousPage = page > 0
  const hasNextPage = true // page < (allTransfers.length / perPage) - 1

  useEffect(() => {
    async function update() {
      try {
        //const data = JSON.parse(localStorage.getItem('data') || '')
        //if (data) {
          //setTransfers(data)
        //}
      } catch (err) {
        //console.error(err)
      }

      new Clipboard('.clipboard')
    }

    update().catch(console.error)
  }, [])


  useEffect(() => {
    const update = async () => {
      const url = 'https://assets.hop.exchange/mainnet/v1-health-check.json'
      const res = await fetch(url)
      const json = await res.json()
      if (json.data.unsyncedSubgraphs?.length > 0) {
        let chain = json.data.unsyncedSubgraphs[0].chain
        if (chain === 'gnosis') {
          chain = 'xdai'
        }
        if (chain === 'ethereum') {
          chain = 'mainnet'
        }
        const subgraphUrl = `https://thegraph.com/legacy-explorer/subgraph/hop-protocol/hop-${chain}?version=pending`
        setUnsyncedSubgraphUrl(subgraphUrl)
        setShowBanner(true)
      }
    }
    update().catch(console.error)
  }, [])

  async function updateChart (data: any[]) {
    const links = data.map((x: any) => {
      return {
        source: chainToIndexMapSource[x.sourceChainSlug],
        target: chainToIndexMapDestination[x.destinationChainSlug],
        value: chartAmountSize ? x.amountFormatted : 1,
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

  async function refreshTransfers () {
    setLoadingData(true)
    try {
      const populatedData = await queryTransfers({
        page,
        perPage,
        startDate: filterStartDate,
        endDate: filterEndDate,
        sortBy: filterSortBy,
        sortDirection: filterSortDirection,
        bonded: filterBonded,
        token: filterToken,
        source: filterSource,
        destination: filterDestination,
        amount: filterAmount,
        amountCmp: filterAmountComparator,
        amountUsd: filterAmountUsd,
        amountUsdCmp: filterAmountUsdComparator,
        bonder: filterBonder,
        account: filterAccount,
        transferId: filterTransferId,
      })
      if (Array.isArray(populatedData)) {
        setTransfers(populatedData)
      }
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

  function previousPage () {
    const _page = Math.max(page - 1, 0)
    setPage(_page)
    updateQueryParams({ page: _page })
  }

  function firstPage () {
    setPage(0)
    updateQueryParams({ page: 0 })
  }

  function nextPage () {
    //const _page = (Math.min(page + 1, Math.floor(allTransfers.length / perPage)))
    //setPage(_page)
    const _page = page + 1
    setPage(_page)
    updateQueryParams({ page: _page })
  }

  function updatePerPage (event: any) {
    const value = event.target.value
    const _perPage = Number(value)
    setPerPage(_perPage)
      try {
        localStorage.setItem('perPage', _perPage.toString())
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

  function updateFilterStartDate (event: any) {
    const value = event.target.value
    setFilterStartDate(value)
    updateQueryParams({ startDate: value })
  }

  function updateFilterEndDate (event: any) {
    const value = event.target.value
    setFilterEndDate(value)
    updateQueryParams({ endDate: value })
  }

  function updateFilterSortBy (event: any) {
    const value = event.target.value
    setFilterSortBy(value)
    updateQueryParams({ sortBy: value })
  }

  function updateFilterSortDirection (event: any) {
    const value = event.target.value
    setFilterSortDirection(value)
    updateQueryParams({ sortDirection: value })
  }

  useInterval(() => {
    if (poll) {
      refreshTransfers()
    }
  }, pollInterval)

  useEffect(() => {
    updateChart(transfers)
  }, [transfers, chartAmountSize])

  useEffect(() => {
    refreshTransfers()
  }, [filterBonded, filterSource, filterDestination, filterToken, filterAmount, filterAmountComparator, filterAmountUsd, filterAmountUsdComparator, filterBonder, filterAccount, filterTransferId, filterStartDate, filterEndDate, filterSortBy, filterSortDirection, page, perPage])

  function resetPage () {
    setPage(0)
  }

  function resetFilters(event: any) {
    event.preventDefault()
    setFilterStartDate(yesterdayDate)
    setFilterEndDate(currentDate)
    setFilterSortBy('')
    setFilterSortDirection('')
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
    setPage(0)
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
      transferId: null,
      startDate: null,
      endDate: null,
      page: null,
      sortBy: null,
      sortDirection: null
    })
  }

  function handleRefreshClick(event: any) {
    event.preventDefault()
    refreshTransfers()
  }

  return {
    filterStartDate,
    filterEndDate,
    filterSortBy,
    filterSortDirection,
    minDate,
    maxDate,
    enableChartAmountSize,
    chartAmountSize,
    chartSelection,
    filterSource,
    updateFilterSource,
    filterDestination,
    updateFilterDestination,
    updateFilterStartDate,
    updateFilterEndDate,
    updateFilterSortBy,
    updateFilterSortDirection,
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
    firstPage,
    previousPage,
    hasFirstPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    loadingData,
    resetFilters,
    handleRefreshClick,
    showBanner,
    unsyncedSubgraphUrl
  }
}

const Index: NextPage = () => {
  const {
    filterStartDate,
    filterEndDate,
    filterSortBy,
    filterSortDirection,
    minDate,
    maxDate,
    enableChartAmountSize,
    chartAmountSize,
    chartSelection,
    filterSource,
    updateFilterSource,
    filterDestination,
    updateFilterDestination,
    updateFilterStartDate,
    updateFilterEndDate,
    updateFilterSortBy,
    updateFilterSortDirection,
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
    firstPage,
    previousPage,
    hasFirstPage,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    loadingData,
    resetFilters,
    handleRefreshClick,
    showBanner,
    unsyncedSubgraphUrl
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
      {showBanner && (
        <div id="banner">
          <div>
            ⚠️ The <a href={unsyncedSubgraphUrl} target="_blank" rel="noreferrer noopener">subgraph</a> is currently experiencing some issues so the table might not reflect the latest state.
          </div>
        </div>
      )}
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
          <button onClick={handleRefreshClick} className="refreshButton">Refresh</button>
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
                <label>Start Date:</label>
                <input type="date" id="date" name="date"
                value={filterStartDate}
                min={minDate}
                max={maxDate}
                onChange={updateFilterStartDate}
                 />
              </div>
              <div>
                <label>End Date:</label>
                <input type="date" id="date" name="date"
                value={filterEndDate}
                min={minDate}
                max={maxDate}
                onChange={updateFilterEndDate}
                 />
              </div>
              <div>
                <label>Sort By:</label>
                <select className="select" value={filterSortBy} onChange={updateFilterSortBy}>
                  <option value="timestamp">Timestamp</option>
                  <option value="source">Source</option>
                  <option value="destination">Destination</option>
                  <option value="token">Token</option>
                  <option value="bonded">Bonded</option>
                  <option value="amount">Amount</option>
                  <option value="amountUsd">Amount USD</option>
                  <option value="bonderFee">Bonder Fee</option>
                  <option value="bonderFeeUsd">BonderFee USD</option>
                  <option value="bonder">Bonder</option>
                  <option value="transferId">Transfer ID</option>
                  <option value="account">Account</option>
                  <option value="recipient">Recipient</option>
                  <option value="bondTimestamp">Bonded Timestamp</option>
                  <option value="bondWithinTimestamp">Bonded Within Timestamp</option>
                </select>
              </div>
              <div>
                <label>Sort Order:</label>
                <select className="select" value={filterSortDirection} onChange={updateFilterSortDirection}>
                  <option value="desc">↓ Descending</option>
                  <option value="asc">↑ Ascending</option>
                </select>
              </div>
              <div>
                <button onClick={resetFilters}>Reset</button>
              </div>
            </div>
          </div>
          <div className="pagination">
            {hasFirstPage && (
              <button onClick={firstPage} className="paginationButton">first page</button>
            )}
            {hasPreviousPage && (
              <button onClick={previousPage} className="paginationButton">previous page</button>
            )}
            {hasNextPage && (
              <button onClick={nextPage} className="paginationButton">next page</button>
            )}
          </div>
          <div id="transfers">
            <table>
              <thead>
                <tr>
                  <th></th><th>Date</th><th>Source</th><th>Destination</th><th>Transfer ID</th><th>Transfer Tx</th><th>Token</th><th>Amount</th><th>Amount USD</th><th>Bonder Fee</th><th>Bonder Fee USD</th><th>Bonded</th><th>Bonded Tx</th><th>Bonded Date</th><th>Bonded Within</th><th>Bonder</th><th>Account</th><th>Recipient</th>
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
                        {x.bonded && (
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
                        {(!x.receiveStatusUnknown && !x.bondTransactionHashExplorerUrl && !x.bonded) && (
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
                      <td className="bondedWithin" title={x.accountAddress}>
                        {x.accountAddressExplorerUrl && (
                          <a className="bonder" href={x.accountAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.accountAddress}`}>
                            { x.accountAddressTruncated }
                          </a>
                        )}
                      </td>
                      <td className="bondedWithin" title={x.recipientAddress}>
                        {x.recipientAddressExplorerUrl && (
                          <a className="bonder" href={x.recipientAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.recipientAddress}`}>
                            { x.recipientAddressTruncated }
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </details>
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
            {hasFirstPage && (
              <button onClick={firstPage} className="paginationButton">first page</button>
            )}
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
