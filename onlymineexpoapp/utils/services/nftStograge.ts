// const NFT_STORAGE_KEY = process.env.EXPO_PUBLIC_NFT_STORAGE_KEY || 'fb085d05.f142023f91cf43ca874f01d6cb5a235c';

// export const uploadToIPFSWithNFTStorage = async (
//   imageUri: string,
//   nftData: {
//     name: string;
//     description?: string;
//     attributes?: Array<{ trait_type: string; value: string }>;
//   }
// ) => {
//   try {
//     console.log('🚀 Uploading via NFT.Storage API...');
    
//     if (!NFT_STORAGE_KEY) {
//       throw new Error('NFT.Storage API key not configured');
//     }
    
//     // Step 1: Upload image
//     console.log('📤 Uploading image...');
    
//     // Fetch the file directly from the URI and convert to blob
//     const response = await fetch(imageUri);
//     const imageBlob = await response.blob();
    
//     const imageFormData = new FormData();
//     imageFormData.append('file', imageBlob as any, 'image.jpg');
    
//     const imageResponse = await fetch('https://api.nft.storage/upload', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Authorization': `Bearer df86f726.92d9f2bb9a9b4a9098749eb422ef5418`,
//       },
//       body: imageFormData,
//     });
    
//     if (!imageResponse.ok) {
//       const errorText = await imageResponse.text();
//       throw new Error(`Failed to upload image to NFT.Storage: ${errorText}`);
//     }
    
//     const imageData = await imageResponse.json();
//     const imageUrl = `https://nftstorage.link/ipfs/${imageData.value.cid}`;
    
//     console.log('✅ Image uploaded:', imageUrl);
    
//     // Step 2: Upload metadata
//     console.log('📤 Uploading metadata...');
//     const metadataJson = {
//       name: nftData.name,
//       description: nftData.description || '',
//       image: imageUrl,
//       attributes: nftData.attributes || [],
//       properties: {
//         files: [{ uri: imageUrl, type: 'image/jpeg' }],
//         category: 'image',
//       },
//     };
    
//     const metadataBlob = new Blob([JSON.stringify(metadataJson)], {
//       type: 'application/json',
//     });
    
//     const metadataFormData = new FormData();
//     metadataFormData.append('file', metadataBlob as any, 'metadata.json');
    
//     const metadataResponse = await fetch('https://api.nft.storage/upload', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${NFT_STORAGE_KEY}`,
//       },
//       body: metadataFormData,
//     });
    
//     if (!metadataResponse.ok) {
//       const errorText = await metadataResponse.text();
//       throw new Error(`Failed to upload metadata to NFT.Storage: ${errorText}`);
//     }
    
//     const metadataData = await metadataResponse.json();
//     const metadataUrl = `https://nftstorage.link/ipfs/${metadataData.value.cid}`;
    
//     console.log('✅ Metadata uploaded:', metadataUrl);
    
//     return {
//       imageUrl,
//       metadataUrl,
//     };
//   } catch (error: any) {
//     console.error('❌ NFT.Storage upload failed:', error);
//     throw error;
//   }
// };
const PINATA_JWT = process.env.PINATA_JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2M2RjZTg4ZS00N2MzLTQ5YzgtYjRjMy1kM2JmZWJmMjllM2MiLCJlbWFpbCI6InNoYXVyYXlkaGluZ3JhMDNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjAwY2NjYjkxMTI4NTI5MWM0ODg1Iiwic2NvcGVkS2V5U2VjcmV0IjoiZTg1Y2I1Nzg0NzUxODVkZjhlODVhYjMxODFhMDEwZDJhMDRlZTMxYWE1YzhiN2U3MGU5ZDk0NzkwYzQ4NDVkOSIsImV4cCI6MTc5MzE4MTA1Nn0.oKZDYLZ0PoP9eqimrl6_JscSArBslrSzU3yge97nbGM';

export const uploadToIPFSWithPinata = async (
  imageUri: string,
  nftData: {
    name: string;
    description?: string;
    attributes?: Array<{ trait_type: string; value: string }>;
  }
) => {
  try {
    console.log('🚀 Uploading via Pinata...');
    
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }
    
    // Step 1: Upload image
    console.log('📤 Uploading image...');
    
    const response = await fetch(imageUri);
    const imageBlob = await response.blob();
    
    const imageFormData = new FormData();
    imageFormData.append('file', imageBlob as any, 'image.jpg');
    
    const imageResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
      },
      body: imageFormData,
    });
    
    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      throw new Error(`Failed to upload image to Pinata: ${errorText}`);
    }
    
    const imageData = await imageResponse.json();
    const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;
    
    console.log('✅ Image uploaded:', imageUrl);
    
    // Step 2: Upload metadata
    console.log('📤 Uploading metadata...');
    const metadataJson = {
      name: nftData.name,
      description: nftData.description || '',
      image: imageUrl,
      attributes: nftData.attributes || [],
      properties: {
        files: [{ uri: imageUrl, type: 'image/jpeg' }],
        category: 'image',
      },
    };
    
    const metadataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadataJson),
    });
    
    if (!metadataResponse.ok) {
      const errorText = await metadataResponse.text();
      throw new Error(`Failed to upload metadata to Pinata: ${errorText}`);
    }
    
    const metadataData = await metadataResponse.json();
    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;
    
    console.log('✅ Metadata uploaded:', metadataUrl);
    
    return {
      imageUrl,
      metadataUrl,
    };
  } catch (error: any) {
    console.error('❌ Pinata upload failed:', error);
    throw error;
  }
};