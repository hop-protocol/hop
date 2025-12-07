# @hop-protocol/sdk

## Table of contents

### Namespaces

- [Bridge](modules/Bridge.md)
- [GovernorAlpha](modules/GovernorAlpha.md)
- [MockOVM\_CrossDomainMessenger](modules/MockOVM_CrossDomainMessenger.md)
- [Multicall3](modules/Multicall3.md)

### Enumerations

- [CanonicalToken](enums/CanonicalToken.md)
- [ChainId](enums/ChainId.md)
- [ChainName](enums/ChainName.md)
- [ChainSlug](enums/ChainSlug.md)
- [HToken](enums/HToken.md)
- [NetworkSlug](enums/NetworkSlug.md)
- [RpcProviderSlug](enums/RpcProviderSlug.md)
- [Slug](enums/Slug.md)
- [TokenSymbol](enums/TokenSymbol.md)
- [WrappedToken](enums/WrappedToken.md)

### Classes

- [AMM](classes/AMM.md)
- [Accounting\_\_factory](classes/Accounting__factory.md)
- [ArbERC20\_\_factory](classes/ArbERC20__factory.md)
- [ArbitrumGlobalInbox\_\_factory](classes/ArbitrumGlobalInbox__factory.md)
- [ArbitrumMessengerWrapper\_\_factory](classes/ArbitrumMessengerWrapper__factory.md)
- [Arbitrum\_L1\_ERC20\_Bridge\_\_factory](classes/Arbitrum_L1_ERC20_Bridge__factory.md)
- [Arbitrum\_L2\_ERC20\_Bridge\_\_factory](classes/Arbitrum_L2_ERC20_Bridge__factory.md)
- [Base](classes/Base.md)
- [Bridge\_\_factory](classes/Bridge__factory.md)
- [CCTPMessageTransmitter\_\_factory](classes/CCTPMessageTransmitter__factory.md)
- [CCTPTokenMessenger\_\_factory](classes/CCTPTokenMessenger__factory.md)
- [CCTPTokenMinter\_\_factory](classes/CCTPTokenMinter__factory.md)
- [ERC20Burnable\_\_factory](classes/ERC20Burnable__factory.md)
- [ERC20Mintable\_\_factory](classes/ERC20Mintable__factory.md)
- [ERC20\_\_factory](classes/ERC20__factory.md)
- [FallbackProvider](classes/FallbackProvider.md)
- [FxBaseChildTunnel\_\_factory](classes/FxBaseChildTunnel__factory.md)
- [FxBaseRootTunnel\_\_factory](classes/FxBaseRootTunnel__factory.md)
- [GovernorAlpha\_\_factory](classes/GovernorAlpha__factory.md)
- [Hop](classes/Hop.md)
- [HopBridge](classes/HopBridge.md)
- [HopBridgeToken\_\_factory](classes/HopBridgeToken__factory.md)
- [Hop\_\_factory](classes/Hop__factory.md)
- [IAbs\_BaseCrossDomainMessenger\_\_factory](classes/IAbs_BaseCrossDomainMessenger__factory.md)
- [IAllowlist\_\_factory](classes/IAllowlist__factory.md)
- [IArbSys\_\_factory](classes/IArbSys__factory.md)
- [IArbitraryMessageBridge\_\_factory](classes/IArbitraryMessageBridge__factory.md)
- [IBridge\_\_factory](classes/IBridge__factory.md)
- [ICheckpointManager\_\_factory](classes/ICheckpointManager__factory.md)
- [IERC20\_\_factory](classes/IERC20__factory.md)
- [IEthERC20Bridge\_\_factory](classes/IEthERC20Bridge__factory.md)
- [IFlashLoanReceiver\_\_factory](classes/IFlashLoanReceiver__factory.md)
- [IForeignOmniBridge\_\_factory](classes/IForeignOmniBridge__factory.md)
- [IFxMessageProcessor\_\_factory](classes/IFxMessageProcessor__factory.md)
- [IFxStateSender\_\_factory](classes/IFxStateSender__factory.md)
- [IGlobalInbox\_\_factory](classes/IGlobalInbox__factory.md)
- [IInbox\_\_factory](classes/IInbox__factory.md)
- [IMessageProvider\_\_factory](classes/IMessageProvider__factory.md)
- [IMessengerWrapper\_\_factory](classes/IMessengerWrapper__factory.md)
- [IOVM\_BaseCrossDomainMessenger\_\_factory](classes/IOVM_BaseCrossDomainMessenger__factory.md)
- [IOVM\_L1CrossDomainMessenger\_\_factory](classes/IOVM_L1CrossDomainMessenger__factory.md)
- [IOVM\_L2CrossDomainMessenger\_\_factory](classes/IOVM_L2CrossDomainMessenger__factory.md)
- [IOutbox\_\_factory](classes/IOutbox__factory.md)
- [IPolygonFxChild\_\_factory](classes/IPolygonFxChild__factory.md)
- [IRootChainManager\_\_factory](classes/IRootChainManager__factory.md)
- [IStateReceiver\_\_factory](classes/IStateReceiver__factory.md)
- [IStateSender\_\_factory](classes/IStateSender__factory.md)
- [ISwapFlashLoan\_\_factory](classes/ISwapFlashLoan__factory.md)
- [ISwapGuarded\_\_factory](classes/ISwapGuarded__factory.md)
- [ISwap\_\_factory](classes/ISwap__factory.md)
- [IWETH\_\_factory](classes/IWETH__factory.md)
- [I\_L1\_PolygonMessenger\_\_factory](classes/I_L1_PolygonMessenger__factory.md)
- [I\_L2\_PolygonMessengerProxy\_\_factory](classes/I_L2_PolygonMessengerProxy__factory.md)
- [L1\_ArbitrumMessenger\_\_factory](classes/L1_ArbitrumMessenger__factory.md)
- [L1\_Bridge\_\_factory](classes/L1_Bridge__factory.md)
- [L1\_ERC20\_Bridge\_Legacy\_\_factory](classes/L1_ERC20_Bridge_Legacy__factory.md)
- [L1\_ERC20\_Bridge\_\_factory](classes/L1_ERC20_Bridge__factory.md)
- [L1\_ETH\_Bridge\_\_factory](classes/L1_ETH_Bridge__factory.md)
- [L1\_HomeAMBNativeToErc20\_\_factory](classes/L1_HomeAMBNativeToErc20__factory.md)
- [L1\_HopCCTPImplementation\_\_factory](classes/L1_HopCCTPImplementation__factory.md)
- [L1\_OptimismMessenger\_\_factory](classes/L1_OptimismMessenger__factory.md)
- [L1\_OptimismTokenBridge\_\_factory](classes/L1_OptimismTokenBridge__factory.md)
- [L1\_PolygonFxBaseRootTunnel\_\_factory](classes/L1_PolygonFxBaseRootTunnel__factory.md)
- [L1\_PolygonMessenger\_\_factory](classes/L1_PolygonMessenger__factory.md)
- [L1\_PolygonPosRootChainManager\_\_factory](classes/L1_PolygonPosRootChainManager__factory.md)
- [L1\_xDaiAMB\_\_factory](classes/L1_xDaiAMB__factory.md)
- [L1\_xDaiForeignOmniBridge\_\_factory](classes/L1_xDaiForeignOmniBridge__factory.md)
- [L1\_xDaiMessenger\_\_factory](classes/L1_xDaiMessenger__factory.md)
- [L2\_AmmWrapper\_\_factory](classes/L2_AmmWrapper__factory.md)
- [L2\_ArbitrumBridge\_\_factory](classes/L2_ArbitrumBridge__factory.md)
- [L2\_BridgeWrapper\_\_factory](classes/L2_BridgeWrapper__factory.md)
- [L2\_Bridge\_\_factory](classes/L2_Bridge__factory.md)
- [L2\_HopCCTPImplementation\_\_factory](classes/L2_HopCCTPImplementation__factory.md)
- [L2\_OptimismBridge\_\_factory](classes/L2_OptimismBridge__factory.md)
- [L2\_OptimismTokenBridge\_\_factory](classes/L2_OptimismTokenBridge__factory.md)
- [L2\_PolygonBridge\_\_factory](classes/L2_PolygonBridge__factory.md)
- [L2\_PolygonChildERC20\_\_factory](classes/L2_PolygonChildERC20__factory.md)
- [L2\_PolygonMessengerProxy\_\_factory](classes/L2_PolygonMessengerProxy__factory.md)
- [L2\_xDaiAMB\_\_factory](classes/L2_xDaiAMB__factory.md)
- [L2\_xDaiBridge\_\_factory](classes/L2_xDaiBridge__factory.md)
- [L2\_xDaiToken\_\_factory](classes/L2_xDaiToken__factory.md)
- [LPToken\_\_factory](classes/LPToken__factory.md)
- [MathUtils\_\_factory](classes/MathUtils__factory.md)
- [MessengerWrapper\_\_factory](classes/MessengerWrapper__factory.md)
- [MockERC20\_\_factory](classes/MockERC20__factory.md)
- [MockEthERC20Bridge\_\_factory](classes/MockEthERC20Bridge__factory.md)
- [MockForeignOmniBridge\_\_factory](classes/MockForeignOmniBridge__factory.md)
- [MockFxChild\_\_factory](classes/MockFxChild__factory.md)
- [MockFxRoot\_\_factory](classes/MockFxRoot__factory.md)
- [MockMessenger\_\_factory](classes/MockMessenger__factory.md)
- [MockOVM\_CrossDomainMessenger\_\_factory](classes/MockOVM_CrossDomainMessenger__factory.md)
- [MockPolygonMessengerWrapper\_\_factory](classes/MockPolygonMessengerWrapper__factory.md)
- [MockRootChainManager\_\_factory](classes/MockRootChainManager__factory.md)
- [Mock\_Accounting\_\_factory](classes/Mock_Accounting__factory.md)
- [Mock\_Bridge\_\_factory](classes/Mock_Bridge__factory.md)
- [Mock\_L1\_CanonicalBridge\_\_factory](classes/Mock_L1_CanonicalBridge__factory.md)
- [Mock\_L1\_ERC20\_Bridge\_\_factory](classes/Mock_L1_ERC20_Bridge__factory.md)
- [Mock\_L1\_ETH\_Bridge\_\_factory](classes/Mock_L1_ETH_Bridge__factory.md)
- [Mock\_L1\_Messenger\_\_factory](classes/Mock_L1_Messenger__factory.md)
- [Mock\_L1\_PolygonMessenger\_\_factory](classes/Mock_L1_PolygonMessenger__factory.md)
- [Mock\_L1\_xDaiMessenger\_\_factory](classes/Mock_L1_xDaiMessenger__factory.md)
- [Mock\_L2\_ArbitrumBridge\_\_factory](classes/Mock_L2_ArbitrumBridge__factory.md)
- [Mock\_L2\_Messenger\_\_factory](classes/Mock_L2_Messenger__factory.md)
- [Mock\_L2\_OptimismBridge\_\_factory](classes/Mock_L2_OptimismBridge__factory.md)
- [Mock\_L2\_PolygonBridge\_\_factory](classes/Mock_L2_PolygonBridge__factory.md)
- [Mock\_L2\_xDaiBridge\_\_factory](classes/Mock_L2_xDaiBridge__factory.md)
- [Multicall](classes/Multicall.md)
- [Multicall3\_\_factory](classes/Multicall3__factory.md)
- [OVM\_BaseCrossDomainMessenger\_\_factory](classes/OVM_BaseCrossDomainMessenger__factory.md)
- [OVM\_L1\_ERC20\_Bridge\_\_factory](classes/OVM_L1_ERC20_Bridge__factory.md)
- [OVM\_L2\_ERC20\_Bridge\_\_factory](classes/OVM_L2_ERC20_Bridge__factory.md)
- [OptimismMessengerWrapper\_\_factory](classes/OptimismMessengerWrapper__factory.md)
- [OwnableUpgradeable\_\_factory](classes/OwnableUpgradeable__factory.md)
- [Ownable\_\_factory](classes/Ownable__factory.md)
- [OwnerPausableUpgradeable\_\_factory](classes/OwnerPausableUpgradeable__factory.md)
- [PausableUpgradeable\_\_factory](classes/PausableUpgradeable__factory.md)
- [PolygonMessengerWrapper\_\_factory](classes/PolygonMessengerWrapper__factory.md)
- [PriceFeed](classes/PriceFeed.md)
- [PriceFeedFromS3](classes/PriceFeedFromS3.md)
- [RelayerFee](classes/RelayerFee.md)
- [RetryProvider](classes/RetryProvider.md)
- [SaddleLpToken\_\_factory](classes/SaddleLpToken__factory.md)
- [StakingRewardsFactory\_\_factory](classes/StakingRewardsFactory__factory.md)
- [StakingRewards\_\_factory](classes/StakingRewards__factory.md)
- [SwapUtils\_\_factory](classes/SwapUtils__factory.md)
- [Swap\_\_factory](classes/Swap__factory.md)
- [Timelock\_\_factory](classes/Timelock__factory.md)
- [Token](classes/Token.md)
- [TokenModel](classes/TokenModel.md)
- [UniswapQuoterV2\_\_factory](classes/UniswapQuoterV2__factory.md)
- [UniswapV3Pool\_\_factory](classes/UniswapV3Pool__factory.md)
- [WETH9\_\_factory](classes/WETH9__factory.md)
- [WithdrawalProof](classes/WithdrawalProof.md)
- [XDaiMessengerWrapper\_\_factory](classes/XDaiMessengerWrapper__factory.md)

