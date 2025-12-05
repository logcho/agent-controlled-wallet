import "dotenv/config";
import { EthereumWallet } from "../src/wallets/EthereumWallet";
import { ContractInteractor } from "../src/contracts/ContractInteractor";
import { ethers } from "ethers";
import assert from "assert";

const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint amount) returns (bool)"
];

async function main() {
    console.log("Running Ethereum Interaction Tests...");

    const rpcUrl = process.env.ETH_RPC_URL;
    const privateKey = process.env.ETH_PRIVATE_KEY;
    const tokenAddress = process.env.LINK_ADDRESS; // Using LINK as example
    const recipient = process.env.ETH_RECIPIENT;

    if (!rpcUrl || !privateKey || !tokenAddress || !recipient) {
        console.error("Missing ENV variables: ETH_RPC_URL, ETH_PRIVATE_KEY, LINK_ADDRESS, ETH_RECIPIENT");
        process.exit(1);
    }

    const wallet = new EthereumWallet(rpcUrl);
    await wallet.loadFromPrivateKey(privateKey);
    console.log(`Wallet loaded: ${wallet.getAddress()}`);

    // 1. Test Read: Name
    console.log("Testing Read: name()...");
    const name = await ContractInteractor.read(wallet, tokenAddress, ERC20_ABI, "name");
    console.log(`Token Name: ${name}`);
    assert(typeof name === "string" && name.length > 0, "Name should be a non-empty string");

    // 2. Test Read: Balance
    console.log("Testing Read: balanceOf()...");
    const balance = await ContractInteractor.read(wallet, tokenAddress, ERC20_ABI, "balanceOf", [wallet.getAddress()]);
    console.log(`Balance: ${balance.toString()}`);
    assert(balance >= 0n, "Balance should be a non-negative number");

    // 3. Test Write: Approve (cheaper/safer than transfer for testing if we don't want to lose funds)
    // We'll approve the recipient for 0 tokens (or 1 wei)
    console.log("Testing Write: approve()...");
    const txHash = await ContractInteractor.write(
        wallet,
        tokenAddress,
        ERC20_ABI,
        "approve",
        [recipient, 1n]
    );
    console.log(`Approve Tx: ${txHash}`);
    assert(txHash.startsWith("0x"), "Tx hash should start with 0x");
    assert(txHash.length === 66, "Tx hash should be 66 chars long");

    console.log("Ethereum Interaction Tests Passed!");
}

main().catch((err) => {
    console.error("Test Failed:", err);
    process.exit(1);
});
