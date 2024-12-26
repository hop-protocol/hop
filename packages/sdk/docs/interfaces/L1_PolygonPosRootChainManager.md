# Interface: L1\_PolygonPosRootChainManager

## Hierarchy

- `BaseContract`

  ↳ **`L1_PolygonPosRootChainManager`**

## Table of contents

### Properties

- [callStatic](L1_PolygonPosRootChainManager.md#callstatic)
- [estimateGas](L1_PolygonPosRootChainManager.md#estimategas)
- [filters](L1_PolygonPosRootChainManager.md#filters)
- [functions](L1_PolygonPosRootChainManager.md#functions)
- [interface](L1_PolygonPosRootChainManager.md#interface)
- [off](L1_PolygonPosRootChainManager.md#off)
- [on](L1_PolygonPosRootChainManager.md#on)
- [once](L1_PolygonPosRootChainManager.md#once)
- [populateTransaction](L1_PolygonPosRootChainManager.md#populatetransaction)
- [removeListener](L1_PolygonPosRootChainManager.md#removelistener)

### Methods

- [DEFAULT\_ADMIN\_ROLE](L1_PolygonPosRootChainManager.md#default_admin_role)
- [DEPOSIT](L1_PolygonPosRootChainManager.md#deposit)
- [ERC712\_VERSION](L1_PolygonPosRootChainManager.md#erc712_version)
- [ETHER\_ADDRESS](L1_PolygonPosRootChainManager.md#ether_address)
- [MAPPER\_ROLE](L1_PolygonPosRootChainManager.md#mapper_role)
- [MAP\_TOKEN](L1_PolygonPosRootChainManager.md#map_token)
- [attach](L1_PolygonPosRootChainManager.md#attach)
- [checkpointManagerAddress](L1_PolygonPosRootChainManager.md#checkpointmanageraddress)
- [childChainManagerAddress](L1_PolygonPosRootChainManager.md#childchainmanageraddress)
- [childToRootToken](L1_PolygonPosRootChainManager.md#childtoroottoken)
- [cleanMapToken](L1_PolygonPosRootChainManager.md#cleanmaptoken)
- [connect](L1_PolygonPosRootChainManager.md#connect)
- [deployed](L1_PolygonPosRootChainManager.md#deployed)
- [depositEtherFor](L1_PolygonPosRootChainManager.md#depositetherfor)
- [depositFor](L1_PolygonPosRootChainManager.md#depositfor)
- [executeMetaTransaction](L1_PolygonPosRootChainManager.md#executemetatransaction)
- [exit](L1_PolygonPosRootChainManager.md#exit)
- [getChainId](L1_PolygonPosRootChainManager.md#getchainid)
- [getDomainSeperator](L1_PolygonPosRootChainManager.md#getdomainseperator)
- [getNonce](L1_PolygonPosRootChainManager.md#getnonce)
- [getRoleAdmin](L1_PolygonPosRootChainManager.md#getroleadmin)
- [getRoleMember](L1_PolygonPosRootChainManager.md#getrolemember)
- [getRoleMemberCount](L1_PolygonPosRootChainManager.md#getrolemembercount)
- [grantRole](L1_PolygonPosRootChainManager.md#grantrole)
- [hasRole](L1_PolygonPosRootChainManager.md#hasrole)
- [initialize](L1_PolygonPosRootChainManager.md#initialize)
- [initializeEIP712](L1_PolygonPosRootChainManager.md#initializeeip712)
- [listeners](L1_PolygonPosRootChainManager.md#listeners)
- [mapToken](L1_PolygonPosRootChainManager.md#maptoken)
- [processedExits](L1_PolygonPosRootChainManager.md#processedexits)
- [queryFilter](L1_PolygonPosRootChainManager.md#queryfilter)
- [registerPredicate](L1_PolygonPosRootChainManager.md#registerpredicate)
- [remapToken](L1_PolygonPosRootChainManager.md#remaptoken)
- [removeAllListeners](L1_PolygonPosRootChainManager.md#removealllisteners)
- [renounceRole](L1_PolygonPosRootChainManager.md#renouncerole)
- [revokeRole](L1_PolygonPosRootChainManager.md#revokerole)
- [rootToChildToken](L1_PolygonPosRootChainManager.md#roottochildtoken)
- [setCheckpointManager](L1_PolygonPosRootChainManager.md#setcheckpointmanager)
- [setChildChainManagerAddress](L1_PolygonPosRootChainManager.md#setchildchainmanageraddress)
- [setStateSender](L1_PolygonPosRootChainManager.md#setstatesender)
- [setupContractId](L1_PolygonPosRootChainManager.md#setupcontractid)
- [stateSenderAddress](L1_PolygonPosRootChainManager.md#statesenderaddress)
- [tokenToType](L1_PolygonPosRootChainManager.md#tokentotype)
- [typeToPredicate](L1_PolygonPosRootChainManager.md#typetopredicate)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `DEPOSIT` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `ETHER_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `MAPPER_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `MAP_TOKEN` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `checkpointManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `childChainManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `childToRootToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `cleanMapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositEtherFor` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `depositFor` | (`user`: `PromiseOrValue`\<`string`\>, `rootToken`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `exit` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `initialize` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `initializeEIP712` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `mapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `registerPredicate` | (`tokenType`: `PromiseOrValue`\<`BytesLike`\>, `predicateAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `remapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `rootToChildToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setChildChainManagerAddress` | (`newChildChainManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setupContractId` | (`overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stateSenderAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `tokenToType` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `typeToPredicate` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `DEPOSIT` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `ETHER_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAPPER_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `MAP_TOKEN` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `checkpointManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `childChainManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `childToRootToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `cleanMapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositEtherFor` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `depositFor` | (`user`: `PromiseOrValue`\<`string`\>, `rootToken`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `exit` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `initialize` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `initializeEIP712` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `mapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `registerPredicate` | (`tokenType`: `PromiseOrValue`\<`BytesLike`\>, `predicateAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `remapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `rootToChildToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setChildChainManagerAddress` | (`newChildChainManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setupContractId` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stateSenderAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `tokenToType` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `typeToPredicate` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MetaTransactionExecuted` | (`userAddress?`: ``null``, `relayerAddress?`: ``null``, `functionSignature?`: ``null``) => `MetaTransactionExecutedEventFilter` |
| `MetaTransactionExecuted(address,address,bytes)` | (`userAddress?`: ``null``, `relayerAddress?`: ``null``, `functionSignature?`: ``null``) => `MetaTransactionExecutedEventFilter` |
| `PredicateRegistered` | (`tokenType?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `predicateAddress?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `PredicateRegisteredEventFilter` |
| `PredicateRegistered(bytes32,address)` | (`tokenType?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `predicateAddress?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `PredicateRegisteredEventFilter` |
| `RoleAdminChanged` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleAdminChanged(bytes32,bytes32,bytes32)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleGranted` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleGranted(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleRevoked` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |
| `RoleRevoked(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |
| `TokenMapped` | (`rootToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `childToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenType?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `TokenMappedEventFilter` |
| `TokenMapped(address,address,bytes32)` | (`rootToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `childToken?`: ``null`` \| `PromiseOrValue`\<`string`\>, `tokenType?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `TokenMappedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `DEPOSIT` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `ETHER_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `MAPPER_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `MAP_TOKEN` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `checkpointManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `childChainManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `childToRootToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `cleanMapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositEtherFor` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `depositFor` | (`user`: `PromiseOrValue`\<`string`\>, `rootToken`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `exit` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`] & \{ `nonce`: `BigNumber`  }\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `initialize` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `initializeEIP712` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `mapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `registerPredicate` | (`tokenType`: `PromiseOrValue`\<`BytesLike`\>, `predicateAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `remapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `rootToChildToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setChildChainManagerAddress` | (`newChildChainManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setupContractId` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stateSenderAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `tokenToType` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `typeToPredicate` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_PolygonPosRootChainManagerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `DEPOSIT` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ERC712_VERSION` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `ETHER_ADDRESS` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAPPER_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `MAP_TOKEN` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `checkpointManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `childChainManagerAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `childToRootToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `cleanMapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositEtherFor` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `depositFor` | (`user`: `PromiseOrValue`\<`string`\>, `rootToken`: `PromiseOrValue`\<`string`\>, `depositData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `executeMetaTransaction` | (`userAddress`: `PromiseOrValue`\<`string`\>, `functionSignature`: `PromiseOrValue`\<`BytesLike`\>, `sigR`: `PromiseOrValue`\<`BytesLike`\>, `sigS`: `PromiseOrValue`\<`BytesLike`\>, `sigV`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `exit` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `getChainId` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getDomainSeperator` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getNonce` | (`user`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `initialize` | (`_owner`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `initializeEIP712` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `mapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `registerPredicate` | (`tokenType`: `PromiseOrValue`\<`BytesLike`\>, `predicateAddress`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `remapToken` | (`rootToken`: `PromiseOrValue`\<`string`\>, `childToken`: `PromiseOrValue`\<`string`\>, `tokenType`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `rootToChildToken` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setChildChainManagerAddress` | (`newChildChainManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setupContractId` | (`overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stateSenderAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `tokenToType` | (`arg0`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `typeToPredicate` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Overrides

BaseContract.removeListener

## Methods

### <a id="default_admin_role" name="default_admin_role"></a> DEFAULT\_ADMIN\_ROLE

▸ **DEFAULT_ADMIN_ROLE**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="deposit" name="deposit"></a> DEPOSIT

▸ **DEPOSIT**(`overrides?`): `Promise`\<`string`\>

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

### <a id="ether_address" name="ether_address"></a> ETHER\_ADDRESS

▸ **ETHER_ADDRESS**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="mapper_role" name="mapper_role"></a> MAPPER\_ROLE

▸ **MAPPER_ROLE**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="map_token" name="map_token"></a> MAP\_TOKEN

▸ **MAP_TOKEN**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="checkpointmanageraddress" name="checkpointmanageraddress"></a> checkpointManagerAddress

▸ **checkpointManagerAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="childchainmanageraddress" name="childchainmanageraddress"></a> childChainManagerAddress

▸ **childChainManagerAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="childtoroottoken" name="childtoroottoken"></a> childToRootToken

▸ **childToRootToken**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="cleanmaptoken" name="cleanmaptoken"></a> cleanMapToken

▸ **cleanMapToken**(`rootToken`, `childToken`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootToken` | `PromiseOrValue`\<`string`\> |
| `childToken` | `PromiseOrValue`\<`string`\> |
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

### <a id="deployed" name="deployed"></a> deployed

▸ **deployed**(): `Promise`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Returns

`Promise`\<[`L1_PolygonPosRootChainManager`](L1_PolygonPosRootChainManager.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="depositetherfor" name="depositetherfor"></a> depositEtherFor

▸ **depositEtherFor**(`user`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `PayableOverrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="depositfor" name="depositfor"></a> depositFor

▸ **depositFor**(`user`, `rootToken`, `depositData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `PromiseOrValue`\<`string`\> |
| `rootToken` | `PromiseOrValue`\<`string`\> |
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

### <a id="exit" name="exit"></a> exit

▸ **exit**(`inputData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

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

### <a id="initialize" name="initialize"></a> initialize

▸ **initialize**(`_owner`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_owner` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="initializeeip712" name="initializeeip712"></a> initializeEIP712

▸ **initializeEIP712**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
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

### <a id="maptoken" name="maptoken"></a> mapToken

▸ **mapToken**(`rootToken`, `childToken`, `tokenType`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootToken` | `PromiseOrValue`\<`string`\> |
| `childToken` | `PromiseOrValue`\<`string`\> |
| `tokenType` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="processedexits" name="processedexits"></a> processedExits

▸ **processedExits**(`arg0`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>

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

### <a id="registerpredicate" name="registerpredicate"></a> registerPredicate

▸ **registerPredicate**(`tokenType`, `predicateAddress`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokenType` | `PromiseOrValue`\<`BytesLike`\> |
| `predicateAddress` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="remaptoken" name="remaptoken"></a> remapToken

▸ **remapToken**(`rootToken`, `childToken`, `tokenType`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootToken` | `PromiseOrValue`\<`string`\> |
| `childToken` | `PromiseOrValue`\<`string`\> |
| `tokenType` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="roottochildtoken" name="roottochildtoken"></a> rootToChildToken

▸ **rootToChildToken**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="setcheckpointmanager" name="setcheckpointmanager"></a> setCheckpointManager

▸ **setCheckpointManager**(`newCheckpointManager`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newCheckpointManager` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setchildchainmanageraddress" name="setchildchainmanageraddress"></a> setChildChainManagerAddress

▸ **setChildChainManagerAddress**(`newChildChainManager`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newChildChainManager` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setstatesender" name="setstatesender"></a> setStateSender

▸ **setStateSender**(`newStateSender`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newStateSender` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="setupcontractid" name="setupcontractid"></a> setupContractId

▸ **setupContractId**(`overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

___

### <a id="statesenderaddress" name="statesenderaddress"></a> stateSenderAddress

▸ **stateSenderAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="tokentotype" name="tokentotype"></a> tokenToType

▸ **tokenToType**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`string`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="typetopredicate" name="typetopredicate"></a> typeToPredicate

▸ **typeToPredicate**(`arg0`, `overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg0` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>
