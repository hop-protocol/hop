// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

/* Contract Imports */
import { OVM_BaseCrossDomainMessenger } from "./OVM_BaseCrossDomainMessenger.sol";

/**
 * @title mockOVM_CrossDomainMessenger
 */
contract mockOVM_CrossDomainMessenger is OVM_BaseCrossDomainMessenger {

    /***********
     * Structs *
     ***********/

    struct ReceivedMessage {
        uint256 timestamp;
        address target;
        address sender;
        bytes message;
        uint256 messageNonce;
        uint256 gasLimit;
    }


    /**********************
     * Contract Variables *
     **********************/

    ReceivedMessage[] public fullReceivedMessages;
    address public targetCanonicalBridgeAddress;
    uint256 public lastRelayedMessage;
    uint256 public delay;


    /***************
     * Constructor *
     ***************/

    /**
     * @param _delay Time in seconds before a message can be relayed.
     */
    constructor(
        uint256 _delay
    )
        public
    {
        delay = _delay;
    }


    /********************
     * Public Functions *
     ********************/

    /**
     * Sets the target bridge address.
     * @dev Currently, this function is public and therefore allows anyone to modify the target
     *      bridge for a given xdomain bridge contract. Obviously this shouldn't be allowed,
     *      but we still need to determine an adequate mechanism for updating this address.
     * @param _targetCanonicalBridgeAddress New bridge address.
     */
    function setTargetCanonicalBridgeAddress(
        address _targetCanonicalBridgeAddress
    )
        public
    {
        targetCanonicalBridgeAddress = _targetCanonicalBridgeAddress;
    }

    /**
     * Sends a message to another mock xdomain bridge.
     * @param _target Target for the message.
     * @param _message Message to send.
     * @param _gasLimit Amount of gas to send with the call.
     */
    function sendMessage(
        address _target,
        bytes memory _message,
        uint32 _gasLimit
    )
        public
    {
        mockOVM_CrossDomainMessenger targetCanonicalBridge = mockOVM_CrossDomainMessenger(
            targetCanonicalBridgeAddress
        );

        // Just send it over!
        targetCanonicalBridge.receiveMessage(ReceivedMessage({
            timestamp: block.timestamp,
            target: _target,
            sender: msg.sender,
            message: _message,
            messageNonce: messageNonce,
            gasLimit: _gasLimit
        }));

        messageNonce += 1;
    }

    /**
     * Receives a message to be sent later.
     * @param _message Message to send later.
     */
    function receiveMessage(
        ReceivedMessage memory _message
    )
        public
    {
        fullReceivedMessages.push(_message);
    }

    /**
     * Checks whether we have messages to relay.
     * @param _exists Whether or not we have more messages to relay.
     */
    function hasNextMessage()
        public
        view
        returns (
            bool _exists
        )
    {
        return fullReceivedMessages.length > lastRelayedMessage;
    }

    /**
     * Relays the last received message not yet relayed.
     */
    function relayNextMessage()
        public
    {
        if (hasNextMessage() == false) {
            return;
        }

        ReceivedMessage memory nextMessage = fullReceivedMessages[lastRelayedMessage];
        if (nextMessage.timestamp + delay > block.timestamp) {
            return;
        }

        xDomainMessageSender = nextMessage.sender;
        nextMessage.target.call{gas: nextMessage.gasLimit}(nextMessage.message);

        lastRelayedMessage += 1;
    }
}
