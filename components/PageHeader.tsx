import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import DividerLine from './DividerLine'
import { Icon } from './Icon'

export interface PageHeaderProps {
    title: string
    backButton?: () => void
}

export default function PageHeader(props: PageHeaderProps) {
    return (
        <>
        <View className="flex flex-row items-center justify-center w-full">
            {props.backButton &&
            (
                <TouchableOpacity onPress={() => {
                    if (props.backButton) {
                        props.backButton()
                    }
                    }} className="ml-3">
                  <Text className="text-2xl">
                    <Icon name="arrow-back-sharp" size={25}></Icon>
                    </Text>
                </TouchableOpacity>
            )
            }
            <Text className="text-2xl font-psemibolds flex-1 text-center mr-3">
                {props.title}
            </Text>
        </View>
        <DividerLine fullWidth={true} />
        </>
    )
}