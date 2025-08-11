export const abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_hopToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_challengeIterationPeriod",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_minChallengeIncrease",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_fullChallenge",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_minHopStake",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_windowSize",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "acceptSlash",
    inputs: [
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addToAppeal",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "addToChallenge",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "challengeIterationPeriod",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimEth",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createChallenge",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "forceSettleChallenge",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
      {
        name: "challengeWon",
        type: "bool",
        internalType: "bool",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fullChallenge",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getChallengeId",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getStakedBalance",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalBalance",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWithdrawableBalance",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "withdrawableBalance",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hopToken",
    inputs: [],
    outputs: [
      {
        // eslint-disable-next-line max-lines
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isStaked",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minChallengeIncrease",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minHopStake",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "optimisticallySettleChallenge",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "signalPreference",
    inputs: [
      {
        name: "pathId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "feeTier",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "liquidity",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "stakeHop",
    inputs: [
      {
        name: "staker",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unstakeHop",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "windowSize",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawStake",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AddedToAppeal",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "contributor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AddedToChallenge",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "contributor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BonderPreference",
    inputs: [
      {
        name: "bonder",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "pathId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "feeTier",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "liquidity",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChallengeCreated",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "challenger",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ChallengeSettled",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "challengeWon",
        type: "bool",
        indexed: false,
        internalType: "bool",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EthClaimed",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "penalty",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "slashingData",
        type: "bytes",
        indexed: false,
        internalType: "bytes",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "HopStaked",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "from",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "HopUnstaked",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StakeWithdrawn",
    inputs: [
      {
        name: "staker",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
]
