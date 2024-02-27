import MerkleTree from '#utils/MerkleTree.js'

test('merkle', () => {
  const transferHashes = [
    '0xceb9d07920f1860611c1ed02043fe6a15220bb0930d9b8c2acb61bf2b84aa212',
    '0x43bca1ee1ac8f0b95f1942e634eb5b3ed991ac611a8e4594becdc4cb6eafa181',
    '0x26fce79648036f78104b2665f037a7a8ed398d6815c276c13880c8d7715822a5',
    '0x1013ee8287f8e0f49f8d1d20dca588da58555df97df75a2433c649d2359155d5'
  ]

  const tree = new MerkleTree(transferHashes)

  expect(tree.getHexRoot()).toBe(
    '0xcb157ea8a7e9f050dcc0f02d1e5fa400b7cc481cb33ed51925a0cdf510d7eab1'
  )
})
