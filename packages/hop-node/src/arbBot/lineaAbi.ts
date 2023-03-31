export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_deadline',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: '_calldata',
        type: 'bytes'
      }
    ],
    name: 'dispatchMessage',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

export default abi
