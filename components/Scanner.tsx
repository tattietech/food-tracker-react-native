import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera-text-recognition';
import { parseDateFromScan, TextData } from '@/lib/dates';
import Icon from 'react-native-vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScannerProps {
  setScanning: any,
  setForm: any,
  form: any
}

const Scanner = (props: ScannerProps) => {
  const { hasPermission, requestPermission } = useCameraPermission()
  const [dateFound, setDateFound] = useState(false)
  const [data, setData] = useState<TextData>()
  const device = useCameraDevice('back');

  if (!hasPermission) {
    requestPermission();
  }

  useEffect(() => {
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
            style={StyleSheet.absoluteFill}
            device={device}
            isActive
            options={{
              language: 'latin'
            }}
            mode={'recognize'}
            callback={(d) => setData(d as unknown as TextData)}
          />

          <TouchableOpacity className="w-8 bg-black/30 rounded-md items-center absolute left-2 top-10">
            <Icon name="close" color="white" size={30} onPress={() => props.setScanning(false)} />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  )
}

export default Scanner