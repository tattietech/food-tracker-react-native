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
        data={[
          {
            title: "Account",
            action: () => {console.log("account")}
          },
          {
            title: "Log Out",
            action: logOut
          }
        ]}
        renderItem={({item}) => <MenuItem onPress={item.action} name={item.title} />}
        className="mt-5"
      />
    </SafeAreaView>
  );
}