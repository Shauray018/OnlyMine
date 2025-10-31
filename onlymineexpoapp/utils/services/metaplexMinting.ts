// services/metaplexMinting.ts
// Complete Metaplex minting service for Expo/React Native

// import {
//     Metaplex,
//     toBigNumber,
//     walletAdapterIdentity
// } from '@metaplex-foundation/js';
// import {
//     clusterApiUrl,
//     Connection,
//     LAMPORTS_PER_SOL,
//     PublicKey
// } from '@solana/web3.js';
// import { uploadToIPFSWithPinata } from './nftStograge';

// const SOLANA_NETWORK = (process.env.EXPO_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet';

// /**
//  * Initialize Metaplex instance with wallet
//  */
// export const initMetaplex = (wallet: any) => {
//   const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
  
//   // Create metaplex instance
//   const metaplex = Metaplex.make(connection)
//     .use(walletAdapterIdentity(wallet));
  
//   return metaplex;
// };

// /**
//  * Mint NFT using Metaplex (after IPFS upload)
//  */
// export const mintNFTOnChain = async (
//   wallet: any,
//   metadataUri: string,
//   nftData: {
//     name: string;
//     symbol?: string;
//     sellerFeeBasisPoints?: number;
//   }
// ) => {
//   try {
//     console.log('🎨 Starting NFT mint on Solana...');
//     console.log('Network:', SOLANA_NETWORK);
//     console.log('Metadata URI:', metadataUri);
    
//     const metaplex = initMetaplex(wallet);
    
//     // Get wallet's public key
//     const walletPublicKey = new PublicKey(wallet.publicKey.toString());
    
//     // Check balance
//     const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
//     const balance = await connection.getBalance(walletPublicKey);
//     console.log('Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
//     if (balance < 0.01 * LAMPORTS_PER_SOL) {
//       throw new Error('Insufficient balance. Need at least 0.01 SOL to mint.');
//     }
    
//     // Mint the NFT
//     console.log('Creating NFT transaction...');
//     const { nft } = await metaplex.nfts().create({
//       uri: metadataUri,
//       name: nftData.name,
//       symbol: nftData.symbol || 'PHOTO',
//       sellerFeeBasisPoints: nftData.sellerFeeBasisPoints || 0, // 0% royalty
//       isMutable: true,
//       maxSupply: toBigNumber(1), // One of a kind
//     });
    
//     console.log('✅ NFT Minted Successfully!');
//     console.log('Mint Address:', nft.address.toString());
//     console.log('Name:', nft.name);
//     console.log('Symbol:', nft.symbol);
    
//     return {
//       mintAddress: nft.address.toString(),
//       name: nft.name,
//       symbol: nft.symbol,
//       uri: nft.uri,
//     };
//   } catch (error: any) {
//     console.error('❌ Minting failed:', error);
    
//     // Better error messages
//     if (error.message.includes('0x1')) {
//       throw new Error('Insufficient funds for transaction');
//     } else if (error.message.includes('User rejected')) {
//       throw new Error('Transaction rejected by user');
//     } else if (error.message.includes('Blockhash not found')) {
//       throw new Error('Network timeout. Please try again.');
//     } else {
//       throw new Error(error.message || 'Failed to mint NFT');
//     }
//   }
// };

// /**
//  * Complete minting flow: Upload to IPFS + Mint NFT
//  */
// export const mintPhotoNFT = async (
//   wallet: any,
//   imageUri: string,
//   nftData: {
//     name: string;
//     description?: string;
//     attributes?: Array<{ trait_type: string; value: string }>;
//   }
// ) => {
//   try {
//     console.log('🚀 Starting complete minting flow...');
    
//     // Step 1: Upload image and metadata to IPFS
//     console.log('📤 Step 1: Uploading to IPFS...');
//     const { imageUrl, metadataUrl } = await uploadToIPFSWithPinata(imageUri, nftData);
    
