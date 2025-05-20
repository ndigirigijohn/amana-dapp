"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployEntityRegistry = void 0;
// offchain/deployment/deploy-entity-registry.ts
const config_1 = require("../config");
const validators_1 = require("../utils/validators");
const lucid_helpers_1 = require("../utils/lucid-helpers");
// Import utils and additional types needed
const utils_1 = require("@lucid-evolution/utils");
// Main deployment function
async function deployEntityRegistry() {
    try {
        console.log('Starting entity registry deployment...');
        // Initialize Lucid
        const lucid = await (0, lucid_helpers_1.initLucid)(config_1.env.PRIVATE_KEY);
        console.log('Lucid initialized');
        // Get validator info
        const validators = (0, validators_1.loadValidators)();
        const entityRegistryValidator = (0, lucid_helpers_1.createValidator)(validators.entityRegistry.compiledCode);
        console.log(`Entity registry validator loaded. Hash: ${validators.entityRegistry.hash}`);
        // Get verification key hash
        const vkh = await (0, lucid_helpers_1.getVerificationKeyHash)(lucid);
        console.log(`Deployer verification key hash: ${vkh}`);
        // Get network from config
        const network = lucid.config().network;
        // Use the validatorToAddress function with the correct parameters
        const contractAddress = (0, utils_1.validatorToAddress)(network, entityRegistryValidator);
        console.log(`Entity registry contract address: ${contractAddress}`);
        // Create the deployment transaction
        const tx = lucid
            .newTx()
            .pay.ToAddress(contractAddress, { lovelace: BigInt(2000000) } // Use BigInt() function instead of n suffix
        );
        // Complete and sign the transaction
        const signedTx = await tx.complete().then(txComplete => txComplete.sign.withWallet().complete());
        // Submit the transaction
        const txHash = await signedTx.submit();
        console.log(`Entity registry deployed. Transaction hash: ${txHash}`);
        console.log(`Contract address: ${contractAddress}`);
        // Wait for confirmation
        await (0, lucid_helpers_1.waitForTx)(lucid, txHash);
        return {
            txHash,
            contractAddress,
            validatorHash: validators.entityRegistry.hash
        };
    }
    catch (error) {
        console.error('Error deploying entity registry:', error);
        throw error;
    }
}
exports.deployEntityRegistry = deployEntityRegistry;
// Run the deployment if this file is executed directly
if (require.main === module) {
    deployEntityRegistry()
        .then(result => {
        console.log('Deployment successful!');
        console.log(JSON.stringify(result, null, 2));
    })
        .catch(error => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });
}
