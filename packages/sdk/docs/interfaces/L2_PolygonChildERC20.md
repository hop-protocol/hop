# Interface: L2\_PolygonChildERC20

## Hierarchy

- `BaseContract`

  ↳ **`L2_PolygonChildERC20`**

## Table of contents

### Properties

- [callStatic](L2_PolygonChildERC20.md#callstatic)
- [estimateGas](L2_PolygonChildERC20.md#estimategas)
- [filters](L2_PolygonChildERC20.md#filters)
- [functions](L2_PolygonChildERC20.md#functions)
- [interface](L2_PolygonChildERC20.md#interface)
- [off](L2_PolygonChildERC20.md#off)
- [on](L2_PolygonChildERC20.md#on)
- [once](L2_PolygonChildERC20.md#once)
- [populateTransaction](L2_PolygonChildERC20.md#populatetransaction)
- [removeListener](L2_PolygonChildERC20.md#removelistener)

### Methods

- [CHILD\_CHAIN\_ID](L2_PolygonChildERC20.md#child_chain_id)
- [CHILD\_CHAIN\_ID\_BYTES](L2_PolygonChildERC20.md#child_chain_id_bytes)
- [DEFAULT\_ADMIN\_ROLE](L2_PolygonChildERC20.md#default_admin_role)
- [DEPOSITOR\_ROLE](L2_PolygonChildERC20.md#depositor_role)
- [ERC712\_VERSION](L2_PolygonChildERC20.md#erc712_version)
- [ROOT\_CHAIN\_ID](L2_PolygonChildERC20.md#root_chain_id)
- [ROOT\_CHAIN\_ID\_BYTES](L2_PolygonChildERC20.md#root_chain_id_bytes)
- [allowance](L2_PolygonChildERC20.md#allowance)
- [approve](L2_PolygonChildERC20.md#approve)
- [attach](L2_PolygonChildERC20.md#attach)
- [balanceOf](L2_PolygonChildERC20.md#balanceof)
- [connect](L2_PolygonChildERC20.md#connect)
- [decimals](L2_PolygonChildERC20.md#decimals)
- [decreaseAllowance](L2_PolygonChildERC20.md#decreaseallowance)
- [deployed](L2_PolygonChildERC20.md#deployed)
- [deposit](L2_PolygonChildERC20.md#deposit)
- [executeMetaTransaction](L2_PolygonChildERC20.md#executemetatransaction)
- [getChainId](L2_PolygonChildERC20.md#getchainid)
- [getDomainSeperator](L2_PolygonChildERC20.md#getdomainseperator)
- [getNonce](L2_PolygonChildERC20.md#getnonce)
- [getRoleAdmin](L2_PolygonChildERC20.md#getroleadmin)
- [getRoleMember](L2_PolygonChildERC20.md#getrolemember)
- [getRoleMemberCount](L2_PolygonChildERC20.md#getrolemembercount)
- [grantRole](L2_PolygonChildERC20.md#grantrole)
- [hasRole](L2_PolygonChildERC20.md#hasrole)
- [increaseAllowance](L2_PolygonChildERC20.md#increaseallowance)
- [listeners](L2_PolygonChildERC20.md#listeners)
- [name](L2_PolygonChildERC20.md#name)
- [queryFilter](L2_PolygonChildERC20.md#queryfilter)
- [removeAllListeners](L2_PolygonChildERC20.md#removealllisteners)
- [renounceRole](L2_PolygonChildERC20.md#renouncerole)
- [revokeRole](L2_PolygonChildERC20.md#revokerole)
- [symbol](L2_PolygonChildERC20.md#symbol)
- [totalSupply](L2_PolygonChildERC20.md#totalsupply)
- [transfer](L2_PolygonChildERC20.md#transfer)
- [transferFrom](L2_PolygonChildERC20.md#transferfrom)
- [withdraw](L2_PolygonChildERC20.md#withdraw)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHILD_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `CHILD_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `DEPOSITOR_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `ROOT_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ROOT_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `allowance` | (`owner`: `PromiseOrValue`\<`string`\>, `spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`spender`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`number`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `deposit` | (`user`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `transferFrom` | (`sender`: `PromiseOrValue`\<`string`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHILD_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `CHILD_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `DEPOSITOR_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ROOT_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ROOT_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `allowance` | (`owner`: `PromiseOrValue`\<`string`\>, `spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `approve` | (`spender`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `deposit` | (`user`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `transfer` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `transferFrom` | (`sender`: `PromiseOrValue`\<`string`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

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
| `MetaTransactionExecuted` | (`userAddress?`: ``null``, `relayerAddress?`: ``null``, `functionSignature?`: ``null``) => `MetaTransactionExecutedEventFilter` |
| `MetaTransactionExecuted(address,address,bytes)` | (`userAddress?`: ``null``, `relayerAddress?`: ``null``, `functionSignature?`: ``null``) => `MetaTransactionExecutedEventFilter` |
| `RoleAdminChanged` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleAdminChanged(bytes32,bytes32,bytes32)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleGranted` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleGranted(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleRevoked` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |
| `RoleRevoked(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |
| `Transfer` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `TransferEventFilter` |
| `Transfer(address,address,uint256)` | (`from?`: ``null`` \| `PromiseOrValue`\<`string`\>, `to?`: ``null`` \| `PromiseOrValue`\<`string`\>, `value?`: ``null``) => `TransferEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHILD_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `CHILD_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `DEPOSITOR_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `ROOT_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `ROOT_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `allowance` | (`owner`: `PromiseOrValue`\<`string`\>, `spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `approve` | (`spender`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<[`number`]\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `deposit` | (`user`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `nonce`: `BigNumber`  }\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `transfer` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `transferFrom` | (`sender`: `PromiseOrValue`\<`string`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L2_PolygonChildERC20Interface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CHILD_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `CHILD_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `DEPOSITOR_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ROOT_CHAIN_ID` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ROOT_CHAIN_ID_BYTES` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `allowance` | (`owner`: `PromiseOrValue`\<`string`\>, `spender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `approve` | (`spender`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `balanceOf` | (`account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decimals` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `decreaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `subtractedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `deposit` | (`user`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `increaseAllowance` | (`spender`: `PromiseOrValue`\<`string`\>, `addedValue`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `name` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `symbol` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `totalSupply` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `transfer` | (`recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `transferFrom` | (`sender`: `PromiseOrValue`\<`string`\>, `recipient`: `PromiseOrValue`\<`string`\>, `amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `withdraw` | (`amount`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="child_chain_id" name="child_chain_id"></a> CHILD\_CHAIN\_ID

▸ **CHILD_CHAIN_ID**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="child_chain_id_bytes" name="child_chain_id_bytes"></a> CHILD\_CHAIN\_ID\_BYTES

▸ **CHILD_CHAIN_ID_BYTES**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="default_admin_role" name="default_admin_role"></a> DEFAULT\_ADMIN\_ROLE

▸ **DEFAULT_ADMIN_ROLE**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="depositor_role" name="depositor_role"></a> DEPOSITOR\_ROLE

▸ **DEPOSITOR_ROLE**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="erc712_version" name="erc712_version"></a> ERC712\_VERSION

▸ **ERC712_VERSION**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="root_chain_id" name="root_chain_id"></a> ROOT\_CHAIN\_ID

▸ **ROOT_CHAIN_ID**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="root_chain_id_bytes" name="root_chain_id_bytes"></a> ROOT\_CHAIN\_ID\_BYTES

▸ **ROOT_CHAIN_ID_BYTES**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="allowance" name="allowance"></a> allowance

▸ **allowance**(`owner`, `spender`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `PromiseOrValue`\<`string`\> |
| `spender` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="approve" name="approve"></a> approve

▸ **approve**(`spender`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `spender` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
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

▸ **balanceOf**(`account`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Returns

`Promise`\<[`L2_PolygonChildERC20`](L2_PolygonChildERC20.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="deposit" name="deposit"></a> deposit

▸ **deposit**(`user`, `depositData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `depositData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="executemetatransaction" name="executemetatransaction"></a> executeMetaTransaction

▸ **executeMetaTransaction**(`userAddress`, `functionSignature`, `sigR`, `sigS`, `sigV`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userAddress` | `PromiseOrValue`\<`string`\> |
| `functionSignature` | `PromiseOrValue`\<`BytesLike`\> |
| `sigR` | `PromiseOrValue`\<`BytesLike`\> |
| `sigS` | `PromiseOrValue`\<`BytesLike`\> |
| `sigV` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="getchainid" name="getchainid"></a> getChainId

▸ **getChainId**(`overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getdomainseperator" name="getdomainseperator"></a> getDomainSeperator

▸ **getDomainSeperator**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getnonce" name="getnonce"></a> getNonce

▸ **getNonce**(`user`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="getroleadmin" name="getroleadmin"></a> getRoleAdmin

▸ **getRoleAdmin**(`role`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getrolemember" name="getrolemember"></a> getRoleMember

▸ **getRoleMember**(`role`, `index`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `index` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="getrolemembercount" name="getrolemembercount"></a> getRoleMemberCount

▸ **getRoleMemberCount**(`role`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

___

### <a id="grantrole" name="grantrole"></a> grantRole

▸ **grantRole**(`role`, `account`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="hasrole" name="hasrole"></a> hasRole

▸ **hasRole**(`role`, `account`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="name" name="name"></a> name

▸ **name**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="renouncerole" name="renouncerole"></a> renounceRole

▸ **renounceRole**(`role`, `account`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `account` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="revokerole" name="revokerole"></a> revokeRole

▸ **revokeRole**(`role`, `account`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `role` | `PromiseOrValue`\<`BytesLike`\> |
| `account` | `PromiseOrValue`\<`string`\> |
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

▸ **transfer**(`recipient`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="transferfrom" name="transferfrom"></a> transferFrom

▸ **transferFrom**(`sender`, `recipient`, `amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `PromiseOrValue`\<`string`\> |
| `recipient` | `PromiseOrValue`\<`string`\> |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="withdraw" name="withdraw"></a> withdraw

▸ **withdraw**(`amount`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `amount` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
