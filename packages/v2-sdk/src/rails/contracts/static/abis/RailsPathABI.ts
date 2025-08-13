export const abi = [
  {
    type: "function",
    name: "attestedAndRemoved",
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
    name: "bond",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "bonderFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "nextHops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "msgSender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimChain",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "confirmClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "counterpartChainId",
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
    name: "counterpartToken",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "fraudulentAmount",
    inputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "gateway",
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
    name: "getAmountOut",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAmountOut",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "attestedClaimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "sourcePool",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sourceTotalFraudulent",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "amountOut",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBucket",
    inputs: [
      {
        name: "index",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Bucket",
        components: [
          {
            name: "completedAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "finalClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "totalAttested",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxConfirmed",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBucketCount",
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
    name: "getBucketIndex",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "getClaim",
    // eslint-disable-next-line max-lines
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Claim",
        components: [
          {
            name: "createdAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "index",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "to",
            type: "address",
            internalType: "address",
          },
          {
            name: "amountOut",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalClaims",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "nextHopsHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "totalAttested",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalAddedToBucketMaxConfirmed",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "bondedBy",
            type: "address",
            internalType: "address",
          },
          {
            name: "withdrawnBy",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHeadClaimId",
    inputs: [],
    outputs: [
      {
        name: "headClaimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHeadTransferId",
    inputs: [],
    outputs: [
      {
        name: "headTransferId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getInitialId",
    inputs: [
      {
        name: "chainId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNextHopsHash",
    inputs: [
      {
        name: "nextHops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "nextHopsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getNextHopsHashFromHops",
    inputs: [
      {
        name: "hops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "nextHopsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getPathInfo",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
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
    name: "getSourcePool",
    inputs: [
      {
        name: "attestedClaimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "getTotalClaimsAtClaimId",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "getTotalConfirmed",
    inputs: [],
    outputs: [
      {
        name: "totalConfirmed",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransfer",
    inputs: [
      {
        name: "transferId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Transfer",
        components: [
          {
            name: "index",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalSent",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransferDataHash",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sourcePool",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sourceTotalFraudulent",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "hops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
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
    name: "getTransferDataHash",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxBonderFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "attestedClaimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "sourcePool",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sourceTotalFraudulent",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "nextHopsHash",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "getTransferId",
    inputs: [
      {
        name: "previousTransferId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "transferDataHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [
      {
        name: "transferId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getWithdrawableBalance",
    inputs: [
      {
        name: "bonder",
        type: "address",
        internalType: "address",
      },
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "hardConfirmedBucketIndex",
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
    name: "hardConfirmedClaimId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialReserve",
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
    name: "initialize",
    inputs: [
      {
        name: "_pathId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "_token",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_counterpartChainId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_counterpartToken",
        type: "address",
        internalType: "contract IERC20",
      },
      {
        name: "_initialReserve",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_gateway",
        type: "address",
        internalType: "address",
      },
      {
        name: "_minBucketDuration",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isValidClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "isValidTransfer",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "lastBondedClaimIdForBonder",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minBucketDuration",
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
    name: "pathId",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "postClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "maxBonderFee",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "attestedClaimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "sourcePool",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "sourceTotalFraudulent",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "nextHopsHash",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "readdClaim",
    inputs: [
      {
        name: "transferDataHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "send",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "hops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [
      {
        name: "transferId",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "token",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalClaims",
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
    name: "totalFraudulent",
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
    name: "totalSent",
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
    name: "totalWithdrawableAtClaimId",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
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
    name: "transferChain",
    inputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "updateClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "currentNextHops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "newNextHops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawBonds",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "msgSender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawClaim",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "nextHops",
        type: "tuple[]",
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "msgSender",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawn",
    inputs: [
      {
        name: "",
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
    type: "event",
    name: "ClaimBonded",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "bonderFee",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimPosted",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "amountOut",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimReadded",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimRemoved",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimUpdated",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "nextHops",
        type: "tuple[]",
        indexed: false,
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ClaimWithdrawn",
    inputs: [
      {
        name: "claimId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
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
    name: "TransferSent",
    inputs: [
      {
        name: "transferId",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "to",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "sourcePool",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "sourceTotalFraudulent",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "hops",
        type: "tuple[]",
        indexed: false,
        internalType: "struct Hop[]",
        components: [
          {
            name: "pathId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "maxBonderFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "maxTotalSent",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "attestedClaimId",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "updater",
            type: "address",
            internalType: "address",
          },
        ],
      },
    ],
    anonymous: false,
  },
]