// contract-deployment/deploy-member-nft.ts
import * as fs from 'fs';
import * as path from 'path';
import { env } from './config';
import { loadValidators } from './utils/validators';
import { initLucid, getVerificationKeyHash, waitForTx } from './utils/lucid-helpers';
// Import utils and additional types needed
import { Data, MintingPolicy } from '@lucid-evolution/lucid';
import { mintingPolicyToId } from '@lucid-evolution/utils';
import { Network } from '@lucid-evolution/core-types';

// Deployment output interface - structured for JSON file
interface MemberNFTDeploymentOutput {
  contractInfo: {
    name: string;
    type: string;
    policyId: string;
    validatorHash: string;
    network: string;
  };
  deployment: {
    txHash: string;
    timestamp: string;
    deployerVkh: string;
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

// Create a minting policy from compiled code
function createMintingPolicy(compiledCode: string): MintingPolicy {
  return {
    type: 'PlutusV2',
    script: compiledCode
  };
}

// Save deployment output to JSON file
function saveDeploymentOutput(output: MemberNFTDeploymentOutput): void {
  const outputDir = path.join(process.cwd(), 'deployments');
  
  // Create deployments directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Create timestamped filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `member-nft-deployment-${output.contractInfo.network.toLowerCase()}-${timestamp}.json`;
  const outputPath = path.join(outputDir, filename);
  
  // Write deployment output
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  // Also save as latest deployment for easy reference
  const latestPath = path.join(outputDir, `member-nft-latest-${output.contractInfo.network.toLowerCase()}.json`);
  fs.writeFileSync(latestPath, JSON.stringify(output, null, 2));
  
  console.log(`✅ Deployment output saved to: ${filename}`);
  console.log(`✅ Latest deployment saved to: member-nft-latest-${output.contractInfo.network.toLowerCase()}.json`);
}

// Main deployment function
async function deployMemberNFT() {
  const startTime = new Date();
  let deploymentOutput: MemberNFTDeploymentOutput;
  
  try {
    console.log('🚀 Starting member NFT policy deployment...');
    
    // Initialize Lucid
    const lucid = await initLucid(env.MNEMONIC);
    console.log('📡 Lucid initialized');
    
    // Get validator info
    const validators = loadValidators();
    const memberNFTPolicy = createMintingPolicy(validators.memberNFT.compiledCode);
    console.log(`📋 Member NFT policy loaded. Hash: ${validators.memberNFT.hash}`);
    
    // Get verification key hash
    const vkh = await getVerificationKeyHash(lucid);
    console.log(`👤 Deployer verification key hash: ${vkh}`);
    
    // Get network from config
    const network = lucid.config().network as Network;
    
    // For minting policies, we need to get the policy ID using the imported function
    const policyId = mintingPolicyToId(memberNFTPolicy);
    console.log(`🏛️ Member NFT Policy ID: ${policyId}`);
    
    // Create a simple transaction to register the policy (send back to self)
    const deployerAddress = await lucid.wallet().address();
    const initialFunding = BigInt(2000000); // 2 ADA like the entity registry
    
    const tx = lucid
      .newTx()
      .pay.ToAddress(
        deployerAddress,
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
        name: 'Member NFT Policy',
        type: 'MintingPolicy',
        policyId,
        validatorHash: validators.memberNFT.hash,
        network: network
      },
      deployment: {
        txHash,
        timestamp: new Date().toISOString(),
        deployerVkh: vkh,
        explorerUrl
      },
      status: 'success' as const
    };
    
    // Save deployment output to JSON file
    saveDeploymentOutput(deploymentOutput);
    
    console.log('🎉 Member NFT policy deployment completed successfully!');
    
    return {
      txHash,
      policyId,
      validatorHash: validators.memberNFT.hash,
      deploymentOutput
    };
    
  } catch (error) {
    console.error('❌ Member NFT policy deployment failed:', error);
    
    // Create failed deployment output
    deploymentOutput = {
      contractInfo: {
        name: 'Member NFT Policy',
        type: 'MintingPolicy',
        policyId: '',
        validatorHash: '',
        network: env.NETWORK || 'Preview'
      },
      deployment: {
        txHash: '',
        timestamp: new Date().toISOString(),
        deployerVkh: '',
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
  deployMemberNFT()
    .then(result => {
      console.log('🎯 Deployment successful!');
      console.log('📋 Summary:');
      console.log(`   Policy ID: ${result.policyId}`);
      console.log(`   Transaction Hash: ${result.txHash}`);
      console.log(`   Validator Hash: ${result.validatorHash}`);
    })
    .catch(error => {
      console.error('💥 Deployment failed:', error);
      process.exit(1);
    });
}

export { deployMemberNFT };
export type { MemberNFTDeploymentOutput };