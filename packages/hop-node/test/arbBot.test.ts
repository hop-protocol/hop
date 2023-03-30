import { ArbBot } from '../src/arbBot'

async function main () {
  const arbBot = new ArbBot({ dryMode: true })
  const l2CommitTxHash = '0xfff19a34001aef8a82a6235344837f4175044931259e0d68d7781777a447e96e'
  const rootData = await arbBot.getTransferRootHashDataFromCommitHash(l2CommitTxHash)
  console.log(rootData)
  expect(rootData).toBeTruthy()
}

// main().catch(console.error)