//     console.log('✅ Upload complete!');
//     console.log('Image URL:', imageUrl);
//     console.log('Metadata URL:', metadataUrl);
    
//     // Step 2: Mint NFT on Solana
//     console.log('🎨 Step 2: Minting NFT on Solana...');
//     const nft = await mintNFTOnChain(wallet, metadataUrl, {
//       name: nftData.name,
//       symbol: 'PHOTO',
//       sellerFeeBasisPoints: 0,
//     });
    
//     console.log('✅ Complete minting flow finished!');
    
//     return {
//       ...nft,
//       imageUrl,
//       metadataUrl,
//     };
//   } catch (error: any) {
//     console.error('❌ Complete minting flow failed:', error);
//     throw error;
//   }
// };

// /**
//  * Fetch all NFTs owned by a wallet address
//  */
// export const fetchWalletNFTs = async (
//   walletAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ) => {
//   try {
//     console.log('🔍 Fetching NFTs for:', walletAddress);
    
//     const connection = new Connection(clusterApiUrl(network));
//     const metaplex = Metaplex.make(connection);
    
//     const owner = new PublicKey(walletAddress);
//     const nfts = await metaplex.nfts().findAllByOwner({ owner });
    
//     console.log(`✅ Found ${nfts.length} NFTs`);
    
//     return nfts;
//   } catch (error: any) {
//     console.error('❌ Failed to fetch NFTs:', error);
//     throw new Error('Failed to fetch wallet NFTs');
//   }
// };

// /**
//  * Get NFT details by mint address
//  */
// export const getNFTDetails = async (
//   mintAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ) => {
//   try {
//     const connection = new Connection(clusterApiUrl(network));
//     const metaplex = Metaplex.make(connection);
    
//     const mint = new PublicKey(mintAddress);
//     const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
    
//     return nft;
//   } catch (error: any) {
//     console.error('❌ Failed to fetch NFT details:', error);
//     throw new Error('Failed to fetch NFT details');
//   }
// };

// /**
//  * Verify NFT ownership
//  */
// export const verifyNFTOwnership = async (
//   mintAddress: string,
//   expectedOwner: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ): Promise<boolean> => {
//   try {
//     const nft = await getNFTDetails(mintAddress, network);
    
//     // Handle different NFT types returned by Metaplex
//     let currentOwner: string | undefined;
    
//     if ('token' in nft && nft.token) {
//       // For NftWithToken or SftWithToken
//       currentOwner = nft.token.ownerAddress?.toString();
//     } else if ('mint' in nft && nft.mint) {
//       // For regular Nft or Sft - we need to fetch the token account
//       const connection = new Connection(clusterApiUrl(network));
//       const metaplex = Metaplex.make(connection);
      
//       // Get the largest token account (should be the owner)
//       const largestAccounts = await connection.getTokenLargestAccounts(
//         new PublicKey(mintAddress)
//       );
      
//       if (largestAccounts.value.length > 0) {
//         const tokenAccountInfo = await connection.getParsedAccountInfo(
//           largestAccounts.value[0].address
//         );
        
//         if (tokenAccountInfo.value && 'parsed' in tokenAccountInfo.value.data) {
//           currentOwner = tokenAccountInfo.value.data.parsed.info.owner;
//         }
//       }
//     }
    
//     return currentOwner === expectedOwner;
//   } catch (error) {
//     console.error('Failed to verify ownership:', error);
//     return false;
//   }
// };

// /**
//  * Get wallet SOL balance
//  */
// export const getWalletBalance = async (
//   walletAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ): Promise<number> => {
//   try {
//     const connection = new Connection(clusterApiUrl(network));
//     const publicKey = new PublicKey(walletAddress);
//     const balance = await connection.getBalance(publicKey);
    
//     return balance / LAMPORTS_PER_SOL;
//   } catch (error) {
//     console.error('Failed to get balance:', error);
//     return 0;
//   }
// };
// services/metaplexMinting.ts
// Complete Metaplex minting service for Expo/React Native

