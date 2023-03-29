export const abi = [
  {
    type: 'function',
    name: 'dispatchMessage',
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
        baseType: 'address'
      },
      {
        name: '_fee',
        type: 'uint256',
        baseType: 'uint256'
      },
      {
        name: '_deadline',
        type: 'uint256',
        baseType: 'uint256'
      },
      {
        name: '_calldata',
        type: 'bytes',
        baseType: 'bytes'
      }
    ],
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    _isFragment: true
  }
]
