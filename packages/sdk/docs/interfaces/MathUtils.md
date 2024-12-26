# Interface: MathUtils

## Hierarchy

- `BaseContract`

  ↳ **`MathUtils`**

## Table of contents

### Properties

- [callStatic](MathUtils.md#callstatic)
- [estimateGas](MathUtils.md#estimategas)
- [filters](MathUtils.md#filters)
- [functions](MathUtils.md#functions)
- [interface](MathUtils.md#interface)
- [off](MathUtils.md#off)
- [on](MathUtils.md#on)
- [once](MathUtils.md#once)
- [populateTransaction](MathUtils.md#populatetransaction)
- [removeListener](MathUtils.md#removelistener)

### Methods

- [attach](MathUtils.md#attach)
- [connect](MathUtils.md#connect)
- [deployed](MathUtils.md#deployed)
- [difference](MathUtils.md#difference)
- [listeners](MathUtils.md#listeners)
- [queryFilter](MathUtils.md#queryfilter)
- [removeAllListeners](MathUtils.md#removealllisteners)
- [within1](MathUtils.md#within1)

## Properties

### <a id="callstatic" name="callstatic"></a> callStatic

• **callStatic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difference` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `within1` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`boolean`\> |

#### Overrides

BaseContract.callStatic

___

### <a id="estimategas" name="estimategas"></a> estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difference` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |
| `within1` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`BigNumber`\> |

#### Overrides

BaseContract.estimateGas

___

### <a id="filters" name="filters"></a> filters

• **filters**: `Object`

#### Overrides

BaseContract.filters

___

### <a id="functions" name="functions"></a> functions

• **functions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difference` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`BigNumber`]\> |
| `within1` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<[`boolean`]\> |

#### Overrides

BaseContract.functions

___

### <a id="interface" name="interface"></a> interface

• **interface**: `MathUtilsInterface`

#### Overrides

BaseContract.interface

___

### <a id="off" name="off"></a> off

• **off**: `OnEvent`\<[`MathUtils`](MathUtils.md)\>

#### Overrides

BaseContract.off

___

### <a id="on" name="on"></a> on

• **on**: `OnEvent`\<[`MathUtils`](MathUtils.md)\>

#### Overrides

BaseContract.on

___

### <a id="once" name="once"></a> once

• **once**: `OnEvent`\<[`MathUtils`](MathUtils.md)\>

#### Overrides

BaseContract.once

___

### <a id="populatetransaction" name="populatetransaction"></a> populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `difference` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |
| `within1` | (`a`: `PromiseOrValue`\<`BigNumberish`\>, `b`: `PromiseOrValue`\<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`\<`PopulatedTransaction`\> |

#### Overrides

BaseContract.populateTransaction

___

### <a id="removelistener" name="removelistener"></a> removeListener

• **removeListener**: `OnEvent`\<[`MathUtils`](MathUtils.md)\>

#### Overrides

BaseContract.removeListener

## Methods

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

▸ **deployed**(): `Promise`\<[`MathUtils`](MathUtils.md)\>

#### Returns

`Promise`\<[`MathUtils`](MathUtils.md)\>

#### Overrides

BaseContract.deployed

___

### <a id="difference" name="difference"></a> difference

▸ **difference**(`a`, `b`, `overrides?`): `Promise`\<`BigNumber`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `PromiseOrValue`\<`BigNumberish`\> |
| `b` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`BigNumber`\>

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

### <a id="within1" name="within1"></a> within1

▸ **within1**(`a`, `b`, `overrides?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `PromiseOrValue`\<`BigNumberish`\> |
| `b` | `PromiseOrValue`\<`BigNumberish`\> |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`\<`boolean`\>