// import {
//     Metaplex,
//     toBigNumber,
//     walletAdapterIdentity
// } from '@metaplex-foundation/js';
// import {
//     clusterApiUrl,
//     Connection,
//     LAMPORTS_PER_SOL,
//     PublicKey
// } from '@solana/web3.js';
// import { uploadToIPFSWithPinata } from './nftStograge';

// const SOLANA_NETWORK = (process.env.EXPO_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet';

// /**
//  * Initialize Metaplex instance with wallet
//  */
// export const initMetaplex = (wallet: any) => {
//   const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
  
//   // Create metaplex instance
//   const metaplex = Metaplex.make(connection)
//     .use(walletAdapterIdentity(wallet));
  
//   return metaplex;
// };

// /**
//  * Mint NFT using Metaplex (after IPFS upload)
//  */
// export const mintNFTOnChain = async (
//   wallet: any,
//   walletAddress: string,
//   metadataUri: string,
//   nftData: {
//     name: string;
//     symbol?: string;
//     sellerFeeBasisPoints?: number;
//   }
// ) => {
//   try {
//     console.log('🎨 Starting NFT mint on Solana...');
//     console.log('Network:', SOLANA_NETWORK);
//     console.log('Wallet Address:', walletAddress);
//     console.log('Metadata URI:', metadataUri);
    
//     const metaplex = initMetaplex(wallet);
    
//     // Get wallet's public key from the address string
//     const walletPublicKey = new PublicKey(walletAddress);
    
//     // Check balance
//     const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
//     const balance = await connection.getBalance(walletPublicKey);
//     console.log('Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
//     if (balance < 0.01 * LAMPORTS_PER_SOL) {
//       throw new Error('Insufficient balance. Need at least 0.01 SOL to mint.');
//     }
    
//     // Mint the NFT
//     console.log('Creating NFT transaction...');
//     const { nft } = await metaplex.nfts().create({
//       uri: metadataUri,
//       name: nftData.name,
//       symbol: nftData.symbol || 'PHOTO',
//       sellerFeeBasisPoints: nftData.sellerFeeBasisPoints || 0, // 0% royalty
//       isMutable: true,
//       maxSupply: toBigNumber(1), // One of a kind
//     });
    
//     console.log('✅ NFT Minted Successfully!');
//     console.log('Mint Address:', nft.address.toString());
//     console.log('Name:', nft.name);
//     console.log('Symbol:', nft.symbol);
    
//     return {
//       mintAddress: nft.address.toString(),
//       name: nft.name,
//       symbol: nft.symbol,
//       uri: nft.uri,
//     };
//   } catch (error: any) {
//     console.error('❌ Minting failed:', error);
    
//     // Better error messages
//     if (error.message.includes('0x1')) {
//       throw new Error('Insufficient funds for transaction');
//     } else if (error.message.includes('User rejected')) {
//       throw new Error('Transaction rejected by user');
//     } else if (error.message.includes('Blockhash not found')) {
//       throw new Error('Network timeout. Please try again.');
//     } else {
//       throw new Error(error.message || 'Failed to mint NFT');
//     }
//   }
// };

// /**
//  * Complete minting flow: Upload to IPFS + Mint NFT
//  */
// export const mintPhotoNFT = async (
//   wallet: any,
//   walletAddress: string,
//   imageUri: string,
//   nftData: {
//     name: string;
//     description?: string;
//     attributes?: Array<{ trait_type: string; value: string }>;
//   }
// ) => {
//   try {
//     console.log('🚀 Starting complete minting flow...');
    
//     // Step 1: Upload image and metadata to IPFS
//     console.log('📤 Step 1: Uploading to IPFS...');
//     const { imageUrl, metadataUrl } = await uploadToIPFSWithPinata(imageUri, nftData);
    
//     console.log('✅ Upload complete!');
//     console.log('Image URL:', imageUrl);
//     console.log('Metadata URL:', metadataUrl);
    
