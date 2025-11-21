import "dotenv/config";
import { ethers } from "ethers";
import { EthereumWallet } from "../src/wallets/EthereumWallet.js";
import { ContractInteractor } from "../src/contracts/ContractInteractor.js";

/**
 * UniswapV2 Router ABI (simplified)
 */
const UNISWAP_ROUTER_ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)",
];

/**
 * This test demonstrates:
 * 1. Reading swap quotes
 * 2. Swapping ETH → ERC20
 * 3. Swapping ERC20 → ERC20
 */
async function main() {
  const wallet = new EthereumWallet(process.env.ETH_RPC_URL);
  await wallet.loadFromPrivateKey(process.env.ETH_PRIVATE_KEY!);

  const address = wallet.getAddress();
  console.log("Wallet Address:", address);

  // ENV must contain:
  // UNISWAP_ROUTER=0x...
  // TOKEN_IN (e.g., ETH or ERC20)
  // TOKEN_OUT (ERC20 receiving)

  const ROUTER = process.env.UNISWAP_ROUTER!;
  const TOKEN_IN = process.env.SWAP_TOKEN_IN!;     // e.g. WETH
  const TOKEN_OUT = process.env.SWAP_TOKEN_OUT!;   // e.g. LINK
  const ONE_ETH = ethers.parseEther("0.01");

  console.log(`\nUsing Router: ${ROUTER}`);
  console.log(`Swap Path: ${TOKEN_IN} -> ${TOKEN_OUT}`);

  // 1. Get Quote
  const amounts = await ContractInteractor.read(
    wallet,
    ROUTER,
    UNISWAP_ROUTER_ABI,
    "getAmountsOut",
    [ONE_ETH, [TOKEN_IN, TOKEN_OUT]]
  );

  console.log("Quote: 0.01 ETH gives:", amounts.toString());

  // 2. ETH → ERC20 Swap
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

  const txHash = await ContractInteractor.write(
    wallet,
    ROUTER,
    UNISWAP_ROUTER_ABI,
    "swapExactETHForTokens",
    [
      0,                       // amountOutMin (0 for demo)
      [TOKEN_IN, TOKEN_OUT],   // path
      address,                 // recipient
      deadline                 // deadline
    ],
    {
      value: ONE_ETH           // send ETH
    }
  );

  console.log("\nSwap ETH → ERC20 Tx:", txHash);

  // 3. OPTIONAL: ERC20 → ERC20 Swap (TOKEN_IN must be an ERC20)
  // Approvals required
  // ERC20_ABI
  const ERC20_ABI = [
    "function approve(address spender, uint amount) public returns (bool)"
  ];

  console.log("\nApproving Router to spend our ERC20...");

  await ContractInteractor.write(
    wallet,
    TOKEN_IN,
    ERC20_ABI,
    "approve",
    [ROUTER, ethers.parseUnits("1000", 18)]
  );

  console.log("Approval complete!");

  const tokenSwapTx = await ContractInteractor.write(
    wallet,
    ROUTER,
    UNISWAP_ROUTER_ABI,
    "swapExactTokensForTokens",
    [
      ethers.parseUnits("1", 18),   // 1 TokenIn
      0,                             // amountOutMin
      [TOKEN_IN, TOKEN_OUT],         // path
      address,
      deadline
    ]
  );

  console.log("\nSwap ERC20 → ERC20 Tx:", tokenSwapTx);
}

main().catch(console.error);
