import { View, Text, TextInput, TouchableOpacity, Image, KeyboardTypeOptions } from 'react-native'
import React, { LegacyRef, useState } from 'react'

interface FormFieldProps {
    title?: string;
    value: string;
    placeholder?: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
    keyboardType?: KeyboardTypeOptions | undefined;
  }

const FormField = React.forwardRef((props : FormFieldProps, ref:LegacyRef<TextInput>) => {
    const [showPassword, setshowPassword] = useState(false)

    return (
        <View className={`space-y-2 ${props.otherStyles}`}>
            {props.title && <Text className="text-base font-pmedium ml-2">{props.title}</Text>}

            <View className="border-2 w-full h-16 px-4
            rounded-2xl focus:border-secondary items-center flex-row">
                <TextInput
                    ref={ref}
                    className="flex-1 font-psemibold text-base"
                    value={props.value}
                    placeholder={props.placeholder}
                    placeholderTextColor="#7B7B8B"
                    onChangeText={props.handleChangeText}
                    secureTextEntry={props.title === "Password" && !showPassword}
                    keyboardType={props.keyboardType}
                />

                {props.title === "Password" && (
                    <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
                        {/* <Image
                            source={!showPassword ? icons.eye : icons.eyeHide}
                            className="w-6 h-6"
                            resizeMode="contain"
                        /> */}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
})

export default FormField