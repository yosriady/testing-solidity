// require("dotenv").config();
// jest.setTimeout(100000);

// const { ethers } = require("ethers");
// const erc20 = require("@studydefi/money-legos/erc20");
// const uniswap = require("@studydefi/money-legos/uniswap");

// const fromWei = (x, u = 18) => ethers.utils.formatUnits(x, u);

// describe("initial conditions", () => {
//   let wallet, daiContract, uniswapFactory;

//   beforeAll(async () => {
//     wallet = global.wallet;

//     daiContract = new ethers.Contract(erc20.dai.address, erc20.dai.abi, wallet);

//     uniswapFactory = new ethers.Contract(
//       uniswap.factory.address,
//       uniswap.factory.abi,
//       wallet,
//     );
//   });

//   test("buy DAI from Uniswap manually", async () => {
//     const daiExchangeAddress = await uniswapFactory.getExchange(
//       erc20.dai.address,
//     );

//     const daiExchange = new ethers.Contract(
//       daiExchangeAddress,
//       uniswap.exchange.abi,
//       wallet,
//     );

//     // collect info on state before the swap
//     const ethBefore = await wallet.getBalance();
//     const daiBefore = await daiContract.balanceOf(wallet.address);
//     const expectedDai = await daiExchange.getEthToTokenInputPrice(
//       ethers.utils.parseEther("5"),
//     );

//     // do the actual swapping
//     await daiExchange.ethToTokenSwapInput(
//       1, // min amount of token retrieved
//       2525644800, // random timestamp in the future (year 2050)
//       {
//         gasLimit: 4000000,
//         value: ethers.utils.parseEther("5"),
//       },
//     );

//     // collect info on state after the swap
//     const ethAfter = await wallet.getBalance();
//     const daiAfter = await daiContract.balanceOf(wallet.address);
//     const ethLost = parseFloat(fromWei(ethBefore.sub(ethAfter)));

//     expect(fromWei(daiBefore)).toBe("0.0");
//     expect(fromWei(daiAfter)).toBe(fromWei(expectedDai));
//     expect(ethLost).toBeCloseTo(5);
//   });
// });