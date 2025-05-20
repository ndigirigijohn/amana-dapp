// offchain/utils/lucid-helpers.ts
import { 
    Lucid, 
    Blockfrost, 
    SpendingValidator, 
    TxHash, 
    UTxO,
    LucidEvolution
  } from '@lucid-evolution/lucid';
  // Import additional utilities that might be needed
  import { getAddressDetails } from '@lucid-evolution/utils';
  import { selectedNetwork } from '../config';
  
  // Initialize Lucid with Blockfrost provider
  export async function initLucid(privateKeyHex: string): Promise<LucidEvolution> {
    const lucid = await Lucid(
      new Blockfrost(
        selectedNetwork.url,
        selectedNetwork.projectId
      ),
      'Preview'
    );
    
    // Use the correct method to select wallet from private key
    lucid.selectWallet.fromPrivateKey(privateKeyHex);
    
    return lucid;
  }
  
  // Get verification key hash from a wallet
  export async function getVerificationKeyHash(lucid: LucidEvolution): Promise<string> {
    // IMPORTANT: Now using await since address() is asynchronous
    const address = await lucid.wallet().address();
    // Use the imported getAddressDetails function
    const { paymentCredential } = getAddressDetails(address);
    
    if (!paymentCredential || paymentCredential.type !== 'Key') {
      throw new Error('Payment credential not found or not of type Key');
    }
    
    return paymentCredential.hash;
  }
  
  // Create a validator from compiled code
  export function createValidator(compiledCode: string): SpendingValidator {
    return {
      type: 'PlutusV2',
      script: compiledCode
    };
  }
  
  // Wait for transaction confirmation
  export async function waitForTx(lucid: LucidEvolution, txHash: TxHash): Promise<UTxO[]> {
    await lucid.awaitTx(txHash);
    console.log(`Transaction confirmed: ${txHash}`);
    
    // Get the UTXOs created by this transaction
    // IMPORTANT: Now using await since address() is asynchronous
    const address = await lucid.wallet().address();
    const utxos = await lucid.utxosAt(address);
    return utxos;
  }