"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var EthereumWallet_js_1 = require("./wallets/EthereumWallet.js");
require("dotenv/config");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var RPC_URL, PRIVATE_KEY, SEND_AMOUNT, RECIPIENT, wallet, _a, _b, _c, _d, _e, _f, message, signature, recovered, txData, signedTx, txHash, newBalance;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    RPC_URL = process.env.ALCHEMY_RPC_URL;
                    PRIVATE_KEY = process.env.PRIVATE_KEY;
                    SEND_AMOUNT = "0.001";
                    RECIPIENT = process.env.RECIPIENT;
                    console.log("Starting EthereumWallet test...\n");
                    wallet = new EthereumWallet_js_1.EthereumWallet(RPC_URL);
                    return [4 /*yield*/, wallet.loadFromPrivateKey(PRIVATE_KEY)];
                case 1:
                    _g.sent();
                    console.log("Address:", wallet.getAddress());
                    _b = (_a = console).log;
                    _c = ["Network Info:"];
                    return [4 /*yield*/, wallet.getNetworkInfo()];
                case 2:
                    _b.apply(_a, _c.concat([_g.sent()]));
                    _e = (_d = console).log;
                    _f = ["Current Balance:"];
                    return [4 /*yield*/, wallet.getBalance()];
                case 3:
                    _e.apply(_d, _f.concat([_g.sent(), "ETH"]));
                    message = "Testing EthereumWallet signing on Sepolia";
                    return [4 /*yield*/, wallet.signMessage(message)];
                case 4:
                    signature = _g.sent();
                    recovered = ethers_1.ethers.verifyMessage(message, signature);
                    console.log("\nMessage Signature:", signature);
                    console.log("Recovered Address:", recovered);
                    return [4 /*yield*/, wallet.createTransactionData(RECIPIENT, SEND_AMOUNT)];
                case 5:
                    txData = _g.sent();
                    console.log("\nPrepared Transaction:", txData);
                    return [4 /*yield*/, wallet.signTransaction(txData)];
                case 6:
                    signedTx = _g.sent();
                    console.log("\nSigned Transaction (hex):", signedTx.slice(0, 80) + "...");
                    // 5. Broadcast the transaction to the network
                    console.log("\nBroadcasting transaction...");
                    return [4 /*yield*/, wallet.sendTransaction(signedTx)];
                case 7:
                    txHash = _g.sent();
                    console.log("Transaction Sent!");
                    console.log("Etherscan:", "https://sepolia.etherscan.io/tx/".concat(txHash));
                    return [4 /*yield*/, wallet.getBalance()];
                case 8:
                    newBalance = _g.sent();
                    console.log("\nNew Balance:", newBalance, "ETH");
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.error("\nError during test:", err);
});
