# UUPS Proxy Prototype

A beacon prototype for UUPS.

## Feature

- compatible with UUPS logic contract
- less upgradeable logic in contract architecture
- revert when proxy call the upgradeable logic

## Implementation about Beacon

Architecture

```
+-------+                   +--------+                   +-------+
| Proxy | - delegatecall -> | Beacon | - delegatecall -> | Logic |
+-------+                   +--------+                   +-------+
    ^                          ^
    |- normal call             |- upgrade call
```
