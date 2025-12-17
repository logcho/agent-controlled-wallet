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

    console.log("Testing Accessors...");
    const eth = multiWallet.getWallet("eth");
    assert(eth === multiWallet.ethereum, "Accessing 'eth' returns ethereum wallet");
    assert(eth?.chain === "Ethereum", "Chain name matches");

    const sol = multiWallet.getWallet("solana");
    assert(sol, "Solana wallet accessed");
    assert(sol.chain === "Solana", "Solana chain matches");

    // 3. Test Proxy Methods
    console.log("Testing Proxy Methods...");

    // getAddress
    const ethAddress = multiWallet.getAddress("eth");
    assert(ethAddress === addresses.Ethereum, "Proxy getAddress matches");

    // getBalance (Etherem mainnet RPC might fail if offline/rate-limited, but we are using Sepolia)
    // We expect it to resolve to a string (even "0.0")
    const bal = await multiWallet.getBalance("eth");
    assert(typeof bal === "string", "Balance is string");
    console.log(`ETH Balance via proxy: ${bal}`);

    // Error handling
    try {
        multiWallet.getAddress("bitcoin");
        assert.fail("Should throw on unsupported chain");
    } catch (e: any) {
        assert(e.message.includes("Unsupported chain"), "Error message correct");
    }

    console.log("MultiChain Wallet Tests Passed!");
}

main().catch((err) => {
    console.error("Test Failed:", err);
    process.exit(1);
});
