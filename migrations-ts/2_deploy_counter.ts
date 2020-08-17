const Counter = artifacts.require("Counter");

module.exports = function(deployer) {
  console.log('lol');
  deployer.deploy(Counter, 9000);
} as Truffle.Migration;
