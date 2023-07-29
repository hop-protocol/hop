import React, {useEffect, useState, useCallback } from 'react'
import { useInterval } from 'react-use'
import Clipboard from 'clipboard'
import * as luxon from 'luxon'
import type {NextPage} from 'next'
import Head from 'next/head'
import Script from 'next/script'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import RefreshIcon from '@mui/icons-material/Refresh'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import GitHubIcon from '@mui/icons-material/GitHub'
import TwitterIcon from '@mui/icons-material/Twitter'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { chains, tokens } from '@hop-protocol/core/metadata'
import { goerli as goerliAddresses, mainnet as mainnetAddresses } from '@hop-protocol/core/addresses'
import { goerli as goerliNetworks, mainnet as mainnetNetworks } from '@hop-protocol/core/networks'
import MuiTooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

const isGoerli = process.env.NEXT_PUBLIC_NETWORK === 'goerli'
let apiBaseUrl = 'https://explorer-api.hop.exchange'
let appBaseUrl = 'https://app.hop.exchange'
if (isGoerli) {
  apiBaseUrl = 'https://goerli-explorer-api.hop.exchange'
  appBaseUrl = 'https://goerli.hop.exchange'
}
if (process.env.NEXT_PUBLIC_LOCAL) {
  apiBaseUrl = 'http://localhost:8000'
}

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: '1em',
  },
}))

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

const tokenSet = new Set([] as string[])
const chainSet = new Set([] as string[])

const addresses = isGoerli ? goerliAddresses : mainnetAddresses
for (const token in addresses.bridges) {
  tokenSet.add(token)

  for (const chain in addresses.bridges[token]) {
    chainSet.add(chain)
  }
}

let enabledTokens: string[] = Array.from(tokenSet)
let enabledChains: string[] = Array.from(chainSet)

if (process.env.NEXT_PUBLIC_ENABLED_TOKENS) {
  enabledTokens = process.env.NEXT_PUBLIC_ENABLED_TOKENS.split(',').map((token: any) => token.trim()).filter(Boolean)
}

