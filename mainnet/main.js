const poll = true
const fetchInterval = 10 * 1000

const app = new Vue({
  el: '#app',
  data: {
    transfers: []
  },
  methods: {
    updateTransfers: (transfers) => {
      Vue.set(app, 'transfers', transfers)
    }
  }
})

const chainToIndexMapSource = {
  xdai: 1,
  polygon: 2,
  optimism: 2,
  ethereum: 0
}

const chainToIndexMapDestination = {
  ethereum: 3,
  xdai: 4,
  optimism: 5,
  polygon: 5
}

const chainIdToSlugMap = {
  1: 'ethereum',
  42: 'ethereum',
  69: 'optimism',
  77: 'xdai',
  100: 'xdai',
  137: 'polygon'
}

const colors = {
  ethereum: '#868dac',
  arbitrum: '#97ba4c',
  optimism: '#97ba4c',
  xdai: '#46a4a1',
  polygon: '#8b57e1',
  fallback: '#9f9fa3'
}

const chainLogos = {
  ethereum: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg',
  xdai: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/xdai.svg',
  polygon: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/polygon.svg'
}

const tokenLogos = {
  USDC: 'https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdc.svg'
}

function explorerLink (chain, transactionHash) {
  let base = ''
  if (chain === 'xdai') {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 'polygon') {
    base = 'https://polygonscan.com'
  } else {
    base = 'https://etherscan.io'
  }

  return `${base}/tx/${transactionHash}`
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
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        destinationChainId
        amount
        transactionHash
        timestamp
      }
    }
  `
  const queryL2 = `
    query TransferSents {
      transferSents(
        orderBy: timestamp,
        orderDirection: desc
      ) {
        transferId
        destinationChainId
        amount
        transactionHash
        timestamp
      }
    }
  `
  let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  let query = queryL1
  if (chain !== 'mainnet') {
    url = `${url}-${chain}`
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
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        transferId
        transactionHash
      }
    }
  `
  let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  if (chain !== 'mainnet') {
    url = `${url}-${chain}`
  }
  const data = await queryFetch(url, query)
  return data.withdrawalBondeds
}

async function updateData () {
  const data = []
  const [
    xdaiTransfers,
    polygonTransfers,
    mainnetTransfers
  ] = await Promise.all([
    fetchTransfers('xdai'),
    fetchTransfers('polygon'),
    fetchTransfers('mainnet')
  ])

  const [
    xdaiBonds,
    polygonBonds,
    mainnetBonds
  ] = await Promise.all([
    fetchBonds('xdai'),
    fetchBonds('polygon'),
    fetchBonds('mainnet')
  ])

  for (const x of xdaiTransfers) {
    data.push({
      sourceChain: 100,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp)
    })
  }
  for (const x of polygonTransfers) {
    data.push({
      sourceChain: 137,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      transferId: x.transferId,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp)
    })
  }
  for (const x of mainnetTransfers) {
    data.push({
      sourceChain: 1,
      destinationChain: x.destinationChainId,
      amount: x.amount,
      transferId: x.id,
      transactionHash: x.transactionHash,
      timestamp: Number(x.timestamp)
    })
  }

  for (const x of data) {
    x.bonded = false
  }

  const bondsMap = {
    xdai: xdaiBonds,
    polygon: polygonBonds,
    ethereum: mainnetBonds
  }

  for (const x of data) {
    const bonds = bondsMap[chainIdToSlugMap[x.destinationChain]]
    for (const bond of bonds) {
      if (bond.transferId === x.transferId) {
        x.bonded = true
        x.bondTransactionHash = bond.transactionHash
        continue
      }
    }
  }

  const populatedData = data.filter(x => x.destinationChain && x.transferId)
    .sort((a, b) => a.timestamp < b.timestamp)
    .map(populateTransfer)

  app.updateTransfers(populatedData)
  return populatedData
}

function populateTransfer (x) {
  const t = luxon.DateTime.fromSeconds(x.timestamp)
  x.isoTimestamp = t.toISO()
  x.relativeTimestamp = t.toRelative()

  x.sourceChainSlug = chainIdToSlugMap[x.sourceChain]
  x.destinationChainSlug = chainIdToSlugMap[x.destinationChain]

  x.sourceChainImageUrl = chainLogos[x.sourceChainSlug]
  x.destinationChainImageUrl = chainLogos[x.sourceChainSlug]

  x.sourceTxExplorerUrl = explorerLink(x.sourceChainSlug, x.transactionHash)
  x.bondTxExplorerUrl = x.bondTransactionHash ? explorerLink(x.destinationChainSlug, x.bondTransactionHash) : ''

  const tokenDecimals = 6
  x.formattedAmount = ethers.utils.formatUnits(x.amount, tokenDecimals)
  x.token = 'USDC'
  x.tokenImageUrl = tokenLogos[x.token]

  x.gradient = `background: linear-gradient(to right, ${colors[x.sourceChainSlug]}, ${colors[x.destinationChainSlug]}); -webkit-background-clip: text; color: transparent;`

  return x
}

async function updateChart (data) {
  const links = data.map(x => {
    return {
      source: chainToIndexMapSource[x.sourceChainSlug],
      target: chainToIndexMapDestination[x.destinationChainSlug],
      value: 1
    }
  })

  const graph = {
    nodes: [
      { node: 0, name: 'Ethereum', id: 'ethereum' },
      { node: 1, name: 'xDai', id: 'xdai' },
      // {"node":1,"name":"Optimism", "id": "optimism"},
      { node: 2, name: 'Polygon', id: 'polygon' },

      { node: 3, name: 'Ethereum', id: 'ethereum' },
      { node: 4, name: 'xDai', id: 'xdai' },
      // {"node":4,"name":"Optimism", "id": "optimism"},
      { node: 5, name: 'Polygon', id: 'polygon' }
    ],
    links: links
  }

  const render = () => {
    d3.select('#chart svg').remove()
    const chart = d3.select('#chart').append('svg').chart('Sankey.Path')
    chart
      .name(label)
      .colorNodes(function (name, node) {
        return color(node, 1) || colors.fallback
      })
      .colorLinks(function (link) {
        return color(link.source, 4) || color(link.target, 1) || colors.fallback
      })
      .nodeWidth(15)
      .nodePadding(10)
      .spread(true)
      .iterations(0)
      .draw(graph)

    function label (node) {
      return node.name.replace(/\s*\(.*?\)$/, '')
    }

    function color (node, depth) {
      const id = node.id.replace(/(_score)?(_\d+)?$/, '')
      if (colors[id]) {
        return colors[id]
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

async function main () {
  updateData()
  if (poll) {
    while (true) {
      const data = await updateData()
      updateChart(data)
      await new Promise((resolve) => setTimeout(() => resolve(null), fetchInterval))
    }
  }
}

main()
