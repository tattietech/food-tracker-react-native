import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

interface NumberInputProps {
    setForm: any,
    form: any,
    quantity: number,
    setQuantity: (num: number) => void
}

export default function NumberInput(props: NumberInputProps) {
    return (
        <View className="flex flex-row space-x-3 h-10 items-center mt-1 border-2 rounded-xl h-16 bg-fieldLight dark:bg-fieldDark">
            <Text className="text-base ml-2 text-textLight dark:text-textDark">{props.quantity}</Text>
            <View className="absolute right-1 flex flex-row space-x-1">
                <TouchableOpacity
                    onPress={() => {
                        if (props.quantity > 1) {
                            props.setForm({ ...props.form, quantity: props.quantity-1 });
                            props.setQuantity(props.quantity - 1)
                        }
                    }}
                    activeOpacity={0.7}
                    className="bg-secondary rounded-xl w-12 h-12 justify-center items-center"
                >
                    <Text className="text-white font-psemibold text-2xl ${props.textStyles">
                        -
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        props.setForm({ ...props.form, quantity: props.quantity+1 });
                        props.setQuantity(props.quantity + 1);
                    }}
                    activeOpacity={0.7}
                    className="bg-secondary rounded-xl w-12 h-12 justify-center items-center"
                >
                    <Text className="text-white font-psemibold text-2xl ${props.textStyles">
                        +
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}