//     // Step 2: Mint NFT on Solana
//     console.log('🎨 Step 2: Minting NFT on Solana...');
//     const nft = await mintNFTOnChain(wallet, walletAddress, metadataUrl, {
//       name: nftData.name,
//       symbol: 'PHOTO',
//       sellerFeeBasisPoints: 0,
//     });
    
//     console.log('✅ Complete minting flow finished!');
    
//     return {
//       ...nft,
//       imageUrl,
//       metadataUrl,
//     };
//   } catch (error: any) {
//     console.error('❌ Complete minting flow failed:', error);
//     throw error;
//   }
// };

// /**
//  * Fetch all NFTs owned by a wallet address
//  */
// export const fetchWalletNFTs = async (
//   walletAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ) => {
//   try {
//     console.log('🔍 Fetching NFTs for:', walletAddress);
    
//     const connection = new Connection(clusterApiUrl(network));
//     const metaplex = Metaplex.make(connection);
    
//     const owner = new PublicKey(walletAddress);
//     const nfts = await metaplex.nfts().findAllByOwner({ owner });
    
//     console.log(`✅ Found ${nfts.length} NFTs`);
    
//     return nfts;
//   } catch (error: any) {
//     console.error('❌ Failed to fetch NFTs:', error);
//     throw new Error('Failed to fetch wallet NFTs');
//   }
// };

// /**
//  * Get NFT details by mint address
//  */
// export const getNFTDetails = async (
//   mintAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ) => {
//   try {
//     const connection = new Connection(clusterApiUrl(network));
//     const metaplex = Metaplex.make(connection);
    
//     const mint = new PublicKey(mintAddress);
//     const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
    
//     return nft;
//   } catch (error: any) {
//     console.error('❌ Failed to fetch NFT details:', error);
//     throw new Error('Failed to fetch NFT details');
//   }
// };

// /**
//  * Verify NFT ownership
//  */
// export const verifyNFTOwnership = async (
//   mintAddress: string,
//   expectedOwner: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ): Promise<boolean> => {
//   try {
//     const nft = await getNFTDetails(mintAddress, network);
    
//     // Handle different NFT types returned by Metaplex
//     let currentOwner: string | undefined;
    
//     if ('token' in nft && nft.token) {
//       // For NftWithToken or SftWithToken
//       currentOwner = nft.token.ownerAddress?.toString();
//     } else if ('mint' in nft && nft.mint) {
//       // For regular Nft or Sft - we need to fetch the token account
//       const connection = new Connection(clusterApiUrl(network));
//       const metaplex = Metaplex.make(connection);
      
//       // Get the largest token account (should be the owner)
//       const largestAccounts = await connection.getTokenLargestAccounts(
//         new PublicKey(mintAddress)
//       );
      
//       if (largestAccounts.value.length > 0) {
//         const tokenAccountInfo = await connection.getParsedAccountInfo(
//           largestAccounts.value[0].address
//         );
        
//         if (tokenAccountInfo.value && 'parsed' in tokenAccountInfo.value.data) {
//           currentOwner = tokenAccountInfo.value.data.parsed.info.owner;
//         }
//       }
//     }
    
//     return currentOwner === expectedOwner;
//   } catch (error) {
//     console.error('Failed to verify ownership:', error);
//     return false;
//   }
// };

// /**
//  * Get wallet SOL balance
//  */
// export const getWalletBalance = async (
//   walletAddress: string,
//   network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
// ): Promise<number> => {
//   try {
//     const connection = new Connection(clusterApiUrl(network));
//     const publicKey = new PublicKey(walletAddress);
//     const balance = await connection.getBalance(publicKey);
    
