import {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctions,
} from 'abitype'
import {
  BigNumber,
  CallOverrides,
  Contract,
  ContractTransaction,
  EventFilter,
  Overrides,
  PayableOverrides,
  providers,
  Signer
} from 'ethers'
import {
  EventFragment,
  FunctionFragment,
} from 'ethers/lib/utils'

export { Abi }

// Adjusted for ethers v5: ContractTransactionResponse replaced with ContractTransaction
export type TypedContractFunctionResult<
  TAbi extends Abi,
  TFunctionName extends string,
  TOutputArgs = AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']>
> = TOutputArgs extends readonly [] ? void : TOutputArgs extends readonly [infer Arg] ? Arg : TOutputArgs

export type TypedFragment<
  TAbi extends Abi,
  TFunctionName extends string,
  TFunction extends ExtractAbiFunctions<TAbi> = ExtractAbiFunction<TAbi, TFunctionName>
> = Omit<FunctionFragment, 'inputs' | 'outputs' | 'stateMutability' | 'name' | 'type'> & {
  name: TFunction['name']
  type: TFunction['type']
  inputs: TFunction['inputs']
  outputs: TFunction['outputs']
  stateMutability: TFunction['stateMutability']
}

// A helper type to apply the transformation across all elements of a tuple/array
type TransformAbiParameters<Params extends readonly any[]> = {
  [K in keyof Params]: AbiParametersToPrimitiveTypes<Params[K]>
}

export interface TypedContractFunction<
  TAbi extends Abi,
  TFunctionName extends string,
  TFunction extends ExtractAbiFunctions<TAbi> = ExtractAbiFunction<TAbi, TFunctionName>,

  TInputArgs = TransformAbiParameters<TFunction['inputs']>,

  TResult = TypedContractFunctionResult<TAbi, TFunctionName>,
  TFragment = TypedFragment<TAbi, TFunctionName>
> {
  // Use function overloads to handle calls with and without overrides
  (...args: TInputArgs[]): Promise<TResult>
  (...args: [...TInputArgs[], Overrides | PayableOverrides]): Promise<TResult>


  name: TFunctionName
  fragment: TFragment
  getFragment(...args: TInputArgs[]): TFragment
  populateTransaction(
    ...args: [...TInputArgs[], Overrides | PayableOverrides]
  ): Promise<ContractTransaction>
  staticCall(
    ...args: [...TInputArgs[], CallOverrides]
  ): Promise<TResult>
  send(
    ...args: [...TInputArgs[], Overrides | PayableOverrides]
  ): Promise<ContractTransaction>
  estimateGas(...args: [...TInputArgs[], Overrides | PayableOverrides]): Promise<BigNumber>
  staticCallResult(
    ...args: [...TInputArgs[], CallOverrides]
  ): Promise<any> // Adjusted for ethers v5, TResult might need to be more specific based on usage
}

export interface TypedContractEvent<
  TAbi extends Abi,
  TEventName extends string,
  TEvent extends ExtractAbiEvents<TAbi> = ExtractAbiEvent<TAbi, TEventName>,
  TEventArgs = Partial<AbiParametersToPrimitiveTypes<TEvent['inputs']>>
> {
  (...args: TEventArgs[]): EventFilter
  name: TEventName
  fragment: EventFragment
  getFragment(...args: TEventArgs[]): EventFragment
}

export type TypedContract<TAbi extends Abi> = Omit<Contract, 'getFunction' | 'getEvent'> & {
  [Method in ExtractAbiFunctionNames<TAbi>]: TypedContractFunction<TAbi, Method>
} & {
  address: any,
  interface: any,
  signer: any,
  provider: any,
  functions: any,
  callStatic: any
  estimateGas: any
  populateTransaction: any
  resolvedAddress: any
  deployTransaction: any
  _deployedPromise: any
  _runningEvents: any
  _wrappedEmits: any
  deployed: any
  _deployed: any
  fallback: any
  connect: any
  attach: any
  _normalizeRunningEvent: any
  _getRunningEvent: any
  _checkRunningEvents: any
  _wrapEvent: any
  _addEventListener: any
  queryFilter: any
  on: any
  once: any
  emit: any
  listenerCount: any
  listeners: any
  removeAllListeners: any
  off: any
  removeListener: any
  getFunction<T extends ExtractAbiFunctionNames<TAbi>>(key: T | TypedFragment<TAbi, T>): TypedContractFunction<TAbi, T>
  getEvent<T extends ExtractAbiEventNames<TAbi>>(key: T | EventFragment): TypedContractEvent<TAbi, T>
  filters: {
    [EventName in ExtractAbiEventNames<TAbi>]: TypedContractEvent<TAbi, EventName>
  }
}

export const typedContract = <TAbi extends Abi>(
  address: string,
  abi: TAbi,
  signerOrProvider: Signer | providers.Provider
): TypedContract<TAbi> => {
  return new Contract(address, abi as any, signerOrProvider) as unknown as TypedContract<TAbi>
}
