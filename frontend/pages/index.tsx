import { useInterval } from 'react-use'
import Clipboard from 'clipboard'
import * as luxon from 'luxon'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type {NextPage} from 'next'
import Head from 'next/head'
import Script from 'next/script'
import React, {useEffect, useState } from 'react'
// import bgImage from './assets/circles-bg.svg'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import MuiTableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from './_useTheme'
import { withStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import dayjs, { Dayjs } from 'dayjs'

const isGoerli = process.env.NEXT_PUBLIC_NETWORK === 'goerli'
let apiBaseUrl = 'https://explorer-api.hop.exchange'
if (isGoerli) {
  apiBaseUrl = 'https://goerli-explorer-api.hop.exchange'
}
if (process.env.NEXT_PUBLIC_LOCAL) {
  apiBaseUrl = 'http://localhost:8000'
}

function getSourceChainId (chain: string) {
  if (chain === 'ethereum') {
    if (isGoerli) {
      return 5
    }
    return 1
  }
  if (chain === 'gnosis') {
    return 100
  }
  if (chain === 'polygon') {
    if (isGoerli) {
      return 80001
    }
    return 137
  }
  if (chain === 'optimism') {
    if (isGoerli) {
      return 420
    }
    return 10
  }
  if (chain === 'arbitrum') {
    if (isGoerli) {
      return 421613
    }
    return 42161
  }
  if (chain === 'nova') {
    return 42170
  }
  throw new Error(`unsupported chain "${chain}"`)
}

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
let enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism', 'nova']
if (isGoerli) {
  enabledChains = ['ethereum', 'polygon', 'arbitrum', 'optimism']
}

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
const defaultStartDate = luxon.DateTime.now().minus({ days: isGoerli ? 7 : 1 }).toFormat('yyyy-MM-dd')
const defaultEndDate = luxon.DateTime.now().toFormat('yyyy-MM-dd')
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
  nova: 'Nova'
}

