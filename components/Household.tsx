import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'

export interface HouseProps {
    name: string
    onPress: () => void
    active: boolean
}

export default function Household(props: HouseProps) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View className="flex-col self-center h-24 justify-center mb-0.5 w-full bg-white px-4 shadow">
                <Text className="text-2xl">{props.name}</Text>
                {
                    props.active &&
                    
                    <Text className='mt-3'>Current Household</Text>
                }
            </View>
        </TouchableOpacity>
    )
}