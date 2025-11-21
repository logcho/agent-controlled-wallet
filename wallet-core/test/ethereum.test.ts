import { ethers } from "ethers";
import { EthereumWallet } from "../src/wallets/EthereumWallet.js";
import "dotenv/config"; 

async function main() {
  // RPC configuration (use Alchemy Sepolia endpoint)
  const RPC_URL = process.env.ETH_RPC_URL as string;

  // Private key for a wallet funded with Sepolia test ETH
  const PRIVATE_KEY = process.env.ETH_PRIVATE_KEY as string;

  // Amount (in ETH) and recipient address
  const SEND_AMOUNT = "0.001";
  const RECIPIENT = process.env.ETH_RECIPIENT as string;

  console.log("Starting EthereumWallet test...\n");

  // 1. Initialize and load wallet
  const wallet = new EthereumWallet(RPC_URL);
  await wallet.loadFromPrivateKey(PRIVATE_KEY);

  console.log("Address:", wallet.getAddress());
  console.log("Network Info:", await wallet.getNetworkInfo());
  console.log("Current Balance:", await wallet.getBalance(), "ETH");

  // 2. Sign and verify an arbitrary message
  const message = "Testing EthereumWallet signing on Sepolia";
  const signature = await wallet.signMessage(message);
  const recovered = ethers.verifyMessage(message, signature);

  console.log("\nMessage Signature:", signature);
  console.log("Recovered Address:", recovered);

  // 3. Build a populated transaction
  const txData = await wallet.createTransactionData(RECIPIENT, SEND_AMOUNT);
  console.log("\nPrepared Transaction:", txData);

  // 4. Sign the transaction
  const signedTx = await wallet.signTransaction(txData);
  console.log("\nSigned Transaction (hex):", signedTx.slice(0, 80) + "...");

  // 5. Broadcast the transaction to the network
  console.log("\nBroadcasting transaction...");
  const txHash = await wallet.sendTransaction(signedTx);

  console.log("Transaction Sent!");
  console.log("Etherscan:", `https://sepolia.etherscan.io/tx/${txHash}`);

  // 6. Verify balance update after sending
  const newBalance = await wallet.getBalance();
  console.log("\nNew Balance:", newBalance, "ETH");
}

main().catch((err) => {
  console.error("\nError during test:", err);
});
