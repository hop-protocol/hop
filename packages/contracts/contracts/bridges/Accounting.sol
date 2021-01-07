// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

/**
 * @dev Accounting is an abstract contract that encapsulates the most critical logic in the Hop system.
 * The accounting system works by using two balances that can only increase `_credit` and `_debit`.
 * The committee's available balance is the total credit minus the total debit. The contract exposes
 * two external functions that allow the committee to stake and unstake and exposes two internal
 * functions to it's parent contracts that allows the parent contract to add to the
 * credit and debit balance. In addition, parent contracts can override `_additionalDebit` to account
 * for any additional debit balance in an alternative way. Lastly, it exposes a modifier,
 * `requirePositiveBalance`, that can be used by parent contracts to ensure the committee does not
 * use more than its available stake.
 */

abstract contract Accounting {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address private _committee;

    uint256 private _credit;
    uint256 private _debit;

    event Stake (
        uint256 amount
    );

    event Unstake (
        uint256 amount
    );

    /* ========== Modifiers ========== */

    modifier onlyCommittee {
        require(msg.sender == _committee, "ACT: Caller is not committee");
        _;
    }

    /// @dev Used by parent contract to ensure that the committee is solvent at the end of the transaction.
    modifier requirePositiveBalance {
        _;
        require(_credit >= getDebit(), "ACT: Not enough available credit");
    }

    /// @dev Sets the committee address
    constructor(address committee_) public {
        _committee = committee_;
    }

    /* ========== Virtual functions ========== */

    function _transferFromBridge(address _recipient, uint256 _amount) internal virtual;
    function _transferToBridge(address _from, uint256 _amount) internal virtual;

    /**
     * @dev This function can be optionally overridden by a parent contract to track any additional
     * debit balance in an alternative way.
     */
    function _additionalDebit() internal view virtual returns (uint256) {
        this; // Silence state mutability warning without generating any additional byte code
        return 0;
    }

    /* ========== Public getters ========== */

    function getCommittee() public view returns (address) {
        return _committee;
    }

    function getCredit() external view returns (uint256) {
        return _credit;
    }

    function getDebit() public view returns (uint256) {
        return _debit.add(_additionalDebit());
    }

    /* ========== Committee public functions ========== */

    /** 
     * @dev Allows the committee to deposit tokens and increase its credit balance
     * @param _amount The amount being staked
     */
    function stake(uint256 _amount) external {
        _transferToBridge(msg.sender, _amount);
        _addCredit(_amount);
    }
    /**
     * @dev Allows the committee to withdraw any available balance and add to its debit balance
     * @param _amount The amount being staked
     */
    function unstake(uint256 _amount) external requirePositiveBalance onlyCommittee {
        _addDebit(_amount);
        _transferFromBridge(_committee, _amount);
    }

    /* ========== Internal functions ========== */

    function _addCredit(uint256 _amount) internal {
        _credit = _credit.add(_amount);
    }

    function _addDebit(uint256 _amount) internal {
        _debit = _debit.add(_amount);
    }
}
