import { Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./CustomButton";
import { useState } from "react";

export default function NumberInput() {
    const [num, setNum] = useState(1)

    return (
        <View className="flex flex-row space-x-3 h-10 items-center ml-2 mt-1">
            <Text className="text-xl">{num}</Text>
            <TouchableOpacity
                onPress={() => {
                    if (num > 1) {
                        setNum(num - 1)
                    }
                }}
                activeOpacity={0.7}
                className="bg-primary rounded-xl w-10 h-10 justify-center items-center"
            >
                <Text className="text-white font-psemibold text-lg ${props.textStyles">
                    -
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {setNum(num+1)}}
                activeOpacity={0.7}
                className="bg-primary rounded-xl w-10 h-10 justify-center items-center"
            >
                <Text className="text-white font-psemibold text-lg ${props.textStyles">
                    +
                </Text>
            </TouchableOpacity>
        </View>
    )
}