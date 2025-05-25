import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import GlobalProvider from '@/context/GlobalProvider';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Alert } from 'react-native';
import { appwrite } from '@/lib/appwrite';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // useEffect(() => {
  //   // Request APNS permissions
  //   PushNotificationIOS.requestPermissions().then((permissions) => {
  //     if (permissions?.alert || permissions?.badge || permissions?.sound) {
  //       console.log('APNS Permissions granted:', permissions);
  //     } else {
  //       Alert.alert('Push Notification Permission', 'You need to enable notifications in settings.');
  //     }
  //   });

  //   // Listen for the APNS token
  //   const onRegister = (token: string) => {
  //     console.log('APNS Token:', token);
  //     appwrite.registerDeviceToken(token);
  //   };

  //   // Handle incoming notifications
  //   const onNotification = (notification: any) => {
  //     Alert.alert(notification.getTitle(), notification.getMessage());
  //   };

  //   // Add event listeners
  //   PushNotificationIOS.addEventListener('register', onRegister);
  //   PushNotificationIOS.addEventListener('notification', onNotification);

  //   return () => {
  //     // Clean up event listeners
  //     PushNotificationIOS.removeEventListener('register');
  //     PushNotificationIOS.removeEventListener('notification');
  //   };
  // }, []);

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      </GlobalProvider>
  );
}
