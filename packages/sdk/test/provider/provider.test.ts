import { FallbackProvider } from '../../src/provider'
import { Hop } from '../../src/index'
import { IProvider } from '../../src/provider/IProvider'

describe('fallback provider', () => {
  it('Should test methods', async () => {
    const hop = new Hop('mainnet')
    const bridge = hop.bridge('USDC')
    const provider = bridge.toChainModel('optimism').provider as IProvider
    const ethProvider = bridge.toChainModel('ethereum').provider as IProvider
    expect(provider instanceof FallbackProvider).toBe(true)
    expect(ethProvider instanceof FallbackProvider).toBe(true)
    const network = await provider.getNetwork()
    console.log('network:', network)
    expect(network.name).toBe('optimism')

    const blockNumber = await provider.getBlockNumber()
    console.log('blockNumber:', blockNumber)
    expect(blockNumber).toBeGreaterThan(0)

    const gasPrice = await provider.getGasPrice()
    console.log('gasPrice:', gasPrice)
    expect(gasPrice.toNumber()).toBeGreaterThan(0)

    const feeData = await provider.getFeeData()
    console.log('feeData:', feeData)
    expect(feeData.gasPrice.toNumber()).toBeGreaterThan(0)

    const latestBlock = await provider.getBlock('latest')
    console.log('latest block:', latestBlock)
    expect(latestBlock.number).toBeGreaterThan(0)

    const block = await provider.getBlock(2000)
    console.log('block:', block)
    expect(block.number).toBe(2000)

    const transactionHash = '0xb4db3ff1ce3e2524a3c131e01401735f2dca85b00745e5e3dc3d48bf10d9f648'
    const tx = await provider.getTransaction(transactionHash)
    console.log('tx:', tx)
    expect(tx.hash).toBe(transactionHash)

    const receipt = await provider.getTransactionReceipt(transactionHash)
    console.log('receipt:', receipt)
    expect(receipt.transactionHash).toBe(transactionHash)

    const waitReceipt = await provider.waitForTransaction(transactionHash)
    console.log('waitReceipt:', waitReceipt)
    expect(waitReceipt.transactionHash).toBe(transactionHash)

    const accountAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
    const balance = await provider.getBalance(accountAddress)
    console.log('balance:', balance)
    expect(balance.toString()).toBeTruthy()

    const transactionCount = await provider.getTransactionCount(accountAddress)
    console.log('transactionCount:', transactionCount)
    expect(transactionCount).toBeGreaterThan(0)

    const code = await provider.getCode('0x7F5c764cBc14f9669B88837ca1490cCa17c31607')
    console.log('code:', code.substr(0, 10))
    expect(code).not.toBe('0x')

    const call = await provider.call({
      to: '0x0000000000000000000000000000000000000000',
      data: '0x00',
      value: '0x00'
    })
    console.log('call:', call)
    expect(call).toBe('0x')

    const sendTransaction = provider.sendTransaction
    expect(typeof sendTransaction).toBe('function')

    const logs = await provider.getLogs({
      address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
      fromBlock: 15936490,
      toBlock: 15936520
    })
    console.log('logs:', logs)
    expect(logs.length).toBe(2)

    const estimateGas = await provider.estimateGas({
      to: '0x0000000000000000000000000000000000000000',
      data: '0x00',
      value: '0x00'
    })
    console.log('estimateGas:', estimateGas)
    expect(estimateGas.toNumber()).toBeGreaterThan(0)

    const detectNetwork = await provider.detectNetwork()
    console.log('detectNetwork:', detectNetwork)
    expect(detectNetwork.chainId).toBe(10)

    expect(provider.connection.url).toBeTruthy()

    const lookupAddress = await ethProvider.lookupAddress('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    console.log('lookupAddress:', lookupAddress)
    expect(lookupAddress).toBeTruthy()

    const resolveName = await ethProvider.resolveName('vitalik.eth')
    console.log('resolveName:', resolveName)
    expect(resolveName).toBeTruthy()

    const avatar = await ethProvider.getAvatar('vitalik.eth')
    console.log('avatar:', avatar)
    expect(avatar).toBeTruthy()

    const resolver = await ethProvider.getResolver('vitalik.eth')
    console.log('resolver:', resolver)
    expect(resolver).toBeTruthy()
  }, 60 * 1000)
})
