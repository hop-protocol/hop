# Interface: L2\_xDaiToken

## Hierarchy

- `BaseContract`

  ↳ **`L2_xDaiToken`**

## Table of contents

### Properties

- [callStatic](L2_xDaiToken.md#callstatic)
- [estimateGas](L2_xDaiToken.md#estimategas)
- [filters](L2_xDaiToken.md#filters)
- [functions](L2_xDaiToken.md#functions)
- [interface](L2_xDaiToken.md#interface)
- [off](L2_xDaiToken.md#off)
- [on](L2_xDaiToken.md#on)
- [once](L2_xDaiToken.md#once)
- [populateTransaction](L2_xDaiToken.md#populatetransaction)
- [removeListener](L2_xDaiToken.md#removelistener)

### Methods

- [DOMAIN\_SEPARATOR](L2_xDaiToken.md#domain_separator)
- [PERMIT\_TYPEHASH](L2_xDaiToken.md#permit_typehash)
- [allowance](L2_xDaiToken.md#allowance)
- [approve](L2_xDaiToken.md#approve)
- [attach](L2_xDaiToken.md#attach)
- [balanceOf](L2_xDaiToken.md#balanceof)
- [bridgeContract](L2_xDaiToken.md#bridgecontract)
- [burn](L2_xDaiToken.md#burn)
- [claimTokens](L2_xDaiToken.md#claimtokens)
- [connect](L2_xDaiToken.md#connect)
- [decimals](L2_xDaiToken.md#decimals)
- [decreaseAllowance](L2_xDaiToken.md#decreaseallowance)
- [decreaseApproval](L2_xDaiToken.md#decreaseapproval)
- [deployed](L2_xDaiToken.md#deployed)
- [expirations](L2_xDaiToken.md#expirations)
- [finishMinting](L2_xDaiToken.md#finishminting)
- [getTokenInterfacesVersion](L2_xDaiToken.md#gettokeninterfacesversion)
- [increaseAllowance](L2_xDaiToken.md#increaseallowance)
- [increaseApproval](L2_xDaiToken.md#increaseapproval)
- [isBridge](L2_xDaiToken.md#isbridge)
- [listeners](L2_xDaiToken.md#listeners)
- [mint](L2_xDaiToken.md#mint)
- [mintingFinished](L2_xDaiToken.md#mintingfinished)
- [move](L2_xDaiToken.md#move)
- [name](L2_xDaiToken.md#name)
- [nonces](L2_xDaiToken.md#nonces)
- [owner](L2_xDaiToken.md#owner)
- [permit](L2_xDaiToken.md#permit)
- [pull](L2_xDaiToken.md#pull)
- [push](L2_xDaiToken.md#push)
- [queryFilter](L2_xDaiToken.md#queryfilter)
- [removeAllListeners](L2_xDaiToken.md#removealllisteners)
- [renounceOwnership](L2_xDaiToken.md#renounceownership)
- [setBridgeContract](L2_xDaiToken.md#setbridgecontract)
- [symbol](L2_xDaiToken.md#symbol)
- [totalSupply](L2_xDaiToken.md#totalsupply)
- [transfer](L2_xDaiToken.md#transfer)
- [transferAndCall](L2_xDaiToken.md#transferandcall)
- [transferFrom](L2_xDaiToken.md#transferfrom)
- [transferOwnership](L2_xDaiToken.md#transferownership)
- [version](L2_xDaiToken.md#version)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DOMAIN_SEPARATOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `PERMIT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `allowance` | (`_owner`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`_spender`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `balanceOf` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `burn` | (`_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `decreaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `expirations` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `finishMinting` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `getTokenInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `increaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `isBridge` | (`_address`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `mint` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `mintingFinished` | (`overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `move` | (`_from`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `nonces` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `permit` | (`_holder`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `_nonce`: `PromiseOrValue`\<`BigNumberish`\>, `_expiry`: `PromiseOrValue`\<`BigNumberish`\>, `_allowed`: `PromiseOrValue`\<`boolean`\>, `_v`: `PromiseOrValue`\<`BigNumberish`\>, `_r`: `PromiseOrValue`\<`BytesLike`\>, `_s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `pull` | (`_from`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `push` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `renounceOwnership` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferAndCall` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferFrom` | (`_sender`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferOwnership` | (`_newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DOMAIN_SEPARATOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `PERMIT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `allowance` | (`_owner`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`_spender`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `balanceOf` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `burn` | (`_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `decreaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `expirations` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `finishMinting` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getTokenInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `increaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `isBridge` | (`_address`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `mint` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `mintingFinished` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `move` | (`_from`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `nonces` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `permit` | (`_holder`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `_nonce`: `PromiseOrValue`\<`BigNumberish`\>, `_expiry`: `PromiseOrValue`\<`BigNumberish`\>, `_allowed`: `PromiseOrValue`\<`boolean`\>, `_v`: `PromiseOrValue`\<`BigNumberish`\>, `_r`: `PromiseOrValue`\<`BytesLike`\>, `_s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `pull` | (`_from`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `push` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferAndCall` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferFrom` | (`_sender`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferOwnership` | (`_newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Approval` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `spender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `ApprovalEventFilter` |
| `Approval(address,address,uint256)` | (`owner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `spender?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `ApprovalEventFilter` |
| `Burn` | (`burner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `BurnEventFilter` |
| `Burn(address,uint256)` | (`burner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `BurnEventFilter` |
| `ContractFallbackCallFailed` | (`from?`: ``null``, `to?`: ``null``, `value?`: ``null``) => `ContractFallbackCallFailedEventFilter` |
| `ContractFallbackCallFailed(address,address,uint256)` | (`from?`: ``null``, `to?`: ``null``, `value?`: ``null``) => `ContractFallbackCallFailedEventFilter` |
| `Mint` | (`to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `MintEventFilter` |
| `Mint(address,uint256)` | (`to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `amount?`: ``null``) => `MintEventFilter` |
| `MintFinished` | () => `MintFinishedEventFilter` |
| `MintFinished()` | () => `MintFinishedEventFilter` |
| `OwnershipRenounced` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipRenouncedEventFilter` |
| `OwnershipRenounced(address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipRenouncedEventFilter` |
| `OwnershipTransferred` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `OwnershipTransferred(address,address)` | (`previousOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>, `newOwner?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `OwnershipTransferredEventFilter` |
| `Transfer(address,address,uint256)` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `Transfer_address_address_uint256_EventFilter` |
| `Transfer(address,address,uint256,bytes)` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``, `data?`: ``null``) => `Transfer_address_address_uint256_bytes_EventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DOMAIN_SEPARATOR` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `PERMIT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `allowance` | (`_owner`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `approve` | (`_spender`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `balanceOf` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `burn` | (`_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `decreaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `expirations` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `finishMinting` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getTokenInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `increaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `isBridge` | (`_address`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `mint` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `mintingFinished` | (`overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `move` | (`_from`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `nonces` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `permit` | (`_holder`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `_nonce`: `PromiseOrValue`\<`BigNumberish`\>, `_expiry`: `PromiseOrValue`\<`BigNumberish`\>, `_allowed`: `PromiseOrValue`\<`boolean`\>, `_v`: `PromiseOrValue`\<`BigNumberish`\>, `_r`: `PromiseOrValue`\<`BytesLike`\>, `_s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `pull` | (`_from`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `push` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transfer` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferAndCall` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferFrom` | (`_sender`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferOwnership` | (`_newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_xDaiTokenInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DOMAIN_SEPARATOR` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `PERMIT_TYPEHASH` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `allowance` | (`_owner`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `approve` | (`_spender`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `balanceOf` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `bridgeContract` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `burn` | (`_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `claimTokens` | (`_token`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `decreaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `expirations` | (`arg0`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `finishMinting` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getTokenInterfacesVersion` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `increaseApproval` | (`_spender`: `PromiseOrValue`\<`string`\>, `_addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `isBridge` | (`_address`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `mint` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `mintingFinished` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `move` | (`_from`: `PromiseOrValue`\<`string`\>, `_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `nonces` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `owner` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `permit` | (`_holder`: `PromiseOrValue`\<`string`\>, `_spender`: `PromiseOrValue`\<`string`\>, `_nonce`: `PromiseOrValue`\<`BigNumberish`\>, `_expiry`: `PromiseOrValue`\<`BigNumberish`\>, `_allowed`: `PromiseOrValue`\<`boolean`\>, `_v`: `PromiseOrValue`\<`BigNumberish`\>, `_r`: `PromiseOrValue`\<`BytesLike`\>, `_s`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `pull` | (`_from`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `push` | (`_to`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `renounceOwnership` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setBridgeContract` | (`_bridgeContract`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transfer` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferAndCall` | (`_to`: `PromiseOrValue`\<`string`\>, `_value`: `PromiseOrValue`\<`BigNumberish`\>, `_data`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferFrom` | (`_sender`: `PromiseOrValue`\<`string`\>, `_recipient`: `PromiseOrValue`\<`string`\>, `_amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferOwnership` | (`_newOwner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `version` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="domain_separator" name="domain_separator"></a> DOMAIN\_SEPARATOR

▸ **DOMAIN_SEPARATOR**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="permit_typehash" name="permit_typehash"></a> PERMIT\_TYPEHASH

▸ **PERMIT_TYPEHASH**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="allowance" name="allowance"></a> allowance

▸ **allowance**(`_owner`, `_spender`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `_spender` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="approve" name="approve"></a> approve

▸ **approve**(`_spender`, `_value`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_spender` | `PromiseOrValue`\<`string`\> |
| `_value` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="attach" name="attach"></a> attach

▸ **attach**(`addressOrName`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `addressOrName` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.attach

___

### <a id="balanceof" name="balanceof"></a> balanceOf

▸ **balanceOf**(`_owner`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="bridgecontract" name="bridgecontract"></a> bridgeContract

▸ **bridgeContract**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="burn" name="burn"></a> burn

▸ **burn**(`_value`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_value` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="claimtokens" name="claimtokens"></a> claimTokens

▸ **claimTokens**(`_token`, `_to`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_token` | `PromiseOrValue`\<`string`\> |
| `_to` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="connect" name="connect"></a> connect

▸ **connect**(`signerOrProvider`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerOrProvider` | `string` \| `Provider` \| `Signer` |

#### Returns

`this`

#### Overrides

BaseContract.connect

___

### <a id="decimals" name="decimals"></a> decimals

▸ **decimals**(`overrides?`): `Promise`\<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`number`\>

___

### <a id="decreaseallowance" name="decreaseallowance"></a> decreaseAllowance

▸ **decreaseAllowance**(`spender`, `subtractedValue`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spender` | `PromiseOrValue`\<`string`\> |
| `subtractedValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="decreaseapproval" name="decreaseapproval"></a> decreaseApproval

▸ **decreaseApproval**(`_spender`, `_subtractedValue`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_spender` | `PromiseOrValue`\<`string`\> |
| `_subtractedValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Returns

`Promise`\<[`L2_xDaiToken`](L2_xDaiToken.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="expirations" name="expirations"></a> expirations

▸ **expirations**(`arg0`, `arg1`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `arg1` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="finishminting" name="finishminting"></a> finishMinting

▸ **finishMinting**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="gettokeninterfacesversion" name="gettokeninterfacesversion"></a> getTokenInterfacesVersion

▸ **getTokenInterfacesVersion**(`overrides?`): `Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<[`BigNumber`, `BigNumber`, `BigNumber`] & \{ `major`: `BigNumber` ; `minor`: `BigNumber` ; `patch`: `BigNumber`  }\>

___

### <a id="increaseallowance" name="increaseallowance"></a> increaseAllowance

▸ **increaseAllowance**(`spender`, `addedValue`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spender` | `PromiseOrValue`\<`string`\> |
| `addedValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="increaseapproval" name="increaseapproval"></a> increaseApproval

▸ **increaseApproval**(`_spender`, `_addedValue`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_spender` | `PromiseOrValue`\<`string`\> |
| `_addedValue` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="isbridge" name="isbridge"></a> isBridge

▸ **isBridge**(`_address`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_address` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="listeners" name="listeners"></a> listeners

▸ **listeners**\<`TEvent`\>(`eventFilter?`): `TypedListener`\<`TEvent`\>[]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter?` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`TypedListener`\<`TEvent`\>[]

#### Overrides

BaseContract.listeners

▸ **listeners**(`eventName?`): `Listener`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`Listener`[]

#### Overrides

BaseContract.listeners

___

### <a id="mint" name="mint"></a> mint

▸ **mint**(`_to`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_to` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="mintingfinished" name="mintingfinished"></a> mintingFinished

▸ **mintingFinished**(`overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

___

### <a id="move" name="move"></a> move

▸ **move**(`_from`, `_to`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_from` | `PromiseOrValue`\<`string`\> |
| `_to` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="name" name="name"></a> name

▸ **name**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="nonces" name="nonces"></a> nonces

▸ **nonces**(`arg0`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="owner" name="owner"></a> owner

▸ **owner**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="permit" name="permit"></a> permit

▸ **permit**(`_holder`, `_spender`, `_nonce`, `_expiry`, `_allowed`, `_v`, `_r`, `_s`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_holder` | `PromiseOrValue`\<`string`\> |
| `_spender` | `PromiseOrValue`\<`string`\> |
| `_nonce` | `PromiseOrValue`\<`BigNumberish`\> |
| `_expiry` | `PromiseOrValue`\<`BigNumberish`\> |
| `_allowed` | `PromiseOrValue`\<`boolean`\> |
| `_v` | `PromiseOrValue`\<`BigNumberish`\> |
| `_r` | `PromiseOrValue`\<`BytesLike`\> |
| `_s` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="pull" name="pull"></a> pull

▸ **pull**(`_from`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_from` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="push" name="push"></a> push

▸ **push**(`_to`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_to` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="queryfilter" name="queryfilter"></a> queryFilter

▸ **queryFilter**\<`TEvent`\>(`event`, `fromBlockOrBlockhash?`, `toBlock?`): `Promise`\<`TEvent`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `TypedEventFilter`\<`TEvent`\> |
| `fromBlockOrBlockhash?` | `string` \| `number` |
| `toBlock?` | `string` \| `number` |

#### Returns

`Promise`\<`TEvent`[]\>

#### Overrides

BaseContract.queryFilter

___

### <a id="removealllisteners" name="removealllisteners"></a> removeAllListeners

▸ **removeAllListeners**\<`TEvent`\>(`eventFilter`): `this`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TEvent` | extends `TypedEvent`\<`any`, `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventFilter` | `TypedEventFilter`\<`TEvent`\> |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

▸ **removeAllListeners**(`eventName?`): `this`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName?` | `string` |

#### Returns

`this`

#### Overrides

BaseContract.removeAllListeners

___

### <a id="renounceownership" name="renounceownership"></a> renounceOwnership

▸ **renounceOwnership**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setbridgecontract" name="setbridgecontract"></a> setBridgeContract

▸ **setBridgeContract**(`_bridgeContract`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_bridgeContract` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="symbol" name="symbol"></a> symbol

▸ **symbol**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="totalsupply" name="totalsupply"></a> totalSupply

▸ **totalSupply**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="transfer" name="transfer"></a> transfer

▸ **transfer**(`_to`, `_value`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_to` | `PromiseOrValue`\<`string`\> |
| `_value` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferandcall" name="transferandcall"></a> transferAndCall

▸ **transferAndCall**(`_to`, `_value`, `_data`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_to` | `PromiseOrValue`\<`string`\> |
| `_value` | `PromiseOrValue`\<`BigNumberish`\> |
| `_data` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferfrom" name="transferfrom"></a> transferFrom

▸ **transferFrom**(`_sender`, `_recipient`, `_amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_sender` | `PromiseOrValue`\<`string`\> |
| `_recipient` | `PromiseOrValue`\<`string`\> |
| `_amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferownership" name="transferownership"></a> transferOwnership

▸ **transferOwnership**(`_newOwner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_newOwner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="version" name="version"></a> version

▸ **version**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
