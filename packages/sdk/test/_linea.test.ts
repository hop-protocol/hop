import { LineaUtils } from '../src/utils/LineaUtils'

describe('LineaUtils', () => {
  it('should have received message for these deposits', async () => {
    const utils = new LineaUtils()
    const from = '0x20527b2aFF565f563dA3C27A10e79366b1ee0Ad3'

    // expect(await utils.getL2MessageDeliveredEvent('0x8655898f1146f046595ced4e307d27e12a0306a081ba67be23729ca8a4b06662', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x3c2545f8146f936d1d5bfd2713160f29e6219b4547ed16468cf473c819bd5b6f', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x22ff57b3d9921466ac440802ac02014a49c7da5fc5812aa7eaf1b70c9f475c95', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x3ac00e5f61b1af52c114bc57ae52d7d6ec2bbf469a69dd9cc074c47db0b8d79c', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xce8022119afb5642c9c88c947d528e9c2bf691616baf28ad28d5fc87b80ab13b', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xdf75c8ebdf1973e283be2b2c99941e45566ff04a4ea839f91201749255484dc9', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x5e41d49652f3c15c0e43d386e946e46e505c33a5229f46d715342d797bf95094', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x71537e88c42281f53361a6733a3218f8526d588ba9ad1635c3a4cfd1e4bbbbca', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x5d0a4d20800d1f3c74bbe9082378c7d7bb6b2f56ecf3bb9ad79709f6bfac38fb', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x71296bfd7b2438ed21e12afa6fb5dbc3d5a8e50ac76e8afb707aaa3aa6ab20dc', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xdc2f9ecf4a54515fc4294866bc2191ea94a34ef395719c7c58655c81d730cee4', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x200fef18bd445e155b017df612d542d6ad2613cbc050ad79da7f85837962834c', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xb33985ff9bb413f3fa2ebdaa90740a819499df1e8ba748d4c1d453600559d307', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x95955a531231579383c45fb462589b5f523fcce66f9d7ee93a24b85e156bf97f', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xf20d1ecad5fff4ccab688b3b09a1680ebc9437ebade607252955c0a76e52ba5b', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x1022386657f049b4bf97314eb70221a5dcac75a12cd1f29b08a3133fe194c01c', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xa3ab5273f0b6087efa7f432bb70c79b008f24c71f6747bb93f8b220c66508c4c', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x753724be2f3d7f441a7dcb9f340f0c3955d47bcd8535f08835fff3bdccb89c38', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x9b217bce90c3897d2183e9a88da539ffa466c72f3826392d9afd42efe93677e0', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xd4083ea1c41dbe1c1941c9e252c608e90e4fecffa79523b06f085d22ae983c3f', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x9a02c90e3881f6bdfbdbf1219c443b025962eda5ea97a0f1406f5b53652eb600', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xa364d21203a87347e56134fb410a106b718ebc3a85ca5f04b16bbd3fd2f081d8', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xbd1da09b7934ab756ab3b7de027cc0ed3e3153157b0ceb7970ed875438f29438', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x731cd4ea989a96e1fd120353336a075b5e393789261bdd284d097e38820c9665', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x771440a9f9437006fa1488397212a4c5704d0812112006f699d080f1f7f9bd15', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xdde7700b6fc7777b7fbc43993c34f625923b7d07e6a0cd834b4d45b9daa781e4', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x1071503d8e8cd33db274704a0bcaf87070cebab4de3fb501e6f4bb758b9120f4', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x7230d9d19bbe8a45576b8702ac8ca07545587e39706f0a4944dc005a6f2150e6', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x051657a6faa936aafa313f1e468e4e1f3d355f59b6054eaa5a69db55cbed2f4a', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x2d37901623422fe62a4eb61588847015dd3d558aff476c017d8461aa886363ed', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x9eb7b7f89e32d0d87bd40f4962d4a510d433a64706980242baaf39d6848136fe', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x61ef0fd4ade3cc14cb7bafbe2e2d1eaa9122c148317f81a34517d35698dcabe5', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xbec74bf060e563f651e16ad7155cf2a263c1f89900bd9ebba7188839e578e78a', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xb4619161e7816bf9a6cac330f6c948834fc3ea261ceaa143824a495621de4214', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xc295fa56da5e3f9e90f7aa4e62e3b192a8963cb8cf3dad23fa226e50fb8ccf97', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x6da679ca4f5b89f58c02ae5338254a26671bac85765707faf6ca1fea40e65427', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x2db801afe751e2b5b72cffc63ed9c7377f3e004b629adf46a9e90f87c38ccdee', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x535499e5ccea42ab5bcdc037a99ab602033c4bb892df6a00cba4de3c6e98caec', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x157f59d4cb3228715acda1bcf8ceb611b4b7c0af30c0d5526621265d9c541565', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xb5f88a7f3994c40b2b2b4d4cf4910cad7c630fdcdea578a36cf99a4338222fb7', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x445f5879b527907e13a17847882db901fa1c89636ce408d12e6a14a0745aa7fd', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x09fb059f6951b7e9018f84dbe0406b837d53ba2a032696ef4f28d493a440f2dd', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x56728cc27ecdac4f5b651326ef51a0ef134ff0af11676e395fdefd177cd10f55', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0xf38dcfc9a67173688e3f5a9032e8c9a5267f07eec18416a294e478150057cb04', from)).toBeTruthy() // t
    // expect(await utils.getL2MessageDeliveredEvent('0x799b38bf07b210b6213ca34b6d0e0fa291f77692e9a1c4a592c8d1f49953308d', from)).toBeTruthy() // f
    // expect(await utils.getL2MessageDeliveredEvent('0x6e5829b402168dabed4d5d012ffbc54872e50365ad3bf1ea564ed2efa8efb045', from)).toBeTruthy() // f
    // expect(await utils.getL2MessageDeliveredEvent('0x396f7a1e52862b3f169e5beef6633c79098a1b3bd900f98a3685c3267f87c915', from)).toBeTruthy() // f
    // expect(await utils.getL2MessageDeliveredEvent('0x923141a239cf6541b5b5f4b421656a49249bcc067df648b1ee1e066feb0799e7', from)).toBeTruthy() // f
    // expect(await utils.getL2MessageDeliveredEvent('0xeb0a17d17abaf6b97af13acf94cac1d91d59897d9fcc7ade113f855947c255a5', from)).toBeTruthy() // f
  }, 5 * 60 * 1000)
})
