import wallets from 'src/wallets'
import { Chain } from 'src/constants'
import { Vault } from 'src/vault/Vault'
import { parseUnits } from 'ethers/lib/utils'

describe('Vault', () => {
  it('get balance', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const balance = await vault.getBalance()
    console.log('balance:', vault.formatUnits(balance))
    expect(balance).toBeTruthy()
    expect(balance.gt(0)).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - ETH', async () => {
    const token = 'ETH'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('0.0017')
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('0.5')
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - ETH', async () => {
    const token = 'ETH'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('0.001682978694778424')
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it('formatUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const result = await vault.formatUnits(amount)
    expect(result).toBe(1)
  }, 60 * 1000)
  it('parseUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const result = await vault.parseUnits(1)
    expect(result.toString()).toBe(amount.toString())
  }, 60 * 1000)
  it('getDepositOutcome', async () => {
    const token = 'USDC'
    const decimals = 6
    const chain = Chain.Ethereum
    const signer = wallets.get(chain)
    const vault = Vault.from(chain, token, signer)!
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
    const vault = Vault.from(chain, token, signer)!
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
    const vault = Vault.from(chain, token, signer)!
    const list = await vault.getList()
    console.log(list)

    expect(list).toBeTruthy()
    expect(list.length > 0).toBeTruthy()
  }, 60 * 1000)
})
