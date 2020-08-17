import { CounterInstance } from "../types/truffle-contracts";

const {
  BN,           // Big Number support e.g. new BN(1)
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,         // Time manipulation
} = require('@openzeppelin/test-helpers');

const Counter = artifacts.require("Counter");
const shouldBehaveLikeAccessControl = require('./AccessControl.behaviour');

const INITIAL_VALUE = 123;
const PUBLISHER_ROLE = web3.utils.soliditySha3('PUBLISHER_ROLE') as string;

contract('Counter', (accounts) => {
  const [ owner, other ] = accounts;

  let counter: CounterInstance;

  beforeEach(async () => {
    // Deploy Counter contract before every test
    counter = await Counter.new(INITIAL_VALUE, { from: owner });
  });

  shouldBehaveLikeAccessControl(() => counter, owner);

  it('initializes with an initial value', async () => {
    const value = await counter.read();

    // Chai Assert
    assert.equal(value.toNumber(), INITIAL_VALUE, 'value should be equal to initial value');
    assert.typeOf(value.toNumber(), 'number', 'value should be convertible to number');

    // Chai Expect
    expect(value.toNumber(), 'value should be equal to initial value').to.equal(INITIAL_VALUE);
    expect(value.toString(), 'value should be convertible to string').to.be.a('string');
  });

  it('non-publishers cannot call publish', async () => {
    const isPublisher = await counter.hasRole(PUBLISHER_ROLE, other);
    expect(isPublisher).to.equal(false);

    await expectRevert(
      counter.publish(9000, { from: other }),
      "Caller is not a publisher."
    );
  });  

  it('publishers can call publish', async () => {
    const isPublisher = await counter.hasRole(PUBLISHER_ROLE, owner);
    expect(isPublisher).to.equal(true);

    const NEW_VALUE = 9000;
    const receipt = await counter.publish(NEW_VALUE, { from: owner });

    expectEvent(receipt, 'Published', { source: owner, newValue: new BN(NEW_VALUE) });
    
    const newValue = await counter.read();
    expect(newValue.toNumber()).to.equal(NEW_VALUE);
  });

  it('subsequent publishes must wait for at least an hour', async () => {
    await counter.publish(9001, { from: owner });

    await expectRevert(
      counter.publish(9002, { from: owner }),
      "Updates must be between at least an hour apart."
    );

    await time.increase(3720); // 1 hour 2 minutes
    await counter.publish(9002, { from: owner });

    const newValue = await counter.read();
    expect(newValue.toNumber()).to.equal(9002);
  });  
})