// contract-deployment/deploy-governance.ts
import * as fs from 'fs';
import * as path from 'path';
import { env } from './config';
import { loadValidators } from './utils/validators';
import { initLucid, getVerificationKeyHash, createValidator, waitForTx } from './utils/lucid-helpers';
// Import utils and additional types needed
import { validatorToAddress } from '@lucid-evolution/utils';
import { Data, SpendingValidator } from '@lucid-evolution/lucid';
import { Network } from '@lucid-evolution/core-types';

// Deployment output interface - structured for JSON file
interface GovernanceDeploymentOutput {
  contractInfo: {
    name: string;
    type: string;
    contractAddress: string;
    validatorHash: string;
    network: string;
  };
  deployment: {
    txHash: string;
    timestamp: string;
    deployerVkh: string;
    initialFunding: string;
    explorerUrl: string;
  };
  status: 'success' | 'failed';
}

// Generate block explorer URL based on network
function getBlockExplorerUrl(network: Network, txHash: string): string {
  const baseUrls = {
    Preview: 'https://preview.cardanoscan.io/transaction',
    Preprod: 'https://preprod.cardanoscan.io/transaction', 
    Mainnet: 'https://cardanoscan.io/transaction'
  } as const;
  
  return `${baseUrls[network as keyof typeof baseUrls]}/${txHash}`;
}

// Save deployment output to JSON file
function saveDeploymentOutput(output: GovernanceDeploymentOutput): void {
  const outputDir = path.join(process.cwd(), 'deployments');
  
  // Create deployments directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create timestamped filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `governance-deployment-${output.contractInfo.network.toLowerCase()}-${timestamp}.json`;
  const outputPath = path.join(outputDir, filename);
  
  // Write deployment output
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  // Also save as latest deployment for easy reference
  const latestPath = path.join(outputDir, `governance-latest-${output.contractInfo.network.toLowerCase()}.json`);
  fs.writeFileSync(latestPath, JSON.stringify(output, null, 2));
  
  console.log(`✅ Deployment output saved to: ${filename}`);
  console.log(`✅ Latest deployment saved to: governance-latest-${output.contractInfo.network.toLowerCase()}.json`);
}

// Main deployment function
async function deployGovernance() {
  const startTime = new Date();
  let deploymentOutput: GovernanceDeploymentOutput;
  
  try {
    console.log('🚀 Starting governance deployment...');
    
    // Initialize Lucid
    const lucid = await initLucid(env.MNEMONIC);
    console.log('📡 Lucid initialized');
    
    // Get validator info
    const validators = loadValidators();
    const governanceValidator = createValidator(validators.governance.compiledCode);
    console.log(`📋 Governance validator loaded. Hash: ${validators.governance.hash}`);
    
    // Get verification key hash
    const vkh = await getVerificationKeyHash(lucid);
    console.log(`👤 Deployer verification key hash: ${vkh}`);
    
    // Get network from config
    const network = lucid.config().network as Network;
    
    // Use the validatorToAddress function with the correct parameters
    const contractAddress = validatorToAddress(
      network,
      governanceValidator as SpendingValidator
    );
    console.log(`🏛️ Governance contract address: ${contractAddress}`);
    
    // Create the deployment transaction
    const initialFunding = BigInt(3000000); // 3 ADA for governance
    const tx = lucid
      .newTx()
      .pay.ToAddress(
        contractAddress,
        { lovelace: initialFunding }
      );
    
    // Complete and sign the transaction
    const signedTx = await tx.complete().then(txComplete => 
      txComplete.sign.withWallet().complete()
    );
    
    // Submit the transaction
    const txHash = await signedTx.submit();
    console.log(`📤 Transaction submitted: ${txHash}`);
    
    // Wait for confirmation
    await waitForTx(lucid, txHash);
    console.log(`✅ Transaction confirmed!`);
    
    // Generate explorer URL
    const explorerUrl = getBlockExplorerUrl(network, txHash);
    console.log(`🔍 View transaction: ${explorerUrl}`);
    
    // Create structured deployment output
    deploymentOutput = {
      contractInfo: {
        name: 'Governance',
        type: 'SpendingValidator',
        contractAddress,
        validatorHash: validators.governance.hash,
        network: network
      },
      deployment: {
        txHash,
        timestamp: new Date().toISOString(),
        deployerVkh: vkh,
        initialFunding: initialFunding.toString(),
        explorerUrl
      },
      status: 'success' as const
    };
    
    // Save deployment output to JSON file
    saveDeploymentOutput(deploymentOutput);
    
    console.log('🎉 Governance deployment completed successfully!');
    
    return {
      txHash,
      contractAddress,
      validatorHash: validators.governance.hash,
      deploymentOutput
    };
    
  } catch (error) {
    console.error('❌ Governance deployment failed:', error);
    
    // Create failed deployment output
    deploymentOutput = {
      contractInfo: {
        name: 'Governance',
        type: 'SpendingValidator',
        contractAddress: '',
        validatorHash: '',
        network: env.NETWORK || 'Preview'
      },
      deployment: {
        txHash: '',
        timestamp: new Date().toISOString(),
        deployerVkh: '',
        initialFunding: '0',
        explorerUrl: ''
      },
      status: 'failed' as const
    };
    
    // Save failed deployment output
    try {
      saveDeploymentOutput(deploymentOutput);
    } catch (saveError) {
      console.error('Failed to save deployment output:', saveError);
    }
    
    throw error;
  }
}

// Run the deployment if this file is executed directly
if (require.main === module) {
  deployGovernance()
    .then(result => {
      console.log('🎯 Deployment successful!');
      console.log('📋 Summary:');
      console.log(`   Contract Address: ${result.contractAddress}`);
      console.log(`   Transaction Hash: ${result.txHash}`);
      console.log(`   Validator Hash: ${result.validatorHash}`);
    })
    .catch(error => {
      console.error('💥 Deployment failed:', error);
      process.exit(1);
    });
}

export { deployGovernance };
export type { GovernanceDeploymentOutput };