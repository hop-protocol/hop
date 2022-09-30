import getTransfersCommitted from 'src/theGraph/getTransfersCommitted'
import getTransferRootBonded from 'src/theGraph/getTransferRootBonded'
import getTransferRootConfirmed from 'src/theGraph/getTransferRootConfirmed'
import { Chain } from 'src/constants'
import { actionHandler, getSourceChains, parseStringArray, root } from './shared'
import { DateTime } from 'luxon'

interface RootsCommitted {
  rootHash: string,
  destinationChainId: string,
  totalAmount: string,
  rootCommittedAt: string
}


root
  .command('unconfirmed-roots')
  .description('Get all roots that have been bonded but not confirmed')
  .option('--tokens <symbol, ...>', 'Comma-separated token symbols', parseStringArray)
  .action(actionHandler(main))

async function main (source: any) {
  const { tokens } = source
  if (!tokens?.length) {
    throw new Error('token is required')
  }

  // Ignore any root that has been bonded within the last 24 hours, since they are challengeable
  const now = DateTime.now().toUTC()
  const endDate = now.minus({ days: 1 })
  const endDateSeconds: number = Math.floor(endDate.toSeconds())

  for (const token of tokens) {
    console.log(`\nChecking ${token}`)

    const rootsBonded = await getRootsBonded(token, endDateSeconds)
    const rootsConfirmed = await getRootsConfirmed(token)
    const rootsBondedButNotConfirmed = await getRootsBondedButNotConfirmed(rootsBonded, rootsConfirmed)
    const rootsCommitted = await getRootsCommitted(token)

    const rootData: RootsCommitted[] = []
    for (const root of rootsBondedButNotConfirmed) {
      if (!rootsCommitted[root]) {
        throw new Error(`Root ${root} never committed`)
      }
      rootData.push(rootsCommitted[root])
    }

    console.log(JSON.stringify(rootData))
  }
}

async function getRootsBonded(token: string, endDateSeconds: number): Promise<string[]> {
    const startDate = 0
    const bondedRes = await getTransferRootBonded(Chain.Ethereum, token, startDate, endDateSeconds)
    const rootsBonded: string[] = []
    for (const res of bondedRes) {
      rootsBonded.push(res.root)
    }

    return rootsBonded
}

async function getRootsConfirmed(token: string): Promise<string[]> {
    const confirmedRes = await getTransferRootConfirmed(Chain.Ethereum, token)
    const rootsConfirmed: string[] = []
    for (const res of confirmedRes) {
      rootsConfirmed.push(res.rootHash)
    }

    return rootsConfirmed
}

async function getRootsBondedButNotConfirmed (rootsBonded: string[], rootsConfirmed: string[]): Promise<string[]> {
  const rootsBondedButNotConfirmed: string[] = []
  for (const rootBonded of rootsBonded) {
    if (rootsConfirmed.includes(rootBonded)) continue
    rootsBondedButNotConfirmed.push(rootBonded)
  }

  return rootsBondedButNotConfirmed 
}

async function getRootsCommitted(token: string): Promise<Record<string, RootsCommitted>> {
  const sourceChains = getSourceChains(token)
  const rpcRootsCommitted: Record<string, RootsCommitted> = {}

  for (const chain of sourceChains) {
    const commitsRes = await getTransfersCommitted(chain, token)
    for (const res of commitsRes) {
      rpcRootsCommitted[res.rootHash] = {
        rootHash: res.rootHash,
        totalAmount: res.totalAmount,
        destinationChainId: res.destinationChainId,
        rootCommittedAt: res.rootCommittedAt
      }
    }
  }

  const rootsCommitted: Record<string, RootsCommitted> = {
    ...rpcRootsCommitted,
    ...nonRpcRoots
  }

  return rootsCommitted
}

