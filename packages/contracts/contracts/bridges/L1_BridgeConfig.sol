// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "./Bridge.sol";

import "../libraries/MerkleUtils.sol";
import "../interfaces/IMessengerWrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract L1_BridgeConfig is Ownable {
    using SafeMath for uint256;

    /* ========== State ========== */

    // ToDo: Make these private
    mapping(uint256 => IMessengerWrapper) private crossDomainMessenger;
    uint256 challengeAmountMultiplier = 1;
    uint256 challengeAmountDivisor = 10;
    uint256 timeSlotSize = 1 hours;
    uint256 challengePeriod = 4 hours;
    uint256 challengeResolutionPeriod = 8 days;
    uint256 unstakePeriod = 9 days; 

    /* ========== External Management Setters ========== */

    function setCrossDomainMessengerWrapper(uint256 _chainId, IMessengerWrapper _crossDomainMessenger) external onlyOwner {
        crossDomainMessenger[_chainId] = _crossDomainMessenger;
    }

    function setChallengeAmountDivisor(uint256 _challengeAmountDivisor) external onlyOwner {
        challengeAmountDivisor = _challengeAmountDivisor;
    }

    function setTimeSlotSize(uint256 _timeSlotSize) external onlyOwner {
        timeSlotSize = _timeSlotSize;
    }

    function setChallengePeriod(uint256 _challengePeriod) external onlyOwner {
        challengePeriod = _challengePeriod;
    }

    function setChallengeAmountMultiplier(uint256 _challengeAmountMultiplier) external onlyOwner {
        challengeAmountMultiplier = _challengeAmountMultiplier;
    }

    function setChallengeResolutionPeriod(uint256 _challengeResolutionPeriod) external onlyOwner {
        challengeResolutionPeriod = _challengeResolutionPeriod;
    }

    function setUnstakePeriod(uint256 _unstakePeriod) external onlyOwner {
        unstakePeriod = _unstakePeriod;
    }

    /* ========== Public Getters ========== */

    function getCrossDomainMessenger(uint256 _chainId) public view returns(IMessengerWrapper) {
        return crossDomainMessenger[_chainId];
    }

    function getChallengeAmountDivisor() public view returns(uint256) {
        return challengeAmountDivisor;
    }

    function getTimeSlotSize() public view returns(uint256) {
        return timeSlotSize;
    }

    function getChallengePeriod() public view returns(uint256) {
        return challengePeriod;
    }

    function getChallengeAmountMultiplier() public view returns(uint256) {
        return challengeAmountMultiplier;
    }

    function getChallengeResolutionPeriod() public view returns(uint256) {
        return challengeResolutionPeriod;
    }

    function getUnstakePeriod() public view returns(uint256) {
        return unstakePeriod;
    }

    function getBondForTransferAmount(uint256 _amount) public view returns (uint256) {
        // Bond covers _amount plus a bounty to pay a potential challenger
        return _amount.add(getChallengeAmountForTransferAmount(_amount));
    }

    function getChallengeAmountForTransferAmount(uint256 _amount) public view returns (uint256) {
        // Bond covers _amount plus a bounty to pay a potential challenger
        return _amount.mul(challengeAmountMultiplier).div(challengeAmountDivisor);
    }

    function getTimeSlot(uint256 _time) public view returns (uint256) {
        return _time / timeSlotSize;
    }

    function getNumberOfChallengeableTimeSlots() public view returns (uint256) {
        return timeSlotSize / challengePeriod;
    }
}
