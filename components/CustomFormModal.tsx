import { TouchableOpacity, Text, Modal, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import FormField from './FormField'

interface CustomFormModalProps {
    cancel: () => void
    action: any
    visible: boolean
    title: string
    formProps: any
    actionButtonText: string
}

const CustomFormModal = (props : CustomFormModalProps) => {
    const [formValue, setFormValue] = useState("");
    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {props.cancel()}}>
                <View className="flex-1 justify-center items-center">
                    <View className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg shadow-black">
                        <Text className="mb-4 text-center font-bold">{props.title}</Text>
                        <FormField value={formValue} handleChangeText={(e) => setFormValue(e)}/>
                        <View className="flex flex-row pt-4">
                            <Pressable
                                className="bg-blue-500 rounded-lg p-3 mr-1"
                                onPress={() => {props.cancel(); setFormValue("")}}>
                                <Text className="text-white font-bold text-center">Cancel</Text>
                            </Pressable>
                            <Pressable
                                className="bg-green rounded-lg p-3 ml-1"
                                onPress={() => {props.action(formValue, props.formProps); props.cancel(); setFormValue("")}}>
                                <Text className="text-white font-bold text-center">{props.actionButtonText}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
    )
}

export default CustomFormModal