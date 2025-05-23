// offchain/entity-registry/entity-registry-client.ts
import { 
  LucidEvolution, 
  Data, 
  TxHash, 
  UTxO,
  Address
} from '@lucid-evolution/lucid';
import { validatorToAddress, getAddressDetails } from '@lucid-evolution/utils';
import { Network } from '@lucid-evolution/core-types';
import { 
  RegistryDatum, 
  CreateEntityAction, 
  Entity, 
  RegistryAction 
} from '../types/entity-registry';
import { createValidator } from '../utils/lucid-helpers';

export class EntityRegistryClient {
  private lucid: LucidEvolution;
  private contractAddress: Address;
  private validatorScript: string;

  constructor(
    lucid: LucidEvolution, 
    validatorCompiledCode: string,
    contractAddress?: Address
  ) {
    this.lucid = lucid;
    this.validatorScript = validatorCompiledCode;
    
    // If contract address is provided, use it; otherwise derive it
    if (contractAddress) {
      this.contractAddress = contractAddress;
    } else {
      const validator = createValidator(validatorCompiledCode);
      const network = this.lucid.config().network as Network;
      this.contractAddress = validatorToAddress(network, validator);
    }
  }

  /**
   * Create a new SACCO entity on the blockchain
   * @param name - The name of the SACCO entity
   * @param description - Description of the SACCO entity
   * @returns Transaction hash of the creation transaction
   */
  async createEntity(name: string, description: string): Promise<TxHash> {
    try {
      // Get the current wallet address and verification key hash
      const walletAddress = await this.lucid.wallet().address();
      const addressDetails = getAddressDetails(walletAddress);
      
      if (!addressDetails.paymentCredential || addressDetails.paymentCredential.type !== 'Key') {
        throw new Error('Invalid wallet - payment credential not found');
      }
      
      const founderVkh = addressDetails.paymentCredential.hash;
      
      // Create the entity data
      const entity: Entity = {
        name,
        description,
        creation_time: Date.now(),
        founder: founderVkh,
        member_count: 0
      };

      // Create the initial registry datum
      const registryDatum: RegistryDatum = {
        entity,
        members: [], // Empty members list initially
        admins: [founderVkh] // Founder is the initial admin
      };

      // Create the redeemer for CreateEntity action
      const createEntityRedeemer: CreateEntityAction = {
        constructor: 0, // CreateEntity constructor index
        fields: [name, description]
      };

      // Convert datum to CBOR
      const datumCbor = Data.to(this.registryDatumToPlutusData(registryDatum));
      
      // Convert redeemer to CBOR  
      const redeemerCbor = Data.to(this.registryActionToPlutusData(createEntityRedeemer));

      // Build the transaction
      const tx = this.lucid
        .newTx()
        .pay.ToAddressWithData(
          this.contractAddress,
          { 
            kind: "inline", 
            value: datumCbor 
          },
          { lovelace: BigInt(2000000) } // 2 ADA minimum UTxO
        )
        .attach.SpendingValidator(createValidator(this.validatorScript));

      // Complete and sign the transaction
      const completedTx = await tx.complete();
      const signedTx = await completedTx.sign.withWallet().complete();
      
      // Submit the transaction
      const txHash = await signedTx.submit();
      
      console.log(`Entity creation transaction submitted: ${txHash}`);
      
      return txHash;
      
    } catch (error) {
      console.error('Error creating entity:', error);
      throw new Error(`Failed to create entity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert RegistryDatum to Plutus Data format
   */
  private registryDatumToPlutusData(datum: RegistryDatum): Data {
    const entityData = new Map([
      ["name", datum.entity.name],
      ["description", datum.entity.description], 
      ["creation_time", BigInt(datum.entity.creation_time)],
      ["founder", datum.entity.founder],
      ["member_count", BigInt(datum.entity.member_count)]
    ] as Array<[string, any]>);

    const membersData = datum.members.map(([vkh, member]) => [
      vkh,
      new Map([
        ["name", member.name],
        ["verification_key_hash", member.verification_key_hash],
        ["join_time", BigInt(member.join_time)],
        ["status", BigInt(member.status)]
      ] as Array<[string, any]>)
    ]);

    return new Map([
      ["entity", entityData],
      ["members", membersData],
      ["admins", datum.admins]
    ] as Array<[string, any]>);
  }

  /**
   * Convert RegistryAction to Plutus Data format
   */
  private registryActionToPlutusData(action: RegistryAction): Data {
    switch (action.constructor) {
      case 0: // CreateEntity
        return {
          index: 0,
          fields: [
            action.fields[0], // name
            action.fields[1]  // description
          ]
        };
      default:
        throw new Error(`Unsupported action constructor: ${action.constructor}`);
    }
  }

  /**
   * Get the contract address
   */
  getContractAddress(): Address {
    return this.contractAddress;
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForConfirmation(txHash: TxHash): Promise<void> {
    await this.lucid.awaitTx(txHash);
    console.log(`Transaction confirmed: ${txHash}`);
  }
}