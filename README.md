# UUPS Proxy Prototype

A beacon prototype for UUPS.

## Problem

Check out the architecture about beacon in transparent proxy.

```
+-------+                    +-------+
| Proxy | -- delegatecall -> | Logic |
+-------+                    +-------+
    |                         +--------+
    +<- getImplementation() - | Beacon |
                              +--------+
```

Since UUPS' upgradeable logic is placed in logic contract, every `upgrade call` will setup new implementation address into proxy's storage. However, when beacon join, `upgrade call` should setup new implementation address in beacon, not proxy. Additionally, upgradeable logic will check the new implementation if it implements `proxiableUUID()`, but beacon doesn't.


## Implementation about Beacon

Architecture

```
+-------+                   +--------+                   +-------+
| Proxy | - delegatecall -> | Beacon | - delegatecall -> | Logic |
+-------+                   +--------+                   +-------+
    ^                          ^
    |- normal call             |- upgrade call
```

### Proxy

This is simple. It can inherit contracts below to setup.

contracts:
1. `@openzeppelin/contracts/proxy/Proxy.sol`
2. `@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol`
3. `@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol`

### Beacon

- Force selector clashing
    - Since the goal is to setup new implementation address in beacon, the `upgrade call` should come from beacon. Therefore, beacon contract implements `upgradeTo` and `upgradeToAndCall` to make selector clashing happen on purpose.
- `notDelegated` modifier
    - The modifier is prevent `upgrade call` which comes from proxy.

### Logic

The logic contract inherited `@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol`.
