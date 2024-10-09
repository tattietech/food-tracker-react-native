import { StyleSheet, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'

export default function Home() {
  const { user } = useGlobalContext();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>{user.name}</Text>
    </View>
  );
}
