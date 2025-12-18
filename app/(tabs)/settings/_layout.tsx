import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

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
