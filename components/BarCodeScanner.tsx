import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera-text-recognition';
import { TextData } from '@/lib/dates';
import Icon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IBarCodeData } from '@/interfaces/IBarCodeData';

interface BarCodeScannerProps {
  setScanningCode: (value: boolean) => void
  setScanningDate: (value: boolean) => void
  setForm: any
  form: any
}

const getBarCodeData = async (code: string) => {
  console.log("Got code, fetching data");
  try {
    const response = await fetch(
      `https://world.openfoodfacts.net/api/v0/product/${code}.json`,
    );
    const json = await response.json();
    console.log("Got data");
    return json.product as IBarCodeData
  } catch (error) {
    console.error(error);
  }
};

const BarCodeScanner = (props: BarCodeScannerProps) => {
  const { hasPermission, requestPermission } = useCameraPermission()
  const [data, setData] = useState<TextData>()
  const device = useCameraDevice('back');

  if (!hasPermission) {
    requestPermission();
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes) => {
      if (codes[0] && codes[0].value && codes[0].value != "") {
        let product = await getBarCodeData(codes[0].value ?? "");
        if (product && product.product_name) {
          props.setForm({ ...props.form, title: product?.product_name });
          props.setScanningDate(true);
          props.setScanningCode(false);
        }
      }
    }
  })

  return (
    <>
      {!!device && (
        <SafeAreaView className="w-full h-full">

          <Camera
            codeScanner={codeScanner}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            options={{
              language: 'latin'
            }}
            mode={'recognize'}
            callback={(d) => setData(d as unknown as TextData)}
          />
          <View className="flex-1 items-center top-[20%]">
            <Text className="shadow text-3xl font-bold text-white">Scan Barcode</Text>
            <View className="w-[90%] h-[40%] border-2 border-white mt-5"></View>
          </View>

          <TouchableOpacity className="w-8 bg-black/30 rounded-md items-center absolute left-2 top-10">
            <Icon name="close" color="white" size={30} onPress={() => props.setScanningCode(false)} />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  )
}

export default BarCodeScanner