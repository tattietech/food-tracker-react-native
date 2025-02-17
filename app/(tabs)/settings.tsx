import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router'

export default function Settings() {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const logOut = async () => {
    await appwrite.signOut();
    console.log("log out");
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
}

  return (
    <SafeAreaView className="h-full bg-white">
      <Text className="text-2xl text-center font-psemibolds">
          Settings
        </Text>
        <DividerLine fullWidth={true}/>
        <FlatList
        data={["Account", "Log Out"]}
        renderItem={({item}) => <MenuItem onPress={item == "Log Out" ? logOut : logOut} name={item} />}
        className="mt-5"
      />
    </SafeAreaView>
  );
}