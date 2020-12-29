// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

abstract contract Accounting {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address private _committee;
    IERC20 private _collateralToken;

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

    modifier requirePositiveBalance {
        _;
        require(_credit >= getTotalDebit(), "ACT: Not enough available credit");
    }

    constructor(IERC20 collateralToken_, address committee_) public {
        _collateralToken = collateralToken_;
        _committee = committee_;
    }

     /* ========== Virtual functions ========== */

    function _transfer(address _recipient, uint256 _amount) internal virtual;

    function _additionalDebit() internal view virtual returns (uint256) {
        this; // Silence state mutability warning without generating any additional byte code
        return 0;
    }

     /* ========== Public getters ========== */

    function getCommittee() public view returns (address) {
        return _committee;
    }

    function getCommitteeBalances() public view returns (uint256, uint256) {
        return (_credit, getTotalDebit());
    }

    function getTotalDebit() public view returns (uint256) {
        return _debit.add(_additionalDebit());
    }

    function getCollateralToken() public view returns (IERC20) {
        return _collateralToken;
    }

     /* ========== Committee public functions ========== */

    function stake(uint256 _amount) public {
        _collateralToken.transferFrom(msg.sender, address(this), _amount);
        _addCredit(_amount);
    }

    function unstake(uint256 _amount) public requirePositiveBalance {
        _addDebit(_amount);
        _collateralToken.transfer(_committee, _amount);
    }

     /* ========== Internal functions ========== */

    function _addCredit(uint256 _amount) internal {
        _credit = _credit.add(_amount);
    }

    function _addDebit(uint256 _amount) internal {
        _debit = _debit.add(_amount);
    }
}
