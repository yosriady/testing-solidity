const { ethers } = require('ethers')
const {
  BN,           // Big Number support e.g. new BN(1)
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,         // Time manipulation
} = require('@openzeppelin/test-helpers');

const CounterArtifact = require("../build/contracts/Counter.json");
const Counter = new ethers.ContractFactory(
  CounterArtifact['abi'],
  CounterArtifact['bytecode'],
  wallet,
)
// const shouldBehaveLikeAccessControl = require('./AccessControl.behaviour');

const INITIAL_VALUE = 123;
const PUBLISHER_ROLE = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([ "string" ], [ "PUBLISHER_ROLE" ]))

describe('Counter', () => {
  let wallet;
  let owner;
  let other;
  let counter;

  beforeAll(async () => {
    wallet = global.wallet;
    const account = await wallet.getAddress()
    owner = account
    // TOFIX: this doesn't list all the accounts
    const accounts = await wallet.provider.listAccounts()
    console.log(accounts)
    // [ owner, other ] = accounts;
  });

  beforeEach(async () => {
    // Deploy Counter contract before every test
    counter = await Counter.deploy(INITIAL_VALUE);
  });

  // shouldBehaveLikeAccessControl(() => counter, owner);

  it('initializes with an initial value', async () => {
    const value = await counter.read();

    // Jest Expect
    expect(value.toNumber()).toBe(INITIAL_VALUE);
  });

  // it('non-publishers cannot call publish', async () => {
  //   const isPublisher = await counter.hasRole(PUBLISHER_ROLE, other);
  //   expect(isPublisher).to.equal(false);

  //   await expectRevert(
  //     counter.publish(9000, { from: other }),
  //     "Caller is not a publisher."
  //   );
  // });  

  it('publishers can call publish', async () => {
    // ERROR: project ID does not have access to archive state
    const isPublisher = await counter.hasRole(PUBLISHER_ROLE, owner);
    expect(isPublisher).to.equal(true);

    const NEW_VALUE = 9000;
    // const receipt = await counter.publish(NEW_VALUE, { from: owner });

    // expectEvent(receipt, 'Published', { source: owner, newValue: new BN(NEW_VALUE) });
    
    // const newValue = await counter.read();
    // expect(newValue.toNumber()).to.equal(NEW_VALUE);
  });

  // it('subsequent publishes must wait for at least an hour', async () => {
  //   await counter.publish(9001, { from: owner });

  //   await expectRevert(
  //     counter.publish(9002, { from: owner }),
  //     "Updates must be between at least an hour apart."
  //   );

  //   await time.increase(3720); // 1 hour 2 minutes
  //   await counter.publish(9002, { from: owner });

  //   const newValue = await counter.read();
  //   expect(newValue.toNumber()).to.equal(9002);
  // });  
})