### Interfaces

- [Accounting](interfaces/Accounting.md)
- [ArbERC20](interfaces/ArbERC20.md)
- [ArbitrumGlobalInbox](interfaces/ArbitrumGlobalInbox.md)
- [ArbitrumMessengerWrapper](interfaces/ArbitrumMessengerWrapper.md)
- [Arbitrum\_L1\_ERC20\_Bridge](interfaces/Arbitrum_L1_ERC20_Bridge.md)
- [Arbitrum\_L2\_ERC20\_Bridge](interfaces/Arbitrum_L2_ERC20_Bridge.md)
- [Bridge](interfaces/Bridge-1.md)
- [CCTPMessageTransmitter](interfaces/CCTPMessageTransmitter.md)
- [CCTPTokenMessenger](interfaces/CCTPTokenMessenger.md)
- [CCTPTokenMinter](interfaces/CCTPTokenMinter.md)
- [ERC20](interfaces/ERC20.md)
- [ERC20Burnable](interfaces/ERC20Burnable.md)
- [ERC20Mintable](interfaces/ERC20Mintable.md)
- [FxBaseChildTunnel](interfaces/FxBaseChildTunnel.md)
- [FxBaseRootTunnel](interfaces/FxBaseRootTunnel.md)
- [GovernorAlpha](interfaces/GovernorAlpha-1.md)
- [HopBridgeToken](interfaces/HopBridgeToken.md)
- [IAbs\_BaseCrossDomainMessenger](interfaces/IAbs_BaseCrossDomainMessenger.md)
- [IAllowlist](interfaces/IAllowlist.md)
- [IArbSys](interfaces/IArbSys.md)
- [IArbitraryMessageBridge](interfaces/IArbitraryMessageBridge.md)
- [IBridge](interfaces/IBridge.md)
- [ICheckpointManager](interfaces/ICheckpointManager.md)
- [IERC20](interfaces/IERC20.md)
- [IEthERC20Bridge](interfaces/IEthERC20Bridge.md)
- [IFlashLoanReceiver](interfaces/IFlashLoanReceiver.md)
- [IForeignOmniBridge](interfaces/IForeignOmniBridge.md)
- [IFxMessageProcessor](interfaces/IFxMessageProcessor.md)
- [IFxStateSender](interfaces/IFxStateSender.md)
- [IGlobalInbox](interfaces/IGlobalInbox.md)
- [IInbox](interfaces/IInbox.md)
- [IMessageProvider](interfaces/IMessageProvider.md)
- [IMessengerWrapper](interfaces/IMessengerWrapper.md)
- [IOVM\_BaseCrossDomainMessenger](interfaces/IOVM_BaseCrossDomainMessenger.md)
- [IOVM\_L1CrossDomainMessenger](interfaces/IOVM_L1CrossDomainMessenger.md)
- [IOVM\_L2CrossDomainMessenger](interfaces/IOVM_L2CrossDomainMessenger.md)
- [IOutbox](interfaces/IOutbox.md)
- [IPolygonFxChild](interfaces/IPolygonFxChild.md)
- [IRootChainManager](interfaces/IRootChainManager.md)
- [IStateReceiver](interfaces/IStateReceiver.md)
- [IStateSender](interfaces/IStateSender.md)
- [ISwap](interfaces/ISwap.md)
- [ISwapFlashLoan](interfaces/ISwapFlashLoan.md)
- [ISwapGuarded](interfaces/ISwapGuarded.md)
- [IWETH](interfaces/IWETH.md)
- [I\_L1\_PolygonMessenger](interfaces/I_L1_PolygonMessenger.md)
- [I\_L2\_PolygonMessengerProxy](interfaces/I_L2_PolygonMessengerProxy.md)
- [L1\_ArbitrumMessenger](interfaces/L1_ArbitrumMessenger.md)
- [L1\_Bridge](interfaces/L1_Bridge.md)
- [L1\_ERC20\_Bridge](interfaces/L1_ERC20_Bridge.md)
- [L1\_ERC20\_Bridge\_Legacy](interfaces/L1_ERC20_Bridge_Legacy.md)
- [L1\_ETH\_Bridge](interfaces/L1_ETH_Bridge.md)
- [L1\_HomeAMBNativeToErc20](interfaces/L1_HomeAMBNativeToErc20.md)
- [L1\_HopCCTPImplementation](interfaces/L1_HopCCTPImplementation.md)
- [L1\_OptimismMessenger](interfaces/L1_OptimismMessenger.md)
- [L1\_OptimismTokenBridge](interfaces/L1_OptimismTokenBridge.md)
- [L1\_PolygonFxBaseRootTunnel](interfaces/L1_PolygonFxBaseRootTunnel.md)
- [L1\_PolygonMessenger](interfaces/L1_PolygonMessenger.md)
- [L1\_PolygonPosRootChainManager](interfaces/L1_PolygonPosRootChainManager.md)
- [L1\_xDaiAMB](interfaces/L1_xDaiAMB.md)
- [L1\_xDaiForeignOmniBridge](interfaces/L1_xDaiForeignOmniBridge.md)
- [L1\_xDaiMessenger](interfaces/L1_xDaiMessenger.md)
- [L2\_AmmWrapper](interfaces/L2_AmmWrapper.md)
- [L2\_ArbitrumBridge](interfaces/L2_ArbitrumBridge.md)
- [L2\_Bridge](interfaces/L2_Bridge.md)
- [L2\_BridgeWrapper](interfaces/L2_BridgeWrapper.md)
- [L2\_HopCCTPImplementation](interfaces/L2_HopCCTPImplementation.md)
- [L2\_OptimismBridge](interfaces/L2_OptimismBridge.md)
- [L2\_OptimismTokenBridge](interfaces/L2_OptimismTokenBridge.md)
- [L2\_PolygonBridge](interfaces/L2_PolygonBridge.md)
- [L2\_PolygonChildERC20](interfaces/L2_PolygonChildERC20.md)
- [L2\_PolygonMessengerProxy](interfaces/L2_PolygonMessengerProxy.md)
- [L2\_xDaiAMB](interfaces/L2_xDaiAMB.md)
- [L2\_xDaiBridge](interfaces/L2_xDaiBridge.md)
- [L2\_xDaiToken](interfaces/L2_xDaiToken.md)
- [LPToken](interfaces/LPToken.md)
- [MathUtils](interfaces/MathUtils.md)
- [MessengerWrapper](interfaces/MessengerWrapper.md)
- [MockERC20](interfaces/MockERC20.md)
- [MockEthERC20Bridge](interfaces/MockEthERC20Bridge.md)
- [MockForeignOmniBridge](interfaces/MockForeignOmniBridge.md)
- [MockFxChild](interfaces/MockFxChild.md)
- [MockFxRoot](interfaces/MockFxRoot.md)
- [MockMessenger](interfaces/MockMessenger.md)
- [MockOVM\_CrossDomainMessenger](interfaces/MockOVM_CrossDomainMessenger-1.md)
- [MockPolygonMessengerWrapper](interfaces/MockPolygonMessengerWrapper.md)
- [MockRootChainManager](interfaces/MockRootChainManager.md)
- [Mock\_Accounting](interfaces/Mock_Accounting.md)
- [Mock\_Bridge](interfaces/Mock_Bridge.md)
- [Mock\_L1\_CanonicalBridge](interfaces/Mock_L1_CanonicalBridge.md)
- [Mock\_L1\_ERC20\_Bridge](interfaces/Mock_L1_ERC20_Bridge.md)
- [Mock\_L1\_ETH\_Bridge](interfaces/Mock_L1_ETH_Bridge.md)
- [Mock\_L1\_Messenger](interfaces/Mock_L1_Messenger.md)
- [Mock\_L1\_PolygonMessenger](interfaces/Mock_L1_PolygonMessenger.md)
- [Mock\_L1\_xDaiMessenger](interfaces/Mock_L1_xDaiMessenger.md)
- [Mock\_L2\_ArbitrumBridge](interfaces/Mock_L2_ArbitrumBridge.md)
- [Mock\_L2\_Messenger](interfaces/Mock_L2_Messenger.md)
- [Mock\_L2\_OptimismBridge](interfaces/Mock_L2_OptimismBridge.md)
- [Mock\_L2\_PolygonBridge](interfaces/Mock_L2_PolygonBridge.md)
- [Mock\_L2\_xDaiBridge](interfaces/Mock_L2_xDaiBridge.md)
- [Multicall3](interfaces/Multicall3-1.md)
- [OVM\_BaseCrossDomainMessenger](interfaces/OVM_BaseCrossDomainMessenger.md)
- [OVM\_L1\_ERC20\_Bridge](interfaces/OVM_L1_ERC20_Bridge.md)
- [OVM\_L2\_ERC20\_Bridge](interfaces/OVM_L2_ERC20_Bridge.md)
- [OptimismMessengerWrapper](interfaces/OptimismMessengerWrapper.md)
- [Ownable](interfaces/Ownable.md)
- [OwnableUpgradeable](interfaces/OwnableUpgradeable.md)
- [OwnerPausableUpgradeable](interfaces/OwnerPausableUpgradeable.md)
- [PausableUpgradeable](interfaces/PausableUpgradeable.md)
- [PolygonMessengerWrapper](interfaces/PolygonMessengerWrapper.md)
- [SaddleLpToken](interfaces/SaddleLpToken.md)
- [StakingRewards](interfaces/StakingRewards.md)
- [StakingRewardsFactory](interfaces/StakingRewardsFactory.md)
- [Swap](interfaces/Swap.md)
- [SwapUtils](interfaces/SwapUtils.md)
- [Timelock](interfaces/Timelock.md)
- [UniswapQuoterV2](interfaces/UniswapQuoterV2.md)
- [UniswapV3Pool](interfaces/UniswapV3Pool.md)
- [WETH9](interfaces/WETH9.md)
- [XDaiMessengerWrapper](interfaces/XDaiMessengerWrapper.md)

