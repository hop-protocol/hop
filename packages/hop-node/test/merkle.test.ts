import MerkleTree from 'src/utils/MerkleTree'

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

  const ids = [
      // '0x0bf6c54252382118b6fc4d4b584fd02c7e3f8542cd0a139eb54f1e72ef637099',
      // '0xc8ed9148ac825390c81b131c82b56ae98e6826fae29f4d3941b8dc527820a299',
      // '0x8ae0918524b8e68b941d77aa27b0e3af0075b3c0d363325e7dbd0c8746bf8568',
      // '0x7c7ec9450a0aa311dc0f3f856b63651d8ec5bfe434f1cb3a46927ca3f7d746b4'

      // '0x960a5539f9a774948f74d8b8a228bb7d8c239e29693d170f151e229b0b3b012b',
      // '0xca8f161a581fab7388bd9d6feadf8fcfac05866d3654bfa1b1b2530d8fc05f2e',
      // '0x21cfbfad1cbb8cc273fe5f41a545f8d7a373fb8a710e4260e3e65373d859955a',
      // '0x2f1eb621377b736cc481e10dccfccd5ec4dab9428cafcc6475b77c783b41c196',
      '0x08166869f14af9fe204b311c9d647edb74e5fa593881cf838f521ba446f87322',
      '0x64b4dae44738a79f31e84cf486e0d9a8c0cd8f6ae146e0169196a5f3afa5bfb2'
  ]
  console.log((new MerkleTree(ids)).getHexRoot())
})
