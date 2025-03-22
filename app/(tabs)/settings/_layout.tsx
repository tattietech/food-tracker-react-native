import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import GlobalProvider from '@/context/GlobalProvider';

export default function SettingsLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="manageHousehold" options={{ headerShown: false }} />
        <Stack.Screen name="manageFoodSpaces" options={{ headerShown: false }} />
      </Stack>
      </GlobalProvider>
  );
}
