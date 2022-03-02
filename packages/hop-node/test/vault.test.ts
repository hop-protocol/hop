import GasBoostSigner from 'src/gasboost/GasBoostSigner'
import getRpcProvider from 'src/utils/getRpcProvider'
import { Chain } from 'src/constants'
import { Vault } from 'src/vault'
import { Wallet } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { privateKey } from './config'

describe('Vault', () => {
  it('get balance', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const balance = await vault.getBalance()
    console.log('balance:', vault.formatUnits(balance))
    expect(balance).toBeTruthy()
    expect(balance.gt(0)).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('1', decimals)
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - ETH', async () => {
    const token = 'ETH'
    const decimals = 18
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('0.0017', decimals)
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const list = await vault.yearn.services.zapper
    const amount = parseUnits('0.5', decimals)
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - ETH', async () => {
    const token = 'ETH'
    const decimals = 18
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('0.001682978694778424', decimals)
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it('getDepositOutcome', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new Wallet(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('1', decimals)
    const outcome = await vault.getDepositOutcome(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
    expect(outcome.targetTokenAmount.gt(parseUnits('0.9', decimals))).toBeTruthy()
    expect(outcome.targetTokenAmount.lt(parseUnits('1.1', decimals))).toBeTruthy()
  }, 60 * 1000)
  it('getWithdrawOutcome', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new Wallet(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('0.5', decimals)
    const outcome = await vault.getWithdrawOutcome(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
    expect(outcome.targetTokenAmount.gt(parseUnits('0.4', decimals))).toBeTruthy()
    expect(outcome.targetTokenAmount.lt(parseUnits('1', decimals))).toBeTruthy()
  }, 60 * 1000)
  it('formatUnits', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('1', decimals)
    const result = await vault.formatUnits(amount)
    expect(result).toBe(1)
  }, 60 * 1000)
  it('parseUnits', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new GasBoostSigner(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const amount = parseUnits('1', decimals)
    const result = await vault.parseUnits(1)
    expect(result.toString()).toBe(amount.toString())
  }, 60 * 1000)
  it('getList', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const provider = getRpcProvider(chain)
    const signer = new Wallet(privateKey!, provider!)
    const vault = new Vault(token, signer)
    const list = await vault.getList()
    console.log(list)

    expect(list).toBeTruthy()
    expect(list.length > 0).toBeTruthy()
  }, 60 * 1000)
})
