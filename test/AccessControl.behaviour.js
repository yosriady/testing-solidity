const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

function shouldBehaveLikeAccessControl(ctx, owner) {
  it('deployer has default admin role', async () => {
    const hasAdminRole = await ctx().hasRole(DEFAULT_ADMIN_ROLE, owner)
    expect(hasAdminRole).to.equal(true);
  });
}

module.exports = shouldBehaveLikeAccessControl;