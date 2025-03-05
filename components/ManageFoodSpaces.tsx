import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import DividerLine from './DividerLine';


export default function ManageFoodSpaces() {
    return (
        <SafeAreaView className="h-full bg-white">
      <Text className="text-2xl text-center font-psemibolds">
          Manage Food Spaces
        </Text>
        <DividerLine fullWidth={true}/>
    </SafeAreaView>
    )
}