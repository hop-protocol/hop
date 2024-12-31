# Interface: L1\_PolygonMessenger

## Hierarchy

- `BaseContract`

  ↳ **`L1_PolygonMessenger`**

## Table of contents

### Properties

- [callStatic](L1_PolygonMessenger.md#callstatic)
- [estimateGas](L1_PolygonMessenger.md#estimategas)
- [filters](L1_PolygonMessenger.md#filters)
- [functions](L1_PolygonMessenger.md#functions)
- [interface](L1_PolygonMessenger.md#interface)
- [off](L1_PolygonMessenger.md#off)
- [on](L1_PolygonMessenger.md#on)
- [once](L1_PolygonMessenger.md#once)
- [populateTransaction](L1_PolygonMessenger.md#populatetransaction)
- [removeListener](L1_PolygonMessenger.md#removelistener)

### Methods

- [DEFAULT\_ADMIN\_ROLE](L1_PolygonMessenger.md#default_admin_role)
- [SEND\_MESSAGE\_EVENT\_SIG](L1_PolygonMessenger.md#send_message_event_sig)
- [attach](L1_PolygonMessenger.md#attach)
- [checkpointManager](L1_PolygonMessenger.md#checkpointmanager)
- [childTunnel](L1_PolygonMessenger.md#childtunnel)
- [connect](L1_PolygonMessenger.md#connect)
- [deployed](L1_PolygonMessenger.md#deployed)
- [getRoleAdmin](L1_PolygonMessenger.md#getroleadmin)
- [getRoleMember](L1_PolygonMessenger.md#getrolemember)
- [getRoleMemberCount](L1_PolygonMessenger.md#getrolemembercount)
- [grantRole](L1_PolygonMessenger.md#grantrole)
- [hasRole](L1_PolygonMessenger.md#hasrole)
- [l1BridgeAddress](L1_PolygonMessenger.md#l1bridgeaddress)
- [listeners](L1_PolygonMessenger.md#listeners)
- [processedExits](L1_PolygonMessenger.md#processedexits)
- [queryFilter](L1_PolygonMessenger.md#queryfilter)
- [receiveMessage](L1_PolygonMessenger.md#receivemessage)
- [removeAllListeners](L1_PolygonMessenger.md#removealllisteners)
- [renounceRole](L1_PolygonMessenger.md#renouncerole)
- [revokeRole](L1_PolygonMessenger.md#revokerole)
- [sendCrossDomainMessage](L1_PolygonMessenger.md#sendcrossdomainmessage)
- [setCheckpointManager](L1_PolygonMessenger.md#setcheckpointmanager)
- [setChildTunnel](L1_PolygonMessenger.md#setchildtunnel)
- [setStateSender](L1_PolygonMessenger.md#setstatesender)
- [stateSender](L1_PolygonMessenger.md#statesender)
- [verifySender](L1_PolygonMessenger.md#verifysender)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `childTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setChildTunnel` | (`newChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |
| `stateSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`string`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`void`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `childTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setChildTunnel` | (`newChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |
| `stateSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `RoleAdminChanged` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleAdminChanged(bytes32,bytes32,bytes32)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `previousAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `newAdminRole?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>) => `RoleAdminChangedEventFilter` |
| `RoleGranted` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleGranted(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleGrantedEventFilter` |
| `RoleRevoked` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |
| `RoleRevoked(bytes32,address,address)` | (`role?`: ``null`` \| `PromiseOrValue`\<`BytesLike`\>, `account?`: ``null`` \| `PromiseOrValue`\<`string`\>, `sender?`: ``null`` \| `PromiseOrValue`\<`string`\>) => `RoleRevokedEventFilter` |

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `childTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setChildTunnel` | (`newChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |
| `stateSender` | (`overrides?`: `CallOverrides`) => `Promise`\<[`string`]\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`ContractTransaction`\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `L1_PolygonMessengerInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `DEFAULT_ADMIN_ROLE` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `SEND_MESSAGE_EVENT_SIG` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `checkpointManager` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `childTunnel` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleAdmin` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMember` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `index`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `getRoleMemberCount` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `grantRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `hasRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `l1BridgeAddress` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `processedExits` | (`arg0`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `receiveMessage` | (`inputData`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `renounceRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `revokeRole` | (`role`: `PromiseOrValue`\<`BytesLike`\>, `account`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `sendCrossDomainMessage` | (`_calldata`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setCheckpointManager` | (`newCheckpointManager`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setChildTunnel` | (`newChildTunnel`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `setStateSender` | (`newStateSender`: `PromiseOrValue`\<`string`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |
| `stateSender` | (`overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `verifySender` | (`l1BridgeCaller`: `PromiseOrValue`\<`string`\>, `arg1`: `PromiseOrValue`\<`BytesLike`\>, `overrides?`: `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  }) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

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

### <a id="send_message_event_sig" name="send_message_event_sig"></a> SEND\_MESSAGE\_EVENT\_SIG

▸ **SEND_MESSAGE_EVENT_SIG**(`overrides?`): `Promise`\<`string`\>

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

### <a id="checkpointmanager" name="checkpointmanager"></a> checkpointManager

▸ **checkpointManager**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="childtunnel" name="childtunnel"></a> childTunnel

▸ **childTunnel**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

▸ **deployed**(): `Promise`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

#### Returns

`Promise`\<[`L1_PolygonMessenger`](L1_PolygonMessenger.md)\>

#### Overrides

BaseContract.deployed

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

### <a id="l1bridgeaddress" name="l1bridgeaddress"></a> l1BridgeAddress

▸ **l1BridgeAddress**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

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

### <a id="receivemessage" name="receivemessage"></a> receiveMessage

▸ **receiveMessage**(`inputData`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `PromiseOrValue`\<`BytesLike`\> |
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

### <a id="sendcrossdomainmessage" name="sendcrossdomainmessage"></a> sendCrossDomainMessage

▸ **sendCrossDomainMessage**(`_calldata`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `_calldata` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>

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

### <a id="setchildtunnel" name="setchildtunnel"></a> setChildTunnel

▸ **setChildTunnel**(`newChildTunnel`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `newChildTunnel` | `PromiseOrValue`\<`string`\> |
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

### <a id="statesender" name="statesender"></a> stateSender

▸ **stateSender**(`overrides?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`string`\>

___

### <a id="verifysender" name="verifysender"></a> verifySender

▸ **verifySender**(`l1BridgeCaller`, `arg1`, `overrides?`): `Promise`\<`ContractTransaction`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `l1BridgeCaller` | `PromiseOrValue`\<`string`\> |
| `arg1` | `PromiseOrValue`\<`BytesLike`\> |
| `overrides?` | `Overrides` & \{ `from?`: `PromiseOrValue`\<`string`\>  } |

#### Returns

`Promise`\<`ContractTransaction`\>
