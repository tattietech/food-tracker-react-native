import { View } from "react-native";

export interface DividerLineProps {
    fullWidth?: boolean
}

export default function DividerLine(props: DividerLineProps) {
    return (
        <View className="flex-row justify-center">
                <View className={`h-[1px] bg-gray-300 ${props.fullWidth ? 'w-full' : 'w-[90%]'} my-2 content-center`} />
        </View>
    )
}