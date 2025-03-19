import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import GlobalProvider from '@/context/GlobalProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props:any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#32c237' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: '500',
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props:any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 15,
          fontWeight: '500'
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    )
  };

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)/manageFoodSpaces" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      </GlobalProvider>
  );
}
