import ConnectButton from "@/components/pages/LoginPage/ConnectButton"
import { Button } from "@/components/ui/button"
import { View } from "react-native"

export default function Home() { 
  return ( 
    <View className="flex h-screen w-full justify-center items-center">
      <ConnectButton title="Connect Button" />
    </View>
  )
}