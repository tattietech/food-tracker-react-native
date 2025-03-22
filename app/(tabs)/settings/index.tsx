import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { FlatList, SafeAreaView } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';

export default function Settings() {
  const { setUser, setIsLoggedIn} = useGlobalContext();

  const logOut = async () => {
    await appwrite.signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  }

  return (
    <SafeAreaView className="h-full bg-white">
              <PageHeader title="Settings" />
              <FlatList
                data={[
                  {
                    title: "Manage Food Spaces",
                    action: () => { router.push('/settings/manageFoodSpaces') }
                  },
                  {
                    title: "Manage Household",
                    action: () => { router.push('/settings/manageHousehold') }
                  },
                  {
                    title: "Log Out",
                    action: logOut
                  }
                ]}
                renderItem={({ item }) => <MenuItem onPress={item.action} name={item.title} />}
                className="mt-5"
              />
    </SafeAreaView>
  );
}