if (process.env.NEXT_PUBLIC_ENABLED_CHAINS) {
  enabledChains = process.env.NEXT_PUBLIC_ENABLED_CHAINS.split(',').map((chain: any) => chain.trim()).filter(Boolean)
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

const networks: any = isGoerli ? goerliNetworks : mainnetNetworks
const chainSlugToNameMap :any = {}

for (const chain in networks) {
  chainSlugToNameMap[chain] = networks[chain].name
}

const colorsMap: any = {
  bonded: '#81ff81',
  pending: '#ffc55a',
  fallback: '#9f9fa3'
}

for (const chain in chains) {
  colorsMap[chain] = (chains as any)[chain].primaryColor
}

const chainSlugToIdMap :any = {}

for (const chain in networks) {
  chainSlugToIdMap[chain] = networks[chain].networkId
}

export function chainSlugToId (chainSlug: string) {
  const id = chainSlugToIdMap[chainSlug]
  if (!id) {
    throw new Error(`Unknown chain slug ${chainSlug}`)
  }
  return id
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
  if (queryParams.refresh) {
    filtered['refresh'] = true
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
  const [showSubgraphBanner, setShowSubgraphBanner] = useState<boolean>(false)
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
        setShowSubgraphBanner(true)
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
    .filter((x: any) => x.source != undefined && x.target != undefined)

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

      const $chartSelection: any = document.querySelector('#chartSelection')
      chart.on('link:mouseout', function (item: any) {
        // note: this makes ui lag because of too many re-renders
        // setChartSelection('')
        if ($chartSelection) {
          $chartSelection.innerText = ''
        }
      })
      chart.on('link:mouseover', function (item: any) {
        const value = `${item.source.name}⟶${item.target.name} ${item.amountDisplay} ${item.token}`
        // setChartSelection(value)
        if ($chartSelection) {
          $chartSelection.innerText = value
        }
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
      sortDirection: null,
      refresh: null
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
    showSubgraphBanner,
    unsyncedSubgraphUrl,
    accountCumulativeVolumeUsd
  }
}

const logoDark = 'https://user-images.githubusercontent.com/168240/218285469-4df03677-43de-4abd-986d-b6dd99a3b961.svg'
const logo = 'https://user-images.githubusercontent.com/168240/218271509-66a35bed-94f7-46da-ab41-71c806ac9a96.svg'
const bgImage = 'https://user-images.githubusercontent.com/168240/218269980-c26e1bb2-90d8-4816-b0cb-c8752e32cde1.svg'
const bgImageDark = 'https://user-images.githubusercontent.com/168240/218270008-16c5fe2a-33da-49c9-9fad-5286cbd6191d.svg'

function MenuItemIcon (props: any) {
  const { src } = props
  return (
    <Box mr={0.5} display="inline-flex" alignItems="center" justifyContent="center">
      <img src={src} alt="" width="16px" />
    </Box>
  )
}

const Index: NextPage = (props: any) => {
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
    showSubgraphBanner,
    unsyncedSubgraphUrl,
    accountCumulativeVolumeUsd
  } = useData()

  const { theme, dark, toggleTheme } = props
  const [copied, setCopied] = useState<string>('')
  const [showMoreFilters, setShowMoreFilters] = useState<boolean>(false)

  useEffect(() => {
    try {
      setShowMoreFilters((document as any)?.body?.clientWidth > 960)
    } catch (err) {}
  }, [])

  const setCopiedTimeout = useCallback((value: string) => {
    setTimeout(() => {
      setCopied(value)
    }, 0)
    setTimeout(() => {
      setCopied('')
    }, 1000)
  }, [])

  const setCopiedTimeoutFn = useCallback((value: string) => {
    return (event: any) => {
      setCopiedTimeout(value)
    }
  }, [setCopiedTimeout])

  const showMoreFiltersFn = useCallback(() => {
    setShowMoreFilters(true)
  }, [])

  const chainMenuItems: any[] = []
  for (const chain of enabledChains) {
    chainMenuItems.push(
      <MenuItem key={chain} value={chain}><MenuItemIcon src={(chains as any)[chain].image} /> {chainSlugToNameMap[chain]}</MenuItem>,
    )
  }

  const tokenMenuItems: any[] = []
  for (const tokenSymbol of enabledTokens) {
    tokenMenuItems.push(
      <MenuItem key={tokenSymbol} value={tokenSymbol}><MenuItemIcon src={(tokens as any)[tokenSymbol].image} /> {tokenSymbol}</MenuItem>
    )
  }

  return (
    <>
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
      <Box
      style={{
        alignItems: 'stretch',
        backgroundImage: !dark ? `url(${bgImage})` : `url(${bgImageDark})`,
        backgroundColor: theme?.palette?.background?.default,
        backgroundSize: '120%',
        transition: 'background 0.15s ease-out',
        minHeight: '100vh'
      }}>
      {showSubgraphBanner && (
        <div id="banner">
          <div>
            <span>⚠️</span> The <Link href={unsyncedSubgraphUrl} target="_blank" rel="noreferrer noopener">subgraph</Link> is currently experiencing some issues so the table might not reflect the latest state.
          </div>
        </div>
      )}
      {isGoerli && (
        <div id="banner">
          <div>
            <span>⚠️</span> The Linea network is experiencing RPC issues at this time. If your Linea transaction has not arrived, please check again in a few hours.
          </div>
        </div>
      )}
      <Box id="app" className={dark ? 'dark' : 'light'}>
        <Box mb={2} mt={2} display="flex" justifyContent="space-between">
          <Box className="header" display="flex" alignItems="center" justifyContent="center">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
              <Box mr={1}>
                <img className="logo" src={dark ? logoDark : logo} alt="Hop" />
              </Box>
              <Typography variant="h1" color="secondary">Explorer</Typography>
            </Link>
          </Box>
          <Box>
            <IconButton onClick={toggleTheme} title="Toggle theme color mode">
              { dark ? <LightModeIcon /> : <DarkModeIcon /> }
            </IconButton>
          </Box>
        </Box>
        <Box mb={4} className="chartView">
          <details open>
            <summary><Typography variant="body1" color="secondary">Chart ▾</Typography></summary>
              <Box p={2}>
                <div className="chartHeader">
                  <label><Typography variant="body1" color="secondary">Source</Typography></label>
                  <label className="arrow">
                    <Typography variant="body1" color="secondary" component="div">
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
                <Box><Typography variant="body1" color="secondary" id="chartSelection">{ chartSelection }</Typography></Box>
              </Box>
          </details>
        </Box>
        <details open>
        <summary>
          <span><Typography variant="body1" color="secondary">Filters ▾</Typography></span>
        </summary>
          <Box mb={4} className="tableHeader">
            <Paper style={{ overflowY: 'hidden', overflowX: 'auto', position: 'relative', width: '100%' }}>
              <Box p={4} display="flex" flexDirection="column" style={{ maxHeight: showMoreFilters ? '100%' : '170px' }}>
                <Box display="flex" flexWrap="wrap" className="filters">
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Transfer ID</Typography></label>
                  <TextField className="filterTransferId" value={filterTransferId} onChange={updateFilterTransferId} placeholder="transfer ID or tx hash" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Source</Typography></label>
                  <Select className="select" value={filterSource || 'all'} onChange={updateFilterSource}>
                    <MenuItem value="all">All</MenuItem>
                    {chainMenuItems}
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Destination</Typography></label>
                  <Select className="select" value={filterDestination || 'all'} onChange={updateFilterDestination}>
                    <MenuItem value="all">All</MenuItem>
                    {chainMenuItems}
                  </Select>
                </Box>
                <Box display="flex" flexDirection="column">
                  <label><Typography variant="body1" color="secondary">Token</Typography></label>
                  <Select className="select" value={filterToken || 'all'} onChange={updateFilterToken}>
                    <MenuItem value="all">All</MenuItem>
                    {tokenMenuItems}
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
                <Button onClick={resetFilters} startIcon={<RestartAltIcon />}>Reset</Button>
              </Box>
            </Box>
            {!showMoreFilters && (
              <Box display="flex" alignItems="center" justifyContent="center" style={{ background: dark ? 'rgb(39 35 50 / 84%)' : 'rgb(255 255 255 / 68%)', position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                <Button onClick={showMoreFiltersFn} endIcon={<ExpandMoreIcon />}>More filters</Button>
              </Box>
            )}
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
              <Button onClick={handleRefreshClick} className="refreshButton" startIcon={<RefreshIcon />}>Refresh</Button>
              {loadingData && (
                <Typography variant="body1" color="secondary" component="div">
                  <Box ml={2} className="loadingData" display="flex" alignItems="center">
                    <Spinner /> <Box ml={1}>Loading...</Box>
                  </Box>
                </Typography>
              )}
            </Box>
            <Box className="pagination">
              {hasFirstPage && (
                <Button onClick={firstPage} className="paginationButton" startIcon={<FirstPageIcon />}>First</Button>
              )}
              {hasPreviousPage && (
                <Button onClick={previousPage} className="paginationButton" startIcon={<NavigateBeforeIcon />}>Previous</Button>
              )}
              {hasNextPage && (
                <Button onClick={nextPage} className="paginationButton" endIcon={<NavigateNextIcon />}>Next</Button>
              )}
            </Box>
          </Box>
          <Box mb={4} id="transfers">
            <TableContainer>
            <Table
              sx={{
                "& .MuiTableRow-root:hover": {
                  backgroundColor: "table.hover"
                }
              }}
            >
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
                  if (x.timestamp) {
                    x.localTimestampIso = luxon.DateTime.fromSeconds(x.timestamp).toLocal().toISO()
                  }
                  if (x.bondTimestamp) {
                    x.localBondTimestampIso = luxon.DateTime.fromSeconds(x.bondTimestamp).toLocal().toISO()
                  }
                  if (x.deadline && x.bondTimestamp && x.receivedHTokens) {
                    x.deadlineExpiredSeconds = x.bondTimestamp - x.deadline
                  }
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body1" color="secondary" className="index">
                          { ((Math.max(page-1, 0) * perPage) + index + 1) }
                        </Typography>
                        </TableCell>
                      <TableCell>
                        <Tooltip title={<Box>UTC: {x.timestampIso}<br />Local: {x.localTimestampIso}<br />Unix: {x.timestamp}<br />Relative: { x.timestampRelative }</Box>}>
                          <Typography variant="body1" color="secondary" className="timestamp">
                            { x.timestampRelative }
                          </Typography>
                        </Tooltip>
                        </TableCell>
                      <TableCell>
                        <Tooltip title={`${x.sourceChainName} - Chain ID: ${x.sourceChainId}`}>
                          <Box display="flex" alignItems="center">
                            <img width="16" height="16" src={x.sourceChainImageUrl} alt={x.sourceChainName} />
                            <Typography variant="body1" color="secondary" className={x.sourceChainSlug} style={{ color: colorsMap[x.sourceChainSlug] }}>
                              { x.sourceChainName }
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`${x.destinationChainName} - Chain ID: ${x.destinationChainId}`}>
                          <Box display="flex" alignItems="center">
                            <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                            <Typography variant="body1" color="secondary" className={x.destinationChainSlug} style={{ color: colorsMap[x.destinationChainSlug] }}>
                              { x.destinationChainName }
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="transferId">
                          <Box display="flex" alignItems="center">
                            <Link className="clipboard" data-clipboard-text={x.transferId} rel="noreferrer noopener" onClick={setCopiedTimeoutFn(x.transferId)}><Tooltip title="Copy transfer ID to clipboard">{copied === x.transferId ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                            <Typography variant="body1" color="secondary" component="div">
                              <Tooltip title={<Box>View on {x.sourceChainName} block explorer<br />Transfer ID: {x.transferId}<br />Tx hash: {x.transactionHash}</Box>}>
                                <Link className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" style={{ color: colorsMap[x.sourceChainSlug] }}>
                                  { x.transferIdTruncated }
                                </Link>
                              </Tooltip>
                            </Typography>
                          </Box>
                      </TableCell>
                      <TableCell className="transferTx">
                        <Box display="flex" alignItems="center">
                          <Link className="clipboard" data-clipboard-text={x.transactionHash} rel="noreferrer noopener" onClick={setCopiedTimeoutFn(x.transactionHash)}><Tooltip title="Copy transaction hash to clipboard">{copied === x.transactionHash ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                          <Typography variant="body1" color="secondary" component="div">
                            <Tooltip title={<Box>View on {x.sourceChainName} block explorer<br />Tx hash: {x.transactionHash}</Box>}>
                              <Link className={x.sourceChainSlug} href={x.transactionHashExplorerUrl} target="_blank" rel="noreferrer noopener" style={{ color: colorsMap[x.sourceChainSlug] }}>
                                { x.transactionHashTruncated }
                              </Link>
                            </Tooltip>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="token">
                        <Tooltip title={`${x.token}`}>
                          <Box display="flex" alignItems="center">
                            <img width="16" height="16" src={x.tokenImageUrl} alt={x.token} />
                            <Typography variant="body1" color="secondary">
                              { x.token }
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="amount number">
                        <Tooltip title={<Box>Amount: {x.amountDisplay} {x.token}<br />Raw: {x.amount}</Box>}>
                          <Typography variant="body1" color="secondary">
                            { x.amountDisplay }
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="amount number">
                        <Tooltip title={<Box>Amount USD: {x.amountUsdDisplay}<br />{x.token} Price: {x.tokenPriceUsdDisplay}</Box>}>
                          <Typography variant="body1" color="secondary">
                            { x.amountUsdDisplay }
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="bonderFee number">
                        <Typography variant="body1" color="secondary" component="div">
                          {x.sourceChainId !== chainSlugToId('ethereum') && (
                            <Tooltip title={<Box>Bonder Fee: {x.bonderFeeDisplay} {x.token}<br />Raw: {x.bonderFee}</Box>}>
                              <span>
                                { x.bonderFeeDisplay }
                              </span>
                            </Tooltip>
                          )}
                          {x.sourceChainId === chainSlugToId('ethereum') && (
                            <span className="na">
                              <Tooltip title="Not Applicable — L1 to L2 transfers don't require bonding and should arrive at the destination chain within an hour.">
                                <abbr style={{ cursor: 'help' }}>N/A</abbr>
                              </Tooltip>
                            </span>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bonderFee number">
                        <Typography variant="body1" color="secondary" mr={2} component="div">
                          {x.sourceChainId !== chainSlugToId('ethereum') && (
                            <Tooltip title={<Box>Bonder Fee USD: {x.bonderFeeUsdDisplay}<br />{x.token} Price: {x.tokenPriceUsdDisplay}</Box>}>
                              <span>
                                { x.bonderFeeUsdDisplay }
                              </span>
                            </Tooltip>
                          )}
                          {x.sourceChainId === chainSlugToId('ethereum') && (
                            <span className="na">
                              <Tooltip title="Not Applicable — L1 to L2 transfers don't require bonding">
                                <abbr style={{ cursor: 'help' }}>N/A</abbr>
                              </Tooltip>
                            </span>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bonded">
                        <Typography variant="body1" color="secondary" component="div">
                          {x.bonded && (
                          <Link className={`${x.bonded ? 'yes' : 'no'}`} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener">
                              <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                              {x.sourceChainId !== chainSlugToId('ethereum') && (
                            <Tooltip title={<Box>View on {x.destinationChainName} block explorer<br />Bond tx hash: {x.bondTransactionHash}</Box>}>
                                <span>
                                  Bonded
                                </span>
                            </Tooltip>
                              )}
                              {x.sourceChainId === chainSlugToId('ethereum') && (
                            <Tooltip title={<Box>View on {x.destinationChainName} block explorer<br />Received tx hash: {x.bondTransactionHash}</Box>}>
                                <span>
                                  Received
                                </span>
                            </Tooltip>
                              )}
                              {x.receivedHTokens && (
                                <Tooltip title={<Box>Received h{x.token}.<br />h{x.token} can be swapped for {x.token} on the <Link href={x.convertHTokenUrl} target="_blank" rel="noreferrer noopener">Hop Convert Page ↗</Link><br /><br />Parameters used:<br /><small>Deadline: {x.deadline}<br />AmountOutMin: {x.amountOutMinFormatted || x.amountOutMin}<br /><br />{x.deadline < x.bondTimestamp ? <>AMM swap failed due to expired deadline so user received h{x.token}. Deadline expired {x.deadlineExpiredSeconds} seconds before AMM swap.</> : <>AMM swap failed due to amountOutMin being too low so user received h{x.token}. Use a slightly higher slippage percentage for AMM swap to succeed next time.</>}</small></Box>}>
                                  <span style={{ cursor: 'help' }}> ⚠️</span>
                                </Tooltip>
                              )}
                          </Link>
                          )}
                          {(x.unbondable && !x.bonded) ?
                            <span className="unbondable">
                              <Tooltip title={<Box>This transfer is unbondable because of invalid parameters, therefore bonder will not process it.<br />Your funds are safe.<br />This transfer can be manually withdrawn at the destination on the <Link href={`${appBaseUrl}/#/withdraw?transferId=${x.transferId}`} target="_blank" rel="noreferrer noopener">Hop Withdraw Page ↗</Link>.<br /><br />Parameters used:<br /><small>Deadline: {x.deadline}<br />AmountOutMin: {x.amountOutMinFormatted || x.amountOutMin}</small>{x.destinationChainSlug === 'ethereum' ? <><br /><br /><small>These parameters should be 0 when sending to Ethereum, otherwise transfer will be invalid.</small></> : ''}</Box>}>
                                <span>⚠️ Unbondable</span>
                              </Tooltip>
                              {(x.timestamp < (Date.now()/1000) - (24 * 60 * 60)) && (
                                <Box ml={2}>
                                <Link href={`${appBaseUrl}/#/withdraw?transferId=${x.transferId}`} target="_blank" rel="noreferrer noopener">Withdraw</Link>
                                </Box>
                              )}
                            </span>
                          : <>{(!x.receiveStatusUnknown && !x.bondTransactionHashExplorerUrl && !x.bonded) && (
                              <Tooltip title={<Box>This transaction is still waiting to be bonded or received at the destination. {(x.timestamp < (Date.now()/1000) - (12 * 60 * 60)) && <Box>Your funds are safe. If this transaction has been pending for more than a day, you can try manullay withdrawing the transfer at the destination on the <Link href={`${appBaseUrl}/#/withdraw?transferId=${x.transferId}`} target="_blank" rel="noreferrer noopener">Hop Withdraw Page ↗</Link>.</Box>}</Box>}>
                              <span className="no">
                                <img width="16" height="16" src={x.destinationChainImageUrl} alt={x.destinationChainName} />
                                <span>Pending</span>
                                {(x.timestamp < (Date.now()/1000) - (24 * 60 * 60)) && (
                                  <Box ml={2}>
                                  <Link href={`${appBaseUrl}/#/withdraw?transferId=${x.transferId}`} target="_blank" rel="noreferrer noopener">Withdraw ↗</Link>
                                  </Box>
                                )}
                              </span>
                            </Tooltip>
                          )}</>
                          }
                        </Typography>
                      </TableCell>
                      <TableCell className="bondTx">
                        <Box display="flex" alignItems="center">
                          <Typography variant="body1" color="secondary" component="div">
                            {x.preregenesis && (
                              <Tooltip title={'This transaction occurred before the Optimism Regenesis'}>
                                <span>
                                (pre-regenesis)
                                </span>
                              </Tooltip>
                            )}
                            {x.bondTransactionHash && (
                              <Box display="flex" alignItems="center">
                                <Link className="clipboard" data-clipboard-text={x.bondTransactionHash} onClick={setCopiedTimeoutFn(x.bondTransactionHash)}><Tooltip title="Copy transaction hash to clipboard">{copied === x.bondTransactionHash ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                                <Link className={x.destinationChainSlug} href={x.bondTransactionHashExplorerUrl} target="_blank" rel="noreferrer noopener">
                                  <Tooltip title={<Box>View on {x.destinationChainName} block explorer<br />Bond tx hash: {x.bondTransactionHash}</Box>}>
                                    <span>{ x.bondTransactionHashTruncated }</span>
                                  </Tooltip>
                                </Link>
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell className="bondedDate" >
                        <Tooltip title={
                          !!x.bondTimestamp ? (
                            <Box>UTC: {x.bondTimestampIso}<br />Local: {x.localBondTimestampIso}<br />Unix: {x.bondTimestamp}<br />Relative: { x.estimatedRelativeTimeUntilBond || x.bondTimestampRelative }</Box>
                          ) : <Box>Relative: { x.estimatedRelativeTimeUntilBond || x.bondTimestampRelative }</Box>
                          }>
                          <Typography variant="body1" color="secondary">
                            { x.estimatedRelativeTimeUntilBond || x.bondTimestampRelative }
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="bondedWithin">
                        <Tooltip title={<Box>UTC: {x.bondTimestampIso}<br />Unix: {x.bondTimestamp}<br />Relative: { x.estimatedRelativeTimeUntilBond || x.bondTimestampRelative }<br />Bonded within: { x.bondWithinTimestampRelative }</Box>}>
                          <Typography variant="body1" color="secondary">
                            { x.bondWithinTimestampRelative }
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="bondedWithin">
                        <Typography variant="body1" color="secondary" component="div">
                          {x.bonderAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                              <Link className="clipboard" data-clipboard-text={x.bonderAddress} rel="noreferrer noopener" onClick={setCopiedTimeoutFn(x.bonderAddress)}><Tooltip title="Copy bonder address to clipboard">{copied === x.bonderAddress ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                              <Link className="bonder" href={x.bonderAddressExplorerUrl} target="_blank" rel="noreferrer noopener">
                                <Tooltip title={<Box>View on {x.destinationChainName} block explorer<br />Bonder: {x.bonderAddress}</Box>}>
                                  <span>{ x.bonderAddressTruncated }</span>
                                </Tooltip>
                              </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin">
                        <Typography variant="body1" color="secondary" component="div">
                          {x.accountAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                              <Link className="clipboard" data-clipboard-text={x.accountAddress} rel="noreferrer noopener" onClick={setCopiedTimeoutFn(x.accountAddress)}><Tooltip title="Copy account address to clipboard">{copied === x.accountAddress ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                              <Link className="bonder" href={x.accountAddressExplorerUrl} target="_blank" rel="noreferrer noopener">
                                <Tooltip title={<Box>View on {x.sourceChainName} block explorer<br />Account: {x.accountAddress}</Box>}>
                                  <span>{ x.accountAddressTruncated }</span>
                                </Tooltip>
                              </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin">
                        <Typography variant="body1" color="secondary" component="div">
                          {x.recipientAddressExplorerUrl && (
                            <Box display="flex" alignItems="center">
                            <Link className="clipboard" data-clipboard-text={x.recipientAddress} rel="noreferrer noopener" onClick={setCopiedTimeoutFn(x.recipientAddress)}><Tooltip title="Copy account address to clipboard">{copied === x.recipientAddress ? <CheckIcon /> : <ContentCopyIcon />}</Tooltip></Link>
                            {x.isDifferentRecipient && (
                              <Tooltip title="The recipient is different than the sender. If this was not expected then make sure that the website you sent from was not a scam site. The official website is app.hop.exchange">
                                <span style={{ cursor: 'help' }}>⚠️ </span>
                              </Tooltip>
                            )}
                            <Link className="bonder" href={x.recipientAddressExplorerUrl} target="_blank" rel="noreferrer noopener">
                              <Tooltip title={<Box>View on {x.destinationChainName} block explorer<br />Recipient: {x.recipientAddress}</Box>}>
                                <span>{ x.recipientAddressTruncated }</span>
                              </Tooltip>
                            </Link>
                            </Box>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell className="bondedWithin">
                        <Tooltip title={`This transfer was originated from a ${x.integrationPartnerName} app/integration.`}>
                          <Box display="flex" alignItems="center">
                            {x.integrationPartnerImageUrl && (
                              <img width="16" height="16" src={x.integrationPartnerImageUrl} alt={x.integrationPartnerName} />
                            )}
                            <Typography variant="body1" color="secondary">
                              {x.integrationPartnerName}
                            </Typography>
                          </Box>
                        </Tooltip>
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
                <Button onClick={firstPage} className="paginationButton" startIcon={<FirstPageIcon />}>First</Button>
              )}
              {hasPreviousPage && (
                <Button onClick={previousPage} className="paginationButton" startIcon={<NavigateBeforeIcon />}>Previous</Button>
              )}
              {hasNextPage && (
                <Button onClick={nextPage} className="paginationButton" endIcon={<NavigateNextIcon />}>Next</Button>
              )}
            </div>
          </div>
        </details>
        <Box mt={6} mb={6} display="flex" alignItems="center" justifyContent="center">
          <Box>
            <Link href="https://twitter.com/hopprotocol" target="_blank" rel="noreferrer noopener"><TwitterIcon  /></Link>
          </Box>
          <Box ml={2}>
            <Link href="https://github.com/hop-protocol/explorer" target="_blank" rel="noreferrer noopener"><GitHubIcon  /></Link>
          </Box>
        </Box>
      </Box>
      </Box>
    </>
  )
}

export default Index