### Type Aliases

- [Bps](modules.md#bps)
- [Chain](modules.md#chain)
- [Network](modules.md#network)
- [PriceFeedApiKeys](modules.md#pricefeedapikeys)
- [RpcProvider](modules.md#rpcprovider)
- [TAmount](modules.md#tamount)
- [TChain](modules.md#tchain)
- [TProvider](modules.md#tprovider)
- [TTime](modules.md#ttime)
- [TTimeSlot](modules.md#ttimeslot)
- [TToken](modules.md#ttoken)

### Variables

- [eventTopics](modules.md#eventtopics)
- [rpcProviders](modules.md#rpcproviders)
- [sdkConfig](modules.md#sdkconfig)

### Functions

- [fetchJsonOrThrow](modules.md#fetchjsonorthrow)
- [getBlockNumberFromDate](modules.md#getblocknumberfromdate)
- [getCctpDomain](modules.md#getcctpdomain)
- [getChain](modules.md#getchain)
- [getChainNativeTokenSymbol](modules.md#getchainnativetokensymbol)
- [getChainSlug](modules.md#getchainslug)
- [getChainSlugFromName](modules.md#getchainslugfromname)
- [getChains](modules.md#getchains)
- [getLpFeeBps](modules.md#getlpfeebps)
- [getMinGasLimit](modules.md#getmingaslimit)
- [getMinGasPrice](modules.md#getmingasprice)
- [getNetwork](modules.md#getnetwork)
- [getNetworks](modules.md#getnetworks)
- [getProviderFromUrl](modules.md#getproviderfromurl)
- [getSlugFromChainId](modules.md#getslugfromchainid)
- [getSubgraphChains](modules.md#getsubgraphchains)
- [getSubgraphUrl](modules.md#getsubgraphurl)
- [getToken](modules.md#gettoken)
- [getTokenDecimals](modules.md#gettokendecimals)
- [getTokens](modules.md#gettokens)
- [getUSDCSwapParams](modules.md#getusdcswapparams)
- [getUrlFromProvider](modules.md#geturlfromprovider)
- [isValidChainSlug](modules.md#isvalidchainslug)
- [isValidNetworkSlug](modules.md#isvalidnetworkslug)
- [isValidTokenSymbol](modules.md#isvalidtokensymbol)
- [promiseQueue](modules.md#promisequeue)
- [promiseTimeout](modules.md#promisetimeout)
- [rateLimitRetry](modules.md#ratelimitretry)
- [serializeQueryParams](modules.md#serializequeryparams)
- [shiftBNDecimals](modules.md#shiftbndecimals)
- [wait](modules.md#wait)

## Type Aliases

### <a id="bps" name="bps"></a> Bps

Ƭ **Bps**: \{ [key in ChainSlug]: number }

___

### <a id="chain" name="chain"></a> Chain

Ƭ **Chain**: `SharedChain` & \{ `chainId`: `string` ; `etherscanApiUrl`: `string` ; `explorerUrls`: `string`[] ; `fallbackPublicRpcUrls`: `string`[] ; `multicall`: `string` ; `parentChainId`: `string` ; `publicRpcUrl`: `string` ; `subgraphUrl`: `string` ; `txOverrides`: \{ `minGasLimit?`: `number` ; `minGasPrice?`: `number`  }  }

___

### <a id="network" name="network"></a> Network

Ƭ **Network**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chains` | `Chains` |
| `isMainnet` | `boolean` |
| `slug` | `NetworkSlug` |

___

### <a id="pricefeedapikeys" name="pricefeedapikeys"></a> PriceFeedApiKeys

Ƭ **PriceFeedApiKeys**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `coingecko?` | `string` |

___

### <a id="rpcprovider" name="rpcprovider"></a> RpcProvider

Ƭ **RpcProvider**: \{ readonly [key in RpcProviderSlug]: Object }

___

### <a id="tamount" name="tamount"></a> TAmount

Ƭ **TAmount**: `BigNumberish`

Amount-ish type alias

___

### <a id="tchain" name="tchain"></a> TChain

Ƭ **TChain**: `Chain` \| [`ChainSlug`](enums/ChainSlug.md) \| `string`

Chain-ish type

___

### <a id="tprovider" name="tprovider"></a> TProvider

Ƭ **TProvider**: `Signer` \| `providers.Provider`

Signer-ish type

___

### <a id="ttime" name="ttime"></a> TTime

Ƭ **TTime**: `BigNumberish`

Time-ish type alias

___

### <a id="ttimeslot" name="ttimeslot"></a> TTimeSlot

Ƭ **TTimeSlot**: `BigNumberish`

TimeSlot-ish type alias

___

### <a id="ttoken" name="ttoken"></a> TToken

Ƭ **TToken**: [`TokenModel`](classes/TokenModel.md) \| `TokenSymbol` \| `string`

Token-ish type

## Variables

### <a id="eventtopics" name="eventtopics"></a> eventTopics

• `Const` **eventTopics**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `tokenTransferTopic` | `string` |
| `tokensBridgedTopic` | `string` |
| `transferFromL1CompletedTopic` | `string` |
| `transferSentToL2Topic` | `string` |
| `transferSentTopic` | `string` |
| `withdrawalBondedTopic` | `string` |

___

### <a id="rpcproviders" name="rpcproviders"></a> rpcProviders

• `Const` **rpcProviders**: [`RpcProvider`](modules.md#rpcprovider)

___

### <a id="sdkconfig" name="sdkconfig"></a> sdkConfig

• `Const` **sdkConfig**: `any` = `{}`

## Functions

### <a id="fetchjsonorthrow" name="fetchjsonorthrow"></a> fetchJsonOrThrow

▸ **fetchJsonOrThrow**(`url`, `timeoutMs?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `timeoutMs` | `number` |

#### Returns

`Promise`\<`any`\>

___

### <a id="getblocknumberfromdate" name="getblocknumberfromdate"></a> getBlockNumberFromDate

▸ **getBlockNumberFromDate**(`provider`, `timestamp`, `etherscanApiKey?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `Provider` |
| `timestamp` | `number` |
| `etherscanApiKey?` | `string` |

#### Returns

`Promise`\<`number`\>

___

### <a id="getcctpdomain" name="getcctpdomain"></a> getCctpDomain

▸ **getCctpDomain**(`chainSlug`): `number` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainSlug` | `string` |

#### Returns

`number` \| ``null``

___

### <a id="getchain" name="getchain"></a> getChain

▸ **getChain**(`chainId`): [`Chain`](modules.md#chain)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |

#### Returns

[`Chain`](modules.md#chain)

▸ **getChain**(`networkSlug`, `chainSlug`): [`Chain`](modules.md#chain)

#### Parameters

| Name | Type |
| :------ | :------ |
| `networkSlug` | `NetworkSlug` |
| `chainSlug` | `ChainSlug` |

#### Returns

[`Chain`](modules.md#chain)

___

### <a id="getchainnativetokensymbol" name="getchainnativetokensymbol"></a> getChainNativeTokenSymbol

▸ **getChainNativeTokenSymbol**(`chainIdOrNetworkSlug`, `chainSlug?`): `TokenSymbol`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIdOrNetworkSlug` | `string` |
| `chainSlug?` | `ChainSlug` |

#### Returns

`TokenSymbol`

___

### <a id="getchainslug" name="getchainslug"></a> getChainSlug

▸ **getChainSlug**(`chainIdOrNetworkSlug`, `chainSlug?`): `ChainSlug`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainIdOrNetworkSlug` | `string` |
| `chainSlug?` | `ChainSlug` |

#### Returns

`ChainSlug`

___

### <a id="getchainslugfromname" name="getchainslugfromname"></a> getChainSlugFromName

▸ **getChainSlugFromName**(`name`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`

___

### <a id="getchains" name="getchains"></a> getChains

▸ **getChains**(`networkSlug`): [`Chain`](modules.md#chain)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `networkSlug` | `NetworkSlug` |

#### Returns

[`Chain`](modules.md#chain)[]

___

### <a id="getlpfeebps" name="getlpfeebps"></a> getLpFeeBps

▸ **getLpFeeBps**(`chain`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chain` | `Chain` |

#### Returns

`BigNumber`

___

### <a id="getmingaslimit" name="getmingaslimit"></a> getMinGasLimit

▸ **getMinGasLimit**(`network`, `chain`): `number` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `NetworkSlug` |
| `chain` | `ChainSlug` |

#### Returns

`number` \| `undefined`

___

### <a id="getmingasprice" name="getmingasprice"></a> getMinGasPrice

▸ **getMinGasPrice**(`network`, `chain`): `number` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `NetworkSlug` |
| `chain` | `ChainSlug` |

#### Returns

`number` \| `undefined`

___

### <a id="getnetwork" name="getnetwork"></a> getNetwork

▸ **getNetwork**(`networkSlug`): [`Network`](modules.md#network)

Main methods to be consumed

#### Parameters

| Name | Type |
| :------ | :------ |
| `networkSlug` | `NetworkSlug` |

#### Returns

[`Network`](modules.md#network)

___

### <a id="getnetworks" name="getnetworks"></a> getNetworks

▸ **getNetworks**(): [`Network`](modules.md#network)[]

#### Returns

[`Network`](modules.md#network)[]

___

### <a id="getproviderfromurl" name="getproviderfromurl"></a> getProviderFromUrl

▸ **getProviderFromUrl**(`rpcUrl`): `providers.Provider`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rpcUrl` | `string` \| `string`[] |

#### Returns

`providers.Provider`

___

### <a id="getslugfromchainid" name="getslugfromchainid"></a> getSlugFromChainId

▸ **getSlugFromChainId**(`chainId`): `ChainSlug`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chainId` | `string` |

#### Returns

`ChainSlug`

___

### <a id="getsubgraphchains" name="getsubgraphchains"></a> getSubgraphChains

▸ **getSubgraphChains**(`network`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |

#### Returns

`string`[]

___

### <a id="getsubgraphurl" name="getsubgraphurl"></a> getSubgraphUrl

▸ **getSubgraphUrl**(`networkSlug`, `chainSlug`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `networkSlug` | `string` |
| `chainSlug` | `string` |

#### Returns

`string`

___

### <a id="gettoken" name="gettoken"></a> getToken

▸ **getToken**(`symbol`): `Token`

Main methods to be consumed

#### Parameters

| Name | Type |
| :------ | :------ |
| `symbol` | [`TokenSymbol`](enums/TokenSymbol.md) |

#### Returns

`Token`

___

### <a id="gettokendecimals" name="gettokendecimals"></a> getTokenDecimals

▸ **getTokenDecimals**(`symbol`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `symbol` | [`TokenSymbol`](enums/TokenSymbol.md) |

#### Returns

`number`

___

### <a id="gettokens" name="gettokens"></a> getTokens

▸ **getTokens**(): `Token`[]

#### Returns

`Token`[]

___

### <a id="getusdcswapparams" name="getusdcswapparams"></a> getUSDCSwapParams

▸ **getUSDCSwapParams**(`options`): `Promise`\<\{ `quotedAmountOut`: `any` ; `quotedAmountOutFormatted`: `any` ; `swapParams`: \{ `amounting, amount in`: `string` ; `amountOutMinimum`: `string` ; `path`: `string` ; `recipient`: `any` = recipient }  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`Promise`\<\{ `quotedAmountOut`: `any` ; `quotedAmountOutFormatted`: `any` ; `swapParams`: \{ `amounting, amount in`: `string` ; `amountOutMinimum`: `string` ; `path`: `string` ; `recipient`: `any` = recipient }  }\>

___

### <a id="geturlfromprovider" name="geturlfromprovider"></a> getUrlFromProvider

▸ **getUrlFromProvider**(`providerOrUrl`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerOrUrl` | `string` \| `Provider` |

#### Returns

`string`

___

### <a id="isvalidchainslug" name="isvalidchainslug"></a> isValidChainSlug

▸ **isValidChainSlug**(`slug`): slug is ChainSlug

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

slug is ChainSlug

___

### <a id="isvalidnetworkslug" name="isvalidnetworkslug"></a> isValidNetworkSlug

▸ **isValidNetworkSlug**(`slug`): slug is NetworkSlug

#### Parameters

| Name | Type |
| :------ | :------ |
| `slug` | `string` |

#### Returns

slug is NetworkSlug

___

### <a id="isvalidtokensymbol" name="isvalidtokensymbol"></a> isValidTokenSymbol

▸ **isValidTokenSymbol**(`symbol`): symbol is TokenSymbol

#### Parameters

| Name | Type |
| :------ | :------ |
| `symbol` | `string` |

#### Returns

symbol is TokenSymbol

___

### <a id="promisequeue" name="promisequeue"></a> promiseQueue

▸ **promiseQueue**(`items`, `cb`, `options`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `items` | `any`[] |
| `cb` | `any` |
| `options` | `Options` |

#### Returns

`Promise`\<`void`\>

___

### <a id="promisetimeout" name="promisetimeout"></a> promiseTimeout

▸ **promiseTimeout**\<`T`\>(`promise`, `timeout`): `Promise`\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`\<`T`\> |
| `timeout` | `number` |

#### Returns

`Promise`\<`T`\>

___

### <a id="ratelimitretry" name="ratelimitretry"></a> rateLimitRetry

▸ **rateLimitRetry**\<`FN`\>(`fn`): (...`args`: `Parameters`\<`FN`\>) => `Promise`\<`Awaited`\<`ReturnType`\<`FN`\>\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `FN` | extends (...`args`: `any`[]) => `Promise`\<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | `FN` |

#### Returns

`fn`

▸ (`...args`): `Promise`\<`Awaited`\<`ReturnType`\<`FN`\>\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `Parameters`\<`FN`\> |

##### Returns

`Promise`\<`Awaited`\<`ReturnType`\<`FN`\>\>\>

___

### <a id="serializequeryparams" name="serializequeryparams"></a> serializeQueryParams

▸ **serializeQueryParams**(`params`, `options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |
| `options` | `Partial`\<`IOptions`\> |

#### Returns

`string`

___

### <a id="shiftbndecimals" name="shiftbndecimals"></a> shiftBNDecimals

▸ **shiftBNDecimals**(`bn`, `shiftAmount`): `BigNumber`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bn` | `BigNumber` |
| `shiftAmount` | `number` |

#### Returns

`BigNumber`

___

### <a id="wait" name="wait"></a> wait

▸ **wait**(`t`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `t` | `number` |

#### Returns

`Promise`\<`unknown`\>
