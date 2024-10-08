import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera-text-recognition';
import { parseDateFromScan, TextData } from '@/lib/dates';

interface ScannerProps {
    setScanning: any,
    setScanData: any
}

const Scanner = (props : ScannerProps) => {
    const { hasPermission, requestPermission } = useCameraPermission()

  
    if (!hasPermission) {
      requestPermission();
    }
  
    const [data, setData] = useState<TextData>()
    const device = useCameraDevice('back');
  
    if (data && data.resultText && data.resultText.length > 0) {
      const foundDate = parseDateFromScan(data.resultText);
  
      if (foundDate) {
        props.setScanData(foundDate.toLocaleString());
        props.setScanning(false);
        console.log("Date string: " + foundDate.toLocaleString());
      }
    }
  
    return (
      <>
        {!!device && (
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
        )}
      </>
    )
}

export default Scanner