import { View, Text } from 'react-native'
import React from 'react'
import { getDateColour } from '@/lib/dates'
import { Icon } from './Icon'

export interface ItemProps {
    name: string
    expiry?: Date
    quantity?: number
}

export default function Item(props: ItemProps) {
    let colour = props.expiry ? getDateColour(props.expiry) : "";
    return (
        <View className="flex-col self-center h-24 justify-center w-full bg-white px-4 shadow bg-fieldLight dark:bg-fieldDark rounded-lg mt-[0.5%]">
            <View className="flex-row">
                <Text className="text-2xl text-textLight dark:text-textDark max-w-[70%]">{props.name}</Text>
                <Text className="text-lg text-textLight dark:text-textDark mt-1">{props.quantity && props.quantity > 1 ? ' x' + props.quantity : ''}</Text>
            </View>
            <View className="flex flex-row justify-between">
                {
                    props.expiry ?
                        <Text className={`text-base ${colour == "red" ? 'text-red' : colour == "green" ? 'text-green' : colour == "amber" ? 'text-yellow' : 'text-primary'}`}>{new Date(props.expiry).toLocaleDateString()}</Text>

                        :

                        <Text className='text-base text-textLight dark:text-textDark'>No expiry set</Text>

                }
            </View>
            <View>
                <Icon name="chevron-down-sharp" size={20}></Icon>
            </View>
        </View>
    )
}