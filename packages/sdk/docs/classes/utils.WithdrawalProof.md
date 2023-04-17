# Class: WithdrawalProof

[utils](../modules/utils.md).WithdrawalProof

## Table of contents

### Constructors

- [constructor](utils.WithdrawalProof.md#constructor)

### Properties

- [leaves](utils.WithdrawalProof.md#leaves)
- [network](utils.WithdrawalProof.md#network)
- [numLeaves](utils.WithdrawalProof.md#numleaves)
- [proof](utils.WithdrawalProof.md#proof)
- [rootTotalAmount](utils.WithdrawalProof.md#roottotalamount)
- [transfer](utils.WithdrawalProof.md#transfer)
- [transferId](utils.WithdrawalProof.md#transferid)
- [transferIndex](utils.WithdrawalProof.md#transferindex)
- [transferRoot](utils.WithdrawalProof.md#transferroot)
- [transferRootHash](utils.WithdrawalProof.md#transferroothash)

### Methods

- [checkWithdrawable](utils.WithdrawalProof.md#checkwithdrawable)
- [generateProof](utils.WithdrawalProof.md#generateproof)
- [getProofPayload](utils.WithdrawalProof.md#getproofpayload)
- [getTransferSents](utils.WithdrawalProof.md#gettransfersents)
- [getTxPayload](utils.WithdrawalProof.md#gettxpayload)

## Constructors

### <a id="constructor" name="constructor"></a> constructor

• **new WithdrawalProof**(`network`, `transferId`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `network` | `string` |
| `transferId` | `string` |

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

▸ **generateProof**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

___

### <a id="getproofpayload" name="getproofpayload"></a> getProofPayload

▸ **getProofPayload**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `leaves` | `string`[] |
| `numLeaves` | `number` |
| `proof` | `string`[] |
| `rootTotalAmount` | `string` |
| `transferId` | `string` |
| `transferIndex` | `number` |
| `transferRootHash` | `string` |

___

### <a id="gettransfersents" name="gettransfersents"></a> getTransferSents

▸ **getTransferSents**(`options`, `lastId?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `options` | `any` | `undefined` |
| `lastId` | `string` | `''` |

#### Returns

`Promise`<`any`\>

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
| `rootTotalAmount` | `string` |
| `siblings` | `string`[] |
| `totalLeaves` | `number` |
| `transferIdTreeIndex` | `number` |
| `transferNonce` | `any` |
| `transferRootHash` | `string` |
