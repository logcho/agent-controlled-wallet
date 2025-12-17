import "dotenv/config";
import { MultiChainWallet } from "../src/wallets/MultiChainWallet";
import assert from "assert";

async function main() {
    console.log("Running MultiChain Wallet Tests...");

    // 1. Test Single Mnemonic Loading
    console.log("Testing Unified Loading from Mnemonic...");
    // Use a valid mnemonic (from previous Cosmos output or new one)
    const TEST_MNEMONIC = "term huge balcony journey dash moon biology age unfair trash math monitor";

    const multiWallet = new MultiChainWallet({
        ethRpcUrl: process.env.ETH_RPC_URL,
        solanaRpcUrl: process.env.SOLANA_RPC_URL,
        cosmosRpcUrl: process.env.COSMOS_RPC_URL,
        cosmosPrefix: "akash" // Test configuring prefix
    });

    await multiWallet.loadFromMnemonic(TEST_MNEMONIC);
    const addresses = multiWallet.getAllAddresses();
    console.log("Loaded Addresses:", addresses);

    assert(addresses.Ethereum.startsWith("0x"), "Eth address valid");
    assert(addresses.Solana.length > 30, "Solana address valid");
    assert(addresses.Cosmos.startsWith("akash"), "Cosmos address uses configured prefix");

    // 2. Test Get Wallet Accessors
    console.log("Testing Accessors...");
    const eth = multiWallet.getWallet("eth");
    assert(eth === multiWallet.ethereum, "Accessing 'eth' returns ethereum wallet");
    assert(eth?.chain === "Ethereum", "Chain name matches");

    const sol = multiWallet.getWallet("solana");
    assert(sol, "Solana wallet accessed");
    assert(sol.chain === "Solana", "Solana chain matches");

    console.log("MultiChain Wallet Tests Passed!");
}

main().catch((err) => {
    console.error("Test Failed:", err);
    process.exit(1);
});