//     return balance / LAMPORTS_PER_SOL;
//   } catch (error) {
//     console.error('Failed to get balance:', error);
//     return 0;
//   }
// };
// services/metaplexMinting.ts
import {
  Metaplex,
  toBigNumber,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { uploadToIPFSWithPinata } from './nftStograge';

const SOLANA_NETWORK = (process.env.EXPO_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') || 'devnet';

/**
 * Create a wallet adapter compatible with Metaplex from Reown provider
 */
const createWalletAdapter = (provider: any, walletAddress: string, connection: Connection) => {
  const publicKey = new PublicKey(walletAddress);
  
  // Helper to ensure session is active
  const ensureSession = async () => {
    try {
      // Check if provider has an active session
      if (provider.session) {
        console.log('✅ Session active');
        return;
      }
      
      // If no session, try to reconnect
      console.log('⚠️ No active session, attempting to reconnect...');
      if (provider.connect) {
        await provider.connect();
        console.log('✅ Reconnected successfully');
      }
    } catch (error) {
      console.error('❌ Session check failed:', error);
      throw new Error('Wallet session expired. Please reconnect your wallet.');
    }
  };
  
  return {
    publicKey,
    signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
      try {
        console.log('🔐 [signMessage] Called');
        await ensureSession();
        
        const result = await provider.request({
          method: 'solana_signMessage',
          params: {
            message: Buffer.from(message).toString('base64'),
            pubkey: walletAddress,
          },
        });
        
        console.log('✅ [signMessage] Success');
        return Buffer.from(result.signature, 'base64');
      } catch (error) {
        console.error('❌ [signMessage] Error:', error);
        throw error;
      }
    },
    // FIXED: Only sign the transaction, don't send it
    // Metaplex handles sending after signing
    signTransaction: async <T extends Transaction | VersionedTransaction>(
      transaction: T
    ): Promise<T> => {
      try {
        console.log('🔐 [signTransaction] Called');
        console.log('Transaction type:', transaction instanceof VersionedTransaction ? 'VersionedTransaction' : 'Transaction');
        
        if (transaction instanceof VersionedTransaction) {
          const serializedTx = Buffer.from(transaction.serialize()).toString('base64');
          console.log('📤 [signTransaction] Sending to wallet for signing...');
          
          const result = await provider.request({
            method: 'solana_signTransaction',
            params: {
              transaction: serializedTx,
            },
          });
          
          console.log('✅ [signTransaction] Transaction signed by wallet');
          const signedTxBuffer = Buffer.from(result.transaction, 'base64');
          const signedTx = VersionedTransaction.deserialize(signedTxBuffer) as T;
          
          return signedTx;
        } else {
          // Legacy Transaction
          const serializedTx = transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          });
          
          console.log('📤 [signTransaction] Sending to wallet for signing...');
          
          const result = await provider.request({
            method: 'solana_signTransaction',
            params: {
              transaction: Buffer.from(serializedTx).toString('base64'),
            },
          });
          
          console.log('✅ [signTransaction] Transaction signed by wallet');
          const signedTxBuffer = Buffer.from(result.transaction, 'base64');
          const signedTx = Transaction.from(signedTxBuffer) as T;
          
          return signedTx;
        }
      } catch (error: any) {
        console.error('❌ [signTransaction] Error:', error);
        console.error('Error code:', error?.code);
        console.error('Error message:', error?.message);
        throw error;
      }
    },
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(
      transactions: T[]
    ): Promise<T[]> => {
      try {
        console.log(`🔐 [signAllTransactions] Called with ${transactions.length} transactions`);
        
        const signedTxs: T[] = [];
        
        for (let i = 0; i < transactions.length; i++) {
          console.log(`📝 [signAllTransactions] Signing transaction ${i + 1}/${transactions.length}...`);
          
          let serializedTx: string;
          
          if (transactions[i] instanceof VersionedTransaction) {
            serializedTx = Buffer.from(transactions[i].serialize()).toString('base64');
          } else {
            serializedTx = Buffer.from((transactions[i] as Transaction).serialize({
              requireAllSignatures: false,
              verifySignatures: false,
            })).toString('base64');
          }
          
          console.log('📤 [signAllTransactions] Sending to wallet...');
          const result = await provider.request({
            method: 'solana_signTransaction',
            params: {
              transaction: serializedTx,
            },
          });
          
          console.log(`✅ [signAllTransactions] Transaction ${i + 1} signed`);
          const signedTxBuffer = Buffer.from(result.transaction, 'base64');
          
          let signedTx: T;
          if (transactions[i] instanceof VersionedTransaction) {
            signedTx = VersionedTransaction.deserialize(signedTxBuffer) as T;
          } else {
            signedTx = Transaction.from(signedTxBuffer) as T;
          }
          
          signedTxs.push(signedTx);
        }
        
        console.log('✅ [signAllTransactions] All transactions signed!');
        return signedTxs;
      } catch (error) {
        console.error('❌ [signAllTransactions] Error:', error);
        console.error('Error code:', (error as any)?.code);
        console.error('Error message:', (error as any)?.message);
        throw error;
      }
    },
  };
};

