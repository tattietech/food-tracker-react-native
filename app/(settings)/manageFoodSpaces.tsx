import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router'

export default function ManageFoodSpaces() {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  return (
    <SafeAreaView className="h-full bg-white">
      <Text className="text-2xl text-center font-psemibolds">
          Manage Food Spaces
        </Text>
        <DividerLine fullWidth={true}/>
    </SafeAreaView>
  );
}