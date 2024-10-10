import { View, Text } from 'react-native'
import React from 'react'

export interface ItemProps {
    name : string
    expiry : Date
    quantity: number
}

export default function Item(props : ItemProps) {
    return (
        <View className="flex-col self-center h-24 mb-5 w-[90%] bg-white px-4 shadow">
            <Text className="text-2xl">{props.name}</Text>
            <Text className="text-base">{new Date(props.expiry).toLocaleDateString()}</Text>       
        </View>
    )
}