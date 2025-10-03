// import { Button, ButtonText } from "@/components/ui/button";
// import {
//   clusterApiUrl,
//   Connection,
//   PublicKey
// } from "@solana/web3.js";
// import { Buffer } from "buffer";
// import * as Linking from "expo-linking";
// import React, { useState } from "react";
// import { StyleSheet, Text, View } from "react-native";
// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";
// global.Buffer = global.Buffer || Buffer;

// const connection = new Connection(clusterApiUrl("devnet"));


// export default function ConnectionPage() { 
//   const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
//     useState<PublicKey | null>(null);

//     // Initiate a new connection to Phantom
//     const connect = async () => {
//     // TODO
//     const params = {
//       cluster: "devnet",
//       app_url: "https://deeplink-movie-tutorial-dummy-site.vercel.app/",
//     };

//     const url = "https://phantom.app/ul/v1/connect";
//     Linking.openURL(url);
//   };

//   // Initiate a disconnect from Phantom
//   const disconnect = async () => {};

//   return ( 
//     <View className="flex-1 justify-center items-center"> 
//     {phantomWalletPublicKey ? (
//             <>
//               <View className="bg-white flex-1 h-screen w-full justify-center items-center" style={{backgroundColor: "white"}}>
//                 <View style={styles.greenDot} />
//                 <Text
//                   style={styles.text}
//                   numberOfLines={1}
//                   ellipsizeMode="middle"
//                 >
//                   {`Connected to: ${phantomWalletPublicKey.toString()}`}
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <Button  onPress={disconnect} >
//                   <ButtonText>
//                     Disconnect
//                   </ButtonText>
//                   </Button>
//               </View>
//             </>
//           ) : (
//             <View style={{ marginTop: 15 }}>
//               <Button onPress={connect}>
//                 <ButtonText>
//                   Connect Phantom
//                 </ButtonText>
//               </Button>
//             </View>
//           )
// }
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   greenDot: {
//     height: 8,
//     width: 8,
//     borderRadius: 10,
//     marginRight: 5,
//     backgroundColor: "green",
//   },
//   header: {
//     width: "95%",
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },
//   spinner: {
//     position: "absolute",
//     alignSelf: "center",
//     top: "50%",
//     zIndex: 1000,
//   },
//   text: {
//     color: "808080",
//     width: "100%",
//   },
//   wallet: {
//     alignItems: "center",
//     margin: 10,
//     marginBottom: 15,
//   },
// });

import { Button, ButtonText } from "@/components/ui/button";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import nacl from "tweetnacl";
global.Buffer = global.Buffer || Buffer;

const connection = new Connection(clusterApiUrl("devnet"));

export default function ConnectionPage() {
  const [phantomWalletPublicKey, setPhantomWalletPublicKey] = useState<PublicKey | null>(null);
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState<Uint8Array>();

  React.useEffect(() => {
  const handleDeepLink = ({ url }: { url: string }) => {
    if (url.includes("onConnect")) {
      // Parse params
      const query = Linking.parse(url).queryParams;
      console.log("Phantom Response:", query);

      // Example: extract public key
      if (query?.phantom_encryption_public_key) {
        setPhantomWalletPublicKey(new PublicKey(query?.public_key as string));
      }
    }
  };

  const subscription = Linking.addEventListener("url", handleDeepLink);
  return () => subscription.remove();
}, []);

  

  // Initiate a new connection to Phantom
  // const connect = async () => {
  //   const params = {
  //     cluster: "devnet",
  //     app_url: "exp://192.168.1.46:8081",
  //     dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
  //   };

  //   const url = `https://phantom.app/ul/v1/connect?${params}`;
  //   Linking.openURL(url);
  // };
  const connect = async () => {
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        cluster: "devnet",
        app_url: Linking.createURL("onConnect"), // callback path
      });

      const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
      await Linking.openURL(url);
  };

  // Initiate a disconnect from Phantom
  const disconnect = async () => {
    setPhantomWalletPublicKey(null);
  };

  return (
    <View style={styles.container}>
      {phantomWalletPublicKey ? (
        <>
          <View style={styles.connectedBox}>
            <View style={styles.greenDot} />
            <Text
              style={styles.text}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {`Connected to: ${phantomWalletPublicKey.toString()}`}
            </Text>
          </View>
          <View style={styles.row}>
            <Button onPress={disconnect}>
              <ButtonText>Disconnect</ButtonText>
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.connectBox}>
          <Button onPress={connect}>
            <ButtonText>Connect Phantom</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // make background white
  },
  connectedBox: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  greenDot: {
    height: 8,
    width: 8,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "green",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    color: "#333", // dark text
    fontSize: 14,
  },
  connectBox: {
    marginTop: 15,
  },
});
