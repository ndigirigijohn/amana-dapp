"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForTx = exports.createValidator = exports.getVerificationKeyHash = exports.initLucid = void 0;
// offchain/utils/lucid-helpers.ts
const lucid_1 = require("@lucid-evolution/lucid");
// Import additional utilities that might be needed
const utils_1 = require("@lucid-evolution/utils");
const config_1 = require("../config");
// Initialize Lucid with Blockfrost provider
async function initLucid(privateKeyHex) {
    const lucid = await (0, lucid_1.Lucid)(new lucid_1.Blockfrost(config_1.selectedNetwork.url, config_1.selectedNetwork.projectId), 'Preview');
    // Use the correct method to select wallet from private key
    lucid.selectWallet.fromPrivateKey(privateKeyHex);
    return lucid;
}
exports.initLucid = initLucid;
// Get verification key hash from a wallet
async function getVerificationKeyHash(lucid) {
    // IMPORTANT: Now using await since address() is asynchronous
    const address = await lucid.wallet().address();
    // Use the imported getAddressDetails function
    const { paymentCredential } = (0, utils_1.getAddressDetails)(address);
    if (!paymentCredential || paymentCredential.type !== 'Key') {
        throw new Error('Payment credential not found or not of type Key');
    }
    return paymentCredential.hash;
}
exports.getVerificationKeyHash = getVerificationKeyHash;
// Create a validator from compiled code
function createValidator(compiledCode) {
    return {
        type: 'PlutusV2',
        script: compiledCode
    };
}
exports.createValidator = createValidator;
// Wait for transaction confirmation
async function waitForTx(lucid, txHash) {
    await lucid.awaitTx(txHash);
    console.log(`Transaction confirmed: ${txHash}`);
    // Get the UTXOs created by this transaction
    // IMPORTANT: Now using await since address() is asynchronous
    const address = await lucid.wallet().address();
    const utxos = await lucid.utxosAt(address);
    return utxos;
}
exports.waitForTx = waitForTx;
