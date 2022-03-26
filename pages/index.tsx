import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const rawHTML = `
  <div id="banner">
    <div>
      ⚠️ The <a href="https://thegraph.com/legacy-explorer/subgraph/hop-protocol/hop-polygon?ve
rsion=pending" target="_blank">subgraphs</a> are currently experiencing some issues so the table
might not reflect the latest state.
      </div>
    </div>
    <div id="app" v-cloak>
      <div class="chartView">
        <details open>
          <summary>Chart ▾</summary>
          <header class="header">
            <h1 class="rainbow rainbow-animated">Hop transfers</h1>
          </header>
          <div class="chartHeader">
            <label>Source</label>
            <label class="arrow rainbow rainbow-animated animation-delay">⟶</label>
            <label>Destination</label>
          </div>
          <div class="chartContainer">
            <div id="chart"></div>
          </div>
          <label for="amountSizeCheckbox">
            <input type="checkbox" id="amountSizeCheckbox" @change="enableChartAmountSize" />
            Amount size
          </label>
          <div id="chartSelection">{{ chartSelection }}</div>
        </details>
      </div>
      <!--
      <div id="stats">
        <div id="volume">
          <details open>
            <summary>Cumulative Volume (USD) ▾</summary>
            <div>
              <div>Total: {{volume.total.formattedAmount}}</div>
              <div class="ethereum">Ethereum: {{volume.ethereum.formattedAmount}}</div>
              <div class="gnosis">Gnosis: {{volume.gnosis.formattedAmount}}</div>
              <div class="polygon">Polygon: {{volume.polygon.formattedAmount}}</div>
              <div class="optimism">Optimism: {{volume.optimism.formattedAmount}}</div>
              <div class="arbitrum">Arbitrum: {{volume.arbitrum.formattedAmount}}</div>
            </div>
        </div>
        <div id="tvl">
          <details open>
            <summary>Total Value Locked (USD) ▾</summary>
            <div>
              <div>Total: {{tvl.total.formattedAmount}}</div>
              <div class="ethereum">Ethereum: {{tvl.ethereum.formattedAmount}}</div>
              <div class="gnosis">Gnosis: {{tvl.gnosis.formattedAmount}}</div>
              <div class="polygon">Polygon: {{tvl.polygon.formattedAmount}}</div>
              <div class="optimism">Optimism: {{tvl.optimism.formattedAmount}}</div>
              <div class="arbitrum">Arbitrum: {{tvl.arbitrum.formattedAmount}}</div>
            </div>
        </div>
      </div>
      -->
      <details open>
      <summary>
        <span>Transfers ▾</span>
        <span v-if="loadingData" class="loadingData">
          Loading...
        </span>
      </summary>
        <div class="tableHeader">
          <div class="filters">
            <div>
              <label>Per page:</label>
              <select class="perPageSelection select" v-model="perPage" @change="setPerPage">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
            </div>
            <div>
              <label>Source:</label>
              <select class="select" v-model="filterSource" @change="setFilterSource">
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
              <select class="select" v-model="filterDestination" @change="setFilterDestination">
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
              <select class="select" v-model="filterToken" @change="setFilterToken">
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
              <select class="select" v-model="filterBonded" @change="setFilterBonded">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="bonded">Bonded</option>
              </select>
            </div>
            <div>
              <label>Amount:</label>
              <select class="select selectSmall" v-model="filterAmountComparator" @change="setFilterAmountComparator">
                <option value="eq">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
              <input class="filterAmount" v-model="filterAmount" @input="setFilterAmount" placeholder="amount" />
            </div>
            <div>
              <label>Amount USD:</label>
              <select class="select selectSmall" v-model="filterAmountUsdComparator" @change="setFilterAmountUsdComparator">
                <option value="eq">=</option>
                <option value="gt">&gt;</option>
                <option value="lt">&lt;</option>
              </select>
              <input class="filterAmountUsd" v-model="filterAmountUsd" @input="setFilterAmountUsd" placeholder="amount USD" />
            </div>
            <div>
              <label>Bonder:</label>
              <input class="filterBonder" v-model="filterBonder" @input="setFilterBonder" placeholder="bonder" />
            </div>
            <div>
              <label>Transfer ID:</label>
              <input class="filterTransferId" v-model="filterTransferId" @input="setFilterTransferId" placeholder="transfer ID or tx hash" />
            </div>
            <div>
              <label>Account:</label>
              <input class="filterAccount" v-model="filterAccount" @input="setFilterAccount" placeholder="Account address" />
            </div>
            <div>
              <label>Date:</label>
              <input type="date" id="date" name="date"
               v-model="filterDate"
               :min="minDate"
               :max="maxDate"
               @change="setFilterDate()"
               >
            </div>
          </div>
          <div class="pagination">
            <button v-if="hasPreviousPage" @click="previousPage()" class="paginationButton">previous page</button>
            <button v-if="hasNextPage" @click="nextPage()" class="paginationButton">next page</button>
          </div>
        </div>
        <div id="transfers">
          <table>
            <thead>
              <tr>
                <th></th><th>Date</th><th>Source</th><th>Destination</th><th>Transfer ID</th><th>Transfer Tx</th><th>Token</th><th>Amount</th><th>Amount USD</th><th>Bonder Fee</th><th>Bonder Fee USD</th><th>Bonded</th><th>Bonded Tx</th><th>Bonded Date</th><th>Bonded Within</th><th>Bonder</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(x, index) in transfers">
                <td class="index">{{ ((page * perPage) + index + 1) }}</td>
                <td class="timestamp" :title="x.isoTimestamp">{{ x.relativeTimestamp }}</td>
                <td :class="x.sourceChainSlug">
                  <img :src="x.sourceChainImageUrl" :alt="x.sourceChainName">
                  {{ x.sourceChainName }}
                  <span style="small-arrow">⟶</span>
                </td>
                <td :class="x.destinationChainSlug">
                  <img :src="x.destinationChainImageUrl" :alt="x.destinationChainName">
                  {{ x.destinationChainName }}
                </td>
                <td class="transferId">
                  <a class="clipboard" :data-clipboard-text="x.transferId" title="Copy transfer ID to clipboard" onclick="this.innerText='✅';setTimeout(()=>this.innerText='📋',1000)">📋</a>
                  <a :class="x.sourceChainSlug" :href="x.sourceTxExplorerUrl" target="_blank" :title="\`View on block explorer - \${x.transferId}\`">
                    {{ x.transferIdTruncated }}
                  </a>
                </td>
                <td class="transferTx">
                  <a class="clipboard" :data-clipboard-text="x.transactionHash" title="Copy transaction hash to clipboard" onclick="this.innerText='✅';setTimeout(()=>this.innerText='📋',1000)">📋</a>
                  <a :class="x.sourceChainSlug" :href="x.sourceTxExplorerUrl" target="_blank" :title="\`View on block explorer - \${x.transactionHash}\`">
                    {{ x.transactionHashTruncated }}
                  </a>
                </td>
                <td class="token">
                  <img :src="x.tokenImageUrl" :alt="x.token">
                  {{ x.token }}
                </td>
                <td class="amount number" :title="x.amount">{{ x.displayAmount }}</td>
                <td class="amount number" :title="\`\${x.displayAmountUsd} @ \${x.displayTokenPriceUsd}\`">{{ x.displayAmountUsd }}</td>
                <td class="bonderFee number" :title="x.bonderFee">
                  <span v-if="x.sourceChain !== 1">
                    {{ x.displayBonderFee }}
                  </span>
                  <span class="na" v-if="x.sourceChain === 1">
                    <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                  </span>
                </td>
                <td class="bonderFee number" :title="\`\${x.displayBonderFeeUsd} @ \${x.displayTokenPriceUsd}\`">
                  <span v-if="x.sourceChain !== 1">
                    {{ x.displayBonderFeeUsd }}
                  </span>
                  <span class="na" v-if="x.sourceChain === 1">
                    <abbr title="Not Applicable — L1 to L2 transfers don't require bonding">N/A</abbr>
                  </span>
                </td>
                <td class="bonded">
                  <a v-if="x.bondTxExplorerUrl" :class="\`\${x.bonded ? 'yes' : 'no'}\`" :href="x.bondTxExplorerUrl" target="_blank" title="View on block explorer">
                    <img :src="x.destinationChainImageUrl" :alt="x.destinationChainName">
                    <span v-if="x.sourceChain !== 1">
                      Bonded
                    </span>
                    <span v-if="x.sourceChain === 1">
                      Received
                    </span>
                  </a>
                  <span v-if="!x.receiveStatusUnknown && !x.bondTxExplorerUrl" class="no">
                    <img :src="x.destinationChainImageUrl" :alt="x.destinationChainName">
                    Pending
                  </span>
                </td>
                <td class="bondTx">
                  <span v-if="x.preregenesis" title="This transaction occurred before the Optimism Regenesis">
                    (pre-regenesis)
                  </span>
                  <span v-if="x.bondTransactionHash">
                    <a class="clipboard" :data-clipboard-text="x.bondTransactionHash" title="Copy transaction hash to clipboard" onclick="this.innerText='✅';setTimeout(()=>this.innerText='📋',1000)">📋</a>
                    <a :class="x.destinationChainSlug" :href="x.bondTxExplorerUrl" target="_blank" :title="\`View on block explorer - \${x.bondTransactionHash}\`">
                      {{ x.bondTransactionHashTruncated }}
                    </a>
                  </span>
                </td>
                <td class="bondedDate" :title="x.isoBondedTimestamp">
                  {{ x.relativeBondedTimestamp }}
                </td>
                <td class="bondedWithin" :title="x.isoBondedTimestamp">
                  {{ x.relativeBondedWithinTimestamp }}
                </td>
                <td class="bondedWithin" :title="x.bonder">
                  <a v-if="x.bonderUrl" class="bonder" :href="x.bonderUrl" target="_blank" :title="\`View on block explorer - \${x.bonder}\`">
                    {{ x.bonderTruncated }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="tableFooter">
          <div>
            <select class="perPageSelection" v-model="perPage" @change="setPerPage">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <div class="pagination">
            <button v-if="hasPreviousPage" @click="previousPage" class="paginationButton">previous page</button>
            <button v-if="hasNextPage" @click="nextPage" class="paginationButton">next page</button>
          </div>
        </div>
      <script src="main.js"></script>
      </details>
    </div>
`

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
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
        <link rel="stylesheet" href="/style.css" />
        <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14"></script>
        <script src="https://d3js.org/d3.v3.min.js"></script>
        <script src="https://cdn.rawgit.com/misoproject/d3.chart/master/d3.chart.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/luxon/1.27.0/luxon.min.js"></script>
        <script src="https://cdn.ethers.io/lib/ethers-5.0.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.4.0/clipboard.min.js"></script>
        <script src="/lib/sankey.patched.js"></script>
        <script src="/static.js"></script>
      </Head>
      { <div dangerouslySetInnerHTML={{ __html: rawHTML }} /> }
  </div>
  )
}

export default Home
