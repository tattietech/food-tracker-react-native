import { Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

interface NumberInputProps {
    setForm: any,
    form: any
  }

export default function NumberInput( props : NumberInputProps) {
    const [num, setNum] = useState(1)

    return (
        <View className="flex flex-row space-x-3 h-10 items-center mt-1 border-2 rounded-xl h-16">
            <Text className="text-base ml-2">{num}</Text>
            <View className="absolute right-1 flex flex-row space-x-1">
            <TouchableOpacity
                onPress={() => {
                    if (num > 1) {
                        setNum(num - 1)
                        props.setForm({ ...props.form, quantity: num });
                    }
                }}
                activeOpacity={0.7}
                className="bg-primary rounded-xl w-12 h-12 justify-center items-center"
            >
                <Text className="text-white font-psemibold text-2xl ${props.textStyles">
                    -
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    setNum(num+1);
                    props.setForm({ ...props.form, quantity: num });
                }}
                activeOpacity={0.7}
                className="bg-primary rounded-xl w-12 h-12 justify-center items-center"
            >
                <Text className="text-white font-psemibold text-2xl ${props.textStyles">
                    +
                </Text>
            </TouchableOpacity>
            </View>
        </View>
    )
}