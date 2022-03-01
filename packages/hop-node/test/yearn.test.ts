import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import { Chain } from 'src/constants'
import { Strategy } from 'src/yearn/Strategy'
import { Wallet } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { privateKey } from './config'

describe('Strategy', () => {
  it.only('deposit', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const strategy = new Strategy(token, signer)
    const amount = parseUnits('1', decimals)
    const outcome = await strategy.deposit(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
  }, 10 * 1000)
  it('simulateDeposit', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new Wallet(privateKey!, provider!)
    const strategy = new Strategy(token, signer)
    const amount = parseUnits('1', decimals)
    const outcome = await strategy.simulateDeposit(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
    expect(outcome.targetTokenAmount.gt(parseUnits('0.9', decimals))).toBeTruthy()
    expect(outcome.targetTokenAmount.lt(parseUnits('1.1', decimals))).toBeTruthy()
  }, 10 * 1000)
  it('simulateWithdraw', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new Wallet(privateKey!, provider!)
    const strategy = new Strategy(token, signer)
    const amount = parseUnits('1', decimals)
    const outcome = await strategy.simulateWithdraw(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
  }, 10 * 1000)
})
