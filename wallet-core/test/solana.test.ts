import "dotenv/config";
import { SolanaWallet } from "../src/wallets/SolanaWallet.js";
import { PublicKey } from "@solana/web3.js";

async function main() {
  // Load Solana RPC URL and private key from .env
  const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
  const PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;
  const RECIPIENT = process.env.SOLANA_RECIPIENT as string;

  console.log("Starting SolanaWallet test...\n");

  // 1. Initialize and load wallet
  const wallet = new SolanaWallet(RPC_URL);

  if (PRIVATE_KEY) {
    await wallet.loadFromPrivateKey(PRIVATE_KEY);
    console.log("Loaded wallet from private key.");
  } else {
    await wallet.generateNewWallet();
    console.log("Generated new wallet.");
  }

  console.log("Address:", wallet.getAddress());
  console.log("Network Info:", await wallet.getNetworkInfo());
  console.log("Current Balance:", await wallet.getBalance(), "SOL");

  // 2. Sign and verify a message
  const message = "Testing SolanaWallet signing on Devnet";
  const signature = await wallet.signMessage(message);
  console.log("\nMessage Signature (base64):", signature);

  // 3. (Optional) Create and send a small SOL transfer
  // NOTE: only run this if the wallet has some Devnet SOL
  const recipient = new PublicKey(RECIPIENT); // example recipient
  const sendAmount = "0.001";

  console.log("\nPreparing transaction...");
  const txData = await wallet.createTransactionData(recipient.toBase58(), sendAmount);
  const signedTx = await wallet.signTransaction(txData);

  console.log("Signed Transaction (bytes):", signedTx.length);

  console.log("\nBroadcasting transaction...");
  const txHash = await wallet.sendTransaction(signedTx);

  console.log("Transaction Sent!");
  console.log("Explorer URL:", `https://explorer.solana.com/tx/${txHash}?cluster=devnet`);

  // 4. Verify balance after sending
  const newBalance = await wallet.getBalance();
  console.log("\nNew Balance:", newBalance, "SOL");
}

main().catch((err) => {
  console.error("\nError during Solana test:", err);
});
