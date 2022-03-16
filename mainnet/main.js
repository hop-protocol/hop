// TODO: refactor to a react app

const poll = true
const fetchInterval = 20 * 1000
const enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH', 'WBTC']
const enabledChains = ['ethereum', 'gnosis', 'polygon', 'arbitrum', 'optimism']

let queryParams = {}
try {
  const query = window.location.search.substr(1)
  queryParams = query.split('&').reduce((acc, x) => {
    const split = x.split('=')
    acc[split[0]] = split[1]
    return acc
  }, {})
} catch (err) {
  console.error(err)
}

let perPage = 25

try {
  const cached = Number(localStorage.getItem('perPage'))
  if (cached) {
    perPage = cached
  }
} catch (err) {
  console.error(err)
}

const currentDate = luxon.DateTime.now().toFormat('yyyy-MM-dd')
const app = new Vue({
  el: '#app',
  data: {
    loadingData: false,
    filterDate: queryParams.date || currentDate,
    minDate: '2020-07-01',
    maxDate: currentDate,
    perPage,
    filterBonded: queryParams.bonded || '',
    filterToken: queryParams.token || '',
    filterSource: queryParams.source || '',
    filterDestination: queryParams.destination || '',
    filterAmount: queryParams.amount || '',
    filterAmountComparator: queryParams.amountCmp || 'gt',
    filterAmountUsd: queryParams.amountUsd || '',
    filterAmountUsdComparator: queryParams.amountUsdCmp || 'gt',
    filterBonder: queryParams.bonder || '',
    filterAccount: queryParams.account || '',
    filterTransferId: queryParams.transferId || '',
    chartAmountSize: false,
    page: 0,
    allTransfers: [],
    transfers: [],
    chartSelection: '',
    prices: {},
    tvl: {
      gnosis: {
        formattedAmount: '-'
      },
      polygon: {
        formattedAmount: '-'
      },
      optimism: {
        formattedAmount: '-'
      },
      arbitrum: {
        formattedAmount: '-'
      },
      ethereum: {
        formattedAmount: '-'
      },
      total: {
        formattedAmount: '-'
      }
    },
    volume: {
      gnosis: {
        formattedAmount: '-'
      },
      polygon: {
        formattedAmount: '-'
      },
      optimism: {
        formattedAmount: '-'
      },
      arbitrum: {
        formattedAmount: '-'
      },
      ethereum: {
        formattedAmount: '-'
      },
      total: {
        formattedAmount: '-'
      }
    }
  },
  computed: {
    hasPreviousPage () {
      return this.page > 0
    },
    hasNextPage () {
      return this.page < (this.allTransfers.length / this.perPage) - 1
    }
  },
  methods: {
    refreshTransfers () {
      const start = this.page * this.perPage
      const end = start + this.perPage
      const paginated = this.allTransfers
        .filter(x => {
          if (this.filterToken) {
            if (x.token !== this.filterToken) {
              return false
            }
          }

          if (this.filterSource) {
            if (x.sourceChainSlug !== this.filterSource) {
              return false
            }
          }

          if (this.filterDestination) {
            if (x.destinationChainSlug !== this.filterDestination) {
              return false
            }
          }

          if (this.filterBonded) {
            if (this.filterBonded === 'pending') {
              if (x.bonded) {
                return false
              }
            } else if (this.filterBonded === 'bonded') {
              if (!x.bonded) {
                return false
              }
            }
          }

          if (this.filterBonder) {
            if (!x.bonder) {
              return false
            }
            if (x.bonder && this.filterBonder.toLowerCase() !== x.bonder.toString()) {
              return false
            }
          }

          if (this.filterAmount && this.filterAmountComparator) {
            if (this.filterAmountComparator === 'eq') {
              if (Number(x.formattedAmount) !== Number(this.filterAmount)) {
                return false
              }
            } else if (this.filterAmountComparator === 'gt') {
              if (Number(x.formattedAmount) <= Number(this.filterAmount)) {
                return false
              }
            } else if (this.filterAmountComparator === 'lt') {
              if (Number(x.formattedAmount) >= Number(this.filterAmount)) {
                return false
              }
            }
          }

          if (this.filterAmountUsd && this.filterAmountUsdComparator) {
            if (this.filterAmountUsdComparator === 'eq') {
              if (Number(x.amountUsd) !== Number(this.filterAmountUsd)) {
                return false
              }
            } else if (this.filterAmountUsdComparator === 'gt') {
              if (Number(x.amountUsd) <= Number(this.filterAmountUsd)) {
                return false
              }
            } else if (this.filterAmountUsdComparator === 'lt') {
              if (Number(x.amountUsd) >= Number(this.filterAmountUsd)) {
                return false
              }
            }
          }

          return true
        })
        .slice(start, end)
      Vue.set(app, 'transfers', paginated)

      updateChart(app.transfers)
    },
    updateTransfers (transfers) {
      Vue.set(app, 'allTransfers', transfers)
      this.refreshTransfers()
    },
    updatePrices (prices) {
      Vue.set(app, 'prices', prices)
    },
    previousPage () {
      Vue.set(app, 'page', Math.max(this.page - 1, 0))
      this.refreshTransfers()
    },
    nextPage () {
      Vue.set(app, 'page', Math.min(this.page + 1, Math.floor(this.allTransfers.length / this.perPage)))
      this.refreshTransfers()
    },
    setPerPage (event) {
      const value = event.target.value
      const perPage = Number(value)
      Vue.set(app, 'perPage', perPage)
      try {
        localStorage.setItem('perPage', perPage)
      } catch (err) {
        console.error(err)
      }
      this.refreshTransfers()
    },
    setFilterBonded (event) {
      const value = event.target.value
      Vue.set(app, 'filterBonded', value)
      updateQueryParams({ bonded: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterSource (event) {
      const value = event.target.value
      Vue.set(app, 'filterSource', value)
      updateQueryParams({ source: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterDestination (event) {
      const value = event.target.value
      Vue.set(app, 'filterDestination', value)
      updateQueryParams({ destination: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterToken (event) {
      const value = event.target.value
      Vue.set(app, 'filterToken', value)
      updateQueryParams({ token: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterAmount (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmount', value)
      updateQueryParams({ amount: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterAmountComparator (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmountComparator', value)
      updateQueryParams({ amountCmp: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterAmountUsd (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmountUsd', value)
      updateQueryParams({ amountUsd: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterAmountUsdComparator (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmountUsdComparator', value)
      updateQueryParams({ amountUsdCmp: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterBonder (event) {
      const value = event.target.value
      Vue.set(app, 'filterBonder', value)
      updateQueryParams({ bonder: value })
      this.resetPage()
      this.refreshTransfers()
    },
    setFilterAccount (event) {
      const value = event.target.value
      Vue.set(app, 'filterAccount', value)
      updateQueryParams({ account: value })
      this.resetPage()
      updateData()
    },
    setFilterTransferId (event) {
      const value = event.target.value
      Vue.set(app, 'filterTransferId', value)
      updateQueryParams({ transferId: value })
      this.resetPage()
      updateData()
    },
    setTvl (tvl) {
      Vue.set(app, 'tvl', tvl)
    },
    setVolume (volume) {
      Vue.set(app, 'volume', volume)
    },
    enableChartAmountSize (event) {
      const value = event.target.checked
      Vue.set(app, 'chartAmountSize', value)
      updateChart(app.transfers)
    },
    setChartSelection (value) {
      Vue.set(app, 'chartSelection', value)
    },
    setFilterDate () {
      this.resetPage()
      updateData()
    },
    resetPage () {
      Vue.set(app, 'page', 0)
    }
  }
})

const chainToIndexMapSource = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapSource[enabledChains[i]] = i
}

const chainToIndexMapDestination = {}
for (let i = 0; i < enabledChains.length; i++) {
  chainToIndexMapDestination[enabledChains[i]] = i + enabledChains.length
}

const chainIdToSlugMap = {
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

const chainSlugToNameMap = {
  ethereum: 'Ethereum',
  gnosis: 'Gnosis',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  arbitrum: 'Arbitrum'
}

const colorsMap = {
  ethereum: '#868dac',
  gnosis: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  fallback: '#9f9fa3'
}

const chainLogosMap = {
  ethereum: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg',
  gnosis: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/gnosis.svg',
  polygon: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/polygon.svg',
  optimism: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/optimism.svg',
  arbitrum: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/arbitrum.svg'
}

const tokenLogosMap = {
  USDC: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdc.svg',
  USDT: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdt.svg',
  DAI: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/dai.svg',
  MATIC: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/matic.svg',
  ETH: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/eth.svg'
}

const tokenDecimals = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18
}

function explorerLink (chain) {
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

function explorerLinkAddress (chain, address) {
  const base = explorerLink(chain)
  return `${base}/address/${address}`
}

function explorerLinkTx (chain, transactionHash) {
  const base = explorerLink(chain)
  return `${base}/tx/${transactionHash}`
}

function getUrl (chain) {
  if (chain === 'gnosis') {
    chain = 'xdai'
  }

  if (chain === 'mainnet') {
    return 'https://gateway.thegraph.com/api/bd5bd4881b83e6c2c93d8dc80c9105ba/subgraphs/id/Cjv3tykF4wnd6m9TRmQV7weiLjizDnhyt6x2tTJB42Cy'
  }

  return `https://api.thegraph.com/subgraphs/name/hop-protocol/hop-${chain}`
}

async function queryFetch (url, query, variables) {
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

async function fetchTransfers (chain, startTime, endTime, skip) {
  const transferId = app.filterTransferId
  const account = app.filterAccount?.toLowerCase()
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
    .filter(x => x)
    .map(x => {
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
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return transfers
}

async function fetchBonds (chain, startTime, endTime, lastId, transferId) {
  const query = `
    query WithdrawalBondeds($startTime: Int, $endTime: Int, $lastId: ID, $transferId: String, $transferIds: [String]) {
      withdrawalBondeds1: withdrawalBondeds(
        where: {
          ${Array.isArray(transferId)
? 'transferId_in: $transferIds'
          : transferId ? 'transferId: $transferId' : 'timestamp_gte: $startTime, timestamp_lte: $endTime'},
          id_gt: $lastId
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
      }${typeof transferId === 'string'
? `
      , withdrawalBondeds2: withdrawalBondeds(
        where: {
          transactionHash: $transferId
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
      }`
: ''}
    }
  `

  const url = getUrl(chain)
  const data = await queryFetch(url, query, {
    startTime,
    endTime,
    transferId: !Array.isArray(transferId) ? transferId : undefined,
    transferIds: Array.isArray(transferId) ? transferId : [],
    lastId: lastId || '0x0000000000000000000000000000000000000000'
  })

  let bonds = (data.withdrawalBondeds1 || []).concat(data.withdrawalBondeds2 || [])

  if (bonds.length === 1000) {
    try {
      const newLastId = bonds[bonds.length - 1].id
      if (lastId === newLastId) {
        return bonds
      }
      lastId = newLastId
      bonds = bonds.concat(...(await fetchBonds(
        chain,
        startTime,
        endTime,
        lastId,
        transferId
      )))
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return bonds
}

async function fetchWithdrews (chain, startTime, endTime, skip, transferId) {
  const query = `
    query Withdrews($perPage: Int, $startTime: Int, $endTime: Int, $transferId: String) {
      withdrews(
        where: {
          ${transferId ? 'transferId: $transferId' : 'timestamp_gte: $startTime, timestamp_lte: $endTime'}
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
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
    skip,
    transferId
  })
  let withdrawals = data.withdrews || []

  if (withdrawals.length === 1000) {
    try {
      withdrawals = withdrawals.concat(...(await fetchWithdrews(
        chain,
        startTime,
        endTime,
        skip + 1000
      )))
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return withdrawals
}

async function fetchTransferFromL1Completeds (chain, startTime, endTime, skip) {
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
    } catch (err) {
      if (!err.message.includes('The `skip` argument must be between')) {
        throw err
      }
    }
  }

  return events
}

async function fetchTvl (chain) {
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

async function fetchVolume (chain) {
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

async function updateData () {
  Vue.set(app, 'loadingData', true)
  await Promise.all([
    // updateTvl().catch(err => console.error(err)),
    // updateVolume().catch(err => console.error(err)),
    updateTransfers().catch(err => console.error(err))
  ])
  Vue.set(app, 'loadingData', false)
}

function formatTvl (tvls) {
  let amount = 0
  for (const tvl of tvls) {
    const decimals = tokenDecimals[tvl.token]
    const rawAmount = ethers.BigNumber.from(tvl.amount)
    const _amount = Number(ethers.utils.formatUnits(rawAmount, decimals))
    amount = amount + _amount
  }
  const formattedAmount = formatCurrency(amount)
  return {
    amount,
    formattedAmount
  }
}

function formatVolume (volumes) {
  let amount = 0
  for (const volume of volumes) {
    const decimals = tokenDecimals[volume.token]
    const rawAmount = ethers.BigNumber.from(volume.amount)
    const _amount = Number(ethers.utils.formatUnits(rawAmount, decimals))
    amount = amount + _amount
  }
  const formattedAmount = formatCurrency(amount)
  return {
    amount,
    formattedAmount
  }
}

async function updateTvl () {
  const [
    gnosisTvl,
    polygonTvl,
    // optimismTvl,
    arbitrumTvl,
    mainnetTvl
  ] = await Promise.all([
    fetchTvl('gnosis'),
    fetchTvl('polygon'),
    // fetchTvl('optimism'),
    fetchTvl('arbitrum'),
    fetchTvl('mainnet')
  ])

  const gnosis = formatTvl(gnosisTvl)
  const polygon = formatTvl(polygonTvl)
  // const optimism = formatTvl(optimismTvl)
  const arbitrum = formatTvl(arbitrumTvl)
  const ethereum = formatTvl(mainnetTvl)
  // const totalAmount = gnosis.amount + polygon.amount + optimism.amount + arbitrum.amount + ethereum.amount
  const totalAmount = gnosis.amount + polygon.amount + arbitrum.amount + ethereum.amount
  const total = {
    amount: totalAmount,
    formattedAmount: formatCurrency(totalAmount)
  }

  const tvl = {
    gnosis,
    polygon,
    // optimism,
    arbitrum,
    ethereum,
    total
  }

  app.setTvl(tvl)

  try {
    localStorage.setItem('tvl', JSON.stringify(tvl))
  } catch (err) {
    console.error(err)
  }
}

async function updateVolume () {
  const [
    gnosisVolume,
    polygonVolume,
    // optimismVolume,
    arbitrumVolume,
    mainnetVolume
  ] = await Promise.all([
    fetchVolume('gnosis'),
    fetchVolume('polygon'),
    // fetchVolume('optimism'),
    fetchVolume('arbitrum'),
    fetchVolume('mainnet')
  ])

  const gnosis = formatVolume(gnosisVolume)
  const polygon = formatVolume(polygonVolume)
  // const optimism = formatVolume(optimismVolume)
  const arbitrum = formatVolume(arbitrumVolume)
  const ethereum = formatVolume(mainnetVolume)

  // const totalAmount = gnosis.amount + polygon.amount + optimism.amount + arbitrum.amount + ethereum.amount
  const totalAmount = gnosis.amount + polygon.amount + arbitrum.amount + ethereum.amount
  const total = {
    amount: totalAmount,
    formattedAmount: formatCurrency(totalAmount)
  }

  const volume = {
    gnosis,
    polygon,
    // optimism,
    arbitrum,
    ethereum,
    total
  }

  app.setVolume(volume)

  try {
    localStorage.setItem('volume', JSON.stringify(volume))
  } catch (err) {
    console.error(err)
  }
}

async function updateTransfers () {
  let data = []
  const endDate = luxon.DateTime.fromFormat(app.filterDate, 'yyyy-MM-dd').endOf('day').toUTC()
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

  let transferId = app.filterTransferId
  if (data.length === 1) {
    if (data[0].transferId) {
      transferId = data[0].transferId
    }
  }

  const _transferId = app.filterAccount ? data.map(x => x.transferId) : transferId

  const [
    gnosisBondedWithdrawals,
    polygonBondedWithdrawals,
    optimismBondedWithdrawals,
    arbitrumBondedWithdrawals,
    mainnetBondedWithdrawals,

    gnosisWithdrews,
    polygonWithdrews,
    optimismWithdrews,
    arbitrumWithdrews,
    mainnetWithdrews,

    gnosisFromL1Completeds,
    polygonFromL1Completeds,
    optimismFromL1Completeds,
    arbitrumFromL1Completeds
  ] = await Promise.all([
    enabledChains.includes('gnosis') ? fetchBonds('gnosis', startTime, endTime, undefined, _transferId) : Promise.resolve([]),
    enabledChains.includes('polygon') ? fetchBonds('polygon', startTime, endTime, undefined, _transferId) : Promise.resolve([]),
    enabledChains.includes('optimism') ? fetchBonds('optimism', startTime, endTime, undefined, _transferId) : Promise.resolve([]),
    enabledChains.includes('arbitrum') ? fetchBonds('arbitrum', startTime, endTime, undefined, _transferId) : Promise.resolve([]),
    enabledChains.includes('ethereum') ? fetchBonds('mainnet', startTime, endTime, undefined, _transferId) : Promise.resolve([]),

    enabledChains.includes('gnosis') ? fetchWithdrews('gnosis', startTime, endTime, undefined, transferId) : Promise.resolve([]),
    enabledChains.includes('polygon') ? fetchWithdrews('polygon', startTime, endTime, undefined, transferId) : Promise.resolve([]),
    enabledChains.includes('optimism') ? fetchWithdrews('optimism', startTime, endTime, undefined, transferId) : Promise.resolve([]),
    enabledChains.includes('arbitrum') ? fetchWithdrews('arbitrum', startTime, endTime, undefined, transferId) : Promise.resolve([]),
    enabledChains.includes('ethereum') ? fetchWithdrews('mainnet', startTime, endTime, undefined, transferId) : Promise.resolve([]),

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

  const bondsMap = {
    gnosis: gnosisBonds,
    polygon: polygonBonds,
    optimism: optimismBonds,
    arbitrum: arbitrumBonds,
    ethereum: mainnetBonds
  }

  const l1CompletedsMap = {
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

  app.updateTransfers(populatedData)

  try {
    localStorage.setItem('data', JSON.stringify(populatedData.slice(0, 200)))
  } catch (err) {
    console.error(err)
  }

  return populatedData
}

function populateTransfer (x, i) {
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
    const hours = Number(diff.hours.toFixed(0))
    let minutes = Number(diff.minutes.toFixed(0))
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
  x.displayAmount = x.formattedAmount.toFixed(2)
  x.displayBonderFee = formatCurrency(ethers.utils.formatUnits(x.bonderFee, decimals), x.token)
  x.tokenImageUrl = tokenLogosMap[x.token]

  x.amountUsd = ''
  x.displayAmountUsd = ''
  x.tokenPriceUsd = ''
  x.displayTokenPriceUsd = ''

  if (app.prices[x.token]) {
    const dates = app.prices[x.token].reverse().map((x) => x[0])
    const nearest = nearestDate(dates, x.timestamp)
    if (app.prices[x.token][nearest]) {
      const price = app.prices[x.token][nearest][1]
      x.amountUsd = price * x.formattedAmount
      x.displayAmountUsd = formatCurrency(x.amountUsd, 'USDC')
      x.tokenPriceUsd = price
      x.displayTokenPriceUsd = formatCurrency(x.tokenPrice, 'USDC')
    }
  }

  return x
}

async function updateChart (data) {
  const links = data.map(x => {
    return {
      source: chainToIndexMapSource[x.sourceChainSlug],
      target: chainToIndexMapDestination[x.destinationChainSlug],
      value: app.chartAmountSize ? x.formattedAmount : 1,
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
    d3.select('#chart svg').remove()
    const chart = d3.select('#chart').append('svg').chart('Sankey.Path')
    chart
      .name(label)
      .colorNodes(function (name, node) {
        return color(node, 1) || colorsMap.fallback
      })
      .colorLinks(function (link) {
        return color(link.source, 4) || color(link.target, 1) || colorsMap.fallback
      })
      .nodeWidth(15)
      .nodePadding(10)
      .spread(true)
      .iterations(0)
      .draw(graph)

    chart.on('link:mouseout', function (item) {
      app.setChartSelection('')
    })
    chart.on('link:mouseover', function (item) {
      const value = `${item.source.name}⟶${item.target.name} ${item.displayAmount} ${item.token}`
      app.setChartSelection(value)
    })

    function label (node) {
      return node.name.replace(/\s*\(.*?\)$/, '')
    }

    function color (node, depth) {
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

function formatCurrency (value, token) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD'
  })

  if (token === 'MATIC' || token === 'ETH') {
    return Number(value || 0).toFixed(5)
  }

  return `$${currencyFormatter.format(value)}`
}

async function main () {
  try {
    const priceDays = 2
    const pricesArr = await Promise.all([
      this.getPriceHistory('usd-coin', priceDays),
      this.getPriceHistory('tether', priceDays),
      this.getPriceHistory('dai', priceDays),
      this.getPriceHistory('ethereum', priceDays),
      this.getPriceHistory('matic-network', priceDays),
      this.getPriceHistory('wrapped-bitcoin', priceDays)
    ])
    const prices = {
      USDC: pricesArr[0],
      USDT: pricesArr[1],
      DAI: pricesArr[2],
      ETH: pricesArr[3],
      MATIC: pricesArr[4],
      WBTC: pricesArr[5]
    }
    app.updatePrices(prices)
  } catch (err) {
    console.error(err)
  }

  try {
    const data = JSON.parse(localStorage.getItem('data'))
    if (data) {
      app.updateTransfers(data)
      await updateChart(app.transfers)
    }
  } catch (err) {
    console.error(err)
  }

  try {
    const tvl = JSON.parse(localStorage.getItem('tvl'))
    if (tvl) {
      app.setTvl(tvl)
    }
  } catch (err) {
    console.error(err)
  }
  new Clipboard('.clipboard')

  updateData()
  if (poll) {
    while (true) {
      await new Promise((resolve) => setTimeout(() => resolve(null), fetchInterval))
      await updateData()
      await updateChart(app.transfers)
    }
  }
}

function truncateAddress (address) {
  return truncateString(address, 4)
}

function truncateHash (hash) {
  return truncateString(hash, 6)
}

function truncateString (str, splitNum) {
  if (!str) return ''
  return str.substring(0, 2 + splitNum) + '…' + str.substring(str.length - splitNum, str.length)
}

async function getPreRegenesisBondEvent (transferId, token) {
  const rpcUrl = 'https://mainnet-replica-4.optimism.io'
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
  const bridgeAddresses = {
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

function updateQueryParams (params) {
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
    console.log(err)
  }
}

async function getPriceHistory (coinId, days) {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!json.prices) {
        console.log(json)
      }
      return json.prices.map((data) => {
        data[0] = Math.floor(data[0] / 1000)
        return data
      })
    })
}

function nearestDate (dates, target) {
  if (!target) {
    target = Date.now()
  } else if (target instanceof Date) {
    target = target.getTime()
  }

  let nearest = Infinity
  let winner = -1

  dates.forEach(function (date, index) {
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

main()

const bridgeAbi = [{ inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }, { internalType: 'contract HopBridgeToken', name: '_hToken', type: 'address' }, { internalType: 'address', name: '_l1BridgeAddress', type: 'address' }, { internalType: 'uint256[]', name: '_activeChainIds', type: 'uint256[]' }, { internalType: 'address[]', name: 'bonders', type: 'address[]' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'newBonder', type: 'address' }], name: 'BonderAdded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'previousBonder', type: 'address' }], name: 'BonderRemoved', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalBondsSettled', type: 'uint256' }], name: 'MultipleWithdrawalsSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Stake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'relayer', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'TransferFromL1Completed', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'TransferRootSet', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'uint256', name: 'chainId', type: 'uint256' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'index', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'TransferSent', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' }, { indexed: false, internalType: 'uint256', name: 'rootCommittedAt', type: 'uint256' }], name: 'TransfersCommitted', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'account', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'Unstake', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'bonder', type: 'address' }, { indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }], name: 'WithdrawalBondSettled', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'WithdrawalBonded', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { indexed: true, internalType: 'address', name: 'recipient', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }, { indexed: false, internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }], name: 'Withdrew', type: 'event' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'activeChainIds', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'addActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'addBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [], name: 'ammWrapper', outputs: [{ internalType: 'contract L2_AmmWrapper', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }], name: 'bondWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'bondWithdrawalAndDistribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'destinationChainId', type: 'uint256' }], name: 'commitTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'address', name: 'relayer', type: 'address' }, { internalType: 'uint256', name: 'relayerFee', type: 'uint256' }], name: 'distribute', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'getBondedWithdrawalAmount', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getChainId', outputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getCredit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getDebitAndAdditionalDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'maybeBonder', type: 'address' }], name: 'getIsBonder', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'getNextTransferNonce', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'getRawDebit', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'getTransferId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRoot', outputs: [{ components: [{ internalType: 'uint256', name: 'total', type: 'uint256' }, { internalType: 'uint256', name: 'amountWithdrawn', type: 'uint256' }, { internalType: 'uint256', name: 'createdAt', type: 'uint256' }], internalType: 'struct Bridge.TransferRoot', name: '', type: 'tuple' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'getTransferRootId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'pure', type: 'function' }, { inputs: [], name: 'hToken', outputs: [{ internalType: 'contract HopBridgeToken', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'transferId', type: 'bytes32' }], name: 'isTransferIdSpent', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeAddress', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1BridgeCaller', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'l1Governance', outputs: [{ internalType: 'address', name: '', type: 'address' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'lastCommitTimeForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'maxPendingTransfers', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderBps', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minBonderFeeAbsolute', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'minimumForceCommitDelay', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingAmountForChainId', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }, { internalType: 'uint256', name: '', type: 'uint256' }], name: 'pendingTransferIdsForChainId', outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256[]', name: 'chainIds', type: 'uint256[]' }], name: 'removeActiveChainIds', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }], name: 'removeBonder', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'originalAmount', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }], name: 'rescueTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'chainId', type: 'uint256' }, { internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }], name: 'send', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'contract L2_AmmWrapper', name: '_ammWrapper', type: 'address' }], name: 'setAmmWrapper', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }], name: 'setHopBridgeTokenOwner', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeAddress', type: 'address' }], name: 'setL1BridgeAddress', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1BridgeCaller', type: 'address' }], name: 'setL1BridgeCaller', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: '_l1Governance', type: 'address' }], name: 'setL1Governance', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_maxPendingTransfers', type: 'uint256' }], name: 'setMaxPendingTransfers', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minBonderBps', type: 'uint256' }, { internalType: 'uint256', name: '_minBonderFeeAbsolute', type: 'uint256' }], name: 'setMinimumBonderFeeRequirements', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'uint256', name: '_minimumForceCommitDelay', type: 'uint256' }], name: 'setMinimumForceCommitDelay', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'setTransferRoot', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32', name: 'transferId', type: 'bytes32' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'settleBondedWithdrawal', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'bytes32[]', name: 'transferIds', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalAmount', type: 'uint256' }], name: 'settleBondedWithdrawals', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'bonder', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'stake', outputs: [], stateMutability: 'payable', type: 'function' }, { inputs: [], name: 'transferNonceIncrementer', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'unstake', outputs: [], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'recipient', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }, { internalType: 'bytes32', name: 'transferNonce', type: 'bytes32' }, { internalType: 'uint256', name: 'bonderFee', type: 'uint256' }, { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' }, { internalType: 'uint256', name: 'deadline', type: 'uint256' }, { internalType: 'bytes32', name: 'rootHash', type: 'bytes32' }, { internalType: 'uint256', name: 'transferRootTotalAmount', type: 'uint256' }, { internalType: 'uint256', name: 'transferIdTreeIndex', type: 'uint256' }, { internalType: 'bytes32[]', name: 'siblings', type: 'bytes32[]' }, { internalType: 'uint256', name: 'totalLeaves', type: 'uint256' }], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' }]
