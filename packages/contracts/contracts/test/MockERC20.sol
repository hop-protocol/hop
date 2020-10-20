pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor() public ERC20('Dai Stable Token', 'DAI') {}

    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }
}