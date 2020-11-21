// Copyright 2019, Offchain Labs, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import path from 'path'
import fs from 'fs-extra'
import yargs from 'yargs'

export interface Config {
  rollup_address: string
  eth_url: string
  password?: string
  blocktime: number
}

export async function setupValidatorStates(
  count: number,
  folder: string,
  config: Config
): Promise<void> {
  if (count < 1) {
    throw Error('must create at least 1 validator')
  }

  const rollupsPath = path.resolve(__dirname, './data/' + 'rollups') + '/'

  if (!fs.existsSync(rollupsPath)) {
    fs.mkdirpSync(rollupsPath)
  }

  const arbOSData = fs.readFileSync(path.resolve(__dirname, './arbos.mexe'), 'utf8')

  const rollupPath = rollupsPath + folder + '/'
  if (fs.existsSync(rollupPath)) {
    throw Error(`${rollupPath} folder already exists`)
  }

  fs.mkdirpSync(rollupPath)
  for (let i = 0; i < count; i++) {
    const valPath = rollupPath + 'validator' + i + '/'
    fs.mkdirSync(valPath)
    fs.writeFileSync(valPath + 'config.json', JSON.stringify(config))
    fs.writeFileSync(valPath + 'contract.mexe', arbOSData)
  }
}

if (require.main === module) {
  const argv = yargs.command(
    'init [rollup] [ethurl]',
    'initialize validators for the given rollup chain',
    yargsBuilder =>
      yargsBuilder
        .positional('rollup', {
          describe: 'address of the rollup chain',
          type: 'string',
          demandOption: true,
        })
        .positional('ethurl', {
          describe: 'url for ethereum node',
          type: 'string',
          demandOption: true,
        })
        .options({
          validatorcount: {
            description: 'number of validators to deploy',
            default: 1,
          },
          blocktime: {
            description: 'expected length of time between blocks',
            default: 2,
          },
        }),
    args => {
      if (!args.rollup || !args.ethurl) {
        console.error('Must supply rollup address and eth url')
        return
      }
      const config: Config = {
        rollup_address: args.rollup,
        eth_url: args.ethurl,
        blocktime: args.blocktime,
      }

      setupValidatorStates(
        args.validatorcount + 1,
        config.rollup_address,
        config
      )
    }
  ).argv
}
