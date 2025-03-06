import { View, Text } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'

export interface ItemProps {
    name : string
    expiry? : Date
    quantity?: number
}

export default function Item(props : ItemProps) {
    let colour = props.expiry ? getDateColour(props.expiry) : "";
    return (
        <View className="flex-col self-center h-24 justify-center mb-0.5 w-full bg-white px-4 shadow">
            <Text className="text-2xl">{props.name}</Text>
            <View className="flex flex-row justify-between">
                {
                    props.expiry && 
                    <Text className={`text-base ${colour == "red" ? 'text-red' : colour == "green" ? 'text-green' : colour == "amber" ? 'text-amber' : 'text-primary'}`}>{new Date(props.expiry).toLocaleDateString()}</Text>
                }
                {
                    props.quantity && props.quantity > 1 && <Text className="text-base transform -translate-y-3">x{props.quantity}</Text>
                }
            </View>
        </View>
    )
}