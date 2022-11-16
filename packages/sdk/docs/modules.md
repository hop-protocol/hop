# @hop-protocol/sdk

## Table of contents

### Namespaces

- [eventTopics](modules/eventTopics.md)

### Enumerations

- [CanonicalToken](enums/CanonicalToken.md)
- [ChainId](enums/ChainId.md)
- [ChainSlug](enums/ChainSlug.md)
- [HToken](enums/HToken.md)
- [NetworkSlug](enums/NetworkSlug.md)
- [Slug](enums/Slug.md)
- [WrappedToken](enums/WrappedToken.md)

### Classes

- [AMM](classes/AMM.md)
- [Base](classes/Base.md)
- [CanonicalBridge](classes/CanonicalBridge.md)
- [Chain](classes/Chain.md)
- [FallbackProvider](classes/FallbackProvider.md)
- [Hop](classes/Hop.md)
- [HopBridge](classes/HopBridge.md)
- [RelayerFee](classes/RelayerFee.md)
- [RetryProvider](classes/RetryProvider.md)
- [Route](classes/Route.md)
- [Token](classes/Token.md)
- [TokenAmount](classes/TokenAmount.md)
- [TokenModel](classes/TokenModel.md)

### Type Aliases

- [TAmount](modules.md#tamount)
- [TChain](modules.md#tchain)
- [TProvider](modules.md#tprovider)
- [TTime](modules.md#ttime)
- [TTimeSlot](modules.md#ttimeslot)
- [TToken](modules.md#ttoken)
- [TokenSymbol](modules.md#tokensymbol)

## Type Aliases

### <a id="tamount" name="tamount"></a> TAmount

Ƭ **TAmount**: `BigNumberish`

Amount-ish type alias

___

### <a id="tchain" name="tchain"></a> TChain

Ƭ **TChain**: [`Chain`](classes/Chain.md) \| [`ChainSlug`](enums/ChainSlug.md) \| `string`

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

Ƭ **TToken**: [`TokenModel`](classes/TokenModel.md) \| [`TokenSymbol`](modules.md#tokensymbol) \| `string`

Token-ish type

___

### <a id="tokensymbol" name="tokensymbol"></a> TokenSymbol

Ƭ **TokenSymbol**: [`CanonicalToken`](enums/CanonicalToken.md) \| [`WrappedToken`](enums/WrappedToken.md) \| [`HToken`](enums/HToken.md) \| `string`
