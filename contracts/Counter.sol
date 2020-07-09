// solium-disable security/no-block-members
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

import "@openzeppelin/contracts/access/AccessControl.sol";


/**
 * @title   Counter
 * @notice  A simple storage contract that stores a value.
 */
contract Counter is AccessControl {
    uint private _value;
    uint private _lastUpdatedAt;

    bytes32 public constant PUBLISHER_ROLE = keccak256("PUBLISHER_ROLE");

    event Published(address indexed source, uint newValue);

    constructor(uint initialValue) public {
        _value = initialValue;

        // Grant the admin role to the contract deployer
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        // Grant the publisher role to the contract deployer
        _setupRole(PUBLISHER_ROLE, msg.sender);
    }

    /**
     * @notice Publish a new value for the counter.
     * @dev Updates must be at least an hour apart.
     * @param newValue The new value
     */
    function publish(uint newValue) public {
      require(hasRole(PUBLISHER_ROLE, msg.sender), "Caller is not a publisher.");
      require(now > _lastUpdatedAt + 60 minutes, "Updates must be between at least an hour apart.");
      _value = newValue;
      _lastUpdatedAt = now;
      emit Published(msg.sender, newValue);
    }

    /**
     * @notice Read the counter's value.
     * @return The counter's current value.
     */
    function read() public view returns (uint) {
        return _value;
    }
}
