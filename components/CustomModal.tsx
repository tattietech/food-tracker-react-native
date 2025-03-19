import { TouchableOpacity, Text, Modal, View, Pressable } from 'react-native'
import React from 'react'

interface CustomModalProps {
    cancel: () => void
    action: () => void
    visible: boolean
    title: string
    body: string
}

const CustomModal = (props : CustomModalProps) => {
    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {props.cancel()}}>
                <View className="flex-1 justify-center items-center">
                    <View className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg shadow-black">
                        <Text className="mb-4 text-center font-bold">{props.title}</Text>
                        <Text className="mb-4 text-center">{props.body}</Text>
                        <View className="flex flex-row">
                            <Pressable
                                className="bg-blue rounded-lg p-3 mr-1"
                                onPress={() => {props.cancel()}}>
                                <Text className="text-white font-bold text-center">Cancel</Text>
                            </Pressable>
                            <Pressable
                                className="bg-red rounded-lg p-3 ml-1"
                                onPress={() => {props.action()}}>
                                <Text className="text-white font-bold text-center">Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
    )
}

export default CustomModal