const colorsMap: any = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  nova: '#ec772c',
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
  if (!filtered['bonderFeeUsd']) {
    delete filtered['bonderFeeUsdCmp']
  }
  if (!filtered['bonderFeeUsd']) {
    delete filtered['bonderFeeUsdCmp']
  }
  if (filtered['endDate'] === currentDate) {
    delete filtered['endDate']
  }
  if (filtered['sortBy'] === defaultSortBy) {
    delete filtered['sortBy']
  }
  if (filtered['sortBy'] === 'receivedHTokens') {
    filtered.receivedHTokens = true
    filtered['sortBy'] = 'timestamp'
  }
  if (filtered['sortDirection'] === defaultSortDirection) {
    delete filtered['sortDirection']
  }
  if (filtered['startTimestamp'] && filtered['startDate']) {
    delete filtered['startDate']
  }
  if (filtered['endTimestamp'] && filtered['endDate']) {
    delete filtered['endDate']
  }
  if (!(filtered['startDate'] || filtered['startTimestamp'])) {
    if (!(filtered['account'] || filtered['recipient'] || filtered['bonder'])) {
      filtered['startDate'] = defaultStartDate
    }
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
  const [filterStartDate, setFilterStartDate] = useState(() => {
    return queryParams.startDate || ''
  })
  const [filterEndDate, setFilterEndDate] = useState(() => {
    return queryParams.endDate || queryParams.date || ''
  })
  const [filterStartTimestamp, setFilterStartTimestamp] = useState(queryParams.startTimestamp)
  const [filterEndTimestamp, setFilterEndTimestamp] = useState(queryParams.endTimestamp)
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
  const [filterBonderFeeUsd, setFilterBonderFeeUsd] = useState(queryParams.bonderFeeUsd || '')
  const [filterBonderFeeUsdComparator, setFilterBonderFeeUsdComparator] = useState(queryParams.bonderFeeUsdCmp || 'gt')
  const [filterBonder, setFilterBonder] = useState(queryParams.bonder || '')
  const [filterAccount, setFilterAccount] = useState(queryParams.account || '')
  const [filterRecipient, setFilterRecipient] = useState(queryParams.recipient || '')
  const [filterTransferId, setFilterTransferId] = useState(queryParams.transferId || '')
  const [chartAmountSize, setChartAmountSize] = useState(false)
  const [chartSelection, setChartSelection] = useState('')
  const [transfers, setTransfers] = useState<any>([])
  const [showBanner, setShowBanner] = useState<boolean>(false)
  const [unsyncedSubgraphUrl, setUnsyncedSubgraphUrl] = useState<string>('')
  const [accountCumulativeVolumeUsd, setAccountCumulativeVolumeUsd] = useState<string>('')
  const [page, setPage] = useState(Number(queryParams.page || 1))
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

  const hasFirstPage = page > 1
  const hasPreviousPage = page > 1
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
      if (isGoerli) {
        return
      }
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

  useEffect(() => {
    const update = async () => {
      try {
        if (!filterAccount) {
          setAccountCumulativeVolumeUsd('')
          return
        }
        const url = `${apiBaseUrl}/v1/accounts?account=${filterAccount}`
        const res = await fetch(url)
        const json = await res.json()
        if (json.data?.length > 0) {
          if (json.data?.[0]?.volumeUsdDisplay) {
            setAccountCumulativeVolumeUsd(json.data[0].volumeUsdDisplay)
          }
        }
      } catch (err: any) {
        setAccountCumulativeVolumeUsd('')
      }
    }
    update().catch(console.error)
  }, [filterAccount])

  async function updateChart (data: any[]) {
    const links = data.map((x: any) => {
      return {
        source: chainToIndexMapSource[x.sourceChainSlug],
        target: chainToIndexMapDestination[x.destinationChainSlug],
        value: chartAmountSize ? x.amountUsd : 1,
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
        startTimestamp: filterStartTimestamp,
        endTimestamp: filterEndTimestamp,
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
        bonderFeeUsd: filterBonderFeeUsd,
        bonderFeeUsdCmp: filterBonderFeeUsdComparator,
        bonder: filterBonder,
        account: filterAccount,
        recipient: filterRecipient,
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
    const _page = Math.max(page - 1, 1)
    setPage(_page)
    updateQueryParams({ page: _page })
  }

  function firstPage () {
    setPage(1)
    updateQueryParams({ page: 1 })
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
    let value = event.target.value
    if (value === 'all') value = ''
    setFilterBonded(value)
    updateQueryParams({ bonded: value })
  }

  function updateFilterSource (event: any) {
    let value = event.target.value
    if (value === 'all') value = ''
    setFilterSource(value)
    updateQueryParams({ source: value })
  }

  function updateFilterDestination (event: any) {
    let value = event.target.value
    if (value === 'all') value = ''
    setFilterDestination(value)
    updateQueryParams({ destination: value })
  }

  function updateFilterToken (event: any) {
    let value = event.target.value
    if (value === 'all') value = ''
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

  function updateFilterBonderFeeUsd (event: any) {
    const value = event.target.value
    setFilterBonderFeeUsd(value)
    updateQueryParams({ bonderFeeUsd: value })
  }

  function updateFilterBonderFeeUsdComparator (event: any) {
    const value = event.target.value
    setFilterBonderFeeUsdComparator(value)
    updateQueryParams({ bonderFeeUsdCmp: value })
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

  function updateFilterRecipient (event: any) {
    const value = event.target.value
    setFilterRecipient(value)
    updateQueryParams({ recipient: value })
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

  function updateFilterStartDate (newValue: any) {
    const value = newValue.format('YYYY-MM-DD')
    setFilterStartDate(value)
    updateQueryParams({ startDate: value })
  }

  function updateFilterEndDate (newValue: any) {
    const value = newValue.format('YYYY-MM-DD')
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
  }, [filterBonded, filterSource, filterDestination, filterToken, filterAmount, filterAmountComparator, filterAmountUsd, filterAmountUsdComparator, filterBonderFeeUsd, filterBonderFeeUsdComparator, filterBonder, filterAccount, filterRecipient, filterTransferId, filterStartDate, filterEndDate, filterSortBy, filterSortDirection, page, perPage])

  function resetPage () {
    setPage(1)
  }

  function resetFilters(event: any) {
    event.preventDefault()
    setFilterStartDate('')
    setFilterEndDate('')
    setFilterStartTimestamp('')
    setFilterEndTimestamp('')
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
    setFilterBonderFeeUsd('')
    setFilterBonderFeeUsdComparator('gt')
    setFilterBonder('')
    setFilterAccount('')
    setFilterRecipient('')
    setFilterTransferId('')
    setChartAmountSize(false)
    setPage(1)
    updateQueryParams({
      bonded: null,
      source: null,
      destination: null,
      token: null,
      amount: null,
      amountCmp: null,
      amountUsd: null,
      amountUsdCmp: null,
      bonderFeeUsd: null,
      bonderFeeUsdCmp: null,
      bonder: null,
      account: null,
      transferId: null,
      startDate: null,
      endDate: null,
      startTimestamp: null,
      endTimestamp: null,
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
    filterBonderFeeUsd,
    filterBonderFeeUsdComparator,
    updateFilterBonderFeeUsd,
    updateFilterBonderFeeUsdComparator,
    filterAccount,
    updateFilterAccount,
    filterRecipient,
    updateFilterRecipient,
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
    unsyncedSubgraphUrl,
    accountCumulativeVolumeUsd
  }
}
const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    padding: '0.1rem 0'
  }
})(MuiTableCell)

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'
const bgImage = 'https://user-images.githubusercontent.com/168240/218269980-c26e1bb2-90d8-4816-b0cb-c8752e32cde1.svg'
const bgImageDark = 'https://user-images.githubusercontent.com/168240/218270008-16c5fe2a-33da-49c9-9fad-5286cbd6191d.svg'

const AppWrapper = styled(Box)<any>`
  align-items: stretch;
  background-image: url(https://user-images.githubusercontent.com/168240/218270008-16c5fe2a-33da-49c9-9fad-5286cbd6191d.svg);
  background-color: #272332;
  background-image: ${({ dark }) => (dark ? `url(${bgImageDark})` : `url(${bgImage})`)};
  background-color: ${({ theme }) => theme.palette.background.default};
  background-size: 120%;
  transition: background 0.15s ease-out;
  min-height: 100vh;
`

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
    filterBonderFeeUsd,
    filterBonderFeeUsdComparator,
    updateFilterBonderFeeUsd,
    updateFilterBonderFeeUsdComparator,
    filterAccount,
    updateFilterAccount,
    filterRecipient,
    updateFilterRecipient,
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
    unsyncedSubgraphUrl,
    accountCumulativeVolumeUsd
  } = useData()

  const { theme, dark } = useTheme()
  const [copied, setCopied] = useState<string>('')

  function setCopiedTimeout (value: string) {
    setTimeout(() => {
      setCopied(value)
    }, 1)
    setTimeout(() => {
      setCopied('')
    }, 1000)
  }

  function setCopiedTimeoutFn (value: string) {
    return (event: any) => {
      setCopiedTimeout(value)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Script strategy="beforeInteractive" src="/lib/d3.v3.min.js" />
      <Script strategy="beforeInteractive" src="/lib/d3.chart.min.js" />
      <Script strategy="beforeInteractive" src="/lib/sankey.patched.js" />
      <Script strategy="beforeInteractive" src="/static.js" />
      <Head>
        <title>Hop Explorer{isGoerli ? ' - Goerli' : ''}</title>
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
      <AppWrapper dark={dark} theme={theme}>
      {showBanner && (
        <div id="banner">
          <div>
            <span>⚠️</span> The <Link href={unsyncedSubgraphUrl} target="_blank" rel="noreferrer noopener">subgraph</Link> is currently experiencing some issues so the table might not reflect the latest state.
          </div>
        </div>
      )}
      <Box id="app">
        <Box className="header" mt={2} display="flex" alignItems="center" justifyContent="center">
          <Box mr={2}>
            <img className="logo" src={dark ? logoDark : logo} alt="Hop" />
          </Box>
          <Typography variant="h1" color="secondary">Explorer</Typography>
        </Box>
        <Box mb={4} className="chartView">
          <details open>
            <summary><Typography variant="body1" color="secondary">Chart ▾</Typography></summary>
              <Box p={2}>
                <div className="chartHeader">
                  <label><Typography variant="body1" color="secondary">Source</Typography></label>
                  <label className="arrow">
                    <Typography variant="body1" color="secondary">
                      <ArrowForwardIcon />
                    </Typography>
                  </label>
                  <label><Typography variant="body1" color="secondary">Destination</Typography></label>
                </div>
                <div className="chartContainer">
                  <div id="chart"></div>
                </div>
                <label htmlFor="amountSizeCheckbox">
                  <Box display="flex" alignItems="center">
                    <Checkbox id="amountSizeCheckbox" value={chartAmountSize.toString()} onChange={enableChartAmountSize} />
                    <Typography variant="body1" component="span" color="secondary">
                      Amount size
                    </Typography>
                  </Box>
                </label>
                <div id="chartSelection"><Typography variant="body1" color="secondary">{ chartSelection }</Typography></div>
              </Box>
          </details>
        </Box>
        <details open>
        <summary>
          <span><Typography variant="body1" color="secondary">Filters ▾</Typography></span>
        </summary>
          <Box mb={4} className="tableHeader">
            <Paper className="filters">
              <Box p={4} display="flex" flexDirection="column">
                <Box display="flex" flexWrap="wrap">
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Transfer ID</Typography></label>
                  <TextField className="filterTransferId" value={filterTransferId} onChange={updateFilterTransferId} placeholder="transfer ID or tx hash" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Source</Typography></label>
                  <Select className="select" value={filterSource || 'all'} onChange={updateFilterSource}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="ethereum">Ethereum</MenuItem>
                    <MenuItem value="polygon">Polygon</MenuItem>
                    <MenuItem value="gnosis">Gnosis</MenuItem>
                    <MenuItem value="optimism">Optimism</MenuItem>
                    <MenuItem value="arbitrum">Arbitrum</MenuItem>
                    <MenuItem value="nova">Nova</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Destination</Typography></label>
                  <Select className="select" value={filterDestination || 'all'} onChange={updateFilterDestination}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="ethereum">Ethereum</MenuItem>
                    <MenuItem value="polygon">Polygon</MenuItem>
                    <MenuItem value="gnosis">Gnosis</MenuItem>
                    <MenuItem value="optimism">Optimism</MenuItem>
                    <MenuItem value="arbitrum">Arbitrum</MenuItem>
                    <MenuItem value="nova">Nova</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Token</Typography></label>
                  <Select className="select" value={filterToken || 'all'} onChange={updateFilterToken}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="USDC">USDC</MenuItem>
                    <MenuItem value="USDT">USDT</MenuItem>
                    <MenuItem value="MATIC">MATIC</MenuItem>
                    <MenuItem value="ETH">ETH</MenuItem>
                    <MenuItem value="DAI">DAI</MenuItem>
                    <MenuItem value="WBTC">WBTC</MenuItem>
                    <MenuItem value="FRAX">FRAX</MenuItem>
                    <MenuItem value="HOP">HOP</MenuItem>
                    <MenuItem value="SNX">SNX</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Bonded</Typography></label>
                  <Select className="select" value={filterBonded || 'all'} onChange={updateFilterBonded}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="bonded">Bonded</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Amount</Typography></label>
                  <Box display="flex">
                    <Select className="select selectSmall" value={filterAmountComparator} onChange={updateFilterAmountComparator}>
                      <MenuItem value="eq">=</MenuItem>
                      <MenuItem value="gt">&gt;</MenuItem>
                      <MenuItem value="lt">&lt;</MenuItem>
                    </Select>
                    <TextField className="filterAmount" value={filterAmount} onChange={updateFilterAmount} placeholder="Amount" />
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Amount USD</Typography></label>
                  <Box display="flex">
                    <Select className="select selectSmall" value={filterAmountUsdComparator} onChange={updateFilterAmountUsdComparator}>
                      <MenuItem value="eq">=</MenuItem>
                      <MenuItem value="gt">&gt;</MenuItem>
                      <MenuItem value="lt">&lt;</MenuItem>
                    </Select>
                    <TextField className="filterAmountUsd" value={filterAmountUsd} onChange={updateFilterAmountUsd} placeholder="Amount USD" />
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Bonder Fee USD</Typography></label>
                  <Box display="flex">
                    <Select className="select selectSmall" value={filterBonderFeeUsdComparator} onChange={updateFilterBonderFeeUsdComparator}>
                      <MenuItem value="eq">=</MenuItem>
                      <MenuItem value="gt">&gt;</MenuItem>
                      <MenuItem value="lt">&lt;</MenuItem>
                    </Select>
                    <TextField className="filterBonderFeeUsd" value={filterBonderFeeUsd} onChange={updateFilterBonderFeeUsd} placeholder="Bonder fee USD" />
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Bonder</Typography></label>
                  <TextField className="filterBonder" value={filterBonder} onChange={updateFilterBonder} placeholder="Bonder address" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Account</Typography></label>
                  <TextField className="filterAccount" value={filterAccount} onChange={updateFilterAccount} placeholder="Account address" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Recipient</Typography></label>
                  <TextField className="filterRecipient" value={filterRecipient} onChange={updateFilterRecipient} placeholder="Recipient address" />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" flexDirection="column">
                    <label><Typography variant="body1" color="secondary">Start Date</Typography></label>
                    <MobileDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={filterStartDate || defaultStartDate}
                    onChange={updateFilterStartDate}
                    renderInput={(params) => <TextField {...params} className="datePicker" />}
                    />
                  </Box>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" flexDirection="column">
                    <label><Typography variant="body1" color="secondary">End Date</Typography></label>
                    <MobileDatePicker
                    inputFormat="YYYY-MM-DD"
                    value={filterEndDate || defaultEndDate}
                    onChange={updateFilterEndDate}
                    renderInput={(params) => <TextField {...params} className="datePicker" />}
                    />
                  </Box>
                </LocalizationProvider>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Sort By</Typography></label>
                  <Select className="select" value={filterSortBy} onChange={updateFilterSortBy}>
                    <MenuItem value="timestamp">Timestamp</MenuItem>
                    <MenuItem value="source">Source</MenuItem>
                    <MenuItem value="destination">Destination</MenuItem>
                    <MenuItem value="token">Token</MenuItem>
                    <MenuItem value="bonded">Bonded</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="amountUsd">Amount USD</MenuItem>
                    <MenuItem value="bonderFee">Bonder Fee</MenuItem>
                    <MenuItem value="bonderFeeUsd">BonderFee USD</MenuItem>
                    <MenuItem value="bonder">Bonder</MenuItem>
                    <MenuItem value="transferId">Transfer ID</MenuItem>
                    <MenuItem value="account">Account</MenuItem>
                    <MenuItem value="recipient">Recipient</MenuItem>
                    <MenuItem value="bondTimestamp">Bonded Timestamp</MenuItem>
                    <MenuItem value="bondWithinTimestamp">Bonded Within Timestamp</MenuItem>
                    <MenuItem value="receivedHTokens">Received hTokens</MenuItem>
                    <MenuItem value="integrationPartner">Integration Partner</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Sort Order</Typography></label>
                  <Select className="select" value={filterSortDirection} onChange={updateFilterSortDirection}>
                    <MenuItem value="desc">↓ Descending</MenuItem>
                    <MenuItem value="asc">↑ Ascending</MenuItem>
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Per page</Typography></label>
                  <Select className="perPageSelection select" value={perPage} onChange={updatePerPage}>
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Button onClick={resetFilters}>Reset</Button>
              </Box>
            </Box>
            </Paper>
          </Box>
          </details>
          <details open>
          <summary>
            <span><Typography variant="body1" color="secondary">Transfers ▾</Typography></span>
          </summary>
          <div>
          {!!accountCumulativeVolumeUsd && (
            <div className="cumulativeVolume" title="Cumulative volume in USD for this account">Account Cumulative Volume: {accountCumulativeVolumeUsd}</div>
          )}
          </div>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Button onClick={handleRefreshClick} className="refreshButton">Refresh</Button>
              {loadingData && (
                <Typography variant="body1" color="secondary">
                  <Box ml={2} className="loadingData" display="flex" alignItems="center">
                    <Spinner /> <Box ml={1}>Loading...</Box>
                  </Box>
                </Typography>
              )}
            </Box>
            <Box className="pagination">
              {hasFirstPage && (
                <Button onClick={firstPage} className="paginationButton">First page</Button>
              )}
              {hasPreviousPage && (
                <Button onClick={previousPage} className="paginationButton">Previous page</Button>
              )}
              {hasNextPage && (
                <Button onClick={nextPage} className="paginationButton">Next page</Button>
              )}
            </Box>
          </Box>
          <Box mb={4} id="transfers">
            <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell><TableCell title="Date">Date</TableCell><TableCell title="Source chain">Source</TableCell><TableCell title="Destination chain">Destination</TableCell><TableCell title="Transfer ID">Transfer ID</TableCell><TableCell title="Transfer transaction hash">Transfer Tx</TableCell><TableCell title="Token">Token</TableCell><TableCell title="Amount in token">Amount</TableCell><TableCell title="Amount in USD">Amount USD</TableCell><TableCell title="Bonder fee in token">Bonder Fee</TableCell><TableCell title="Bonder fee in USD">Bonder Fee USD</TableCell><TableCell title="Transfer token was received at destination chain">Bonded</TableCell><TableCell title="Bonded or receive at destination chain transaction hash">Bonded Tx</TableCell><TableCell title="Date transfer was received at destination chain or estimated time until received at destination if pending">Bonded Date</TableCell><TableCell title="Time it took to receive transfer at destination chain">Bonded Within</TableCell><TableCell title="The address of bonder who bonded transfer">Bonder</TableCell><TableCell title="The sender address">Account</TableCell><TableCell title="The receipient address">Recipient</TableCell><TableCell title="Integration Partner">Integration Partner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transfers.map((x: any, index: number) => {
                  x.isDifferentRecipient = false
                  if (x.recipientAddress && x.accountAddress) {
                    x.isDifferentRecipient = x.recipientAddress !== x.accountAddress
                  }
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body1" color="secondary" className="index">
                          { ((Math.max(page-1, 0) * perPage) + index + 1) }
                        </Typography>
                        </TableCell>
                      <TableCell title={x.timestampIso}>
                        <Typography variant="body1" color="secondary" className="timestamp">
                          { x.timestampRelative }
                        </Typography>
                        </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img width="16" height="16" src={x.sourceChainImageUrl} alt={x.sourceChainName} />
                          <Typography variant="body1" color="secondary" className={x.sourceChainSlug}>
                            { x.sourceChainName }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                          <Typography variant="body1" color="secondary" className={x.destinationChainSlug}>
                            { x.destinationChainName }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="transferId">
                        <Box display="flex" alignItems="center">
                          <Link className="clipboard" data-clipboard-text={x.transferId} rel="noreferrer noopener" title="Copy transfer ID to clipboard" onClick={setCopiedTimeoutFn(x.transferId)}>{copied === x.transferId ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                          <Typography variant="body1" color="secondary">
                            <Link className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transferId}`}>
                              { x.transferIdTruncated }
                            </Link>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="transferTx">
                        <Box display="flex" alignItems="center">
                          <Link className="clipboard" data-clipboard-text={x.transactionHash} rel="noreferrer noopener" title="Copy transaction hash to clipboard" onClick={setCopiedTimeoutFn(x.transactionHash)}>{copied === x.transactionHash ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                          <Typography variant="body1" color="secondary">
                            <Link className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.transactionHash}`}>
                              { x.transactionHashTruncated }
                            </Link>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="token">
                        <Box display="flex" alignItems="center">
                          <img width="16" height="16" src={x.tokenImageUrl} alt={x.token} />
                          <Typography variant="body1" color="secondary">
                            { x.token }
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="amount number" title={x.amount}>
                        <Typography variant="body1" color="secondary">
                          { x.amountDisplay }
                        </Typography>
                      </TableCell>
                      <TableCell className="amount number" title={`${x.amountUsdDisplay} @ ${x.tokenPriceUsdDisplay}`}>
                        <Typography variant="body1" color="secondary">
                          { x.amountUsdDisplay }
                        </Typography>
                      </TableCell>
                      <TableCell className="bonderFee number" title={x.bonderFee}>
                        <Typography variant="body1" color="secondary">
                          {x.sourceChainId !== getSourceChainId('ethereum') && (
                            <span>
                              { x.bonderFeeDisplay }
                            </span>
                          )}
                          {x.sourceChainId === getSourceChainId('ethereum') && (
                            <span className="na">
                              <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                            </span>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bonderFee number" title={`${x.bonderFeeUsdDisplay} @ ${x.tokenPriceUsdDisplay}`}>
                        <Typography variant="body1" color="secondary" mr={2}>
                          {x.sourceChainId !== getSourceChainId('ethereum') && (
                            <span>
                              { x.bonderFeeUsdDisplay }
                            </span>
                          )}
                          {x.sourceChainId === getSourceChainId('ethereum') && (
                            <span className="na">
                              <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                            </span>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bonded">
                        <Typography variant="body1" color="secondary">
                          {x.bonded && (
                          <Link className={`${x.bonded ? 'yes' : 'no'}`} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title="View on block explorer">
                            <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                            {x.sourceChainId !== getSourceChainId('ethereum') && (
                              <span>
                                Bonded
                              </span>
                            )}
                            {x.sourceChainId === getSourceChainId('ethereum') && (
                              <span>
                                Received
                              </span>
                            )}
                            {x.receivedHTokens && (
                              <span title={`Received h${x.token}`}> ⚠️</span>
                            )}
                          </Link>
                          )}
                          {x.unbondable ?
                            <span className="unbondable" title="This transfer is unbondable because of invalid parameters">
                              ⚠️ Unbondable
                            </span>
                          : <>{(!x.receiveStatusUnknown && !x.bondTransactionHashExplorerUrl && !x.bonded) && (
                            <span className="no">
                              <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                              Pending
                            </span>
                          )}</>
                          }
                        </Typography>
                      </TableCell>
                      <TableCell className="bondTx">
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" color="secondary">
                            {x.preregenesis && (
                              <span title="This transaction occurred before the Optimism Regenesis">
                                (pre-regenesis)
                              </span>
                            )}
                            {x.bondTransactionHash && (
                              <Box display="flex" alignItems="center">
                                <Link className="clipboard" data-clipboard-text={x.bondTransactionHash} title="Copy transaction hash to clipboard" onClick={setCopiedTimeoutFn(x.bondTransactionHash)}>{copied === x.bondTransactionHash ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                                <Link className={x.destinationChainSlug} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bondTransactionHash}`}>
                                  { x.bondTransactionHashTruncated }
                                </Link>
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="bondedDate" title={x.bondTimestampIso}>
                        <Typography variant="body1" color="secondary">
                          { x.estimatedRelativeTimeUntilBond || x.bondTimestampRelative }
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin" title={x.bondTimestampIso}>
                        <Typography variant="body1" color="secondary">
                          { x.bondWithinTimestampRelative }
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin" title={x.bonderAddress}>
                        <Typography variant="body1" color="secondary">
                          {x.bonderAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                              <Link className="clipboard" data-clipboard-text={x.bonderAddress} rel="noreferrer noopener" title="Copy bonder address to clipboard" onClick={setCopiedTimeoutFn(x.bonderAddress)}>{copied === x.bonderAddress ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                              <Link className="bonder" href={x.bonderAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.bonderAddress}`}>
                                { x.bonderAddressTruncated }
                              </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin" title={x.accountAddress}>
                        <Typography variant="body1" color="secondary">
                          {x.accountAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                              <Link className="clipboard" data-clipboard-text={x.accountAddress} rel="noreferrer noopener" title="Copy account address to clipboard" onClick={setCopiedTimeoutFn(x.accountAddress)}>{copied === x.accountAddress ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                              <Link className="bonder" href={x.accountAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.accountAddress}`}>
                                { x.accountAddressTruncated }
                              </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin" title={x.recipientAddress}>
                        <Typography variant="body1" color="secondary">
                          {x.recipientAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                            <Link className="clipboard" data-clipboard-text={x.recipientAddress} rel="noreferrer noopener" title="Copy account address to clipboard" onClick={setCopiedTimeoutFn(x.recipientAddress)}>{copied === x.recipientAddress ? <CheckIcon /> : <ContentCopyIcon />}</Link>
                            {x.isDifferentRecipient && (
                              <span title="The recipient is different than the sender. If this was not expected then make sure that the website you sent from was not a scam site. The official website is app.hop.exchange">⚠️ </span>
                            )}
                            <Link className="bonder" href={x.recipientAddressExplorerUrl} target="_blank" rel="noreferrer noopener" title={`View on block explorer - ${x.recipientAddress}`}>
                              { x.recipientAddressTruncated }
                            </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin" title={x.integrationPartnerName}>
                        <Box display="flex" alignItems="center">
                          {x.integrationPartnerImageUrl && (
                            <img width="16" height="16" src={x.integrationPartnerImageUrl} alt={x.integrationPartnerName} />
                          )}
                          <Typography variant="body1" color="secondary">
                            {x.integrationPartnerName}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            </TableContainer>
          </Box>
          <div className="tableFooter">
            <div>
              <Select className="perPageSelection" value={perPage} onChange={updatePerPage}>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="25">25</MenuItem>
                <MenuItem value="50">50</MenuItem>
                <MenuItem value="100">100</MenuItem>
              </Select>
            </div>
            <div className="pagination">
              {hasFirstPage && (
                <Button onClick={firstPage} className="paginationButton">First page</Button>
              )}
              {hasPreviousPage && (
                <Button onClick={previousPage} className="paginationButton">Previous page</Button>
              )}
              {hasNextPage && (
                <Button onClick={nextPage} className="paginationButton">Next page</Button>
              )}
            </div>
          </div>
        </details>
      </Box>
      </AppWrapper>
    </ThemeProvider>
  )
}

export default Index
