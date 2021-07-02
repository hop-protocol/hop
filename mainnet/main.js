let data = []

const fetchData = async (network) => {
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
      }
    }
  `
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
      }
    }
  `
  let url = 'https://api.thegraph.com/subgraphs/name/hop-protocol/hop'
  let query = queryL1
  if (network !== 'mainnet') {
    url = `${url}-${network}`
    query = queryL2
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: {}
    })
  })
  const jsonRes = await res.json()
  return jsonRes.data.transferSents.map(x => {
    x.destinationChainId = Number(x.destinationChainId)
    return x
  })
}

async function updateData () {
  data = []
  const [
    xdaiTransfers,
    polygonTransfers,
    mainnetTransfers
  ] = await Promise.all([
    fetchData('xdai'),
    fetchData('polygon'),
    fetchData('mainnet')
  ])

  for (const t of xdaiTransfers) {
    data.push({
      sourceChain: 100,
      destinationChain: t.destinationChainId,
      amount: t.amount,
      transferId: t.transferId,
      transactionHash: t.transactionHash
    })
  }
  for (const t of polygonTransfers) {
    data.push({
      sourceChain: 137,
      destinationChain: t.destinationChainId,
      amount: t.amount,
      transferId: t.transferId,
      transactionHash: t.transactionHash
    })
  }
  for (const t of mainnetTransfers) {
    data.push({
      sourceChain: 1,
      destinationChain: t.destinationChainId,
      amount: t.amount,
      transferId: t.id,
      transactionHash: t.transactionHash
    })
  }

  data = data.filter(x => x.destinationChain && x.transferId)
  load()

  setTimeout(() => {
    updateData()
  }, 10 * 1000)
}

function explorerLink (chain, transactionHash) {
  let base = ''
  if (chain === 100) {
    base = 'https://blockscout.com/xdai/mainnet'
  } else if (chain === 137) {
    base = 'https://polygonscan.com'
  } else {
    base = 'https://etherscan.io'
  }

  return `${base}/tx/${transactionHash}`
}

async function load () {
  const indexMap = {
    77: 1,
    100: 1,

    137: 2,
    69: 2,

    42: 0,
    1: 0
  }

  const indexMapDest = {
    42: 3,
    1: 3,

    77: 4,
    100: 4,

    69: 5,
    137: 5

  }

  const links = data.map(x => {
    return {
      source: indexMap[x.sourceChain],
      target: indexMapDest[x.destinationChain],
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

  const json = graph
  const colors = {
    // xdai: '#edbd00',
    xdai: '#46a4a1',
    // ethereum: '#367d85',
    ethereum: '#868dac',
    optimism: '#97ba4c',
    // polygon: '#8d4cba',
    polygon: '#8b57e1',
    // polygon: '#97ba4c',
    foo: '#f5662b',
    bar: '#3f3e47',
    fallback: '#9f9fa3'
  }

  const classes = {
    100: 'xdai',
    137: 'polygon',
    1: 'ethereum'
  }

  function className (chain) {
    return classes[chain]
  }

  const transfers = data.map(x => {
    return `<td class="${className(x.sourceChain)}">${classes[x.sourceChain]}</td><td class="${className(x.destinationChain)}">${classes[x.destinationChain]}</td><td><a class="${className(x.sourceChain)}" href="${explorerLink(x.sourceChain, x.transactionHash)}" target="_blank">${x.transferId}</a></td>`
  })
  const table = d3.select('#transfers')
    .html('')
    .append('table')

  table
    .selectAll('thead')
    .data(['<th>Source</th><th>Destination</th><th>Transfer ID</th>'])
    .enter()
    .append('thead')
    .html(String)

  table
    .selectAll('tr')
    .data(transfers)
    .enter()
    .append('tr')
    .html(String)

  function render () {
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
      .draw(json)

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
    // });
  }

  render()
  window.addEventListener('resize', event => {
    render()
  })
}

updateData()
load()
