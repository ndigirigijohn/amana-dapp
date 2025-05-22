// offchain/deployment/deploy-entity-registry.ts
import { env } from '../config';
import { loadValidators } from '../utils/validators';
import { initLucid, getVerificationKeyHash, createValidator, waitForTx } from '../utils/lucid-helpers';
// Import utils and additional types needed
import { validatorToAddress } from '@lucid-evolution/utils';
import { Data, SpendingValidator } from '@lucid-evolution/lucid';
import { Network } from '@lucid-evolution/core-types';

// Main deployment function
async function deployEntityRegistry() {
  try {
    console.log('Starting entity registry deployment...');
    
    // Initialize Lucid
    const lucid = await initLucid(env.MNEMONIC);
    console.log('Lucid initialized');
    
    // Get validator info
    const validators = loadValidators();
    const entityRegistryValidator = createValidator(validators.entityRegistry.compiledCode);
    console.log(`Entity registry validator loaded. Hash: ${validators.entityRegistry.hash}`);
    
    // Get verification key hash
    const vkh = await getVerificationKeyHash(lucid);
    console.log(`Deployer verification key hash: ${vkh}`);
    
    // Get network from config
    const network = lucid.config().network as Network;
    
    // Use the validatorToAddress function with the correct parameters
    const contractAddress = validatorToAddress(
      network,
      entityRegistryValidator as SpendingValidator
    );
    console.log(`Entity registry contract address: ${contractAddress}`);
    
    // Create the deployment transaction
    const tx = lucid
      .newTx()
      .pay.ToAddress(
        contractAddress,
        { lovelace: BigInt(2000000) }  // Use BigInt() function instead of n suffix
      );
    
    // Complete and sign the transaction
    const signedTx = await tx.complete().then(txComplete => 
      txComplete.sign.withWallet().complete()
    );
    
    // Submit the transaction
    const txHash = await signedTx.submit();
    
    console.log(`Entity registry deployed. Transaction hash: ${txHash}`);
    console.log(`Contract address: ${contractAddress}`);
    
    // Wait for confirmation
    await waitForTx(lucid, txHash);
    
    return {
      txHash,
      contractAddress,
      validatorHash: validators.entityRegistry.hash
    };
  } catch (error) {
    console.error('Error deploying entity registry:', error);
    throw error;
  }
}

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

export { deployEntityRegistry };