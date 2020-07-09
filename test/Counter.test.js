const Counter = artifacts.require("Counter");

contract('Counter', (accounts) => {
  const [ owner ] = accounts;

  beforeEach(async () => {
    this.counter = await Counter.new(123, { from: owner });
  });

  it('initializes with an initial value', async () => {
    const value = await this.counter.read();
    expect(value.toNumber()).to.equal(123);
  });
})