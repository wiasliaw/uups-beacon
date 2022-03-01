// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/proxy/Proxy.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract UUPSBeacon is Proxy, UUPSUpgradeable {
    using Address for address;

    constructor(address newImplementation_, bytes memory data_) {
        _changeAdmin(msg.sender);
        _upgradeToAndCallUUPS(newImplementation_, data_, false);
    }

    function implementation() external view returns (address) {
        return _implementation();
    }

    /// @dev override {Proxy}
    function _implementation() internal view override returns (address) {
        return _getImplementation();
    }

    /// @dev override {UUPSUpgradeable}
    function upgradeTo(address newImplementation_)
        external
        override
        notDelegated
    {
        _authorizeUpgrade(newImplementation_);
        // delegate call to UUPS proxied
        bytes memory payload = abi.encodeWithSignature(
            "upgradeTo(address)",
            newImplementation_
        );
        _getImplementation().functionDelegateCall(payload);
    }

    /// @dev override {UUPSUpgradeable}
    function upgradeToAndCall(address newImplementation_, bytes memory data_)
        external
        payable
        override
        notDelegated
    {
        _authorizeUpgrade(newImplementation_);
        // delegate call to UUPS proxied
        bytes memory payload = abi.encodeWithSignature(
            "upgradeTo(address,bytes memory)",
            newImplementation_,
            data_
        );
        _getImplementation().functionDelegateCall(payload);
    }

    /// @dev override {UUPSUpgradeable}
    function _authorizeUpgrade(address newImplementation)
        internal
        virtual
        override
    {
        require(_getAdmin() == msg.sender, "Beacon: not the owner");
    }
}
