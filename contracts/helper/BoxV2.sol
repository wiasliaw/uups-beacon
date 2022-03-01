// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract BoxV2 is Initializable, UUPSUpgradeable {
    uint256 private _value;

    constructor() initializer {}

    function initialize() public initializer {
        _changeAdmin(msg.sender);
    }

    function get() external view returns (uint256) {
        return _value;
    }

    function set(uint256 value_) external {
        _value = value_ + 10;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        virtual
        override
    {
        require(_getAdmin() == msg.sender, "Box: not admin");
    }
}
