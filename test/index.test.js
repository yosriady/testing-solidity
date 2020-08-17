require("dotenv").config();

const { ethers } = require("ethers");
const erc20 = require("@studydefi/money-legos/erc20");

const fromWei = (x, u = 18) => ethers.utils.formatUnits(x, u);

describe("initial conditions", () => {
  let wallet;

  beforeAll(async () => {
    wallet = global.wallet;
  });

  test("initial DAI balance of 0", async () => {
    const daiContract = new ethers.Contract(
      erc20.dai.address,
      erc20.dai.abi,
      wallet,
    );
    const daiBalance = await daiContract.balanceOf(wallet.address);
    expect(fromWei(daiBalance)).toBe("0.0");
  });

  test("initial ETH balance of 1000 ETH", async () => {
    const ethBalance = await wallet.getBalance();
    expect(fromWei(ethBalance)).toBe("1000.0");
  });
});