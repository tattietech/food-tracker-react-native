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
    formValue: string
    setFormValue: (value:string) => void
}

const CustomFormModal = (props : CustomFormModalProps) => {
    
    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
                onRequestClose={() => {props.cancel()}}>
                <View className="flex-1 justify-center items-center">
                    <View className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg shadow-black">
                        <Text className="mb-4 text-center font-bold">{props.title}</Text>
                        <FormField value={props.formValue} handleChangeText={(e) => props.setFormValue(e)}/>
                        <View className="flex flex-row pt-4">
                            <Pressable
                                className="bg-blue rounded-lg p-3 mr-1"
                                onPress={() => {props.cancel(); props.setFormValue("")}}>
                                <Text className="text-white font-bold text-center">Cancel</Text>
                            </Pressable>
                            <Pressable
                                className="bg-green rounded-lg p-3 ml-1"
                                onPress={() => {props.action(props.formValue, props.formProps); props.cancel(); props.setFormValue("")}}>
                                <Text className="text-white font-bold text-center">{props.actionButtonText}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
    )
}

export default CustomFormModal