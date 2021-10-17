// TODO: refactor to a react app

const poll = true
const fetchInterval = 10 * 1000
const enabledTokens = ['USDC', 'USDT', 'DAI', 'MATIC', 'ETH']
const enabledChains = ['ethereum', 'xdai', 'polygon', 'optimism', 'arbitrum']

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

let perPage = 100
try {
  const cached = Number(localStorage.getItem('perPage'))
  if (cached) {
    perPage = cached
  }
} catch (err) {
  console.error(err)
}

const app = new Vue({
  el: '#app',
  data: {
    perPage,
    filterBonded: queryParams.bonded || '',
    filterToken: queryParams.token || '',
    filterSource: queryParams.source || '',
    filterDestination: queryParams.destination || '',
    filterAmount: queryParams.amount || '',
    filterAmountComparator: queryParams.amountCmp || 'gt',
    chartAmountSize: false,
    page: 0,
    allTransfers: [],
    transfers: [],
    chartSelection: '',
    tvl: {
      xdai: {
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
      xdai: {
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

          if (this.setFilterBonded) {
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

          // remove this once polygon subgraph has finished syncing
          if (x.token === 'ETH' && x.destinationChainSlug === 'polygon') {
            return false
          }

          const oneDayAgo = luxon.DateTime.utc().minus({ days: 1 }).toSeconds()
          if (x.timestamp < oneDayAgo) {
            return false
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
      this.refreshTransfers()
    },
    setFilterSource (event) {
      const value = event.target.value
      Vue.set(app, 'filterSource', value)
      this.refreshTransfers()
    },
    setFilterDestination (event) {
      const value = event.target.value
      Vue.set(app, 'filterDestination', value)
      this.refreshTransfers()
    },
    setFilterToken (event) {
      const value = event.target.value
      Vue.set(app, 'filterToken', value)
      this.refreshTransfers()
    },
    setAmount (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmount', value)
      this.refreshTransfers()
    },
    setAmountComparator (event) {
      const value = event.target.value
      Vue.set(app, 'filterAmountComparator', value)
      this.refreshTransfers()
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
  77: 'xdai',
  100: 'xdai',
  137: 'polygon',
  42161: 'arbitrum',
  421611: 'arbitrum'
}

const chainSlugToNameMap = {
  ethereum: 'Ethereum',
  xdai: 'xDai',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  optimism: 'Optimism',
  arbitrum: 'Arbitrum'
}

const colorsMap = {
  ethereum: '#868dac',
  xdai: '#46a4a1',
  polygon: '#8b57e1',
  optimism: '#e64b5d',
  arbitrum: '#289fef',
  fallback: '#9f9fa3'
}

const chainLogosMap = {
  ethereum: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg',
  xdai: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/xdai.svg',
  polygon: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/polygon.svg',
  optimism: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/optimism.svg',
  arbitrum: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/arbitrum.svg'
}

const tokenLogosMap = {
  USDC: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdc.svg',
  USDT: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdt.svg',
  DAI: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/dai.svg',
  MATIC: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/matic.svg',
  ETH: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg'
}

const tokenDecimals = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18
}

function explorerLink (chain, transactionHash) {
  let base = ''
  if (chain === 'xdai') {
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

  return `${base}/tx/${transactionHash}`
}

function getUrl (chain) {
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
  return jsonRes.data
}

async function fetchTransfers (chain) {
  const queryL1 = `
    query TransferSentToL2 {
      transferSents: transferSentToL2S(
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        destinationChainId
        amount
        relayerFee
        transactionHash
        timestamp
        token
      }
    }
  `
  const queryL2 = `
    query TransferSents {
      transferSents(
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        transferId
        destinationChainId
        amount
        bonderFee
        transactionHash
        timestamp
        token
      }
    }
  `
  const url = getUrl(chain)
  let query = queryL1
  if (chain !== 'mainnet') {
    query = queryL2
  }
  const data = await queryFetch(url, query)
  return data.transferSents.map(x => {
    x.destinationChainId = Number(x.destinationChainId)
    return x
  })
}

async function fetchBonds (chain) {
  const query = `
    query WithdrawalBondeds {
      withdrawalBondeds(
        first: 1000,
        orderBy: timestamp,
        orderDirection: desc
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
  const data = await queryFetch(url, query)
  return data.withdrawalBondeds
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
  await Promise.all([
    updateTvl().catch(err => console.error(err)),
    updateVolume().catch(err => console.error(err)),
    updateTransfers().catch(err => console.error(err))
  ])
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
    xdaiTvl,
    polygonTvl,
    optimismTvl,
    arbitrumTvl,
    mainnetTvl
  ] = await Promise.all([
    fetchTvl('xdai'),
    fetchTvl('polygon'),
    fetchTvl('optimism'),
    fetchTvl('arbitrum'),
    fetchTvl('mainnet')
  ])

  const xdai = formatTvl(xdaiTvl)
  const polygon = formatTvl(polygonTvl)
  const optimism = formatTvl(optimismTvl)
  const arbitrum = formatTvl(arbitrumTvl)
  const ethereum = formatTvl(mainnetTvl)
  const totalAmount = xdai.amount + polygon.amount + optimism.amount + arbitrum.amount + ethereum.amount
  const total = {
    amount: totalAmount,
    formattedAmount: formatCurrency(totalAmount)
  }

  const tvl = {
    xdai,
    polygon,
    optimism,
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
    xdaiVolume,
    polygonVolume,
    optimismVolume,
    arbitrumVolume,
    mainnetVolume
  ] = await Promise.all([
    fetchVolume('xdai'),
    fetchVolume('polygon'),
    fetchVolume('optimism'),
    fetchVolume('arbitrum'),
    fetchVolume('mainnet')
  ])

  const xdai = formatVolume(xdaiVolume)
  const polygon = formatVolume(polygonVolume)
  const optimism = formatVolume(optimismVolume)
  const arbitrum = formatVolume(arbitrumVolume)
  const ethereum = formatVolume(mainnetVolume)

  const totalAmount = xdai.amount + polygon.amount + optimism.amount + arbitrum.amount + ethereum.amount
  const total = {
    amount: totalAmount,
    formattedAmount: formatCurrency(totalAmount)
  }

  const volume = {
    xdai,
    polygon,
    optimism,
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
  const data = []
  const [
    xdaiTransfers,
    polygonTransfers,
    optimismTransfers,
    arbitrumTransfers,
    mainnetTransfers
  ] = await Promise.all([
    enabledChains.includes('xdai') ? fetchTransfers('xdai') : Promise.resolve([]),
    enabledChains.includes('polygon') ? fetchTransfers('polygon') : Promise.resolve([]),
    enabledChains.includes('optimism') ? fetchTransfers('optimism') : Promise.resolve([]),
    enabledChains.includes('arbitrum') ? fetchTransfers('arbitrum') : Promise.resolve([]),
    enabledChains.includes('ethereum') ? fetchTransfers('mainnet') : Promise.resolve([])
  ])

  const [
    xdaiBonds,
    polygonBonds,
    optimismBonds,
    arbitrumBonds,
    mainnetBonds
  ] = await Promise.all([
    enabledChains.includes('xdai') ? fetchBonds('xdai') : Promise.resolve([]),
    enabledChains.includes('xdai') ? fetchBonds('polygon') : Promise.resolve([]),
    enabledChains.includes('optimism') ? fetchBonds('optimism') : Promise.resolve([]),
    enabledChains.includes('arbitrum') ? fetchBonds('arbitrum') : Promise.resolve([]),
    enabledChains.includes('ethereum') ? fetchBonds('mainnet') : Promise.resolve([])
  ])

  for (const x of xdaiTransfers) {
    data.push({
      sourceChain: 100,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      bonderFee: x.bonderFee,
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
      bonderFee: x.bonderFee,
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
      bonderFee: x.bonderFee,
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
      bonderFee: x.relayerFee,
      transferId: x.id,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp),
      token: x.token
    })
  }

  for (const x of data) {
    x.bonded = x.sourceChain === 1
  }

  const bondsMap = {
    xdai: xdaiBonds,
    polygon: polygonBonds,
    optimism: optimismBonds,
    arbitrum: arbitrumBonds,
    ethereum: mainnetBonds
  }

  for (const x of data) {
    const bonds = bondsMap[chainIdToSlugMap[x.destinationChain]]
    if (bonds) {
      for (const bond of bonds) {
        if (bond.transferId === x.transferId) {
          x.bonded = true
          x.bondTransactionHash = bond.transactionHash
          x.bondedTimestamp = Number(bond.timestamp)
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
  const transferTime = luxon.DateTime.fromSeconds(x.timestamp)
  x.isoTimestamp = transferTime.toISO()
  x.relativeTimestamp = transferTime.toRelative()

  x.sourceChainSlug = chainIdToSlugMap[x.sourceChain]
  x.destinationChainSlug = chainIdToSlugMap[x.destinationChain]

  x.sourceChainName = chainSlugToNameMap[x.sourceChainSlug]
  x.destinationChainName = chainSlugToNameMap[x.destinationChainSlug]

  x.sourceChainImageUrl = chainLogosMap[x.sourceChainSlug]
  x.destinationChainImageUrl = chainLogosMap[x.destinationChainSlug]

  x.sourceTxExplorerUrl = explorerLink(x.sourceChainSlug, x.transactionHash)
  x.bondTxExplorerUrl = x.bondTransactionHash ? explorerLink(x.destinationChainSlug, x.bondTransactionHash) : ''

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
  x.displayAmount = formatCurrency(ethers.utils.formatUnits(x.amount, decimals), x.token)
  x.displayBonderFee = formatCurrency(ethers.utils.formatUnits(x.bonderFee, decimals), x.token)
  x.tokenImageUrl = tokenLogosMap[x.token]

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

  if (token === 'MATIC') {
    return `${currencyFormatter.format(value)}`
  }

  return `$${currencyFormatter.format(value)}`
}

async function main () {
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

main()
