// import wallets from 'src/wallets'
import getRpcProvider from 'src/utils/getRpcProvider'
import { AaveVault } from 'src/vault/AaveVault'
import { Chain } from 'src/constants'
import { Wallet } from 'ethers'

const wallets = {
  get (chain: string) {
    const privateKey = process.env.AAVE_TEST_PRIVATE_KEY!
    const provider = getRpcProvider(chain)!
    return new Wallet(privateKey, provider)
  }
}

describe('Vault', () => {
  it('get balance', async () => {
    const token = 'USDC'
    const chain = Chain.Arbitrum
    const signer = wallets.get(chain)
    const vault = new AaveVault(chain, token, signer)!
    const balance = await vault.getBalance()
    console.log('balance:', vault.formatUnits(balance))
    expect(balance).toBeTruthy()
    expect(balance.gt(0)).toBeTruthy()
  }, 60 * 1000)
  it.skip('deposit - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Arbitrum
    const signer = wallets.get(chain)
    const vault = new AaveVault(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const tx = await vault.deposit(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it.skip('withdraw - USDC', async () => {
    const token = 'USDC'
    const chain = Chain.Arbitrum
    const signer = wallets.get(chain)
    const vault = new AaveVault(chain, token, signer)!
    const amount = vault.parseUnits('0.5')
    const tx = await vault.withdraw(amount)
    expect(tx.hash).toBeTruthy()
  }, 60 * 1000)
  it('formatUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Arbitrum
    const signer = wallets.get(chain)
    const vault = new AaveVault(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const result = vault.formatUnits(amount)
    expect(result).toBe(1)
  }, 60 * 1000)
  it('parseUnits', async () => {
    const token = 'USDC'
    const chain = Chain.Arbitrum
    const signer = wallets.get(chain)
    const vault = new AaveVault(chain, token, signer)!
    const amount = vault.parseUnits('1')
    const result = vault.parseUnits(1)
    expect(result.toString()).toBe(amount.toString())
  }, 60 * 1000)
})
