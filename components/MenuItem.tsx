import { View, Text } from 'react-native'
import React from 'react'
import DividerLine from './DividerLine'
import { TouchableOpacity } from 'react-native'
import Home from '@/app/(tabs)/home'

export interface MenuItemProps {
    name: string
    onPress: ()=> void
}

export default function MenuItem(props: MenuItemProps) {
    return (
        <TouchableOpacity onPress={props.onPress}>
        <View className="flex-col self-center w-[98%] bg-white px-4 py-4">
            <View className="flex-row justify-between items-center">
                <Text className="text-2xl">{props.name}</Text>
                <Text className="text-xl text-primary">{'>'}</Text>
            </View>
        </View>
        <DividerLine/>
        </TouchableOpacity>
    )
}