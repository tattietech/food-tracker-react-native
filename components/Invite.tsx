import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'

export interface InviteProps {
    header: string
    date: Date
    onPress: () => void
}

export default function Invite(props : InviteProps) {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <View className="flex-col self-center h-20 mb-0.5 w-full bg-white px-4 shadow">
                <Text className="text-xl mt-2">{props.header}</Text>
                <Text className="mt-2">{props.date.toString()}</Text>
            </View>
        </TouchableOpacity>
    )
}