const nonRpcRoots: Record<string, RootsCommitted> = {
  // pre-regenesis
  '0xe321c402a022865093f366bd41c1ddeb5efd4d374327da4e57f58c8f198efa96': {
    destinationChainId: '1',
    rootHash: '0xbabf53063ad68050fd4dbe833dfcbe2a5e286becef761352d6698e7dbab97543',
    totalAmount: '00164245',
    rootCommittedAt: '1629418040'
  },
  '0x5e2582c330f89a6bdb96366f93e1985f1097b6ed4de7ed5b70bfe2a3c1b474fd': {
    destinationChainId: '137',
    rootHash: '0x5e2582c330f89a6bdb96366f93e1985f1097b6ed4de7ed5b70bfe2a3c1b474fd',
    totalAmount: '5008118',
    rootCommittedAt: '1629432971'
  },
  '0xa6411e6f9bf6c7641b1578fb8946142acfa5ce0f2f784f312955adc7a7e69f70': {
    destinationChainId: '1',
    rootHash: '0xa6411e6f9bf6c7641b1578fb8946142acfa5ce0f2f784f312955adc7a7e69f70',
    totalAmount: '40024734',
    rootCommittedAt: '1629474745'
  },
  '0x81144e8a2805832e702f790068d5a026d1aef165cbe8be26e261121d39dba81c': {
    destinationChainId: '1',
    rootHash: '0x81144e8a2805832e702f790068d5a026d1aef165cbe8be26e261121d39dba81c',
    totalAmount: '40417108',
    rootCommittedAt: '1629475923'
  },
  '0xec42b9bf3364149cb93bd8ddbb83021fce72d25311ef0fe2d9f30dc9d797e05e': {
    destinationChainId: '1',
    rootHash: '0xec42b9bf3364149cb93bd8ddbb83021fce72d25311ef0fe2d9f30dc9d797e05e',
    totalAmount: '40190920',
    rootCommittedAt: '1629478429'
  },
  '0x8014f057a49374783a520278262c85d5ac1632ec96da9c8f7665df29ee866f8f': {
    destinationChainId: '1',
    rootHash: '0x8014f057a49374783a520278262c85d5ac1632ec96da9c8f7665df29ee866f8f',
    totalAmount: '40079965',
    rootCommittedAt: '1629480811'
  },
  '0x35586a5938c614553ca6ca5b9dbec74bfa0faf069624c182d2cfeaf7190c9d4e': {
    destinationChainId: '137',
    rootHash: '0x35586a5938c614553ca6ca5b9dbec74bfa0faf069624c182d2cfeaf7190c9d4e',
    totalAmount: '3008679',
    rootCommittedAt: '1629483626'
  },
  '0x4ff42aeeee9e3571108ca7b75914990673291f9ceea74c608cc30a624a1a158b': {
    destinationChainId: '100',
    rootHash: '0x4ff42aeeee9e3571108ca7b75914990673291f9ceea74c608cc30a624a1a158b',
    totalAmount: '2001744',
    rootCommittedAt: '1629483626'
  },
  '0x874a0917d2cb83658c4b3fd040a33bd7d639666f4869bba21841113ec5810226': {
    destinationChainId: '100',
    rootHash: '0x874a0917d2cb83658c4b3fd040a33bd7d639666f4869bba21841113ec5810226',
    totalAmount: '4002799',
    rootCommittedAt: '1629485722'
  },
  '0x7b4515fc57cf8f8d8923d3ac33263b75212b72cedc9b775bee020b419ffefce1': {
    destinationChainId: '137',
    rootHash: '0x7b4515fc57cf8f8d8923d3ac33263b75212b72cedc9b775bee020b419ffefce1',
    totalAmount: '2001399',
    rootCommittedAt: '1629485722'
  },
  '0x81622ec101e283aa2bf00d6dc695b351e4ad2d3cc12cae667a6f3804d12e9ca1': {
    destinationChainId: '137',
    rootHash: '0x81622ec101e283aa2bf00d6dc695b351e4ad2d3cc12cae667a6f3804d12e9ca1',
    totalAmount: '99889460',
    rootCommittedAt: '1629850445'
  },
  '0xdd91130d79ec03c87a21a587dc6f51d2320ffc7d2abf027c48a6497dadaae609': {
    destinationChainId: '1',
    rootHash: '0xdd91130d79ec03c87a21a587dc6f51d2320ffc7d2abf027c48a6497dadaae609',
    totalAmount: '50372707512',
    rootCommittedAt: '1630370517'
  },
  '0x6d3d5b56d103add9d36e3c00bd0ffda660663deb86392c7966429c8dc41eb02f': {
    destinationChainId: '137',
    rootHash: '0x6d3d5b56d103add9d36e3c00bd0ffda660663deb86392c7966429c8dc41eb02f',
    totalAmount: '34850840346',
    rootCommittedAt: '1630380311'
  },
  '0x374fdd6e7af8da5dfd622c6ba111574c4c48ad493c781d3ec77786aba8c58f2d': {
    destinationChainId: '1',
    rootHash: '0x374fdd6e7af8da5dfd622c6ba111574c4c48ad493c781d3ec77786aba8c58f2d',
    totalAmount: '26876325251',
    rootCommittedAt: '1630027601'
  },
  '0xac857136fe7ddc06eceb0648e1c5823d9f159f7413c0436ed1a052f74876fe20': {
    destinationChainId: '1',
    rootHash: '0xac857136fe7ddc06eceb0648e1c5823d9f159f7413c0436ed1a052f74876fe20',
    totalAmount: '35180189447',
    rootCommittedAt: '1629947913'
  },
  '0xbc5d2015548ff4652e3381942486d01f23765b8f68fddecf59d61373326ba61d': {
    destinationChainId: '137',
    rootHash: '0xbc5d2015548ff4652e3381942486d01f23765b8f68fddecf59d61373326ba61d',
    totalAmount: '27298905282',
    rootCommittedAt: '1630593427'
  },
  '0x7ed0cc290a30ebde1873ee517d49400fb9d80b624dbe8651c0c84e5fb934ecc1': {
    destinationChainId: '1',
    rootHash: '0x7ed0cc290a30ebde1873ee517d49400fb9d80b624dbe8651c0c84e5fb934ecc1',
    totalAmount: '52777936245',
    rootCommittedAt: '1630045346'
  },
  '0xa38511a22d4aaa89af1fb35357b2beb783db8195a2ac152e71971409d10de214': {
    destinationChainId: '137',
    rootHash: '0xa38511a22d4aaa89af1fb35357b2beb783db8195a2ac152e71971409d10de214',
    totalAmount: '59265162207',
    rootCommittedAt: '1630051960'
  },
  '0xbc7d51f6c0a80dad447b3f7b8d385e65d3c328439354995fd1e0cc7a7d180f4b': {
    destinationChainId: '1',
    rootHash: '0xbc7d51f6c0a80dad447b3f7b8d385e65d3c328439354995fd1e0cc7a7d180f4b',
    totalAmount: '97330705612',
    rootCommittedAt: '1630209506'
  },
  '0xe59431ffa8ea55c12f5359b136c39ca5d61f97fa51d2d95e1300c24f96a1fb5d': {
    destinationChainId: '1',
    rootHash: '0xe59431ffa8ea55c12f5359b136c39ca5d61f97fa51d2d95e1300c24f96a1fb5d',
    totalAmount: '94694522837',
    rootCommittedAt: '1630055624'
  },
  '0xad173b74098d81249c64574d4575b59ed33de2351cdc34b2f4a194dbc385fd00': {
    destinationChainId: '1',
    rootHash: '0xad173b74098d81249c64574d4575b59ed33de2351cdc34b2f4a194dbc385fd00',
    totalAmount: '31284906353',
    rootCommittedAt: '1630457357'
  },
  '0x5dae21c49a21bd0496f8eb087a36e58ae046ece3fe4aaf9ff5e9ac79e6707e01': {
    destinationChainId: '137',
    rootHash: '0x5dae21c49a21bd0496f8eb087a36e58ae046ece3fe4aaf9ff5e9ac79e6707e01',
    totalAmount: '55645750767',
    rootCommittedAt: '1630494230'
  },
  '0xd2e7f7824c5e531e6d90dbfcc47f4ba46e11cef3e4abbf87935ee436f46881aa': {
    destinationChainId: '137',
    rootHash: '0xd2e7f7824c5e531e6d90dbfcc47f4ba46e11cef3e4abbf87935ee436f46881aa',
    totalAmount: '27139423997',
    rootCommittedAt: '1630076794'
  },
  '0x2faa3e98173de260f4ffb6b10969fe7edad96d3983c81b50fe2ecc067ddad6d6': {
    destinationChainId: '137',
    rootHash: '0x2faa3e98173de260f4ffb6b10969fe7edad96d3983c81b50fe2ecc067ddad6d6',
    totalAmount: '50995747563',
    rootCommittedAt: '1630502188'
  },
  '0x05198fa56d6401d65820f6f7d07d4fe416d5ae2fbaabadc6e7c3e56fee351894': {
    destinationChainId: '137',
    rootHash: '0x05198fa56d6401d65820f6f7d07d4fe416d5ae2fbaabadc6e7c3e56fee351894',
    totalAmount: '63117736836',
    rootCommittedAt: '1630649022'
  },
  '0x3e0dd00d4a0d48a40f722b356188e9220bcd0c67ad9bdcce0ae7c6647538545b': {
    destinationChainId: '1',
    rootHash: '0x3e0dd00d4a0d48a40f722b356188e9220bcd0c67ad9bdcce0ae7c6647538545b',
    totalAmount: '177006115460',
    rootCommittedAt: '1630505354'
  },
  '0x30d101865c735e96d1de8ba9482cdfb9b88be2c8708f4aecd62667da5ffbc1c3': {
    destinationChainId: '1',
    rootHash: '0x30d101865c735e96d1de8ba9482cdfb9b88be2c8708f4aecd62667da5ffbc1c3',
    totalAmount: '68536196183',
    rootCommittedAt: '1630769381'
  },
  '0x42cedfb0b2e9a0f8261f5eb51a1cc750baf95556bc34de88a368c5afc071db5f': {
    destinationChainId: '137',
    rootHash: '0x42cedfb0b2e9a0f8261f5eb51a1cc750baf95556bc34de88a368c5afc071db5f',
    totalAmount: '52385466998',
    rootCommittedAt: '1630669855'
  },
  '0x44e72d8dde160eab2fc32fab3115e97f5b5664856e17cc333279c691a56755a3': {
    destinationChainId: '1',
    rootHash: '0x44e72d8dde160eab2fc32fab3115e97f5b5664856e17cc333279c691a56755a3',
    totalAmount: '31426930033',
    rootCommittedAt: '1630529714'
  },
  '0x40c165dc20890285c6f691cc255537d10dc53378532d60451cc258d680e94acc': {
    destinationChainId: '1',
    rootHash: '0x40c165dc20890285c6f691cc255537d10dc53378532d60451cc258d680e94acc',
    totalAmount: '3993415115',
    rootCommittedAt: '1630548943'
  },
  '0x1dc66931dabd54be08c7144b6392ffa251d5749e0dc4b07b2e54f69f31afdb92': {
    destinationChainId: '1',
    rootHash: '0x1dc66931dabd54be08c7144b6392ffa251d5749e0dc4b07b2e54f69f31afdb92',
    totalAmount: '49921663797',
    rootCommittedAt: '1630557801'
  },
  '0x337abad44d3b13479118b60fdde4f3396048b2e39de926d3c90d5cacd350c1ca': {
    destinationChainId: '137',
    rootHash: '0x337abad44d3b13479118b60fdde4f3396048b2e39de926d3c90d5cacd350c1ca',
    totalAmount: '88723937889',
    rootCommittedAt: '1630718007'
  },
  '0x9b543e49e9c05f671700c93930de379aa1efa9b5117f320409737809c883271e': {
    destinationChainId: '137',
    rootHash: '0x9b543e49e9c05f671700c93930de379aa1efa9b5117f320409737809c883271e',
    totalAmount: '91734518118',
    rootCommittedAt: '1630875988'
  },
  '0x9f229b66d4cc8a7e5e22cef33a6faab66c30eb29a20ec5e8e75f7dd54d23f151': {
    destinationChainId: '137',
    rootHash: '0x9f229b66d4cc8a7e5e22cef33a6faab66c30eb29a20ec5e8e75f7dd54d23f151',
    totalAmount: '59436420107',
    rootCommittedAt: '1630875988'
  },
  '0xdf026fcc0819b08750e66d8aca894e65c95162fd9f6b3d48b6254f61a4a4f801': {
    destinationChainId: '137',
    rootHash: '0xdf026fcc0819b08750e66d8aca894e65c95162fd9f6b3d48b6254f61a4a4f801',
    totalAmount: '130526216245',
    rootCommittedAt: '1631051046'
  },
  '0xdca2d0e82c65c3c9bde8441a665eb73b95dd5c91230bab3d96eeec005f12e889': {
    destinationChainId: '100',
    rootHash: '0xdca2d0e82c65c3c9bde8441a665eb73b95dd5c91230bab3d96eeec005f12e889',
    totalAmount: '1000551',
    rootCommittedAt: '1631311870'
  },
  '0xfb5214a80be1af4eb27089a140bb62f44c85a6dec1b985dbbc610e1d4b4c0f95': {
    destinationChainId: '1',
    rootHash: '0xfb5214a80be1af4eb27089a140bb62f44c85a6dec1b985dbbc610e1d4b4c0f95',
    totalAmount: '204193459259',
    rootCommittedAt: '1631431616'
  },
  '0x8d2bacc4476964af20032225bc04791ed7208810512654d6610b0b2c7b1bf3b8': {
    destinationChainId: '137',
    rootHash: '0x8d2bacc4476964af20032225bc04791ed7208810512654d6610b0b2c7b1bf3b8',
    totalAmount: '50137557957',
    rootCommittedAt: '1631455880'
  },
  '0x1ccb2017b32befd62d40fe4422767061e0256c0ccf8c43ca79c0b329bc471e02': {
    destinationChainId: '1',
    rootHash: '0x1ccb2017b32befd62d40fe4422767061e0256c0ccf8c43ca79c0b329bc471e02',
    totalAmount: '200436700737',
    rootCommittedAt: '1631457498'
  },
  '0xc3ef5a2c09bdefc8316e3048b80113368d31d1979c348d36c10585a4f45ebbb2': {
    destinationChainId: '137',
    rootHash: '0xc3ef5a2c09bdefc8316e3048b80113368d31d1979c348d36c10585a4f45ebbb2',
    totalAmount: '76190642828',
    rootCommittedAt: '1631511166'
  },
  '0xbb312550ecd68c1b12e12284996789dd62b7715bccfeeebc18ce39652a4a6a35': {
    destinationChainId: '1',
    rootHash: '0xbb312550ecd68c1b12e12284996789dd62b7715bccfeeebc18ce39652a4a6a35',
    totalAmount: '200498771507',
    rootCommittedAt: '1631541258'
  },
  '0xcd870107c8eb63ba4c5f80ff39dd19b11155e790b77424cd7054f3bcd021bae0': {
    destinationChainId: '137',
    rootHash: '0xcd870107c8eb63ba4c5f80ff39dd19b11155e790b77424cd7054f3bcd021bae0',
    totalAmount: '78921263759',
    rootCommittedAt: '1631586439'
  },
  '0xb1514c7d19df0b3c46071615a4b47ad0473809fc7876d6caf89fecbbd9e42de9': {
    destinationChainId: '137',
    rootHash: '0xb1514c7d19df0b3c46071615a4b47ad0473809fc7876d6caf89fecbbd9e42de9',
    totalAmount: '22443664737',
    rootCommittedAt: '1631620791'
  },
  '0xa615016239d17c13cbd4bbbd38fd58c811961c0e2b9f067040a96b9338d37ec3': {
    destinationChainId: '137',
    rootHash: '0xa615016239d17c13cbd4bbbd38fd58c811961c0e2b9f067040a96b9338d37ec3',
    totalAmount: '29949560176',
    rootCommittedAt: '1631676285'
  },
  '0x0303d65b67716ee5597765a112d51c7cae26ee72f13a95787b2fbc8b96752fd4': {
    destinationChainId: '137',
    rootHash: '0x0303d65b67716ee5597765a112d51c7cae26ee72f13a95787b2fbc8b96752fd4',
    totalAmount: '28930416046',
    rootCommittedAt: '1631712019'
  },
  '0xfdbec56765375488339c7491835b6f0c1337091538bb9dd40e83916ab57729ab': {
    destinationChainId: '1',
    rootHash: '0xfdbec56765375488339c7491835b6f0c1337091538bb9dd40e83916ab57729ab',
    totalAmount: '206793847498',
    rootCommittedAt: '1631713309'
  },
  '0xa330692d0fe56a49fdad8d25d2b154108bb85c270a8c5022e3f72321f3808563': {
    destinationChainId: '1',
    rootHash: '0xa330692d0fe56a49fdad8d25d2b154108bb85c270a8c5022e3f72321f3808563',
    totalAmount: '203993953844',
    rootCommittedAt: '1631802826'
  },
  '0x0b5eaedb354426416ddc01b84f9c7a4a37c39725cbaee96e50739b13c4d6e0e7': {
    destinationChainId: '1',
    rootHash: '0x0b5eaedb354426416ddc01b84f9c7a4a37c39725cbaee96e50739b13c4d6e0e7',
    totalAmount: '200227987496',
    rootCommittedAt: '1631814644'
  },
  '0xa8666e17cd1309349df13a2f77c5fce260100389bee868040af9444f7920c1d5': {
    destinationChainId: '1',
    rootHash: '0xa8666e17cd1309349df13a2f77c5fce260100389bee868040af9444f7920c1d5',
    totalAmount: '315264869208',
    rootCommittedAt: '1631817648'
  },
  '0x98069ac0e120acae236059b979a4311cfa46512dd9795c389184388a90d28fb8': {
    destinationChainId: '137',
    rootHash: '0x98069ac0e120acae236059b979a4311cfa46512dd9795c389184388a90d28fb8',
    totalAmount: '65781297629',
    rootCommittedAt: '1631838902'
  },
  '0xadf5d16e6bc6ac53cdec0611ce502c13d45953196d4ba8906199af1c7ad3cd22': {
    destinationChainId: '42161',
    rootHash: '0xadf5d16e6bc6ac53cdec0611ce502c13d45953196d4ba8906199af1c7ad3cd22',
    totalAmount: '183860096037',
    rootCommittedAt: '1631854634'
  },
  '0x9cce7ccf14c0012c72d4026242e5fac487d73621358aa2de4b5141780699ca5c': {
    destinationChainId: '1',
    rootHash: '0x9cce7ccf14c0012c72d4026242e5fac487d73621358aa2de4b5141780699ca5c',
    totalAmount: '57882169112',
    rootCommittedAt: '1631854634'
  },
  '0xdb703550cfaf463198fbc61dabffda8b903d080177b18d506ea9e8387c435a8a': {
    destinationChainId: '137',
    rootHash: '0xdb703550cfaf463198fbc61dabffda8b903d080177b18d506ea9e8387c435a8a',
    totalAmount: '27958361775',
    rootCommittedAt: '1631874979'
  },
  '0x7f2147ad900695e24d21067ed5c49b7eadcf78faa44ca007db1f29c1500fe4ac': {
    destinationChainId: '137',
    rootHash: '0x7f2147ad900695e24d21067ed5c49b7eadcf78faa44ca007db1f29c1500fe4ac',
    totalAmount: '23395542944',
    rootCommittedAt: '1631922193'
  },
  '0xd3d7ffef8b3b31f47b78b9332d0120ee86a356b98e95ddc78ea4b0bcc3663bb3': {
    destinationChainId: '42161',
    rootHash: '0xd3d7ffef8b3b31f47b78b9332d0120ee86a356b98e95ddc78ea4b0bcc3663bb3',
    totalAmount: '126835128762',
    rootCommittedAt: '1631950866'
  },
  '0x9a52bce80f830f83a851521511b2a13d9c7e99a195218f91f6d4d24b11ccf806': {
    destinationChainId: '100',
    rootHash: '0x9a52bce80f830f83a851521511b2a13d9c7e99a195218f91f6d4d24b11ccf806',
    totalAmount: '26015042200',
    rootCommittedAt: '1631952947'
  },
  '0x91352a40d13118aaa7f0b1291e61278b7478682d2199e2b47486f03230569dfb': {
    destinationChainId: '42161',
    rootHash: '0x91352a40d13118aaa7f0b1291e61278b7478682d2199e2b47486f03230569dfb',
    totalAmount: '72844832725',
    rootCommittedAt: '1631979563'
  },
  '0xb9c1354ec6dd674219153d3612fec7e2383740567dca4750228da886d759a69e': {
    destinationChainId: '137',
    rootHash: '0xb9c1354ec6dd674219153d3612fec7e2383740567dca4750228da886d759a69e',
    totalAmount: '38706609734',
    rootCommittedAt: '1631983590'
  },
  '0xcb4ad294eca57115f08b54d6efe0c3c5815b8c3279705de9fd796c4970d21d00': {
    destinationChainId: '100',
    rootHash: '0xcb4ad294eca57115f08b54d6efe0c3c5815b8c3279705de9fd796c4970d21d00',
    totalAmount: '48869003598',
    rootCommittedAt: '1632008985'
  },
  '0x4de0fc59576c4e2f2bc307eb39b9fe0300712a6502aacd47d3634f08eb9cf845': {
    destinationChainId: '100',
    rootHash: '0x4de0fc59576c4e2f2bc307eb39b9fe0300712a6502aacd47d3634f08eb9cf845',
    totalAmount: '33201531936',
    rootCommittedAt: '1632014029'
  },
  '0x0bea5b56de9f3580206020cc346488cc3c41bd4fdd751a839886ee18112a5dbf': {
    destinationChainId: '137',
    rootHash: '0x0bea5b56de9f3580206020cc346488cc3c41bd4fdd751a839886ee18112a5dbf',
    totalAmount: '82409651213',
    rootCommittedAt: '1632021834'
  },
  '0xef7ef2f8b71763a72404e76ad2f1b2741713e34be753f8bc900029efbe208d0c': {
    destinationChainId: '42161',
    rootHash: '0xef7ef2f8b71763a72404e76ad2f1b2741713e34be753f8bc900029efbe208d0c',
    totalAmount: '51378777088',
    rootCommittedAt: '1632036627'
  },
  '0x8d6d6753f25dcad47358230a5f93ca099beef81cbf1ba1b723a014bb7265f813': {
    destinationChainId: '1',
    rootHash: '0x8d6d6753f25dcad47358230a5f93ca099beef81cbf1ba1b723a014bb7265f813',
    totalAmount: '200389896708',
    rootCommittedAt: '1632037720'
  },
  '0xbf29cfc496d2e00f5c7ef34a1938465038f2f19e3453eaec4f8cc5d4e3bebc11': {
    destinationChainId: '137',
    rootHash: '0xbf29cfc496d2e00f5c7ef34a1938465038f2f19e3453eaec4f8cc5d4e3bebc11',
    totalAmount: '96967646039',
    rootCommittedAt: '1632065486'
  },
  '0x9cc217bef7d3f504fbe37154c0078864f42445d2b827bf5407be3572e64d8dc4': {
    destinationChainId: '137',
    rootHash: '0x9cc217bef7d3f504fbe37154c0078864f42445d2b827bf5407be3572e64d8dc4',
    totalAmount: '24276418853',
    rootCommittedAt: '1632065486'
  },
  '0x5b885f4b65d81bbe84942b7bd19eff667794f08f16b4cb15c0fe53c24b497fd2': {
    destinationChainId: '42161',
    rootHash: '0x5b885f4b65d81bbe84942b7bd19eff667794f08f16b4cb15c0fe53c24b497fd2',
    totalAmount: '30966542837',
    rootCommittedAt: '1632117975'
  },
  '0x7ad7da7063ddb50066e36a35781207a14333a1bde9d60ab2929d9a66724fbbc6': {
    destinationChainId: '137',
    rootHash: '0x7ad7da7063ddb50066e36a35781207a14333a1bde9d60ab2929d9a66724fbbc6',
    totalAmount: '128845102874',
    rootCommittedAt: '1632123491'
  },
  '0xb102e2a8fc699c81fc99cea0c7fc75c967252e881927795a170645ffdbcbc47d': {
    destinationChainId: '42161',
    rootHash: '0xb102e2a8fc699c81fc99cea0c7fc75c967252e881927795a170645ffdbcbc47d',
    totalAmount: '108538939023',
    rootCommittedAt: '1632148254'
  },
  '0xdfb85c9fbcfced3a302732938c248375a61fa40eea81430d8836d1acb7bae50c': {
    destinationChainId: '1',
    rootHash: '0xdfb85c9fbcfced3a302732938c248375a61fa40eea81430d8836d1acb7bae50c',
    totalAmount: '132021978923',
    rootCommittedAt: '1632178907'
  },
  '0xb3698d62594d7f6f79463a0aad7961b8067b161db44824911428da273f35181a': {
    destinationChainId: '1',
    rootHash: '0xb3698d62594d7f6f79463a0aad7961b8067b161db44824911428da273f35181a',
    totalAmount: '104673780715',
    rootCommittedAt: '1632193369'
  },
  '0x0af0531e2a61dd3066ca1451f0c7ee1bcf7a9423bc5f4dd070221be531ebf645': {
    destinationChainId: '42161',
    rootHash: '0x0af0531e2a61dd3066ca1451f0c7ee1bcf7a9423bc5f4dd070221be531ebf645',
    totalAmount: '90541465088',
    rootCommittedAt: '1632194770'
  },
  '0x10867116dbe5703b6a76fb3eb9962a9062332e12ee00cf501798e438c40d5c65': {
    destinationChainId: '137',
    rootHash: '0x10867116dbe5703b6a76fb3eb9962a9062332e12ee00cf501798e438c40d5c65',
    totalAmount: '119949736956',
    rootCommittedAt: '1632227482'
  },
  '0x09a4be396bc8bf15671f5e2674d821781784ccbbe9aba92b82fa0002f5ea0f70': {
    destinationChainId: '1',
    rootHash: '0x09a4be396bc8bf15671f5e2674d821781784ccbbe9aba92b82fa0002f5ea0f70',
    totalAmount: '57710124039',
    rootCommittedAt: '1632285170'
  },
  '0x3f1ebc0a5b167d7f327a9b9631162a8a4434ace2a047e6979dc90dfd2d384744': {
    destinationChainId: '137',
    rootHash: '0x3f1ebc0a5b167d7f327a9b9631162a8a4434ace2a047e6979dc90dfd2d384744',
    totalAmount: '98991638362',
    rootCommittedAt: '1632285170'
  },
  '0xedf1599a758934eb06478aa270b71df6a4c237ba64efaeaa48fa2d85f25cd947': {
    destinationChainId: '1',
    rootHash: '0xedf1599a758934eb06478aa270b71df6a4c237ba64efaeaa48fa2d85f25cd947',
    totalAmount: '65987099288',
    rootCommittedAt: '1632285170'
  },
  '0x08768d792cad4baf19edcff40ea602d65a07af44ba7ca5a4ce868ba1ee1c348c': {
    destinationChainId: '137',
    rootHash: '0x08768d792cad4baf19edcff40ea602d65a07af44ba7ca5a4ce868ba1ee1c348c',
    totalAmount: '48080991036',
    rootCommittedAt: '1632285170'
  },
  '0x271d5a2df3fa40c73aceee65546e13a875a6fa9a23d5e030861514f6c94d22f6': {
    destinationChainId: '1',
    rootHash: '0x271d5a2df3fa40c73aceee65546e13a875a6fa9a23d5e030861514f6c94d22f6',
    totalAmount: '100927344859',
    rootCommittedAt: '1632353757'
  },
  '0x1ad9a4c9fcfc09b0d20f3c54c15885dd6512b699a636fc7836b5b7f1c4105758': {
    destinationChainId: '137',
    rootHash: '0x1ad9a4c9fcfc09b0d20f3c54c15885dd6512b699a636fc7836b5b7f1c4105758',
    totalAmount: '96923903376',
    rootCommittedAt: '1632403654'
  },
  '0x315b66817bbf2d22653fa3096af84693de76c7e4fa6ea8e1b6e6b5299b253ab2': {
    destinationChainId: '42161',
    rootHash: '0x315b66817bbf2d22653fa3096af84693de76c7e4fa6ea8e1b6e6b5299b253ab2',
    totalAmount: '101168506455',
    rootCommittedAt: '1632403654'
  },
  '0xc10d265ac10e3bc11594cad680c441f7aa867a2971e24366055d574b63888817': {
    destinationChainId: '1',
    rootHash: '0xc10d265ac10e3bc11594cad680c441f7aa867a2971e24366055d574b63888817',
    totalAmount: '179671447123',
    rootCommittedAt: '1632453576'
  },
  '0x22943d9ae1b2d2d2eebf5ffe2496118c35d7985d60243d31d50d6ce839443bb0': {
    destinationChainId: '137',
    rootHash: '0x22943d9ae1b2d2d2eebf5ffe2496118c35d7985d60243d31d50d6ce839443bb0',
    totalAmount: '125363793977',
    rootCommittedAt: '1632466963'
  },
  '0xf457e7c1da7d1408c72adb15bd3f51394e8a7736772562d58690506d19db8c75': {
    destinationChainId: '1',
    rootHash: '0xf457e7c1da7d1408c72adb15bd3f51394e8a7736772562d58690506d19db8c75',
    totalAmount: '201667257083',
    rootCommittedAt: '1632480055'
  },
  '0xd52aee006a12450f15ef5d18709013e9cfbd1ff217e77bacb57a3952966282af': {
    destinationChainId: '100',
    rootHash: '0xd52aee006a12450f15ef5d18709013e9cfbd1ff217e77bacb57a3952966282af',
    totalAmount: '25717505366',
    rootCommittedAt: '1632555930'
  },
  '0xbbcd8130220c139dea56d04a58972cad603883651823808c2317e947da407194': {
    destinationChainId: '137',
    rootHash: '0xbbcd8130220c139dea56d04a58972cad603883651823808c2317e947da407194',
    totalAmount: '65873085555',
    rootCommittedAt: '1632559462'
  },
  '0xaf3b767c713a7741629a9c9a3f3d4a078c606173c38f7d3788c8fe4c66136e5e': {
    destinationChainId: '100',
    rootHash: '0xaf3b767c713a7741629a9c9a3f3d4a078c606173c38f7d3788c8fe4c66136e5e',
    totalAmount: '25832207156',
    rootCommittedAt: '1632567758'
  },
  '0x92af496a03e59fa0ab24f4327c3b7c44f7589b7acf29f4b8aef4af9490f752d7': {
    destinationChainId: '137',
    rootHash: '0x92af496a03e59fa0ab24f4327c3b7c44f7589b7acf29f4b8aef4af9490f752d7',
    totalAmount: '54379315796',
    rootCommittedAt: '1632569065'
  },
  '0x4e02bc4ccc96a417af8130873720501191325c762b993baa19ea416a79673473': {
    destinationChainId: '137',
    rootHash: '0x4e02bc4ccc96a417af8130873720501191325c762b993baa19ea416a79673473',
    totalAmount: '19018744171',
    rootCommittedAt: '1632601722'
  },
  '0x6fb52b51505b305c323c8aa4c8e8a6e27f01e6a664921667e928655d57003461': {
    destinationChainId: '42161',
    rootHash: '0x6fb52b51505b305c323c8aa4c8e8a6e27f01e6a664921667e928655d57003461',
    totalAmount: '98899984383',
    rootCommittedAt: '1632603735'
  },
  '0x450b7e41017a713591126fa3f54a144ac122afb408f3e36db6d8640ab3017395': {
    destinationChainId: '1',
    rootHash: '0x450b7e41017a713591126fa3f54a144ac122afb408f3e36db6d8640ab3017395',
    totalAmount: '129092870285',
    rootCommittedAt: '1632603780'
  },
  '0xd1bc6c48de26893e1ade9e7a5c4ff260918a2bccbe894c39f7b684206d70a711': {
    destinationChainId: '100',
    rootHash: '0xd1bc6c48de26893e1ade9e7a5c4ff260918a2bccbe894c39f7b684206d70a711',
    totalAmount: '27290953942',
    rootCommittedAt: '1632626825'
  },
  '0x994aa1ec08939a904b1c746f13e9b8806a72f6491f69da0c6c94c1b5fe031aca': {
    destinationChainId: '137',
    rootHash: '0x994aa1ec08939a904b1c746f13e9b8806a72f6491f69da0c6c94c1b5fe031aca',
    totalAmount: '5894285152',
    rootCommittedAt: '1632630015'
  },
  '0x877e7385dc56273016b7fbc17dfd502e8f81a0456c38870da567131eb867492c': {
    destinationChainId: '137',
    rootHash: '0x877e7385dc56273016b7fbc17dfd502e8f81a0456c38870da567131eb867492c',
    totalAmount: '395623256',
    rootCommittedAt: '1632639079'
  },
  '0x25d0246af792eba8d4a183e28ea5de65cc04cc9e662c031b63f673c4a2dba957': {
    destinationChainId: '137',
    rootHash: '0x25d0246af792eba8d4a183e28ea5de65cc04cc9e662c031b63f673c4a2dba957',
    totalAmount: '1743287135',
    rootCommittedAt: '1632656822'
  },
  '0xe558b87cdd0ce60436119eadd60438f05917606196a46e4dcbad382fd381c4fa': {
    destinationChainId: '100',
    rootHash: '0xe558b87cdd0ce60436119eadd60438f05917606196a46e4dcbad382fd381c4fa',
    totalAmount: '25282141854',
    rootCommittedAt: '1632662427'
  },
  '0x3c050ba156e4c9a3cc41b9a48d1a0bd13026ff7d450c79c35b2746583eaa8769': {
    destinationChainId: '1',
    rootHash: '0x3c050ba156e4c9a3cc41b9a48d1a0bd13026ff7d450c79c35b2746583eaa8769',
    totalAmount: '113160696416',
    rootCommittedAt: '1632668280'
  },
  '0xc208bac39379adc5f3c5dd194333d380be3a45a3f400e5d69d91d4057d7e7022': {
    destinationChainId: '137',
    rootHash: '0xc208bac39379adc5f3c5dd194333d380be3a45a3f400e5d69d91d4057d7e7022',
    totalAmount: '75032023079',
    rootCommittedAt: '1632668328'
  },
  '0x1c19ac4a3699160adb110b37eb1be3d93dd58e4cccab8b74ccc3613ab0fcdecc': {
    destinationChainId: '137',
    rootHash: '0x1c19ac4a3699160adb110b37eb1be3d93dd58e4cccab8b74ccc3613ab0fcdecc',
    totalAmount: '911002060',
    rootCommittedAt: '1632682866'
  },
  '0xd9a132b053a0b07c6fd786b873fa336cfdc83594dbbf78752ab4f16e849624ae': {
    destinationChainId: '137',
    rootHash: '0xd9a132b053a0b07c6fd786b873fa336cfdc83594dbbf78752ab4f16e849624ae',
    totalAmount: '5045360507',
    rootCommittedAt: '1632723795'
  },
  '0x84a65fb732ad294ca32c83b46cc3d36442315c2da127f9031b0f895da70748f5': {
    destinationChainId: '100',
    rootHash: '0x84a65fb732ad294ca32c83b46cc3d36442315c2da127f9031b0f895da70748f5',
    totalAmount: '28119808950',
    rootCommittedAt: '1632736918'
  },
  '0x4f3d57daf4e9d2478166926f1cef2e94af3b7296d616f96abc36caa8f2f7cb8d': {
    destinationChainId: '137',
    rootHash: '0x4f3d57daf4e9d2478166926f1cef2e94af3b7296d616f96abc36caa8f2f7cb8d',
    totalAmount: '573716168',
    rootCommittedAt: '1632739469'
  },
  '0xe33d540e32bf66ac84ed9daed0b318a97cc3638e63c0d657c0405e09b62988c2': {
    destinationChainId: '1',
    rootHash: '0xe33d540e32bf66ac84ed9daed0b318a97cc3638e63c0d657c0405e09b62988c2',
    totalAmount: '110058600197',
    rootCommittedAt: '1632761141'
  },
  '0xd133bbc27dbc070766f6fd9cfe6f00f1cdf7ce9c7799fbdc2532886017fd765a': {
    destinationChainId: '137',
    rootHash: '0xd133bbc27dbc070766f6fd9cfe6f00f1cdf7ce9c7799fbdc2532886017fd765a',
    totalAmount: '46511985582',
    rootCommittedAt: '1632761481'
  },
  '0x447038ca83c8e83fbfbe9a59fe9c00aaf3c139c267d6b44295aa4a5a41b13def': {
    destinationChainId: '42161',
    rootHash: '0x447038ca83c8e83fbfbe9a59fe9c00aaf3c139c267d6b44295aa4a5a41b13def',
    totalAmount: '65021571055',
    rootCommittedAt: '1632761481'
  },
  '0x3ab3c4e7f3963fa16c210d376330bb51d6f1dde2e9bebf4f497ced87b2feab5b': {
    destinationChainId: '137',
    rootHash: '0x3ab3c4e7f3963fa16c210d376330bb51d6f1dde2e9bebf4f497ced87b2feab5b',
    totalAmount: '17167945743',
    rootCommittedAt: '1632826692'
  },
  '0x343d20afafb9f63bde81fa28596843eaf02bf5940ef1a27963f3840c92560ae7': {
    destinationChainId: '137',
    rootHash: '0x343d20afafb9f63bde81fa28596843eaf02bf5940ef1a27963f3840c92560ae7',
    totalAmount: '4025612124',
    rootCommittedAt: '1632859265'
  },
  '0x29f8b380d028025c75f8c386c9f9191bb8bbbb0e9eebd5318b852daf280fd9b2': {
    destinationChainId: '42161',
    rootHash: '0x29f8b380d028025c75f8c386c9f9191bb8bbbb0e9eebd5318b852daf280fd9b2',
    totalAmount: '15583432219',
    rootCommittedAt: '1632861683'
  },
  '0xc1485af9d819a7d054a61b25da18589112bb10528a697143320da3ab13644e84': {
    destinationChainId: '100',
    rootHash: '0xc1485af9d819a7d054a61b25da18589112bb10528a697143320da3ab13644e84',
    totalAmount: '27564764756',
    rootCommittedAt: '1632879577'
  },
  '0xbc15f494baeca09633154f7aaf3ab12b71d11d4790f06075ab683265c82d2948': {
    destinationChainId: '100',
    rootHash: '0xbc15f494baeca09633154f7aaf3ab12b71d11d4790f06075ab683265c82d2948',
    totalAmount: '27110336438',
    rootCommittedAt: '1632904593'
  },
  '0x456f006455a39eb958576e3659c5435d25ea11012a98fab149bcd2329d15d01e': {
    destinationChainId: '137',
    rootHash: '0x456f006455a39eb958576e3659c5435d25ea11012a98fab149bcd2329d15d01e',
    totalAmount: '54051991696',
    rootCommittedAt: '1632945095'
  },
  '0x67c928eadd90a5d4ee9b754b25a690ff484edd1ac6df401daa2ade75459dfaa1': {
    destinationChainId: '1',
    rootHash: '0x67c928eadd90a5d4ee9b754b25a690ff484edd1ac6df401daa2ade75459dfaa1',
    totalAmount: '91679302139',
    rootCommittedAt: '1632956907'
  },
  '0xeded5d2168a1192bdb001fbbacb260f4736daa77db0f3b492c89661fff9c56ce': {
    destinationChainId: '137',
    rootHash: '0xeded5d2168a1192bdb001fbbacb260f4736daa77db0f3b492c89661fff9c56ce',
    totalAmount: '53833119743',
    rootCommittedAt: '1632986858'
  },
  '0xab97dbe913301d004c2b4e1f9dae9fac3e12ef3246cde4da27ef8b4fe1be4ea6': {
    destinationChainId: '100',
    rootHash: '0xab97dbe913301d004c2b4e1f9dae9fac3e12ef3246cde4da27ef8b4fe1be4ea6',
    totalAmount: '26268364709',
    rootCommittedAt: '1632989341'
  },
  '0x9a1df4b96c4024ad26456d0434291b36a0b67c61fd2bb27e2ab8d7210b6945fc': {
    destinationChainId: '137',
    rootHash: '0x9a1df4b96c4024ad26456d0434291b36a0b67c61fd2bb27e2ab8d7210b6945fc',
    totalAmount: '9868544253',
    rootCommittedAt: '1633000998'
  },
  '0x33b06320ee4eedbfb4d569bfe0f4d5ccf487d2f339ebb8cdcd78f109e8cef113': {
    destinationChainId: '100',
    rootHash: '0x33b06320ee4eedbfb4d569bfe0f4d5ccf487d2f339ebb8cdcd78f109e8cef113',
    totalAmount: '25013408612',
    rootCommittedAt: '1633011577'
  },
  '0x1e6effa74a76055f0c4d5cafecfa58fc6a24f48658de42df441df41f925d2638': {
    destinationChainId: '42161',
    rootHash: '0x1e6effa74a76055f0c4d5cafecfa58fc6a24f48658de42df441df41f925d2638',
    totalAmount: '100308997359',
    rootCommittedAt: '1633023989'
  },
  '0x48e21206d3a23ce6fb4111869f6b8bcfe395d048148d4938d3368c8ecca6b6d9': {
    destinationChainId: '1',
    rootHash: '0x48e21206d3a23ce6fb4111869f6b8bcfe395d048148d4938d3368c8ecca6b6d9',
    totalAmount: '198399024665',
    rootCommittedAt: '1633132783'
  },
  '0xa2b63afa4370c11d96ad5cfe7dd55cb4f90381be977cad49a3a61347bb180eac': {
    destinationChainId: '137',
    rootHash: '0xa2b63afa4370c11d96ad5cfe7dd55cb4f90381be977cad49a3a61347bb180eac',
    totalAmount: '145835140796',
    rootCommittedAt: '1633145689'
  },
  '0x894281b2628a3893bcea384c4d52b186cecbad12215609a14c23f678856bcb1b': {
    destinationChainId: '137',
    rootHash: '0x894281b2628a3893bcea384c4d52b186cecbad12215609a14c23f678856bcb1b',
    totalAmount: '71611890961',
    rootCommittedAt: '1633148457'
  },
  '0x766406458dab8bd4c0aec3aa1d7cd3c806e819ba065c333acfe562fa04e0ee71': {
    destinationChainId: '137',
    rootHash: '0x766406458dab8bd4c0aec3aa1d7cd3c806e819ba065c333acfe562fa04e0ee71',
    totalAmount: '20438856981',
    rootCommittedAt: '1633162243'
  },
  '0x9ae625b2cb1a616e9eca15cec83bf58ae74e4fae2a3cae3418a26a2ac6828132': {
    destinationChainId: '137',
    rootHash: '0x9ae625b2cb1a616e9eca15cec83bf58ae74e4fae2a3cae3418a26a2ac6828132',
    totalAmount: '263531634',
    rootCommittedAt: '1633169916'
  },
  '0x34d9d8a66e24d3d852844e3210eee22dd0cf91f6dc4f06a418eaaa496e3d7b91': {
    destinationChainId: '137',
    rootHash: '0x34d9d8a66e24d3d852844e3210eee22dd0cf91f6dc4f06a418eaaa496e3d7b91',
    totalAmount: '1053419177',
    rootCommittedAt: '1633179380'
  },
  '0xa41cb8ee498e890dd93314aa6204ee976a8766e15013e4b267faaaa0e89d0d09': {
    destinationChainId: '1',
    rootHash: '0xa41cb8ee498e890dd93314aa6204ee976a8766e15013e4b267faaaa0e89d0d09',
    totalAmount: '321128581345',
    rootCommittedAt: '1633203267'
  },
  '0xbe376bc3091a5ec8930e87f4326e08c2c6bd787e23674dbc8c0654736ca49905': {
    destinationChainId: '137',
    rootHash: '0xbe376bc3091a5ec8930e87f4326e08c2c6bd787e23674dbc8c0654736ca49905',
    totalAmount: '7742823152',
    rootCommittedAt: '1633211191'
  },
  '0x80b2f3dbd6f5ef1691b5316e53911fcb098e01c0f9b73f08dbab4a1ae5d30832': {
    destinationChainId: '1',
    rootHash: '0x80b2f3dbd6f5ef1691b5316e53911fcb098e01c0f9b73f08dbab4a1ae5d30832',
    totalAmount: '4409488967',
    rootCommittedAt: '1633223547'
  },
  '0xddadc4db18ddefc6ea1cb3f928fa3cd212b996c41fdfe8297ff4f64fa5ef6367': {
    destinationChainId: '137',
    rootHash: '0xddadc4db18ddefc6ea1cb3f928fa3cd212b996c41fdfe8297ff4f64fa5ef6367',
    totalAmount: '256569022',
    rootCommittedAt: '1633228830'
  },
  '0xc48b1e0a8a6171a35bebbefaaf3cde3e41d492b13c173f8e520a523b61c013b7': {
    destinationChainId: '137',
    rootHash: '0xc48b1e0a8a6171a35bebbefaaf3cde3e41d492b13c173f8e520a523b61c013b7',
    totalAmount: '256683914',
    rootCommittedAt: '1633249262'
  },
  '0xfc7078ac4b8e5a2c84d24f88a0007025f22c7a57c711803004f464b8542cd1d9': {
    destinationChainId: '137',
    rootHash: '0xfc7078ac4b8e5a2c84d24f88a0007025f22c7a57c711803004f464b8542cd1d9',
    totalAmount: '256709809',
    rootCommittedAt: '1633315689'
  },
  '0xe6e43d2cfcbe8946b84a48f2c4d45c1e60fcaf435d453233226ffa730b240674': {
    destinationChainId: '137',
    rootHash: '0xe6e43d2cfcbe8946b84a48f2c4d45c1e60fcaf435d453233226ffa730b240674',
    totalAmount: '82106071737',
    rootCommittedAt: '1633385085'
  },
  '0x0135a047de23bb159376addab64e5de4c27a45b472633ea05efaa7d8183b9ad9': {
    destinationChainId: '42161',
    rootHash: '0x0135a047de23bb159376addab64e5de4c27a45b472633ea05efaa7d8183b9ad9',
    totalAmount: '83638957078',
    rootCommittedAt: '1633385085'
  },
  '0x4550b2678878d20f9dfb85c9c9c6345e13c55b6876a16739586ecae24f67d969': {
    destinationChainId: '100',
    rootHash: '0x4550b2678878d20f9dfb85c9c9c6345e13c55b6876a16739586ecae24f67d969',
    totalAmount: '27036300669',
    rootCommittedAt: '1633610285'
  },
  '0x7584294377a954247aa7f32a8e2b4160cac64edab5984a98b14c8de54e2c91ea': {
    destinationChainId: '1',
    rootHash: '0x7584294377a954247aa7f32a8e2b4160cac64edab5984a98b14c8de54e2c91ea',
    totalAmount: '100413976286',
    rootCommittedAt: '1633815293'
  },
  '0x819b5843864b1aeb76939731b7623178ef7ed70261267f90ac937a72ed9d27be': {
    destinationChainId: '1',
    rootHash: '0x819b5843864b1aeb76939731b7623178ef7ed70261267f90ac937a72ed9d27be',
    totalAmount: '100232383592',
    rootCommittedAt: '1633823403'
  },
  '0x026d3221d850905bd0e305d4bab9262d839ec0bb5229a5fb9f64b2918cb0d5e5': {
    destinationChainId: '1',
    rootHash: '0x026d3221d850905bd0e305d4bab9262d839ec0bb5229a5fb9f64b2918cb0d5e5',
    totalAmount: '138101647440',
    rootCommittedAt: '1633851824'
  },
  '0x0429a442422aed38351643f63cf2d845585d0b03e4d0ff844b29b9fa1c726a5f': {
    destinationChainId: '137',
    rootHash: '0x0429a442422aed38351643f63cf2d845585d0b03e4d0ff844b29b9fa1c726a5f',
    totalAmount: '27063180449',
    rootCommittedAt: '1633855053'
  },
  '0xb276bc91f139b24f1d1cd6efe922d6e3a91ec6d926cf7e2d9b6a92e8e786fc10': {
    destinationChainId: '100',
    rootHash: '0xb276bc91f139b24f1d1cd6efe922d6e3a91ec6d926cf7e2d9b6a92e8e786fc10',
    totalAmount: '26471529452',
    rootCommittedAt: '1633855466'
  },
  '0x3b91b790195dac173c24acfb20f65c36f302986e241d00c0f5a2e3d05e54f7a4': {
    destinationChainId: '137',
    rootHash: '0x3b91b790195dac173c24acfb20f65c36f302986e241d00c0f5a2e3d05e54f7a4',
    totalAmount: '57016882254',
    rootCommittedAt: '1633858088'
  },
  '0x2fcbacf4012d79b9f8e96b333c8eedea497cc536f836f9ff6eb1a3a10df091ea': {
    destinationChainId: '1',
    rootHash: '0x2fcbacf4012d79b9f8e96b333c8eedea497cc536f836f9ff6eb1a3a10df091ea',
    totalAmount: '109027986861',
    rootCommittedAt: '1633859626'
  },
  '0xb07b238a085901ac837f1ae28ef4e2ad26bac868a1affb8172672347d550dc23': {
    destinationChainId: '42161',
    rootHash: '0xb07b238a085901ac837f1ae28ef4e2ad26bac868a1affb8172672347d550dc23',
    totalAmount: '75190692504',
    rootCommittedAt: '1633866087'
  },
  '0xe27bd66eddcce4c6a457e3f3c72f09a4ffa5402e0112008a6187f48fc5ad9f8a': {
    destinationChainId: '1',
    rootHash: '0xe27bd66eddcce4c6a457e3f3c72f09a4ffa5402e0112008a6187f48fc5ad9f8a',
    totalAmount: '112312402500',
    rootCommittedAt: '1633867448'
  },
  '0xdab0180d85556209ea619ac30931f8bf1cd3462d654a9b0c7c8c3b0bd3d143ec': {
    destinationChainId: '100',
    rootHash: '0xdab0180d85556209ea619ac30931f8bf1cd3462d654a9b0c7c8c3b0bd3d143ec',
    totalAmount: '24980164792',
    rootCommittedAt: '1633880046'
  },
  '0x5e02dbced9ddf3d2a467fd0981cadac7f8b9da1b28e2dca077abaa9ebd25d53e': {
    destinationChainId: '137',
    rootHash: '0x5e02dbced9ddf3d2a467fd0981cadac7f8b9da1b28e2dca077abaa9ebd25d53e',
    totalAmount: '22972716020',
    rootCommittedAt: '1633891776'
  },
  '0x4bafb136a284899f31e0c4ef7e2390e049db4998e4073cc60e1466fc01ab80c9': {
    destinationChainId: '1',
    rootHash: '0x4bafb136a284899f31e0c4ef7e2390e049db4998e4073cc60e1466fc01ab80c9',
    totalAmount: '101815712706',
    rootCommittedAt: '1633891864'
  },
  '0x42041afda2a891dd07a09b148f0c5f49cf3994785d3c8fd08c0a217087e698a6': {
    destinationChainId: '42161',
    rootHash: '0x42041afda2a891dd07a09b148f0c5f49cf3994785d3c8fd08c0a217087e698a6',
    totalAmount: '59788841339',
    rootCommittedAt: '1633893277'
  },
  '0xe99b39aeffb69c467ec1c08fcb1524858af11391de2f46ac6f8844b442a1ecb6': {
    destinationChainId: '42161',
    rootHash: '0xe99b39aeffb69c467ec1c08fcb1524858af11391de2f46ac6f8844b442a1ecb6',
    totalAmount: '75067876458',
    rootCommittedAt: '1633927242'
  },
  '0xb897b2b55efc12874c45bc9c41435bf52ff817d4adb18aa5fc6a16704fdca5b2': {
    destinationChainId: '137',
    rootHash: '0xb897b2b55efc12874c45bc9c41435bf52ff817d4adb18aa5fc6a16704fdca5b2',
    totalAmount: '42669888883',
    rootCommittedAt: '1633970335'
  },
  '0xc882c52d76ecd4ab5a36adf7ed46432af8d23f0f1b106f1e5ab154b6b0b491af': {
    destinationChainId: '137',
    rootHash: '0xc882c52d76ecd4ab5a36adf7ed46432af8d23f0f1b106f1e5ab154b6b0b491af',
    totalAmount: '73092803075',
    rootCommittedAt: '1633980275'
  },
  '0x9192ab47ea2229590a2fe84720063650009051a6a75655e0d8c5f7cca6d2ceb4': {
    destinationChainId: '1',
    rootHash: '0x9192ab47ea2229590a2fe84720063650009051a6a75655e0d8c5f7cca6d2ceb4',
    totalAmount: '100785048428',
    rootCommittedAt: '1634006674'
  },
  '0x0d0bf5895bd80c99295ead092f8de6d924544d63e5a0f32a770b27877820117b': {
    destinationChainId: '1',
    rootHash: '0x0d0bf5895bd80c99295ead092f8de6d924544d63e5a0f32a770b27877820117b',
    totalAmount: '105993742583',
    rootCommittedAt: '1634018481'
  },
  '0x37b0835694651eeb0d9cdfe35e4d7469f60d16b0cbe11173d23b459d843d540d': {
    destinationChainId: '137',
    rootHash: '0x37b0835694651eeb0d9cdfe35e4d7469f60d16b0cbe11173d23b459d843d540d',
    totalAmount: '44756697281',
    rootCommittedAt: '1634025669'
  },
  '0x48e7d7979628aae31b077dcd7062344bd46135c33d9b0259b8f6cd1c213dd971': {
    destinationChainId: '42161',
    rootHash: '0x48e7d7979628aae31b077dcd7062344bd46135c33d9b0259b8f6cd1c213dd971',
    totalAmount: '79296920038',
    rootCommittedAt: '1634043316'
  },
  '0xf83ebdac9447fa325394782cbc481804583d6188abc62a08a96a2cbc03d1fe3a': {
    destinationChainId: '100',
    rootHash: '0xf83ebdac9447fa325394782cbc481804583d6188abc62a08a96a2cbc03d1fe3a',
    totalAmount: '25011824785',
    rootCommittedAt: '1634047507'
  },
  '0xd106fd1abb2d0fec0044ffde623d0e66f06157c26fffec45aeb2e76621c88bf5': {
    destinationChainId: '137',
    rootHash: '0xd106fd1abb2d0fec0044ffde623d0e66f06157c26fffec45aeb2e76621c88bf5',
    totalAmount: '63148873673',
    rootCommittedAt: '1634098833'
  },
  '0x8dc468266e9f4a6182167369ae9cf3890e450b91c557256f0d8d696319cdf144': {
    destinationChainId: '1',
    rootHash: '0x8dc468266e9f4a6182167369ae9cf3890e450b91c557256f0d8d696319cdf144',
    totalAmount: '107521809273',
    rootCommittedAt: '1634109724'
  },
  '0x8de66cbb7076cdbe428c20773df7d9da50562f75acc75edd6e6dcbaccfc82c8b': {
    destinationChainId: '137',
    rootHash: '0x8de66cbb7076cdbe428c20773df7d9da50562f75acc75edd6e6dcbaccfc82c8b',
    totalAmount: '47638056313',
    rootCommittedAt: '1634118913'
  },
  '0x4b861d7c9cf7c8ca82ba8401b242526a7c9701d10b5cdc43aed0d1dfecdbb1a8': {
    destinationChainId: '137',
    rootHash: '0x4b861d7c9cf7c8ca82ba8401b242526a7c9701d10b5cdc43aed0d1dfecdbb1a8',
    totalAmount: '95274050387',
    rootCommittedAt: '1634118913'
  },
  '0x18aa53b4f4aa9f72d4ada2f7bfc329cc668ecad5fe518e0f27486ccafd5db016': {
    destinationChainId: '42161',
    rootHash: '0x18aa53b4f4aa9f72d4ada2f7bfc329cc668ecad5fe518e0f27486ccafd5db016',
    totalAmount: '75478072352',
    rootCommittedAt: '1634121918'
  },
  '0xbed174bd8dbd27f211aa4d1760d1543b0bdca5fa543e8f97afc6e2e9299a49dd': {
    destinationChainId: '100',
    rootHash: '0xbed174bd8dbd27f211aa4d1760d1543b0bdca5fa543e8f97afc6e2e9299a49dd',
    totalAmount: '26734641643',
    rootCommittedAt: '1634123622'
  },
  '0xec46d56cdf632aa1e1f6a435f240def839e6843712cdb7aabf5de3cf2eedc145': {
    destinationChainId: '137',
    rootHash: '0xec46d56cdf632aa1e1f6a435f240def839e6843712cdb7aabf5de3cf2eedc145',
    totalAmount: '92521015326',
    rootCommittedAt: '1634123662'
  },
  '0x62a5154c9823155f98d0bed95d6d6a4bc5b538c927b20b7d880329ac0771f932': {
    destinationChainId: '137',
    rootHash: '0x62a5154c9823155f98d0bed95d6d6a4bc5b538c927b20b7d880329ac0771f932',
    totalAmount: '112015413492',
    rootCommittedAt: '1634127354'
  },
  '0xfd0327ca777d13234fd30ed6c211a195dba6b061ae6fd14919c38779480badc1': {
    destinationChainId: '100',
    rootHash: '0xfd0327ca777d13234fd30ed6c211a195dba6b061ae6fd14919c38779480badc1',
    totalAmount: '25276199866',
    rootCommittedAt: '1634136745'
  },
  '0xd5f8bbc2026a17aa7dfd64eca2824bf1c85158000c3a60bbbe098e2336a195db': {
    destinationChainId: '42161',
    rootHash: '0xd5f8bbc2026a17aa7dfd64eca2824bf1c85158000c3a60bbbe098e2336a195db',
    totalAmount: '62950169681',
    rootCommittedAt: '1634164469'
  },
  '0xe60c85ce41d06dd8c45aa3dabf5707e3afcb33db30189374b9b9975ae667f647': {
    destinationChainId: '1',
    rootHash: '0xe60c85ce41d06dd8c45aa3dabf5707e3afcb33db30189374b9b9975ae667f647',
    totalAmount: '116830298774',
    rootCommittedAt: '1634216971'
  },
  '0xc9708fdaf7fa56dc0ae92e580018241a5502d6abc0022ff72a57f430df35c8a1': {
    destinationChainId: '42161',
    rootHash: '0xc9708fdaf7fa56dc0ae92e580018241a5502d6abc0022ff72a57f430df35c8a1',
    totalAmount: '81660800049',
    rootCommittedAt: '1634225580'
  },
  '0xeeecb522117bc1df2d3f334ebf843aed8e0663641ede2922a1d87ea4ae92603f': {
    destinationChainId: '42161',
    rootHash: '0xeeecb522117bc1df2d3f334ebf843aed8e0663641ede2922a1d87ea4ae92603f',
    totalAmount: '25627149645083435000',
    rootCommittedAt: '1634249517'
  },
  '0x8e6676a5d6ccca08fa3f8ea211bbb713fb63a4169bbbf9d6d90a086f4d73f703': {
    destinationChainId: '1',
    rootHash: '0x8e6676a5d6ccca08fa3f8ea211bbb713fb63a4169bbbf9d6d90a086f4d73f703',
    totalAmount: '24852373855181770000',
    rootCommittedAt: '1634268099'
  },
  '0x4c0b47b62f9400dc9e94dce42c215f4dca6f89c54f89574021224fbe1acc62e1': {
    destinationChainId: '1',
    rootHash: '0x4c0b47b62f9400dc9e94dce42c215f4dca6f89c54f89574021224fbe1acc62e1',
    totalAmount: '21276395279930266000',
    rootCommittedAt: '1634271629'
  },
  '0xdffc990e7d3fe639146a71360aacf69cfa58e75da38bb7a5b4a046ec1b3726ac': {
    destinationChainId: '137',
    rootHash: '0xdffc990e7d3fe639146a71360aacf69cfa58e75da38bb7a5b4a046ec1b3726ac',
    totalAmount: '75681524951',
    rootCommittedAt: '1634276257'
  },
  '0x6853da0261b315d6641fae3792ed98e757dd1d57be7b150a9ed06e2956526d36': {
    destinationChainId: '1',
    rootHash: '0x6853da0261b315d6641fae3792ed98e757dd1d57be7b150a9ed06e2956526d36',
    totalAmount: '252660640052',
    rootCommittedAt: '1634279568'
  },
  '0x015c7a88ef42421e054d06a8130bc37ff4144490835e1632f0b78c90d3c988af': {
    destinationChainId: '137',
    rootHash: '0x015c7a88ef42421e054d06a8130bc37ff4144490835e1632f0b78c90d3c988af',
    totalAmount: '75254058983',
    rootCommittedAt: '1634281024'
  },
  '0x00d65003b77e7fa409911a71c0bdf63ae5302ccfa993dd9858bfa5bf9bd203b5': {
    destinationChainId: '137',
    rootHash: '0x00d65003b77e7fa409911a71c0bdf63ae5302ccfa993dd9858bfa5bf9bd203b5',
    totalAmount: '3032616157',
    rootCommittedAt: '1634339188'
  },
  '0x376e20cf1c2166efdb9594ba3b3346fd620d4477b3575ee35e44dbdc9719f67d': {
    destinationChainId: '42161',
    rootHash: '0x376e20cf1c2166efdb9594ba3b3346fd620d4477b3575ee35e44dbdc9719f67d',
    totalAmount: '47408961723264600000',
    rootCommittedAt: '1634353273'
  },
  '0xab9f6b65b91b226635dcd1b75211cb6791707dd0bd5b21995d4bd7278ff894de': {
    destinationChainId: '1',
    rootHash: '0xab9f6b65b91b226635dcd1b75211cb6791707dd0bd5b21995d4bd7278ff894de',
    totalAmount: '21196977338680488000',
    rootCommittedAt: '1634357568'
  },
  '0x0b13f9d42ea1f8384b70dae9da284496021321b66033c610188cda0dbd322ae2': {
    destinationChainId: '100',
    rootHash: '0x0b13f9d42ea1f8384b70dae9da284496021321b66033c610188cda0dbd322ae2',
    totalAmount: '26803395168',
    rootCommittedAt: '1634371587'
  },
  '0xc0383974f4b28d3751a34332a890a4a99293fb7b4e9d27dd26081cce514fd0bb': {
    destinationChainId: '42161',
    rootHash: '0xc0383974f4b28d3751a34332a890a4a99293fb7b4e9d27dd26081cce514fd0bb',
    totalAmount: '21531095822475403000',
    rootCommittedAt: '1634379656'
  },
  '0x273801a94e2828c20163c6e9bcb3bb9be99d54f16fbec6d949591a73a015c86b': {
    destinationChainId: '137',
    rootHash: '0x273801a94e2828c20163c6e9bcb3bb9be99d54f16fbec6d949591a73a015c86b',
    totalAmount: '75134380098',
    rootCommittedAt: '1634408335'
  },
  '0x9bedc0fb56602281ec49550ae6e7450366319fe96cd7b564c3a7013cc450ffb7': {
    destinationChainId: '1',
    rootHash: '0x9bedc0fb56602281ec49550ae6e7450366319fe96cd7b564c3a7013cc450ffb7',
    totalAmount: '21882581562707177000',
    rootCommittedAt: '1634423145'
  },
  '0xc63ba26ad650dc010fc79deb0be6933d5860796fd605068e5c3826052330fa56': {
    destinationChainId: '137',
    rootHash: '0xc63ba26ad650dc010fc79deb0be6933d5860796fd605068e5c3826052330fa56',
    totalAmount: '24721272972416606000',
    rootCommittedAt: '1634423850'
  },
  '0x88b342f8cb23eb6fa73e4617fff7f3fdfa2b5569d4bad0e3c3555ac60faeb261': {
    destinationChainId: '42161',
    rootHash: '0x88b342f8cb23eb6fa73e4617fff7f3fdfa2b5569d4bad0e3c3555ac60faeb261',
    totalAmount: '23228943969502724000',
    rootCommittedAt: '1634432995'
  },
  '0x5415c23761802bee41ecd6fc3464188f2bad25d61f3ad45005a5a7e692515861': {
    destinationChainId: '42161',
    rootHash: '0x5415c23761802bee41ecd6fc3464188f2bad25d61f3ad45005a5a7e692515861',
    totalAmount: '72190174887',
    rootCommittedAt: '1634438556'
  },
  '0x863e996e44156b00795794681e15502d3a1eeeed7e71c73601e34aa5910b67f8': {
    destinationChainId: '100',
    rootHash: '0x863e996e44156b00795794681e15502d3a1eeeed7e71c73601e34aa5910b67f8',
    totalAmount: '14046031088',
    rootCommittedAt: '1634446994'
  },
  '0xfa3012c2e97d09ced5d3717e4c6a2e0f92673878d3ad83555fa0bfd439163824': {
    destinationChainId: '1',
    rootHash: '0xfa3012c2e97d09ced5d3717e4c6a2e0f92673878d3ad83555fa0bfd439163824',
    totalAmount: '119640341239',
    rootCommittedAt: '1634452843'
  },
  '0xb64364b314e04c453670ef3ef98b0a1039ff5e9ef45a404083aafb7a97076d0f': {
    destinationChainId: '1',
    rootHash: '0xb64364b314e04c453670ef3ef98b0a1039ff5e9ef45a404083aafb7a97076d0f',
    totalAmount: '21152580990110490000',
    rootCommittedAt: '1634452886'
  },
  '0x848afa90a4e1fdc2aff4828a8972390ed66d9c7180f431f14b3a7b1e808da96b': {
    destinationChainId: '1',
    rootHash: '0x848afa90a4e1fdc2aff4828a8972390ed66d9c7180f431f14b3a7b1e808da96b',
    totalAmount: '101233545680',
    rootCommittedAt: '1634460556'
  },
  '0x4252d26e41beb7d8bc4fc075cb80fc128c2380e5b35dccf7273e653597790f6d': {
    destinationChainId: '1',
    rootHash: '0x4252d26e41beb7d8bc4fc075cb80fc128c2380e5b35dccf7273e653597790f6d',
    totalAmount: '21102008182176854000',
    rootCommittedAt: '1634464196'
  },
  '0xe12f3cf3afda07c9240a0024943deccce2122502e18230e88ddfd176ab9d3183': {
    destinationChainId: '42161',
    rootHash: '0xe12f3cf3afda07c9240a0024943deccce2122502e18230e88ddfd176ab9d3183',
    totalAmount: '76829508863',
    rootCommittedAt: '1634473433'
  },
  '0xa6310f86664809090e69b89dcf2c267408185b002b03eb67e5a267f5ce4e0461': {
    destinationChainId: '1',
    rootHash: '0xa6310f86664809090e69b89dcf2c267408185b002b03eb67e5a267f5ce4e0461',
    totalAmount: '110919578569',
    rootCommittedAt: '1634477475'
  },
  '0x9f5d3821150f0b39fa23551e7782fc08b3b735a80eb786f8c7c12a7e426c9246': {
    destinationChainId: '137',
    rootHash: '0x9f5d3821150f0b39fa23551e7782fc08b3b735a80eb786f8c7c12a7e426c9246',
    totalAmount: '75195765671',
    rootCommittedAt: '1634482704'
  },
  '0x37be937dd238441ac3fdbfdc114016d7554229bbc54a0b1907af4d3a8dd31672': {
    destinationChainId: '1',
    rootHash: '0x37be937dd238441ac3fdbfdc114016d7554229bbc54a0b1907af4d3a8dd31672',
    totalAmount: '21145195644382147000',
    rootCommittedAt: '1634488774'
  },
  '0xd8ac655dd48ba5a041f9c4aa505a4a9e386af92ff35a62a3e5e038cc1ff64515': {
    destinationChainId: '42161',
    rootHash: '0xd8ac655dd48ba5a041f9c4aa505a4a9e386af92ff35a62a3e5e038cc1ff64515',
    totalAmount: '21023404691186455000',
    rootCommittedAt: '1634497493'
  },
  '0x1edf64663c2c65283ef0b1ab02315181d1ffa49e6f2c1dbb387b6c93c05aecbf': {
    destinationChainId: '42161',
    rootHash: '0x1edf64663c2c65283ef0b1ab02315181d1ffa49e6f2c1dbb387b6c93c05aecbf',
    totalAmount: '21927942909945913000',
    rootCommittedAt: '1634512302'
  },
  '0x6b3ac02272dce5f766410193d9d8b7b48e5f0fbacd6ea2a0524384e8d05b3174': {
    destinationChainId: '42161',
    rootHash: '0x6b3ac02272dce5f766410193d9d8b7b48e5f0fbacd6ea2a0524384e8d05b3174',
    totalAmount: '31128341604115448000',
    rootCommittedAt: '1634518172'
  },
  '0xda48d791ef2c94c6a7d942fe67e7f21eac5c02e984cceef554bf278c85550b19': {
    destinationChainId: '42161',
    rootHash: '0xda48d791ef2c94c6a7d942fe67e7f21eac5c02e984cceef554bf278c85550b19',
    totalAmount: '30502278687563444000',
    rootCommittedAt: '1634521632'
  },
  '0x9756b37d598469212fbc5c60b8eabc427c35d9d2a57a4292c5ff24e73ef28c23': {
    destinationChainId: '1',
    rootHash: '0x9756b37d598469212fbc5c60b8eabc427c35d9d2a57a4292c5ff24e73ef28c23',
    totalAmount: '25578700466642035000',
    rootCommittedAt: '1634548073'
  },
  '0xe853aa0209a16e962f3912d674249dc870baf42e872fd6c534b7c1ec3c4096be': {
    destinationChainId: '137',
    rootHash: '0xe853aa0209a16e962f3912d674249dc870baf42e872fd6c534b7c1ec3c4096be',
    totalAmount: '21514799737583215000',
    rootCommittedAt: '1634549551'
  },
  '0x759a989f5ce59cee586df4733df4bac57def7167c2e431867974a23a74a90caf': {
    destinationChainId: '137',
    rootHash: '0x759a989f5ce59cee586df4733df4bac57def7167c2e431867974a23a74a90caf',
    totalAmount: '83242202050',
    rootCommittedAt: '1634550549'
  },
  '0x30ad1132ca5ef6b3aa6e4dc38c26ddef1b1275f4749111e58995a8dad3d6247b': {
    destinationChainId: '137',
    rootHash: '0x30ad1132ca5ef6b3aa6e4dc38c26ddef1b1275f4749111e58995a8dad3d6247b',
    totalAmount: '104281893997',
    rootCommittedAt: '1634557479'
  },
  '0x0355079bbdffffe76d8ec389a16cf7cbc8f191ce70f35c0d8b69deb05f261143': {
    destinationChainId: '1',
    rootHash: '0x0355079bbdffffe76d8ec389a16cf7cbc8f191ce70f35c0d8b69deb05f261143',
    totalAmount: '129160158213',
    rootCommittedAt: '1634558023'
  },
  '0x144cd0cb05696aa27e5222e73d02d8adc5a34a9b0820d4c3f5ab427c39ce7026': {
    destinationChainId: '137',
    rootHash: '0x144cd0cb05696aa27e5222e73d02d8adc5a34a9b0820d4c3f5ab427c39ce7026',
    totalAmount: '105703990424',
    rootCommittedAt: '1634561139'
  },
  '0x1dc2cd40c864462db0f7950a83b5407dd513616bcd4547aa321ac8e309076dac': {
    destinationChainId: '42161',
    rootHash: '0x1dc2cd40c864462db0f7950a83b5407dd513616bcd4547aa321ac8e309076dac',
    totalAmount: '77920674504',
    rootCommittedAt: '1634561563'
  },
  '0x14bcffab8cb098f22845d04f84d69588f3a44ff6a5bb99a3f6a9aeca2058151d': {
    destinationChainId: '137',
    rootHash: '0x14bcffab8cb098f22845d04f84d69588f3a44ff6a5bb99a3f6a9aeca2058151d',
    totalAmount: '75262801794',
    rootCommittedAt: '1634563382'
  },
  '0x5dd593b82914698a16255aa82ac3458c87ea240d100deab07282f8099c662318': {
    destinationChainId: '42161',
    rootHash: '0x5dd593b82914698a16255aa82ac3458c87ea240d100deab07282f8099c662318',
    totalAmount: '27660257605944967000',
    rootCommittedAt: '1634566265'
  },
  '0x21527af507efbbb0ae99642b9c422d7913a9e803ea34f7c5715653b32cd10087': {
    destinationChainId: '137',
    rootHash: '0x21527af507efbbb0ae99642b9c422d7913a9e803ea34f7c5715653b32cd10087',
    totalAmount: '83760031536',
    rootCommittedAt: '1634580822'
  },
  '0xe8a031b47cf5843a5841eb5e0049ea12a66e1c00b12436ed1673ad236443e1df': {
    destinationChainId: '1',
    rootHash: '0xe8a031b47cf5843a5841eb5e0049ea12a66e1c00b12436ed1673ad236443e1df',
    totalAmount: '58151848978661710000',
    rootCommittedAt: '1634608747'
  },
  '0x0d76442ffe4b0b0b3d3d44ee9198768c782257603c69934d593b1c091d70b8fc': {
    destinationChainId: '137',
    rootHash: '0x0d76442ffe4b0b0b3d3d44ee9198768c782257603c69934d593b1c091d70b8fc',
    totalAmount: '80354406162',
    rootCommittedAt: '1634631448'
  },
  '0x1a1bc5ff730f11089d6ab1690fc89d2015b7328d9786522fae9eea23d49358eb': {
    destinationChainId: '137',
    rootHash: '0x1a1bc5ff730f11089d6ab1690fc89d2015b7328d9786522fae9eea23d49358eb',
    totalAmount: '75690260675',
    rootCommittedAt: '1634639543'
  },
  '0xa60512e7ab7f6b25a34269bb5d1ac0f4496f29fc781136d958f5b1343a627701': {
    destinationChainId: '137',
    rootHash: '0xa60512e7ab7f6b25a34269bb5d1ac0f4496f29fc781136d958f5b1343a627701',
    totalAmount: '84458541265',
    rootCommittedAt: '1634645685'
  },
  '0x2778936e261b13af490dfa51d23dadc25358dd103c8f8f2d694ae639fc405981': {
    destinationChainId: '137',
    rootHash: '0x2778936e261b13af490dfa51d23dadc25358dd103c8f8f2d694ae639fc405981',
    totalAmount: '127641614746',
    rootCommittedAt: '1634649288'
  },
  '0x0cc6fef30fb5771c32afcc6f621391d572f54193cdc6c8cb7e90941853e3b90f': {
    destinationChainId: '137',
    rootHash: '0x0cc6fef30fb5771c32afcc6f621391d572f54193cdc6c8cb7e90941853e3b90f',
    totalAmount: '81543714707',
    rootCommittedAt: '1634653166'
  },
  '0xaff1925bc2eecbe89ec4dc77dba4487c6db0af2cb7a0c2edf5a6755927fe4207': {
    destinationChainId: '137',
    rootHash: '0xaff1925bc2eecbe89ec4dc77dba4487c6db0af2cb7a0c2edf5a6755927fe4207',
    totalAmount: '121570782162',
    rootCommittedAt: '1634656893'
  },
  '0x5748578bb0d625a728c3865d174f8aa70acc120da079fc7bfad4a7be30ae1da5': {
    destinationChainId: '42161',
    rootHash: '0x5748578bb0d625a728c3865d174f8aa70acc120da079fc7bfad4a7be30ae1da5',
    totalAmount: '40199177368714895000',
    rootCommittedAt: '1634661775'
  },
  '0xa23cc811c07af2151cdd5fd83ac50d49c27abef7d581d2e4475ebf0738cc8264': {
    destinationChainId: '1',
    rootHash: '0xa23cc811c07af2151cdd5fd83ac50d49c27abef7d581d2e4475ebf0738cc8264',
    totalAmount: '35311804602710900000',
    rootCommittedAt: '1634666449'
  },
  '0x268e8ec5e1e1583c8cbf334ba672bb74f631b397976bfd0c2e7cd717b04f8748': {
    destinationChainId: '137',
    rootHash: '0x268e8ec5e1e1583c8cbf334ba672bb74f631b397976bfd0c2e7cd717b04f8748',
    totalAmount: '35169238234442105000',
    rootCommittedAt: '1634697602'
  },
  '0xf489586f87df18340889af8ee24fb957faf903d89e7f0c03d6b2434510d5417c': {
    destinationChainId: '137',
    rootHash: '0xf489586f87df18340889af8ee24fb957faf903d89e7f0c03d6b2434510d5417c',
    totalAmount: '86538713991',
    rootCommittedAt: '1634708528'
  },
  '0x97b7f4c5bc2f7aabfb101f0c2895483b954d97abfe637f847494d3d7f8c4f895': {
    destinationChainId: '137',
    rootHash: '0x97b7f4c5bc2f7aabfb101f0c2895483b954d97abfe637f847494d3d7f8c4f895',
    totalAmount: '124603212711',
    rootCommittedAt: '1634712045'
  },
  '0x12c35a0974c6c3f49dffddb2ddac52632b3be0c55805fdd53459c70880ae22ba': {
    destinationChainId: '137',
    rootHash: '0x12c35a0974c6c3f49dffddb2ddac52632b3be0c55805fdd53459c70880ae22ba',
    totalAmount: '75479384530',
    rootCommittedAt: '1634720396'
  },
  '0x7ff4562cb4b215a940dc76b612e3933601bfaa9d0fa08bcca53310b2ee611600': {
    destinationChainId: '1',
    rootHash: '0x7ff4562cb4b215a940dc76b612e3933601bfaa9d0fa08bcca53310b2ee611600',
    totalAmount: '177214783115',
    rootCommittedAt: '1634722016'
  },
  '0x6edc436e789cce11569dc307978d5ee4bdc7bd09a5cc2e7c7b439d3188e8bf6e': {
    destinationChainId: '1',
    rootHash: '0x6edc436e789cce11569dc307978d5ee4bdc7bd09a5cc2e7c7b439d3188e8bf6e',
    totalAmount: '64385399759304990000',
    rootCommittedAt: '1634731068'
  },
  '0xe3ff98e42b888750b2f2040e27d48a3af6e20c6f8ae4161bb4cdce9cd944efb5': {
    destinationChainId: '1',
    rootHash: '0xe3ff98e42b888750b2f2040e27d48a3af6e20c6f8ae4161bb4cdce9cd944efb5',
    totalAmount: '42231610452818756000',
    rootCommittedAt: '1634740097'
  },
  '0x3bac596a75f23c365b0a675888888341f469804fda20416c78877f7fa8ea5bca': {
    destinationChainId: '137',
    rootHash: '0x3bac596a75f23c365b0a675888888341f469804fda20416c78877f7fa8ea5bca',
    totalAmount: '76794792059',
    rootCommittedAt: '1634747868'
  },
  '0x878e6690287c8b1665a83ebbd8c36a03aee94ecf67d545dc2bb9878b7ba81b47': {
    destinationChainId: '42161',
    rootHash: '0x878e6690287c8b1665a83ebbd8c36a03aee94ecf67d545dc2bb9878b7ba81b47',
    totalAmount: '75321674387',
    rootCommittedAt: '1634750732'
  },
  '0xcb54ee152592bfb642c14f8480a193760b9d95ac8af7205a8c0c7acfb0a0b4d3': {
    destinationChainId: '137',
    rootHash: '0xcb54ee152592bfb642c14f8480a193760b9d95ac8af7205a8c0c7acfb0a0b4d3',
    totalAmount: '131670184177',
    rootCommittedAt: '1634751532'
  },
  '0x611e54b53c065f8d3fee191a28f9461c1deac57fbb396870086224475e5da1ae': {
    destinationChainId: '42161',
    rootHash: '0x611e54b53c065f8d3fee191a28f9461c1deac57fbb396870086224475e5da1ae',
    totalAmount: '41289550105411760000',
    rootCommittedAt: '1634766824'
  },
  '0x8bb3768595d2e7686bbbf051ae73fa013d910c110a8671f92d18d2892bd17a73': {
    destinationChainId: '137',
    rootHash: '0x8bb3768595d2e7686bbbf051ae73fa013d910c110a8671f92d18d2892bd17a73',
    totalAmount: '26001480110521870000',
    rootCommittedAt: '1634805712'
  },
  '0xc8248526bf8f4f26f6401c74892005c10e83d721ff24ab361049a8562a869489': {
    destinationChainId: '1',
    rootHash: '0xc8248526bf8f4f26f6401c74892005c10e83d721ff24ab361049a8562a869489',
    totalAmount: '38756209747018570000',
    rootCommittedAt: '1634806829'
  },
  '0x37c494372a38c177103e7ea87ea4f537ac79e1eb53390ef2a32d31a62d87c80b': {
    destinationChainId: '137',
    rootHash: '0x37c494372a38c177103e7ea87ea4f537ac79e1eb53390ef2a32d31a62d87c80b',
    totalAmount: '21906392923322970000',
    rootCommittedAt: '1634861580'
  },
  '0xb39e7b652850dbe19446c5081f5ab4b7a9105c2b28a4888c935d3e3a9f3526e1': {
    destinationChainId: '1',
    rootHash: '0xb39e7b652850dbe19446c5081f5ab4b7a9105c2b28a4888c935d3e3a9f3526e1',
    totalAmount: '105502637856',
    rootCommittedAt: '1634862218'
  },
  '0xf6b3a07b718dea1b71c96fefaee54ba876ed92a2f3a0d2a85d4cefa4a2fd1dd5': {
    destinationChainId: '1',
    rootHash: '0xf6b3a07b718dea1b71c96fefaee54ba876ed92a2f3a0d2a85d4cefa4a2fd1dd5',
    totalAmount: '102126333917',
    rootCommittedAt: '1634869121'
  },
  '0x8bb46b05382afc8e818eaf9d6d902500c5c526908b848a6b435af993416460ee': {
    destinationChainId: '1',
    rootHash: '0x8bb46b05382afc8e818eaf9d6d902500c5c526908b848a6b435af993416460ee',
    totalAmount: '51667053366400090000',
    rootCommittedAt: '1634881721'
  },
  '0x115aee9493dec58f40a41fc6dda4e0cfed5e71c693bbddfbceefdd2807495453': {
    destinationChainId: '1',
    rootHash: '0x115aee9493dec58f40a41fc6dda4e0cfed5e71c693bbddfbceefdd2807495453',
    totalAmount: '35950271226600440000',
    rootCommittedAt: '1634889712'
  },
  '0x50b6c2eb605e292b3bbc3867a7ad346e9e6cc6f0bfacff43ffe94ca64753f894': {
    destinationChainId: '42161',
    rootHash: '0x50b6c2eb605e292b3bbc3867a7ad346e9e6cc6f0bfacff43ffe94ca64753f894',
    totalAmount: '35170511720611500000',
    rootCommittedAt: '1634889925'
  },
  '0xcca8c213712a5652a866cbebecdc0b659d7869c5b29d5b97d46fb5afdeebace0': {
    destinationChainId: '137',
    rootHash: '0xcca8c213712a5652a866cbebecdc0b659d7869c5b29d5b97d46fb5afdeebace0',
    totalAmount: '87490616971',
    rootCommittedAt: '1634916421'
  },
  '0xce0d4ca1c09c8013923c6029b030a524808c502b8b3de8b67b8a335e03c1eba2': {
    destinationChainId: '1',
    rootHash: '0xce0d4ca1c09c8013923c6029b030a524808c502b8b3de8b67b8a335e03c1eba2',
    totalAmount: '35839257234873010000',
    rootCommittedAt: '1634929964'
  },
  '0xd214d0f3407646cd47a3213e71ad55fc4a340bd74e25bbb902e3704b14e66f95': {
    destinationChainId: '1',
    rootHash: '0xd214d0f3407646cd47a3213e71ad55fc4a340bd74e25bbb902e3704b14e66f95',
    totalAmount: '37678709988202150000',
    rootCommittedAt: '1634956295'
  },
  '0x74dff6f50b6b34709166d29bd465e97ce05b0721eed0c327d806709418c3de1a': {
    destinationChainId: '137',
    rootHash: '0x74dff6f50b6b34709166d29bd465e97ce05b0721eed0c327d806709418c3de1a',
    totalAmount: '16285779673705775000',
    rootCommittedAt: '1634957956'
  },
  '0x3d48f77852e44cb2233c7efbf1a1a1b2135487c521cff94efdf5a3940a69ef97': {
    destinationChainId: '137',
    rootHash: '0x3d48f77852e44cb2233c7efbf1a1a1b2135487c521cff94efdf5a3940a69ef97',
    totalAmount: '10176056262456424000',
    rootCommittedAt: '1634987479'
  },
  '0x54c47cb6f9f745b1cc4d46dec587c5e440779e8e5be20218aa72b8837f68a69c': {
    destinationChainId: '1',
    rootHash: '0x54c47cb6f9f745b1cc4d46dec587c5e440779e8e5be20218aa72b8837f68a69c',
    totalAmount: '36517980016787910000',
    rootCommittedAt: '1634998361'
  },
  '0x7daf813b753ee5d6a26fce7265332b6ae3cba67f40b0896ff4c6f646f1a27a29': {
    destinationChainId: '42161',
    rootHash: '0x7daf813b753ee5d6a26fce7265332b6ae3cba67f40b0896ff4c6f646f1a27a29',
    totalAmount: '36192466666405536000',
    rootCommittedAt: '1635003634'
  },
  '0xf1dcef3d2168da18f488f6af1cd203eaf1f2e8b5bebd5297a1f8624eddef06a0': {
    destinationChainId: '1',
    rootHash: '0xf1dcef3d2168da18f488f6af1cd203eaf1f2e8b5bebd5297a1f8624eddef06a0',
    totalAmount: '100727322550',
    rootCommittedAt: '1635036529'
  },
  '0xf903e11d697359281521efb558383475c5c759020c0d93ae7edec4eee2a9c7c5': {
    destinationChainId: '137',
    rootHash: '0xf903e11d697359281521efb558383475c5c759020c0d93ae7edec4eee2a9c7c5',
    totalAmount: '17631139287621444000',
    rootCommittedAt: '1635047768'
  },
  '0x6fa3e9551531c7302aeac41e96518d6c096f5f64b815e1e3a539803549e09a47': {
    destinationChainId: '1',
    rootHash: '0x6fa3e9551531c7302aeac41e96518d6c096f5f64b815e1e3a539803549e09a47',
    totalAmount: '38189105547732940000',
    rootCommittedAt: '1635067144'
  },
  '0xef042844b7ec21704b07af4631a082f667247a001bed9853883528fed9048c95': {
    destinationChainId: '1',
    rootHash: '0xef042844b7ec21704b07af4631a082f667247a001bed9853883528fed9048c95',
    totalAmount: '107573341539',
    rootCommittedAt: '1635073428'
  },
  '0x2ae2e95afb22a3100cd2024e2fbaece0d1cb52dea5f2309933c4ae07a0acc438': {
    destinationChainId: '137',
    rootHash: '0x2ae2e95afb22a3100cd2024e2fbaece0d1cb52dea5f2309933c4ae07a0acc438',
    totalAmount: '81394312767',
    rootCommittedAt: '1635079767'
  },
  '0xf9e0a38ed703c5ddebe6efbe613a7d7ea71d2d3155dd5b327afd0dd4e05201f5': {
    destinationChainId: '137',
    rootHash: '0xf9e0a38ed703c5ddebe6efbe613a7d7ea71d2d3155dd5b327afd0dd4e05201f5',
    totalAmount: '161942651130',
    rootCommittedAt: '1635083146'
  },
  '0xbed42030ce260dcaef00538263a70885c2ec91691025498793f83a9fc738ee10': {
    destinationChainId: '137',
    rootHash: '0xbed42030ce260dcaef00538263a70885c2ec91691025498793f83a9fc738ee10',
    totalAmount: '20529670741614293000',
    rootCommittedAt: '1635094829'
  },
  '0x32e5ce02df624eb221f389e9303d31b665b2625f42d63c0d4991fe7f970e6eb7': {
    destinationChainId: '1',
    rootHash: '0x32e5ce02df624eb221f389e9303d31b665b2625f42d63c0d4991fe7f970e6eb7',
    totalAmount: '35039642189106300000',
    rootCommittedAt: '1635123356'
  },
  '0xba94f180114f0a69a24a5639ba6571bdedfe043be2dec9c8f4792a13161b23c3': {
    destinationChainId: '137',
    rootHash: '0xba94f180114f0a69a24a5639ba6571bdedfe043be2dec9c8f4792a13161b23c3',
    totalAmount: '76084850059',
    rootCommittedAt: '1635152976'
  },
  '0xbcbe1ddb16c7dc06c608a831aed1f1afa360705bc8708f6ea0fff3fded276dfc': {
    destinationChainId: '42161',
    rootHash: '0xbcbe1ddb16c7dc06c608a831aed1f1afa360705bc8708f6ea0fff3fded276dfc',
    totalAmount: '34749276611119276000',
    rootCommittedAt: '1635155538'
  },
  '0x3b6242ae6bda4bc948b9736e913df151c9d171891485ad60baa18333e3f07e0f': {
    destinationChainId: '42161',
    rootHash: '0x3b6242ae6bda4bc948b9736e913df151c9d171891485ad60baa18333e3f07e0f',
    totalAmount: '54545989636',
    rootCommittedAt: '1635191808'
  },
  '0xfb03fe0b69e690bf318e7745985867f7be0522ccde338629c592b73b045e576c': {
    destinationChainId: '1',
    rootHash: '0xfb03fe0b69e690bf318e7745985867f7be0522ccde338629c592b73b045e576c',
    totalAmount: '41903789872403145000',
    rootCommittedAt: '1635220154'
  },
  '0x77bab4dd9a27c9b0475cce52833c87deb1a213806190a80aad10d099663ab482': {
    destinationChainId: '42161',
    rootHash: '0x77bab4dd9a27c9b0475cce52833c87deb1a213806190a80aad10d099663ab482',
    totalAmount: '37069807741661630000',
    rootCommittedAt: '1635223205'
  },
  '0x6733f45adcd795bfb2728f0e858bced163ed570ccbe4c2603fa8d44ef20a1c02': {
    destinationChainId: '137',
    rootHash: '0x6733f45adcd795bfb2728f0e858bced163ed570ccbe4c2603fa8d44ef20a1c02',
    totalAmount: '24569281527219356000',
    rootCommittedAt: '1635233523'
  },
  '0x0fcdc16491c7b490fd177720b8d387284da9f98a9e93d6f0c882b818d2f33e12': {
    destinationChainId: '1',
    rootHash: '0x0fcdc16491c7b490fd177720b8d387284da9f98a9e93d6f0c882b818d2f33e12',
    totalAmount: '46972111903646480000',
    rootCommittedAt: '1635235408'
  },
  '0xf24edc00ea72a0a810bccbda7efb83b153a1cc9f73819346fbbf41875be19fe3': {
    destinationChainId: '42161',
    rootHash: '0xf24edc00ea72a0a810bccbda7efb83b153a1cc9f73819346fbbf41875be19fe3',
    totalAmount: '75013935303',
    rootCommittedAt: '1635240059'
  },
  '0xda40a986e6b0f115e40de970c6f0b0fdaf7d8493f713d3495dc9b53d9b723c1e': {
    destinationChainId: '137',
    rootHash: '0xda40a986e6b0f115e40de970c6f0b0fdaf7d8493f713d3495dc9b53d9b723c1e',
    totalAmount: '82527990755',
    rootCommittedAt: '1635255252'
  },
  '0xc9ffb87ca49647793772ddfc5b21b98cc702beb7e5f514919bbc3b3386cc29f5': {
    destinationChainId: '1',
    rootHash: '0xc9ffb87ca49647793772ddfc5b21b98cc702beb7e5f514919bbc3b3386cc29f5',
    totalAmount: '38768419160560360000',
    rootCommittedAt: '1635261678'
  },
  '0x62801230e701ef9a3e1113dfd44fc64ecdab34999001c399373b3cd50545c2dd': {
    destinationChainId: '137',
    rootHash: '0x62801230e701ef9a3e1113dfd44fc64ecdab34999001c399373b3cd50545c2dd',
    totalAmount: '90530768700',
    rootCommittedAt: '1635287708'
  },
  '0x281d9fdb6edc35f1196d502f6df9b0c127c2df8eea2dee961fa21af538fe8090': {
    destinationChainId: '100',
    rootHash: '0x281d9fdb6edc35f1196d502f6df9b0c127c2df8eea2dee961fa21af538fe8090',
    totalAmount: '13603921451764810000',
    rootCommittedAt: '1635307877'
  },
  '0x0b23a433b6812637ccaeb761012a33c9423f5e266ab4c881a307799b9bc1b102': {
    destinationChainId: '1',
    rootHash: '0x0b23a433b6812637ccaeb761012a33c9423f5e266ab4c881a307799b9bc1b102',
    totalAmount: '35185500881766580000',
    rootCommittedAt: '1635313575'
  },
  '0x6aa876c2fd12cd85c5ed237ab900639229d7fd227f7c689c2c08b9a6bcd115e9': {
    destinationChainId: '1',
    rootHash: '0x6aa876c2fd12cd85c5ed237ab900639229d7fd227f7c689c2c08b9a6bcd115e9',
    totalAmount: '103217361614',
    rootCommittedAt: '1635318060'
  },
  '0x77174acd18228789508a3bc32dd00cf83534e2a86336506f4820dc82f98482e0': {
    destinationChainId: '1',
    rootHash: '0x77174acd18228789508a3bc32dd00cf83534e2a86336506f4820dc82f98482e0',
    totalAmount: '115521788402',
    rootCommittedAt: '1635321941'
  },
  '0x84af8716f02f12b85893175717a0b5e6acb20ff895e5ce37d245672f46ee77b6': {
    destinationChainId: '1',
    rootHash: '0x84af8716f02f12b85893175717a0b5e6acb20ff895e5ce37d245672f46ee77b6',
    totalAmount: '35594805170041328000',
    rootCommittedAt: '1635327621'
  },
  '0xb5219bed7eaa6e81cf2d6fefcd03bd826fcf3b0cbcf5df7f89ad582085d7335f': {
    destinationChainId: '42161',
    rootHash: '0xb5219bed7eaa6e81cf2d6fefcd03bd826fcf3b0cbcf5df7f89ad582085d7335f',
    totalAmount: '58212968949232650000',
    rootCommittedAt: '1635349564'
  },
  '0xed29885e9b69ba4b5f7fc1c7710562cda8b55aa769959d613fd4d12dd3e2a8f2': {
    destinationChainId: '1',
    rootHash: '0xed29885e9b69ba4b5f7fc1c7710562cda8b55aa769959d613fd4d12dd3e2a8f2',
    totalAmount: '90267372189751570000',
    rootCommittedAt: '1635349866'
  },
  '0x1207e1f1cc12b87b318cc045fccf97fdb613f39487982dd997f239c3b461dfff': {
    destinationChainId: '42161',
    rootHash: '0x1207e1f1cc12b87b318cc045fccf97fdb613f39487982dd997f239c3b461dfff',
    totalAmount: '56183876310257070000',
    rootCommittedAt: '1635373462'
  },
  '0xa7d0d42dfd2b87cf7a5096f0eeefcfe9375b50ac8adf4e31b4608a245229cefd': {
    destinationChainId: '42161',
    rootHash: '0xa7d0d42dfd2b87cf7a5096f0eeefcfe9375b50ac8adf4e31b4608a245229cefd',
    totalAmount: '176225272843',
    rootCommittedAt: '1635378037'
  },
  '0x58b432c8fbd43848853678bcf88c2cbc8c17300a1b1fb1cfe575377ed5cc6aed': {
    destinationChainId: '1',
    rootHash: '0x58b432c8fbd43848853678bcf88c2cbc8c17300a1b1fb1cfe575377ed5cc6aed',
    totalAmount: '206625054278622254706568',
    rootCommittedAt: '1632723451'
  },
  '0xd0b8c249a9d03b717541bcb9b6c48db775e71c78fd15ed1fbdcf4f5506dbc0ac': {
    destinationChainId: '1',
    rootHash: '0xd0b8c249a9d03b717541bcb9b6c48db775e71c78fd15ed1fbdcf4f5506dbc0ac',
    totalAmount: '201109080463954194027630',
    rootCommittedAt: '1633147970'
  },
  '0x6daba9deba5f67a92cd60177a14c2c6fc8266d51f80e52ae20d27ce9f8978498': {
    destinationChainId: '137',
    rootHash: '0x6daba9deba5f67a92cd60177a14c2c6fc8266d51f80e52ae20d27ce9f8978498',
    totalAmount: '56357303408808746440223',
    rootCommittedAt: '1633220655'
  },
  '0xf61b7b17ef7b9fb6a4c4a68c6e937e7128eeb915e53525ae4892a70a9358027a': {
    destinationChainId: '1',
    rootHash: '0xf61b7b17ef7b9fb6a4c4a68c6e937e7128eeb915e53525ae4892a70a9358027a',
    totalAmount: '101393169738858161630404',
    rootCommittedAt: '1633933781'
  },
  '0xa0268cdb796ec56ec9082dc03c6cc5b9a57f9d1deb50fbee7d9a18c84adf71df': {
    destinationChainId: '42161',
    rootHash: '0xa0268cdb796ec56ec9082dc03c6cc5b9a57f9d1deb50fbee7d9a18c84adf71df',
    totalAmount: '75543757972520494354731',
    rootCommittedAt: '1634010497'
  },
  '0xde30487be8f7bc11d01b163c84518f81d4dbae14ef95684547ed617d6094acab': {
    destinationChainId: '42161',
    rootHash: '0xde30487be8f7bc11d01b163c84518f81d4dbae14ef95684547ed617d6094acab',
    totalAmount: '75756066333395462374226',
    rootCommittedAt: '1633968356'
  },
  '0x4347c6b033bfbe0630f0c7f0c25b1134ee3ff50022ea81b8b58193ac1ce1443b': {
    destinationChainId: '1',
    rootHash: '0x4347c6b033bfbe0630f0c7f0c25b1134ee3ff50022ea81b8b58193ac1ce1443b',
    totalAmount: '112511566754709227988966',
    rootCommittedAt: '1634024520'
  },
  '0x36be2eca66a3d0d0540a68ab5e4ce0a9678f8d6eef3ce0bdee9bf930b69ecfb2': {
    destinationChainId: '137',
    rootHash: '0x36be2eca66a3d0d0540a68ab5e4ce0a9678f8d6eef3ce0bdee9bf930b69ecfb2',
    totalAmount: '49435357780459830258997',
    rootCommittedAt: '1634019959'
  },
  '0x84ca6921d28e208688acf714c2ce5b8adfe40233d0084f7eaca85bfbc105648e': {
    destinationChainId: '42161',
    rootHash: '0x84ca6921d28e208688acf714c2ce5b8adfe40233d0084f7eaca85bfbc105648e',
    totalAmount: '78031051615313933713341',
    rootCommittedAt: '1634216971'
  },
  '0x6e9b7c8d35e452833d7f3b237305a10f0750f7649f3506b7e0f01041cb7d4e2d': {
    destinationChainId: '1',
    rootHash: '0x6e9b7c8d35e452833d7f3b237305a10f0750f7649f3506b7e0f01041cb7d4e2d',
    totalAmount: '117499127208505156615706',
    rootCommittedAt: '1634311676'
  },
  '0x5ebcdbe7570f2538ca38e4109c159a9890d4a0ab18aca1e2ff0b719da13b11af': {
    destinationChainId: '1',
    rootHash: '0x5ebcdbe7570f2538ca38e4109c159a9890d4a0ab18aca1e2ff0b719da13b11af',
    totalAmount: '110906568921045196916358',
    rootCommittedAt: '1634387766'
  },
  '0x955c463aec4191bc3cab0788d19289c5370985ae94f4d51fb5795763d6d1078f': {
    destinationChainId: '1',
    rootHash: '0x955c463aec4191bc3cab0788d19289c5370985ae94f4d51fb5795763d6d1078f',
    totalAmount: '109840200948749623154221',
    rootCommittedAt: '1634377622'
  },
  '0xfb469a0d9ac123fe526b3b503712cb2f14cbe346d19e386a1e41ed5bd0fa9715': {
    destinationChainId: '137',
    rootHash: '0xfb469a0d9ac123fe526b3b503712cb2f14cbe346d19e386a1e41ed5bd0fa9715',
    totalAmount: '49086314741283251404493',
    rootCommittedAt: '1634401039'
  },
  '0x59cd411d4dffcab0eaa6c6febd3c964bdfa9654607a21d60a8cb103ef8a7466d': {
    destinationChainId: '1',
    rootHash: '0x59cd411d4dffcab0eaa6c6febd3c964bdfa9654607a21d60a8cb103ef8a7466d',
    totalAmount: '117794919777333405566864',
    rootCommittedAt: '1634382313'
  },
  '0x3f3edbd077f2135ea7277d789b9cc109767e3391993d019ce37c481dda978440': {
    destinationChainId: '1',
    rootHash: '0x3f3edbd077f2135ea7277d789b9cc109767e3391993d019ce37c481dda978440',
    totalAmount: '107806113410535880933203',
    rootCommittedAt: '1634427983'
  },
  '0x22bcfad6e19daa042e7947fc9bd467865a7ef1dac295227e2805f4f83856391c': {
    destinationChainId: '100',
    rootHash: '0x22bcfad6e19daa042e7947fc9bd467865a7ef1dac295227e2805f4f83856391c',
    totalAmount: '25063438217116416719944',
    rootCommittedAt: '1634549551'
  },
  '0x0d96553d38acde06ed40a7f72f392d73ba74e7ce7108f636524ddcdb1fe03066': {
    destinationChainId: '1',
    rootHash: '0x0d96553d38acde06ed40a7f72f392d73ba74e7ce7108f636524ddcdb1fe03066',
    totalAmount: '249264413092535813853092',
    rootCommittedAt: '1634611115'
  },
  '0x439fb707eef559695100f4d15d41dcd0ba33d7895a0eef139af9e33902e7a212': {
    destinationChainId: '137',
    rootHash: '0x439fb707eef559695100f4d15d41dcd0ba33d7895a0eef139af9e33902e7a212',
    totalAmount: '79200031204037153467925',
    rootCommittedAt: '1634813979'
  },
  '0xc2939e98ba531a4f6d3c69be5c0fd087039357f87103d7fa36275bddc83951c8': {
    destinationChainId: '1',
    rootHash: '0xc2939e98ba531a4f6d3c69be5c0fd087039357f87103d7fa36275bddc83951c8',
    totalAmount: '197843888082451992060515',
    rootCommittedAt: '1634893255'
  },
  '0xee9271d07bda351f8e598185cf024ab187ad5030bae9615c4fde020c9b6e4a2f': {
    destinationChainId: '137',
    rootHash: '0xee9271d07bda351f8e598185cf024ab187ad5030bae9615c4fde020c9b6e4a2f',
    totalAmount: '75800114379059570825305',
    rootCommittedAt: '1635082184'
  },
  '0x40bea4c67de5dfa18deb04fb0f4840e2f5528b001550bb576b62e68d3cc04b6c': {
    destinationChainId: '42161',
    rootHash: '0x40bea4c67de5dfa18deb04fb0f4840e2f5528b001550bb576b62e68d3cc04b6c',
    totalAmount: '75273136572399087799414',
    rootCommittedAt: '1635076602'
  },
  '0x6f529664866f3708d675efbdcc1fd0d4286eaed4a0d463f71a12b5043965bd0e': {
    destinationChainId: '42161',
    rootHash: '0x6f529664866f3708d675efbdcc1fd0d4286eaed4a0d463f71a12b5043965bd0e',
    totalAmount: '149377238218582316857555',
    rootCommittedAt: '1635244340'
  },
  '0x86d3d8a06d41988ecc626f5f9c77cbcb2a0edf09b4275ad08750bc263b5c90ae': {
    destinationChainId: '1',
    rootHash: '0x86d3d8a06d41988ecc626f5f9c77cbcb2a0edf09b4275ad08750bc263b5c90ae',
    totalAmount: '114268420838867976170215',
    rootCommittedAt: '1635266376'
  },
  '0x37eabab2ed554fef009204460e90567ce239913b5fccc6d18b10d146779779b8': {
    destinationChainId: '1',
    rootHash: '0x37eabab2ed554fef009204460e90567ce239913b5fccc6d18b10d146779779b8',
    totalAmount: '62383482211156680000',
    rootCommittedAt: '1635481929'
  },
  '0x681f669d7bad50c040fb0ec4937571470204134c57708850ee39935677a15017': {
    destinationChainId: '1',
    rootHash: '0x681f669d7bad50c040fb0ec4937571470204134c57708850ee39935677a15017',
    totalAmount: '178453706958',
    rootCommittedAt: '1635485336'
  },
  '0x6e23a10d4266332ef839109fc245847f4b900039a4bf447c3bce01d966b34ca5': {
    destinationChainId: '1',
    rootHash: '0x6e23a10d4266332ef839109fc245847f4b900039a4bf447c3bce01d966b34ca5',
    totalAmount: '128962491841891630000',
    rootCommittedAt: '1635487121'
  },
  '0xa212436194d7d6109c3f22ddbe9cd823f5f76abe65568c33d9d9c7bc0e389170': {
    destinationChainId: '1',
    rootHash: '0xa212436194d7d6109c3f22ddbe9cd823f5f76abe65568c33d9d9c7bc0e389170',
    totalAmount: '61382633308439224000',
    rootCommittedAt: '1635504687'
  },
  '0xf29af81a03b312c014cc3e20c90bbb04105d7de99f0215c8f7f212214f3f4bfc': {
    destinationChainId: '42161',
    rootHash: '0xf29af81a03b312c014cc3e20c90bbb04105d7de99f0215c8f7f212214f3f4bfc',
    totalAmount: '45137361964106910000',
    rootCommittedAt: '1635511146'
  },
  '0xe991f077bc5074bf785b9187ed6356e47e9bce4693be65949a7e3f04c5867723': {
    destinationChainId: '1',
    rootHash: '0xe991f077bc5074bf785b9187ed6356e47e9bce4693be65949a7e3f04c5867723',
    totalAmount: '190676801891',
    rootCommittedAt: '1635511466'
  },
  '0x711c8d0202307159b12437c2a8e7c6848046890b713045255dbd77cb6796a6a1': {
    destinationChainId: '137',
    rootHash: '0x711c8d0202307159b12437c2a8e7c6848046890b713045255dbd77cb6796a6a1',
    totalAmount: '86197452796',
    rootCommittedAt: '1635539087'
  },
  '0x1b60d67c50af3f0d6aced7c8007d57d01ec3982b3b880c9fb38ea426435346f9': {
    destinationChainId: '137',
    rootHash: '0x1b60d67c50af3f0d6aced7c8007d57d01ec3982b3b880c9fb38ea426435346f9',
    totalAmount: '36899808178028770000',
    rootCommittedAt: '1635573786'
  },
  '0x2742c78c3baaacc089abb29d48e53aa1edba21a65acf2a274bace9caae25f964': {
    destinationChainId: '1',
    rootHash: '0x2742c78c3baaacc089abb29d48e53aa1edba21a65acf2a274bace9caae25f964',
    totalAmount: '141542237454',
    rootCommittedAt: '1635577746'
  },
  '0x6f1393dcd54c5934a54cd8419b9149557e3d4aec9602601922697c2fd5d202d4': {
    destinationChainId: '1',
    rootHash: '0x6f1393dcd54c5934a54cd8419b9149557e3d4aec9602601922697c2fd5d202d4',
    totalAmount: '53407056175688335000',
    rootCommittedAt: '1635617407'
  },
  '0x71a48f8d6479a428c8ade6003452b5128f3ecf6f27e5d53f4256631058c3b991': {
    destinationChainId: '1',
    rootHash: '0x71a48f8d6479a428c8ade6003452b5128f3ecf6f27e5d53f4256631058c3b991',
    totalAmount: '126658548110',
    rootCommittedAt: '1635637963'
  },
  '0x49a524626f9f3952696dbde080fc2ccfa4123aaa520d71dd6d11e88eb19f70f1': {
    destinationChainId: '1',
    rootHash: '0x49a524626f9f3952696dbde080fc2ccfa4123aaa520d71dd6d11e88eb19f70f1',
    totalAmount: '112161360461',
    rootCommittedAt: '1635674923'
  },
  '0xb82a37164cde32724213cfa7655b76979ff3c04e5aae44c711a00a8766ea6cca': {
    destinationChainId: '100',
    rootHash: '0xb82a37164cde32724213cfa7655b76979ff3c04e5aae44c711a00a8766ea6cca',
    totalAmount: '25346608400518021834379',
    rootCommittedAt: '1635675558'
  },
  '0x77faff82e31e449beec502ade9efd67bc709ca1edbeb0c7ca54f28aaa7ce66e6': {
    destinationChainId: '42161',
    rootHash: '0x77faff82e31e449beec502ade9efd67bc709ca1edbeb0c7ca54f28aaa7ce66e6',
    totalAmount: '43968752199722960000',
    rootCommittedAt: '1635686555'
  },
  '0xb39013abddcc32363a66e5faba871ec25b77aa2da9e50835be828feb02b49a8c': {
    destinationChainId: '137',
    rootHash: '0xb39013abddcc32363a66e5faba871ec25b77aa2da9e50835be828feb02b49a8c',
    totalAmount: '94554023430326088197320',
    rootCommittedAt: '1635686555'
  },
  '0x6ec434f1004c9cae680284c4cce0ec8843e2c25475d2732cbd8760894cfb6937': {
    destinationChainId: '42161',
    rootHash: '0x6ec434f1004c9cae680284c4cce0ec8843e2c25475d2732cbd8760894cfb6937',
    totalAmount: '92049121592',
    rootCommittedAt: '1635698630'
  },
  '0x6a08e43507be2831837e366ad0704289c9d456f7796bbbd68cfd50f0a7450e13': {
    destinationChainId: '1',
    rootHash: '0x6a08e43507be2831837e366ad0704289c9d456f7796bbbd68cfd50f0a7450e13',
    totalAmount: '50062426134181220000',
    rootCommittedAt: '1635707776'
  },
  '0x8e14f4e103720aa2df8327e9247f0964ae94f22f2179f4655a0bb28e6d5a34b8': {
    destinationChainId: '1',
    rootHash: '0x8e14f4e103720aa2df8327e9247f0964ae94f22f2179f4655a0bb28e6d5a34b8',
    totalAmount: '92353978089017430000',
    rootCommittedAt: '1635720035'
  },
  '0xf2b60fe8a018ee7bb72b1eca5be0c5c7c34820767c90e0a4ecdcb7da596dbdd4': {
    destinationChainId: '1',
    rootHash: '0xf2b60fe8a018ee7bb72b1eca5be0c5c7c34820767c90e0a4ecdcb7da596dbdd4',
    totalAmount: '54234354024533870000',
    rootCommittedAt: '1635762579'
  },
  '0xe38dc3442403e9013ba8b69a9332050c727639b0134710518b9057ca16d102eb': {
    destinationChainId: '1',
    rootHash: '0xe38dc3442403e9013ba8b69a9332050c727639b0134710518b9057ca16d102eb',
    totalAmount: '179767754125131181189246',
    rootCommittedAt: '1635771892'
  },
  '0x9e1f574fd1d56ef169d372c7fb9f098a6434a8dfc9c52cabc0b1ebf2d4997059': {
    destinationChainId: '1',
    rootHash: '0x9e1f574fd1d56ef169d372c7fb9f098a6434a8dfc9c52cabc0b1ebf2d4997059',
    totalAmount: '254810979362',
    rootCommittedAt: '1635794302'
  },
  '0x2311f258b49be0d8bafa43fac915d222a77e2583271aca6e1a3133546d5bffe4': {
    destinationChainId: '1',
    rootHash: '0x2311f258b49be0d8bafa43fac915d222a77e2583271aca6e1a3133546d5bffe4',
    totalAmount: '223083227702',
    rootCommittedAt: '1635797761'
  },
  '0x8ba76e77a27e6bf1b257c065437ea3bdc4a64d107458332e9458062c8e9455d7': {
    destinationChainId: '1',
    rootHash: '0x8ba76e77a27e6bf1b257c065437ea3bdc4a64d107458332e9458062c8e9455d7',
    totalAmount: '124738204003',
    rootCommittedAt: '1635839588'
  },
  '0x595743844604a3059ed3dc7305e1c06b9180ee851e3267f942e4272cdbe9d285': {
    destinationChainId: '1',
    rootHash: '0x595743844604a3059ed3dc7305e1c06b9180ee851e3267f942e4272cdbe9d285',
    totalAmount: '50237549750838714000',
    rootCommittedAt: '1635862581'
  },
  '0xeebf5fc3b5d7f3fe6ffaa6daf742de1365fea1e2e73d1c314ff29f82eb3f1aa0': {
    destinationChainId: '1',
    rootHash: '0xeebf5fc3b5d7f3fe6ffaa6daf742de1365fea1e2e73d1c314ff29f82eb3f1aa0',
    totalAmount: '152993287498870756405116',
    rootCommittedAt: '1635870449'
  },
  '0x6c1e2331a7cbbadbc6ee57afca9445cca51f75a72c8285c03965c9989ae30587': {
    destinationChainId: '137',
    rootHash: '0x6c1e2331a7cbbadbc6ee57afca9445cca51f75a72c8285c03965c9989ae30587',
    totalAmount: '79686386282',
    rootCommittedAt: '1635874767'
  },
  '0xf3e6c67fe0c206ed472c89412de073f6955136e73fdbbc06319d0009ce12d6de': {
    destinationChainId: '137',
    rootHash: '0xf3e6c67fe0c206ed472c89412de073f6955136e73fdbbc06319d0009ce12d6de',
    totalAmount: '18037923477198600000',
    rootCommittedAt: '1635880629'
  },
  '0xb4591b624ae539638b79b31b0440b645efd49197cef9016405b3e84c0bfe9972': {
    destinationChainId: '1',
    rootHash: '0xb4591b624ae539638b79b31b0440b645efd49197cef9016405b3e84c0bfe9972',
    totalAmount: '100941027350',
    rootCommittedAt: '1635890046'
  },
  '0x1678fd9c4ca7e55ac604f55daaa7b22ecf511ef526c3749ac366debb926d67c9': {
    destinationChainId: '1',
    rootHash: '0x1678fd9c4ca7e55ac604f55daaa7b22ecf511ef526c3749ac366debb926d67c9',
    totalAmount: '63285698442697245000',
    rootCommittedAt: '1635892185'
  },
  '0x7ee7a57432cd881cac5568483281bc9bea5ca5b68091fc24a1bcfd8d03750936': {
    destinationChainId: '1',
    rootHash: '0x7ee7a57432cd881cac5568483281bc9bea5ca5b68091fc24a1bcfd8d03750936',
    totalAmount: '264992658936273833893492',
    rootCommittedAt: '1635903278'
  },
  '0xa1c16b9c1aac5e29292ea33c53c83f1b03b74e6e3b611d21c8d5db5aa0bfa886': {
    destinationChainId: '100',
    rootHash: '0xa1c16b9c1aac5e29292ea33c53c83f1b03b74e6e3b611d21c8d5db5aa0bfa886',
    totalAmount: '25646630122',
    rootCommittedAt: '1635912371'
  },
  '0xe938780b8593ecac7ef8386d6b9443d9903acf0b63a5d0d1169560e7906aec3a': {
    destinationChainId: '1',
    rootHash: '0xe938780b8593ecac7ef8386d6b9443d9903acf0b63a5d0d1169560e7906aec3a',
    totalAmount: '103721674781',
    rootCommittedAt: '1635922460'
  },
  '0x4b1ecbd3f7c716528fac09e46ab6c5ad964bc48b8326c345b0e8d22febdcb774': {
    destinationChainId: '137',
    rootHash: '0x4b1ecbd3f7c716528fac09e46ab6c5ad964bc48b8326c345b0e8d22febdcb774',
    totalAmount: '75324900068',
    rootCommittedAt: '1635934117'
  },
  '0xa828b95ba3f1a800addbaef59ac672606f78c29b45bec8451f3adc5c39052b3a': {
    destinationChainId: '42161',
    rootHash: '0xa828b95ba3f1a800addbaef59ac672606f78c29b45bec8451f3adc5c39052b3a',
    totalAmount: '89665777520',
    rootCommittedAt: '1635937354'
  },
  '0xa8d0fd7ac20805524e5db5ace0f47e9b4dbe7c5c832a5b0ec8c0f9205db60874': {
    destinationChainId: '42161',
    rootHash: '0xa8d0fd7ac20805524e5db5ace0f47e9b4dbe7c5c832a5b0ec8c0f9205db60874',
    totalAmount: '34323743432864370000',
    rootCommittedAt: '1635937605'
  },
  '0xebb138059daad8ec0fc690e37b437d3cc792f41b2d64809c862ce487888439d6': {
    destinationChainId: '42161',
    rootHash: '0xebb138059daad8ec0fc690e37b437d3cc792f41b2d64809c862ce487888439d6',
    totalAmount: '40912229670618350000',
    rootCommittedAt: '1635951431'
  },
  '0x018ca212419fcb71fb6db815c1f30e094652ba5c1593f054e88e923330a4228d': {
    destinationChainId: '137',
    rootHash: '0x018ca212419fcb71fb6db815c1f30e094652ba5c1593f054e88e923330a4228d',
    totalAmount: '93117784649542637520082',
    rootCommittedAt: '1635958475'
  },
  '0x0e554f027de80cd241b57c1b3c94a7ae5885c2a396b10c9c6f4c24307adf2e81': {
    destinationChainId: '1',
    rootHash: '0x0e554f027de80cd241b57c1b3c94a7ae5885c2a396b10c9c6f4c24307adf2e81',
    totalAmount: '50079374319029750000',
    rootCommittedAt: '1635990012'
  },
  '0xa7ef01af04cdf660d08655a17a7980b5183f3493706a1920ec877f2362b6b9a4': {
    destinationChainId: '1',
    rootHash: '0xa7ef01af04cdf660d08655a17a7980b5183f3493706a1920ec877f2362b6b9a4',
    totalAmount: '110032692828',
    rootCommittedAt: '1636008108'
  },
  '0x3b3c8a294b5454c6012b33f7cc74685a9f82d5914c69ad81bc568e2e1ddd9d0c': {
    destinationChainId: '1',
    rootHash: '0x3b3c8a294b5454c6012b33f7cc74685a9f82d5914c69ad81bc568e2e1ddd9d0c',
    totalAmount: '55165921939652346000',
    rootCommittedAt: '1636037718'
  },
  '0x0ac9d14049246430921aa9c23f12a20a1b88edf77c3dc89f68795c5cdf32fc8b': {
    destinationChainId: '1',
    rootHash: '0x0ac9d14049246430921aa9c23f12a20a1b88edf77c3dc89f68795c5cdf32fc8b',
    totalAmount: '63692762105749330000',
    rootCommittedAt: '1636044272'
  },
  '0x1d198484f8ebf55f2ba49dcd64b24031069cddb5e09776f57be566394d69f817': {
    destinationChainId: '42161',
    rootHash: '0x1d198484f8ebf55f2ba49dcd64b24031069cddb5e09776f57be566394d69f817',
    totalAmount: '92723928381312480137690',
    rootCommittedAt: '1636047766'
  },
  '0xe002060bf60efcba93cc32236e45da2b1067d640c3a9f43eb2b0a982eadcd71e': {
    destinationChainId: '137',
    rootHash: '0xe002060bf60efcba93cc32236e45da2b1067d640c3a9f43eb2b0a982eadcd71e',
    totalAmount: '228470600237',
    rootCommittedAt: '1636066388'
  },
  '0x8df3be8957a6b70db6353c4e1ddf58f05d089a02d80b7009e7088718913ffbd9': {
    destinationChainId: '42161',
    rootHash: '0x8df3be8957a6b70db6353c4e1ddf58f05d089a02d80b7009e7088718913ffbd9',
    totalAmount: '40443939387166310000',
    rootCommittedAt: '1636073990'
  },
  '0xc4264f89b9a32664405896f8b1b8347b308b8db97e69ba770e86368f4ea15fe8': {
    destinationChainId: '1',
    rootHash: '0xc4264f89b9a32664405896f8b1b8347b308b8db97e69ba770e86368f4ea15fe8',
    totalAmount: '156344497871313127341886',
    rootCommittedAt: '1636089938'
  },
  '0xd45d93738601e54d2bd02b758c72598ea20b84ed6da07f981dc26a4978a91c7a': {
    destinationChainId: '42161',
    rootHash: '0xd45d93738601e54d2bd02b758c72598ea20b84ed6da07f981dc26a4978a91c7a',
    totalAmount: '105809934301',
    rootCommittedAt: '1636107924'
  },
  '0x1a793500fe911e8d9320f1c9c3885fa913d0534c54d018d08c0c626a3e3bfb28': {
    destinationChainId: '42161',
    rootHash: '0x1a793500fe911e8d9320f1c9c3885fa913d0534c54d018d08c0c626a3e3bfb28',
    totalAmount: '199566367248',
    rootCommittedAt: '1636113915'
  },
  '0x4c26d3e35f39b7e73a2d05cf72b13546de5d2afb0ba62844d85b182d1c806544': {
    destinationChainId: '1',
    rootHash: '0x4c26d3e35f39b7e73a2d05cf72b13546de5d2afb0ba62844d85b182d1c806544',
    totalAmount: '50681488392378660000',
    rootCommittedAt: '1636121875'
  },
  '0xd0b0c39d7fd65a0b0d4abdd57e19513597c5444061f5656b700a3adf56bcf951': {
    destinationChainId: '42161',
    rootHash: '0xd0b0c39d7fd65a0b0d4abdd57e19513597c5444061f5656b700a3adf56bcf951',
    totalAmount: '76085092237',
    rootCommittedAt: '1636125493'
  },
  '0x84cc5c71c7112454b9d18daf1e2c5b6795e9fef5dc4df77a2dd9e29a0e503776': {
    destinationChainId: '42161',
    rootHash: '0x84cc5c71c7112454b9d18daf1e2c5b6795e9fef5dc4df77a2dd9e29a0e503776',
    totalAmount: '40230400227359540000',
    rootCommittedAt: '1636134672'
  },
  '0xe4a1d9ddfe3222aa7784a2018ef387dcb271cb5031fa285e212d8dc2e4232016': {
    destinationChainId: '42161',
    rootHash: '0xe4a1d9ddfe3222aa7784a2018ef387dcb271cb5031fa285e212d8dc2e4232016',
    totalAmount: '99349144677',
    rootCommittedAt: '1636136929'
  },
  '0x1d35ba3ccc771fc403862804eec055082a21374e2b73af3f38a88906648e5ab1': {
    destinationChainId: '137',
    rootHash: '0x1d35ba3ccc771fc403862804eec055082a21374e2b73af3f38a88906648e5ab1',
    totalAmount: '85159973396',
    rootCommittedAt: '1636148855'
  },
  '0x563f1e3292bbbc3b115206e4dd509e06ca76af5e1b90cde69f5c85fd4aac3ead': {
    destinationChainId: '1',
    rootHash: '0x563f1e3292bbbc3b115206e4dd509e06ca76af5e1b90cde69f5c85fd4aac3ead',
    totalAmount: '297537781311',
    rootCommittedAt: '1636151130'
  },
  '0xf542914015967cff7bfbf3f44c18697e82487667b3e021c1601d72fff30ce542': {
    destinationChainId: '1',
    rootHash: '0xf542914015967cff7bfbf3f44c18697e82487667b3e021c1601d72fff30ce542',
    totalAmount: '50302782618023850000',
    rootCommittedAt: '1636157397'
  },
  '0xb01bbcff132c8c3cf591da6f138837df4fed064337d94a9bcc1fa974138a4b8e': {
    destinationChainId: '42161',
    rootHash: '0xb01bbcff132c8c3cf591da6f138837df4fed064337d94a9bcc1fa974138a4b8e',
    totalAmount: '190293073385',
    rootCommittedAt: '1636179562'
  },
  '0xd58f678b4b4baa90c95bb49e72c75b1bfba2b27a26f76df8e0d9445e080ec4fb': {
    destinationChainId: '137',
    rootHash: '0xd58f678b4b4baa90c95bb49e72c75b1bfba2b27a26f76df8e0d9445e080ec4fb',
    totalAmount: '97902275281864202977413',
    rootCommittedAt: '1636189505'
  },
  '0x9acffbe77f99d488b20e48d6ecfe9cfcd287a9cf55dcee377c3986d35bd8d63b': {
    destinationChainId: '1',
    rootHash: '0x9acffbe77f99d488b20e48d6ecfe9cfcd287a9cf55dcee377c3986d35bd8d63b',
    totalAmount: '55282385893887885000',
    rootCommittedAt: '1636207184'
  },
  '0xab2915687e6d20c40470c2a3720887fd0150129950c471525a4cf291ce73787e': {
    destinationChainId: '42161',
    rootHash: '0xab2915687e6d20c40470c2a3720887fd0150129950c471525a4cf291ce73787e',
    totalAmount: '8629441356996851000',
    rootCommittedAt: '1636213431'
  },
  '0x827f20e17d9a86460f19637daa2f01032e625ba1691c378f711866595c01e06f': {
    destinationChainId: '137',
    rootHash: '0x827f20e17d9a86460f19637daa2f01032e625ba1691c378f711866595c01e06f',
    totalAmount: '44754968062696990000',
    rootCommittedAt: '1636218346'
  },
  '0xfcf398abc919194b05082fcee0c697dda2072bb882e80eeaff6ca689b91d3442': {
    destinationChainId: '42161',
    rootHash: '0xfcf398abc919194b05082fcee0c697dda2072bb882e80eeaff6ca689b91d3442',
    totalAmount: '107020678336',
    rootCommittedAt: '1636227400'
  },
  '0x83f064178cc8ba6c1c9e58de3614c0fa0d0dee3792f1c649b32d781f4af35ab6': {
    destinationChainId: '1',
    rootHash: '0x83f064178cc8ba6c1c9e58de3614c0fa0d0dee3792f1c649b32d781f4af35ab6',
    totalAmount: '50327946965810860000',
    rootCommittedAt: '1636236103'
  },
  '0x3da1da846925d85e1c17eca3d8ecdbda21bbdcba4e03d2bdfbbbff858e2098fa': {
    destinationChainId: '42161',
    rootHash: '0x3da1da846925d85e1c17eca3d8ecdbda21bbdcba4e03d2bdfbbbff858e2098fa',
    totalAmount: '101397886556',
    rootCommittedAt: '1636243928'
  },
  '0x9d57315ac7326d8cc06a91979683505e101cf005d98a4ce663ad6fc390034af5': {
    destinationChainId: '1',
    rootHash: '0x9d57315ac7326d8cc06a91979683505e101cf005d98a4ce663ad6fc390034af5',
    totalAmount: '137458721102175589932082',
    rootCommittedAt: '1636268361'
  },
  '0xc0e238c1b55c0e1e6e4fc08ca2a697e8f29a4532a2a85d050ecba3265794d1b8': {
    destinationChainId: '1',
    rootHash: '0xc0e238c1b55c0e1e6e4fc08ca2a697e8f29a4532a2a85d050ecba3265794d1b8',
    totalAmount: '50096381201126560000',
    rootCommittedAt: '1636274990'
  },
  '0x4f8569080387e7fcd050a74eb2682693b16a2236cfbffdd94eeb504151f10bbe': {
    destinationChainId: '137',
    rootHash: '0x4f8569080387e7fcd050a74eb2682693b16a2236cfbffdd94eeb504151f10bbe',
    totalAmount: '199226080089',
    rootCommittedAt: '1636276142'
  },
  '0x012c5c5e44a7beadb8a2a42701707a61e507d324374bd12dfbef74862a659291': {
    destinationChainId: '1',
    rootHash: '0x012c5c5e44a7beadb8a2a42701707a61e507d324374bd12dfbef74862a659291',
    totalAmount: '141730162986',
    rootCommittedAt: '1636288819'
  },
  '0xbecb0f669c30161318fc60d3d2fe9e857f305e38bd6d1ae486a1ab78452e2884': {
    destinationChainId: '1',
    rootHash: '0xbecb0f669c30161318fc60d3d2fe9e857f305e38bd6d1ae486a1ab78452e2884',
    totalAmount: '50420778031271200000',
    rootCommittedAt: '1636309263'
  },
  '0x96914168f96bb7f9d19796c60b4a0bd2914a09ee31ee36be9e83dbfff75a8a92': {
    destinationChainId: '137',
    rootHash: '0x96914168f96bb7f9d19796c60b4a0bd2914a09ee31ee36be9e83dbfff75a8a92',
    totalAmount: '40446658456554490000',
    rootCommittedAt: '1636333874'
  },
  '0x1bfb01220659328f9379ef2dab7356c98889c3f0db57920aa7ee491cd8d3ad60': {
    destinationChainId: '42161',
    rootHash: '0x1bfb01220659328f9379ef2dab7356c98889c3f0db57920aa7ee491cd8d3ad60',
    totalAmount: '41690451612571935000',
    rootCommittedAt: '1636349205'
  },
  '0x2330e9c4571636eb0ef16681c993d7b64b97b44be71b8ffb89543fe23b27e307': {
    destinationChainId: '1',
    rootHash: '0x2330e9c4571636eb0ef16681c993d7b64b97b44be71b8ffb89543fe23b27e307',
    totalAmount: '53962088352053570000',
    rootCommittedAt: '1636363211'
  },
  '0xf1f81936c6900d7c94c021d6aea7be8c85cf33b6afc81a8ef684549c372e7a80': {
    destinationChainId: '1',
    rootHash: '0xf1f81936c6900d7c94c021d6aea7be8c85cf33b6afc81a8ef684549c372e7a80',
    totalAmount: '126741805935',
    rootCommittedAt: '1636382002'
  },
  '0x729bc3f5620b63c15b2fad19828b5f87f6c28f221068939043405b2b04c29626': {
    destinationChainId: '42161',
    rootHash: '0x729bc3f5620b63c15b2fad19828b5f87f6c28f221068939043405b2b04c29626',
    totalAmount: '48194760151401470000',
    rootCommittedAt: '1636383572'
  },
  '0xe829c81a24c014d17d529ab69309481d3c57784a146d31994552022330ff34b7': {
    destinationChainId: '42161',
    rootHash: '0xe829c81a24c014d17d529ab69309481d3c57784a146d31994552022330ff34b7',
    totalAmount: '15307307212198898000',
    rootCommittedAt: '1636398818'
  },
  '0x3af969e3fe25f4b37a38371091bfc69cf139299bf795714ee636c8ce4fa6f5b4': {
    destinationChainId: '1',
    rootHash: '0x3af969e3fe25f4b37a38371091bfc69cf139299bf795714ee636c8ce4fa6f5b4',
    totalAmount: '50939093859820134000',
    rootCommittedAt: '1636406754'
  },
  '0x07cb3b4d0246d68af81e5ba78d3714726679116137b4c426be9695730daff61a': {
    destinationChainId: '42161',
    rootHash: '0x07cb3b4d0246d68af81e5ba78d3714726679116137b4c426be9695730daff61a',
    totalAmount: '20096422871288746000',
    rootCommittedAt: '1636411550'
  },
  '0x4a9bfe4f60a922fce15d8883e655eaa618635eeae982eaa452cf4476ec7fae03': {
    destinationChainId: '137',
    rootHash: '0x4a9bfe4f60a922fce15d8883e655eaa618635eeae982eaa452cf4476ec7fae03',
    totalAmount: '14574587288416831000',
    rootCommittedAt: '1636413320'
  },
  '0xe6d07c9338010f34bbf389ab4e62d1ba22f3fa829ecafad905ab9625510058bb': {
    destinationChainId: '100',
    rootHash: '0xe6d07c9338010f34bbf389ab4e62d1ba22f3fa829ecafad905ab9625510058bb',
    totalAmount: '30862568629',
    rootCommittedAt: '1636416478'
  },
  '0xc37401063bfbfe6eae98b8c81a4eb032e1e1d23494a4992d0da23dfe9611c9a3': {
    destinationChainId: '137',
    rootHash: '0xc37401063bfbfe6eae98b8c81a4eb032e1e1d23494a4992d0da23dfe9611c9a3',
    totalAmount: '77371765201',
    rootCommittedAt: '1636435262'
  },
  '0x088b33a098c33e7ee5f34505b75193bd404876d736c0c30914f2d408054ced23': {
    destinationChainId: '42161',
    rootHash: '0x088b33a098c33e7ee5f34505b75193bd404876d736c0c30914f2d408054ced23',
    totalAmount: '40146105651310076000',
    rootCommittedAt: '1636441103'
  },
  '0x70d65979ad41c41b2ccf277895e9d9aa52c3fb93de804547b31a2828fe4b4b09': {
    destinationChainId: '42161',
    rootHash: '0x70d65979ad41c41b2ccf277895e9d9aa52c3fb93de804547b31a2828fe4b4b09',
    totalAmount: '11190505744295037000',
    rootCommittedAt: '1636460562'
  },
  '0x2ae7edb530bf5fcdbc806e7ea59fe997e25239363001c50dd08eca3bb910d697': {
    destinationChainId: '1',
    rootHash: '0x2ae7edb530bf5fcdbc806e7ea59fe997e25239363001c50dd08eca3bb910d697',
    totalAmount: '50725801855106250000',
    rootCommittedAt: '1636463823'
  },
  '0x8456eb2a500dba23484f977e70f53e9034943847a0e01288099df9a3a93af731': {
    destinationChainId: '137',
    rootHash: '0x8456eb2a500dba23484f977e70f53e9034943847a0e01288099df9a3a93af731',
    totalAmount: '75163179511',
    rootCommittedAt: '1636465844'
  },
  '0x32b03dadfe5a73405fd38ac3842d33aa306a502471184d9a378c86747e5c2dfb': {
    destinationChainId: '42161',
    rootHash: '0x32b03dadfe5a73405fd38ac3842d33aa306a502471184d9a378c86747e5c2dfb',
    totalAmount: '132374947342534203478516',
    rootCommittedAt: '1636475953'
  },
  '0x70550ec1e2f1a4301d38047ed3ddd9700948fb3d5b92eb9c63032f2cb5626a6b': {
    destinationChainId: '42161',
    rootHash: '0x70550ec1e2f1a4301d38047ed3ddd9700948fb3d5b92eb9c63032f2cb5626a6b',
    totalAmount: '156236317313',
    rootCommittedAt: '1636476651'
  },
  '0xb072bf7f4f839e71c11379960133b99d92cbd13c3da29ba6a81878a588437e93': {
    destinationChainId: '137',
    rootHash: '0xb072bf7f4f839e71c11379960133b99d92cbd13c3da29ba6a81878a588437e93',
    totalAmount: '22715212780374647000',
    rootCommittedAt: '1636477088'
  },
  '0xf64d0094f9fcc615afec9007fcd9b978e9cfcb69824a8134eac162d541104c84': {
    destinationChainId: '42161',
    rootHash: '0xf64d0094f9fcc615afec9007fcd9b978e9cfcb69824a8134eac162d541104c84',
    totalAmount: '24420391750499470000',
    rootCommittedAt: '1636484099'
  },
  '0x6df854bfb1030b22cc89fe36f7c4950124e463118eedd1af43d45c43fbe376b1': {
    destinationChainId: '137',
    rootHash: '0x6df854bfb1030b22cc89fe36f7c4950124e463118eedd1af43d45c43fbe376b1',
    totalAmount: '132374947342534203478516',
    rootCommittedAt: '1636484374'
  },
  '0xd6d8e36135e6669027f8547a8d3d9023cfab0f31c9720fb6a893bf9799d7df05': {
    destinationChainId: '42161',
    rootHash: '0xd6d8e36135e6669027f8547a8d3d9023cfab0f31c9720fb6a893bf9799d7df05',
    totalAmount: '47107352828346340000',
    rootCommittedAt: '1636493095'
  },
  '0x77e2d7331c148cce2cc1e60e5a999f3a11ac7ec970e334a81c37d338bb209b2f': {
    destinationChainId: '42161',
    rootHash: '0x77e2d7331c148cce2cc1e60e5a999f3a11ac7ec970e334a81c37d338bb209b2f',
    totalAmount: '50823323836300580000',
    rootCommittedAt: '1636497085'
  },
  '0x65bbcaa6e0e2ff8104bb76a6ec13a57c4d6065c68816e4a1b908068a94c3f238': {
    destinationChainId: '137',
    rootHash: '0x65bbcaa6e0e2ff8104bb76a6ec13a57c4d6065c68816e4a1b908068a94c3f238',
    totalAmount: '134477217799',
    rootCommittedAt: '1636513321'
  },
  '0x4272c01a9343c39baa571248efe2ec835aed1bd871ca4f6f37892f338e295934': {
    destinationChainId: '137',
    rootHash: '0x4272c01a9343c39baa571248efe2ec835aed1bd871ca4f6f37892f338e295934',
    totalAmount: '79585302216',
    rootCommittedAt: '1636517104'
  },
  '0xa67b01a7f1114c17ca6ac7c6079a8a8c934319f936e3ad108e146f9685147041': {
    destinationChainId: '42161',
    rootHash: '0xa67b01a7f1114c17ca6ac7c6079a8a8c934319f936e3ad108e146f9685147041',
    totalAmount: '41401195455537660000',
    rootCommittedAt: '1636519497'
  },
  '0x3c3d2d5646dcdd6c890f32991bdf75adadee42b6d9c3d8ad241c75e81c9868cc': {
    destinationChainId: '137',
    rootHash: '0x3c3d2d5646dcdd6c890f32991bdf75adadee42b6d9c3d8ad241c75e81c9868cc',
    totalAmount: '22149404485395358000',
    rootCommittedAt: '1636521568'
  },
  '0x681393cb757efd511d4ff69219b35b546585feb8e986d8f176e2b27979bb0501': {
    destinationChainId: '42161',
    rootHash: '0x681393cb757efd511d4ff69219b35b546585feb8e986d8f176e2b27979bb0501',
    totalAmount: '104431756285',
    rootCommittedAt: '1636525997'
  },
  '0x9dfbd28d936bb70b05a8f81fc676ccafe9f6acb702b8506f4fd9705c000f9fc8': {
    destinationChainId: '1',
    rootHash: '0x9dfbd28d936bb70b05a8f81fc676ccafe9f6acb702b8506f4fd9705c000f9fc8',
    totalAmount: '153476803216',
    rootCommittedAt: '1636545071'
  },
  '0xc512792df647c70f0f1ba2c015002b7e09ee9099a562cdfd1e5ecc8c634b310e': {
    destinationChainId: '42161',
    rootHash: '0xc512792df647c70f0f1ba2c015002b7e09ee9099a562cdfd1e5ecc8c634b310e',
    totalAmount: '35892357786592883000',
    rootCommittedAt: '1636546198'
  },
  '0xfb9240d6494a59093b3fb57f78cc1df1ee1295b1bdf951f119c40d651955e13f': {
    destinationChainId: '1',
    rootHash: '0xfb9240d6494a59093b3fb57f78cc1df1ee1295b1bdf951f119c40d651955e13f',
    totalAmount: '50193319901319900000',
    rootCommittedAt: '1636546367'
  },
  '0x4845904728a0676c0edd849c961f17c7775b91855d0a8e97fe9365da8bf06e13': {
    destinationChainId: '137',
    rootHash: '0x4845904728a0676c0edd849c961f17c7775b91855d0a8e97fe9365da8bf06e13',
    totalAmount: '8912607436633211000',
    rootCommittedAt: '1636574299'
  },
  '0xf1f87619ce2021939ff8ca2327b1812541bfbf8416e3510514990253dbcb2fb2': {
    destinationChainId: '42161',
    rootHash: '0xf1f87619ce2021939ff8ca2327b1812541bfbf8416e3510514990253dbcb2fb2',
    totalAmount: '40300726271686740000',
    rootCommittedAt: '1636575499'
  },
  '0x0f8e6b2e001bfaf605388008a58cc04d58d0fedbdf0751d8568a41c1458c4954': {
    destinationChainId: '137',
    rootHash: '0x0f8e6b2e001bfaf605388008a58cc04d58d0fedbdf0751d8568a41c1458c4954',
    totalAmount: '79777517115',
    rootCommittedAt: '1636588289'
  },
  '0xf5393cdd34e47ae881a76266297b5ab293baf7df7fe34d39606a5f09afe3c26a': {
    destinationChainId: '1',
    rootHash: '0xf5393cdd34e47ae881a76266297b5ab293baf7df7fe34d39606a5f09afe3c26a',
    totalAmount: '51471074354316630000',
    rootCommittedAt: '1636590960'
  },
  '0x2abd27ac4ab063916a1df5f91d76841c84918f8a70eecdd1408713b973a52375': {
    destinationChainId: '137',
    rootHash: '0x2abd27ac4ab063916a1df5f91d76841c84918f8a70eecdd1408713b973a52375',
    totalAmount: '76677928151172020086461',
    rootCommittedAt: '1636607054'
  },
  '0xe10628a506a1af3c886c28c801d90258e09c90f7b9530c7ccebbd879aef0cd95': {
    destinationChainId: '137',
    rootHash: '0xe10628a506a1af3c886c28c801d90258e09c90f7b9530c7ccebbd879aef0cd95',
    totalAmount: '78303678460',
    rootCommittedAt: '1636607276'
  },
  '0x962a1c8b2847ac00838330cac53d97b4247686c67c6b8db9083149686972056d': {
    destinationChainId: '42161',
    rootHash: '0x962a1c8b2847ac00838330cac53d97b4247686c67c6b8db9083149686972056d',
    totalAmount: '34534691877017793000',
    rootCommittedAt: '1636623124'
  },
  '0x97dc8ddd4cdd54c0d4de3b44ee2bb4a1172c926f85cdfd39144b45afb19f1008': {
    destinationChainId: '137',
    rootHash: '0x97dc8ddd4cdd54c0d4de3b44ee2bb4a1172c926f85cdfd39144b45afb19f1008',
    totalAmount: '80151373275',
    rootCommittedAt: '1636623758'
  },
  '0x7ecddf0913debebd1369304bb913ee9b8d092b30442b2507b5bc8167c4023cdf': {
    destinationChainId: '137',
    rootHash: '0x7ecddf0913debebd1369304bb913ee9b8d092b30442b2507b5bc8167c4023cdf',
    totalAmount: '119614822623',
    rootCommittedAt: '1636627602'
  },
  '0x04772dcc5a12e6df2f000f2aaac0d205189975db617be22102b4329322e18445': {
    destinationChainId: '137',
    rootHash: '0x04772dcc5a12e6df2f000f2aaac0d205189975db617be22102b4329322e18445',
    totalAmount: '79463643975',
    rootCommittedAt: '1636635965'
  },
  '0xbabf53063ad68050fd4dbe833dfcbe2a5e286becef761352d6698e7dbab97543': {
    destinationChainId: '1',
    rootHash: '0xe321c402a022865093f366bd41c1ddeb5efd4d374327da4e57f58c8f198efa96',
    totalAmount: '50199825126205580000',
    rootCommittedAt: '1636637685'
  },
  // arbitrum public rpc
  '0x4c131e7af19d7dd1bc8ffe8e937ff8fcdb99bb1f09cc2e041f031e8c48d4d275': {
    destinationChainId: '1',
    rootHash: '0x4c131e7af19d7dd1bc8ffe8e937ff8fcdb99bb1f09cc2e041f031e8c48d4d275',
    totalAmount: '10025137464',
    rootCommittedAt: '1635625219'
  },
  '0x063d5d24ca64f0c662b3f3339990ef6550eb4a5dee7925448d85b712dd38b9e5': {
    destinationChainId: '1',
    rootHash: '0x063d5d24ca64f0c662b3f3339990ef6550eb4a5dee7925448d85b712dd38b9e5',
    totalAmount: '38497139540773520376',
    rootCommittedAt: '1635885336'
  }
}
