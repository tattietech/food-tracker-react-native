import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { FlatList, SafeAreaView } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import { useEffect, useState } from 'react';

export default function Settings() {
  const { setUser, setIsLoggedIn, user} = useGlobalContext();
  const [moreThanOneHouse, setMoreThanOneHouse] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
        try {
          const householdList = await appwrite.getUsersHouseholds(user.accountId);

          if (householdList.length > 1) {
            setMoreThanOneHouse(true);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

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
                    action: () => { router.push('/(tabs)/settings/manageFoodSpaces') }
                  },
                  {
                    title: "Manage This House",
                    action: () => { router.push('/(tabs)/settings/manageHousehold') }
                  },              
                  ...(moreThanOneHouse
                      ? [
                          {
                            title: "Manage My Houses",
                            action: () => router.push("/(tabs)/settings/manageMyHouseholds"),
                          },
                        ]
                      : []),
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