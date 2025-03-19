import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera-text-recognition';
import { parseDateFromScan, TextData } from '@/lib/dates';
import Icon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IBarCodeData } from '@/interfaces/IBarCodeData';
import CustomButton from './CustomButton';
import { showSuccessToast } from '@/lib/toast';

interface ScannerProps {
  setScanning: any,
  setForm: any,
  form: any,
  mode: string
  setMode: (mode: string) => void
}

const Scanner = (props: ScannerProps) => {
  const { hasPermission, requestPermission } = useCameraPermission()
  const [dateFound, setDateFound] = useState(false)
  const [data, setData] = useState<TextData>()
  const device = useCameraDevice('back');

  if (!hasPermission) {
    requestPermission();
  }

  const getBarCodeData = async (code: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v0/product/${code}.json`,
      );
      const json = await response.json();
      return json.product as IBarCodeData
    } catch (error) {
      console.error(error);
    }
  };

  const codeScanner = useCodeScanner({
      codeTypes: ['qr', 'ean-13'],
      onCodeScanned: async (codes) => {
        if (props.mode != "code") return;
        if (codes[0] && codes[0].value && codes[0].value != "") {
          let product = await getBarCodeData(codes[0].value ?? "");
          if (product && product.product_name) {
            props.setForm({ ...props.form, title: product?.product_name });
            showSuccessToast("Code scanned", "Scan expiry next");
            props.setMode("date")
          }
        }
      }
    })

  useEffect(() => {
    if (props.mode != "date") return;

    if (data && data.resultText && data.resultText.length > 0) {
      const date = parseDateFromScan(data.resultText);

      if (date && !dateFound) {
        setDateFound(true);
        props.setForm({ ...props.form, expiry: date });
        setTimeout(() => {
          props.setScanning(false);
        }, 0); // Avoid updating parent state immediately during render
      }
    }
  }, [data, dateFound, props]);

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
            <Text className="shadow text-3xl font-bold text-white">{props.mode == "date" ? "Scan Expiry" : "Scan Barcode"}</Text>
            <View className="w-[90%] h-[40%] border-2 border-white mt-5"></View>
            {/* <CustomButton
                        title={"Enter Manually"}
                        handlePress={() => {props.setScanning(false)}}
                        containerStyles="w-[40%] m-2 border-2 border-primary bg-white"
                        textStyles='text-primary'
                    /> */}
          </View>

          <TouchableOpacity className="w-8 bg-black/30 rounded-md items-center absolute left-2 top-10">
            <Icon name="close" color="white" size={30} onPress={() => props.setScanning(false)} />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  )
}

export default Scanner