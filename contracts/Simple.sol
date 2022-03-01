// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Simple {
    uint256 private _value;

    function get() external view returns (uint256) {
        return _value;
    }

    function set(uint256 value_) external {
        _value = value_;
    }
}
