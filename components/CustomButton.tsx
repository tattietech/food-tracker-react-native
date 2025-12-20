import { TouchableOpacity, Text } from 'react-native'
import React from 'react'

interface CustomButtonProps {
    title: string,
    handlePress: any,
    containerStyles?: string,
    textStyles?: string,
    isLoading?: boolean
}

const CustomButton = (props : CustomButtonProps) => {
    return (
        <TouchableOpacity
            onPress={props.handlePress}
            activeOpacity={0.7}
            className={`bg-secondary min-h-[62px] justify-center items-center
            ${props.containerStyles} ${props.isLoading ? 'opacity-50' : ''}`}
            disabled={props.isLoading}
        >
            <Text className={`text-white font-psemibold text-lg ${props.textStyles}`}>
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

export default CustomButton