import "dotenv/config";
import { EthereumWallet } from "../src/wallets/EthereumWallet.js";
import { ContractInteractor } from "../src/contracts/ContractInteractor.js";
import { ethers } from "ethers";

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

async function main() {
  const wallet = new EthereumWallet(process.env.ETH_RPC_URL);
  await wallet.loadFromPrivateKey(process.env.ETH_PRIVATE_KEY!);

  const RECIPIENT = process.env.ETH_RECIPIENT as string;

  console.log("Address:", wallet.getAddress());

  // READ
  const name = await ContractInteractor.read(
    wallet,
    process.env.LINK_ADDRESS!,
    ERC20_ABI,
    "name"
  );
  console.log("Token name:", name);

  // WRITE (example)
  const txHash = await ContractInteractor.write(
    wallet,
    process.env.LINK_ADDRESS!,
    ERC20_ABI,
    "transfer",
    [RECIPIENT, ethers.parseUnits("1", 18)],
  );
  

  console.log("Transfer tx hash:", txHash);
}

main().catch(console.error);
