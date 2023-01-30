require('dotenv').config()
const fetch = require('isomorphic-fetch')
const path = require('path')
const fs = require('fs')

const token = process.env.METABASE_TOKEN
const outputDir = process.env.OUTPUT_DIR || 'downloaded_dashboard_queries'

async function auth () {
  const res = await fetch('https://metabase.hop.exchange/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'email',
      password: 'password'
    })
  })
  const json = await res.json()
  console.log(json)
}

async function main () {
  const baseDir = path.resolve(__dirname, outputDir)
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir)
  }
  const res = await fetch('https://metabase.hop.exchange/api/dashboard', {
    headers: {
      'X-Metabase-Session': token
    }
  })
  const json = await res.json()
  for (const dashboard of json) {
    const res = await fetch(
      `https://metabase.hop.exchange/api/dashboard/${dashboard.id}`,
      {
        headers: {
          'X-Metabase-Session': token
        }
      }
    )
    const json = await res.json()
    if (!json.name) {
      continue
    }
    const dir = path.resolve(baseDir, json.name)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    console.log(`Fetching dashboard: ${json.name}`)
    for (const item of json.ordered_cards) {
      if (!item.card.name) {
        continue
      }
      const file = path.resolve(dir, item.card.name)
      if (!item.card.dataset_query.native.query) {
        continue
      }
      console.log(`\tFetching query: ${item.card.name}`)
      fs.writeFileSync(file, item.card.dataset_query.native.query)
    }
  }
  console.log('done')
}

main().catch(console.error)
