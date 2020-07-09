const {
  BN,           // Big Number support e.g. new BN(1)
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const Counter = artifacts.require("Counter");
const shouldBehaveLikeAccessControl = require('./AccessControl.behaviour');

const INITIAL_VALUE = 123;
const PUBLISHER_ROLE = web3.utils.soliditySha3('PUBLISHER_ROLE');

contract('Counter', (accounts) => {
  const [ owner, other ] = accounts;

  beforeEach(async () => {
    // Deploy Counter contract
    this.counter = await Counter.new(INITIAL_VALUE, { from: owner });
  });

  shouldBehaveLikeAccessControl(() => this.counter, owner);

  it('initializes with an initial value', async () => {
    const value = await this.counter.read();

    // Chai Assert
    assert.equal(value.toNumber(), INITIAL_VALUE, 'value should be equal to initial value');
    assert.typeOf(value.toNumber(), 'number', 'value should be convertible to number');

    // Chai Expect
    expect(value.toNumber(), 'value should be equal to initial value').to.equal(INITIAL_VALUE);
    expect(value.toString(), 'value should be convertible to string').to.be.a('string');
  });

  it('non-publishers cannot call publish', async () => {
    const isPublisher = await this.counter.hasRole(PUBLISHER_ROLE, other);
    expect(isPublisher).to.equal(false);

    await expectRevert(
      this.counter.publish(9000, { from: other }),
      "Caller is not a publisher."
    );
  });  

  it('publishers can call publish', async () => {
    const isPublisher = await this.counter.hasRole(PUBLISHER_ROLE, owner);
    expect(isPublisher).to.equal(true);

    const NEW_VALUE = 9000;
    const receipt = await this.counter.publish(NEW_VALUE, { from: owner });

    expectEvent(receipt, 'Published', { source: owner, newValue: new BN(NEW_VALUE) });
    
    const newValue = await this.counter.read();
    expect(newValue.toNumber()).to.equal(NEW_VALUE);
  });
})