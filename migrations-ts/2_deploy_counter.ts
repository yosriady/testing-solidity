const Counter = artifacts.require("Counter");

module.exports = function(deployer) {
  deployer.deploy(Counter, 9000);
} as Truffle.Migration;
