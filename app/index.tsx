import { Redirect, router } from 'expo-router'
import { useGlobalContext } from '../context/GlobalProvider';
import { Text, View } from 'react-native';

const Index = () => {
  const { isLoading, isLoggedIn, user } = useGlobalContext();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Food Tracker</Text>
      </View>
    )
  }

  if (isLoggedIn) {
    return <Redirect href="/home" />
  }
  else {
    return <Redirect href="/sign-in" />;
  }
};
export default Index;