import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera-text-recognition';
import { parseDateFromScan, TextData } from '@/lib/dates';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
