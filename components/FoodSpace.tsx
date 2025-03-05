import { View, Text } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'

export interface FoodSpaceProps {
    name : string
}

export default function FoodSpace(props : FoodSpaceProps) {
    return (
        <View className="flex flex-row items-center h-24 w-full bg-white px-4 shadow">
            <Text className="text-2xl">{props.name}</Text>
        </View>
    )
}