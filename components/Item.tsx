import { View, Text } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'

export interface ItemProps {
    name : string
    expiry : Date
    quantity: number
}

export default function Item(props : ItemProps) {
    let colour = getDateColour(props.expiry);
    return (
        <View className="flex-col self-center h-24 mb-5 w-[90%] bg-white px-4 shadow">
            <Text className="text-2xl">{props.name}</Text>
            <View>
                <Text className={`text-base ${colour == "red" ? 'text-red' : colour == "green" ? 'text-green' : colour == "amber" ? 'text-amber' : 'text-primary'}`}>{new Date(props.expiry).toLocaleDateString()}</Text>
            </View>
        </View>
    )
}