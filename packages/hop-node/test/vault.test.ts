import wallets from 'src/wallets'
import { BalancerVault } from 'src/vault/BalancerVault'
import { Chain } from 'src/constants'
import { Vault } from 'src/vault/Vault'
import { YearnVault } from 'src/vault/YearnVault'
import { parseUnits } from 'ethers/lib/utils'

describe.only('Vault', () => {
  it('getDepositOutcome', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    expect(vault).toBeTruthy()
  }, 60 * 1000)
})

describe.skip('BalancerVault', () => {
  it('getDepositOutcome', async () => {
    const token = 'DAI'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new BalancerVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const deltas = await vault.getDepositOutcome(amount)
    console.log('deltas:', deltas)
    expect(deltas[0].gt(0)).toBe(true)
    expect(deltas[1].eq(0)).toBe(true)
    expect(deltas[2].lt(0)).toBe(true)
  }, 60 * 1000)
  it('getWithdrawOutcome', async () => {
    const token = 'DAI'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new BalancerVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const deltas = await vault.getWithdrawOutcome(amount)
    console.log('deltas:', deltas)
    expect(deltas[0].gt(0)).toBe(true)
    expect(deltas[1].eq(0)).toBe(true)
    expect(deltas[2].lt(0)).toBe(true)
  }, 60 * 1000)
  it.skip('getBalance', async () => {
    const token = 'DAI'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new BalancerVault(chain, token, signer)
    const amount = await vault.getBalance()
    expect(amount.gt(0)).toBe(true)
  }, 60 * 1000)
  it.skip('deposit', async () => {
    const token = 'DAI'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new BalancerVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const tx = await vault.deposit(amount)
    console.log('tx:', tx)
    expect(tx).toBeTruthy()
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw', async () => {
    const token = 'DAI'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new BalancerVault(chain, token, signer)
    const amount = await vault.getBalance()
    expect(amount.gt(0)).toBe(true)
    const tx = await vault.withdraw(amount)
    console.log('tx:', tx)
    expect(tx).toBeTruthy()
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
})

describe.skip('YearnVault', () => {
  it('get balance', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const balance = await vault.getBalance()
    console.log('balance:', vault.formatUnits(balance))
    expect(balance).toBeTruthy()
    expect(balance.gt(0)).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - ETH', async () => {
    const token = 'ETH'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('0.0017')
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('0.5')
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - ETH', async () => {
    const token = 'ETH'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('0.001682978694778424')
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it('formatUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const result = await vault.formatUnits(amount)
    expect(result).toBe(1)
  }, 60 * 1000)
  it('parseUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('1')
    const result = await vault.parseUnits(1)
    expect(result.toString()).toBe(amount.toString())
  }, 60 * 1000)
  it('getDepositOutcome', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('1')
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
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const amount = vault.parseUnits('0.5')
    const outcome = await vault.getWithdrawOutcome(amount)

    console.log('outcome:', outcome)
    expect(outcome).toBeTruthy()
    expect(outcome.targetTokenAmount.gt(parseUnits('0.4', decimals))).toBeTruthy()
    expect(outcome.targetTokenAmount.lt(parseUnits('1', decimals))).toBeTruthy()
  }, 60 * 1000)
  it('getList', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = new YearnVault(chain, token, signer)
    const list = await vault.getList()
    console.log(list)

    expect(list).toBeTruthy()
    expect(list.length > 0).toBeTruthy()
  }, 60 * 1000)
})
