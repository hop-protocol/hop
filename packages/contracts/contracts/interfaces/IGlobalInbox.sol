pragma solidity 0.6.12;

interface IGlobalInbox {
    event MessageDelivered(
        address indexed chain,
        uint8 indexed kind,
        address indexed sender,
        uint256 inboxSeqNum,
        bytes data
    );

    event MessageDeliveredFromOrigin(
        address indexed chain,
        uint8 indexed kind,
        address indexed sender,
        uint256 inboxSeqNum
    );

    event BuddyContractDeployed(address indexed sender, bytes data);
    event BuddyContractPair(address indexed sender, address data);

    function getInbox(address account) external view returns (bytes32, uint256);

    function sendMessages(
        bytes calldata _messages,
        uint256 initialMaxSendCount,
        uint256 finalMaxSendCount
    ) external;

    function sendInitializationMessage(bytes calldata messageData) external;

    function sendL2Message(address chain, bytes calldata messageData) external;

    function deployL2ContractPair(
        address chain,
        uint256 maxGas,
        uint256 gasPriceBid,
        uint256 payment,
        bytes calldata contractData
    ) external;
}