/**
 * Initialize Metaplex instance with wallet
 */
export const initMetaplex = (provider: any, walletAddress: string) => {
  console.log('🔧 [initMetaplex] Initializing Metaplex...');
  const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
  
  // Create wallet adapter from provider
  const walletAdapter = createWalletAdapter(provider, walletAddress, connection);
  
  // Create metaplex instance
  const metaplex = Metaplex.make(connection)
    .use(walletAdapterIdentity(walletAdapter));
  
  console.log('✅ [initMetaplex] Metaplex initialized');
  return metaplex;
};

/**
 * Mint NFT using Metaplex (after IPFS upload)
 */
export const mintNFTOnChain = async (
  provider: any,
  walletAddress: string,
  metadataUri: string,
  nftData: {
    name: string;
    symbol?: string;
    sellerFeeBasisPoints?: number;
  }
) => {
  try {
    console.log('🎨 Starting NFT mint on Solana...');
    console.log('Network:', SOLANA_NETWORK);
    console.log('Wallet Address:', walletAddress);
    console.log('Metadata URI:', metadataUri);
    
    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK), 'confirmed');
    const metaplex = initMetaplex(provider, walletAddress);
    
    // Get wallet's public key
    const walletPublicKey = new PublicKey(walletAddress);
    
    // Check balance
    const balance = await connection.getBalance(walletPublicKey);
    console.log('Wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    if (balance < 0.01 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance. Need at least 0.01 SOL to mint.');
    }
    
    // Mint the NFT
    console.log('🏗️ [mintNFTOnChain] Creating NFT with Metaplex...');
    
    // Metaplex will:
    // 1. Build the transaction
    // 2. Call signTransaction on the wallet adapter (opens your wallet)
    // 3. Send the signed transaction to the network
    // 4. Wait for confirmation
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: nftData.name,
      symbol: nftData.symbol || 'PHOTO',
      sellerFeeBasisPoints: nftData.sellerFeeBasisPoints || 0,
      isMutable: true,
      maxSupply: toBigNumber(1),
    }, {
      commitment: 'confirmed',
    });
    
    console.log('✅ NFT Minted Successfully!');
    console.log('Mint Address:', nft.address.toString());
    console.log('Name:', nft.name);
    console.log('Symbol:', nft.symbol);
    
    return {
      mintAddress: nft.address.toString(),
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.uri,
    };
  } catch (error: any) {
    console.error('❌ Minting failed:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    
    // Better error messages
    if (error.message?.includes('0x1')) {
      throw new Error('Insufficient funds for transaction');
    } else if (error.message?.includes('User rejected') || error.message?.includes('User cancelled')) {
      throw new Error('Transaction rejected by user');
    } else if (error.message?.includes('Blockhash not found')) {
      throw new Error('Network timeout. Please try again.');
    } else if (error.code === -32601 || error.message?.includes('Method not found')) {
      throw new Error('Wallet does not support the required signing method. Try a different wallet.');
    } else {
      throw new Error(error.message || 'Failed to mint NFT');
    }
  }
};

