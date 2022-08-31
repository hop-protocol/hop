const fs = require('fs')
const json = require('./distribution.json')

const csv = [
  ['address', 'lpTokens', 'hopUserTokens', 'earlyMultiplier', 'volumeMultiplier'],
]

for (const key in json) {
  const data = json[key]
  const address = key.toLowerCase()
  const {
    lpTokens,
    hopUserTokens,
    earlyMultiplier,
    volumeMultiplier
  } = data
  csv.push([address, lpTokens, hopUserTokens, earlyMultiplier, volumeMultiplier])
}

console.log(csv.join('\n'))
