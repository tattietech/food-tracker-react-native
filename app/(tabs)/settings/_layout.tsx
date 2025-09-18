import { Stack } from 'expo-router';
import React, { lazy } from 'react';
import 'react-native-reanimated';
import GlobalProvider from '@/context/GlobalProvider';

export default function SettingsLayout() {
  return (
      <Stack>
       <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="manageHousehold" options={{ headerShown: false }} />
        <Stack.Screen name="manageFoodSpaces" options={{ headerShown: false }} />
        <Stack.Screen name="manageMyHouseholds" options={{ headerShown: false }} />
      </Stack>
  );
}