/**
 * Complete minting flow: Upload to IPFS + Mint NFT
 */
export const mintPhotoNFT = async (
  provider: any,
  walletAddress: string,
  imageUri: string,
  nftData: {
    name: string;
    description?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  }
) => {
  try {
    console.log('🚀 Starting complete minting flow...');
    
    // Step 1: Upload image and metadata to IPFS
    console.log('📤 Step 1: Uploading to IPFS...');
    const { imageUrl, metadataUrl } = await uploadToIPFSWithPinata(imageUri, nftData);
    
    console.log('✅ Upload complete!');
    console.log('Image URL:', imageUrl);
    console.log('Metadata URL:', metadataUrl);
    
    // Step 2: Mint NFT on Solana
    console.log('🎨 Step 2: Minting NFT on Solana...');
    const nft = await mintNFTOnChain(provider, walletAddress, metadataUrl, {
      name: nftData.name,
      symbol: 'PHOTO',
      sellerFeeBasisPoints: 0,
    });
    
    console.log('✅ Complete minting flow finished!');
    
    return {
      ...nft,
      imageUrl,
      metadataUrl,
    };
  } catch (error: any) {
    console.error('❌ Complete minting flow failed:', error);
    throw error;
  }
};

/**
 * Fetch all NFTs owned by a wallet address
 */
export const fetchWalletNFTs = async (
  walletAddress: string,
  network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
) => {
  try {
    console.log('🔍 Fetching NFTs for:', walletAddress);
    
    const connection = new Connection(clusterApiUrl(network));
    const metaplex = Metaplex.make(connection);
    
    const owner = new PublicKey(walletAddress);
    const nfts = await metaplex.nfts().findAllByOwner({ owner });
    
    console.log(`✅ Found ${nfts.length} NFTs`);
    
    return nfts;
  } catch (error: any) {
    console.error('❌ Failed to fetch NFTs:', error);
    throw new Error('Failed to fetch wallet NFTs');
  }
};

/**
 * Get NFT details by mint address
 */
export const getNFTDetails = async (
  mintAddress: string,
  network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
) => {
  try {
    const connection = new Connection(clusterApiUrl(network));
    const metaplex = Metaplex.make(connection);
    
    const mint = new PublicKey(mintAddress);
    const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
    
    return nft;
  } catch (error: any) {
    console.error('❌ Failed to fetch NFT details:', error);
    throw new Error('Failed to fetch NFT details');
  }
};

/**
 * Verify NFT ownership
 */
export const verifyNFTOwnership = async (
  mintAddress: string,
  expectedOwner: string,
  network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
): Promise<boolean> => {
  try {
    const nft = await getNFTDetails(mintAddress, network);
    
    let currentOwner: string | undefined;
    
    if ('token' in nft && nft.token) {
      currentOwner = nft.token.ownerAddress?.toString();
    } else if ('mint' in nft && nft.mint) {
      const connection = new Connection(clusterApiUrl(network));
      
      const largestAccounts = await connection.getTokenLargestAccounts(
        new PublicKey(mintAddress)
      );
      
      if (largestAccounts.value.length > 0) {
        const tokenAccountInfo = await connection.getParsedAccountInfo(
          largestAccounts.value[0].address
        );
        
        if (tokenAccountInfo.value && 'parsed' in tokenAccountInfo.value.data) {
          currentOwner = tokenAccountInfo.value.data.parsed.info.owner;
        }
      }
    }
    
    return currentOwner === expectedOwner;
  } catch (error) {
    console.error('Failed to verify ownership:', error);
    return false;
  }
};

/**
 * Get wallet SOL balance
 */
export const getWalletBalance = async (
  walletAddress: string,
  network: 'devnet' | 'mainnet-beta' = SOLANA_NETWORK
): Promise<number> => {
  try {
    const connection = new Connection(clusterApiUrl(network));
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to get balance:', error);
    return 0;
  }
};