import { View, Text } from 'react-native'
import React from 'react'
import DividerLine from './DividerLine'
import { TouchableOpacity } from 'react-native'
import Home from '@/app/(tabs)/home'
import { Icon } from './Icon'

export interface MenuItemProps {
    name: string
    onPress: ()=> void
}

export default function MenuItem(props: MenuItemProps) {
    return (
        <TouchableOpacity onPress={props.onPress}>
        <View className="flex-col self-center w-[98%] bg-white px-4 py-6 bg-fieldLight dark:bg-fieldDark mb-2 rounded-lg">
            <View className="flex-row justify-between items-center">
                <Text className="text-2xl text-textLight dark:text-textDark">{props.name}</Text>
                <Icon name="chevron-forward-sharp" size={20}></Icon>
            </View>
        </View>
        </TouchableOpacity>
    )
}