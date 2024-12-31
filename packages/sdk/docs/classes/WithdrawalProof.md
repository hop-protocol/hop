# Class: WithdrawalProof

## Table of contents

### Constructors

- [constructor](WithdrawalProof.md#constructor)

### Properties

- [leaves](WithdrawalProof.md#leaves)
- [network](WithdrawalProof.md#network)
- [numLeaves](WithdrawalProof.md#numleaves)
- [proof](WithdrawalProof.md#proof)
- [rootTotalAmount](WithdrawalProof.md#roottotalamount)
- [transfer](WithdrawalProof.md#transfer)
- [transferId](WithdrawalProof.md#transferid)
- [transferIndex](WithdrawalProof.md#transferindex)
- [transferRoot](WithdrawalProof.md#transferroot)
- [transferRootHash](WithdrawalProof.md#transferroothash)

### Methods

- [checkWithdrawable](WithdrawalProof.md#checkwithdrawable)
- [generateProof](WithdrawalProof.md#generateproof)
- [getProofPayload](WithdrawalProof.md#getproofpayload)
- [getTransferSents](WithdrawalProof.md#gettransfersents)
- [getTxPayload](WithdrawalProof.md#gettxpayload)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new WithdrawalProof**(`network`, `transferId`): [`WithdrawalProof`](WithdrawalProof.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |
| `transferId` | `string` |

#### Returns

[`WithdrawalProof`](WithdrawalProof.md)

## Properties

### <a id="leaves" name="leaves"></a> leaves

• `Optional` **leaves**: `string`[]

___

### <a id="network" name="network"></a> network

• **network**: `string`

___

### <a id="numleaves" name="numleaves"></a> numLeaves

• `Optional` **numLeaves**: `number`

___

### <a id="proof" name="proof"></a> proof

• `Optional` **proof**: `string`[]

___

### <a id="roottotalamount" name="roottotalamount"></a> rootTotalAmount

• `Optional` **rootTotalAmount**: `string`

___

### <a id="transfer" name="transfer"></a> transfer

• `Optional` **transfer**: `any`

___

### <a id="transferid" name="transferid"></a> transferId

• **transferId**: `string`

___

### <a id="transferindex" name="transferindex"></a> transferIndex

• `Optional` **transferIndex**: `number`

___

### <a id="transferroot" name="transferroot"></a> transferRoot

• `Optional` **transferRoot**: `any`

___

### <a id="transferroothash" name="transferroothash"></a> transferRootHash

• `Optional` **transferRootHash**: `string`

## Methods

### <a id="checkwithdrawable" name="checkwithdrawable"></a> checkWithdrawable

▸ **checkWithdrawable**(): `void`

#### Returns

`void`

___

### <a id="generateproof" name="generateproof"></a> generateProof

▸ **generateProof**(): `Promise`\<`string`[]\>

#### Returns

`Promise`\<`string`[]\>

___

### <a id="getproofpayload" name="getproofpayload"></a> getProofPayload

▸ **getProofPayload**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `leaves` | `undefined` \| `string`[] |
| `numLeaves` | `undefined` \| `number` |
| `proof` | `undefined` \| `string`[] |
| `rootTotalAmount` | `undefined` \| `string` |
| `transferId` | `string` |
| `transferIndex` | `undefined` \| `number` |
| `transferRootHash` | `undefined` \| `string` |

___

### <a id="gettransfersents" name="gettransfersents"></a> getTransferSents

▸ **getTransferSents**(`options`, `lastId?`): `Promise`\<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `any` | `undefined` |
| `lastId` | `string` | `''` |

#### Returns

`Promise`\<`any`\>

___

### <a id="gettxpayload" name="gettxpayload"></a> getTxPayload

▸ **getTxPayload**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `amount` | `any` |
| `amountOutMin` | `any` |
| `bonderFee` | `any` |
| `deadline` | `any` |
| `recipient` | `any` |
| `rootTotalAmount` | `undefined` \| `string` |
| `siblings` | `undefined` \| `string`[] |
| `totalLeaves` | `undefined` \| `number` |
| `transferIdTreeIndex` | `undefined` \| `number` |
| `transferNonce` | `any` |
| `transferRootHash` | `undefined` \| `string` |
