import { Text, View } from 'react-native';
import React, { useState } from 'react'
import Scanner from '../../components/Scanner'


export default function TabTwoScreen() {

  const [scanning, setScanning] = useState(false);
  const [scanData, setScanData] = useState<string>();

  if (scanning) {
    return <Scanner setScanning={setScanning} setScanData={setScanData}/>
  }
  else {
    return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg" onPress={() => setScanning(true)}>Scanner Page</Text>
      <Text className="text-lg" >{scanData && (scanData)}</Text>
    </View>
    )
  }
}
