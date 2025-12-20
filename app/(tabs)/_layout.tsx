import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';
import { appwrite, client, config } from '@/lib/appwrite';
import { useGlobalContext } from '@/context/GlobalProvider';
import { IUser } from '@/interfaces/IUser';
import { IInvite } from '@/interfaces/IInvite';
import { Text, View } from 'react-native';
import { IUserInvite } from '@/interfaces/IUserInvite';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, setGlobalInvites, globalInvites } = useGlobalContext();
  const [unreadInvites, setUnreadInvites] = useState<IInvite[]>([]);

  useEffect(() => {
    const fetchInvites = async () => {
      var invites = await appwrite.getUserInvite(user.$id);

      if (invites != null &&
        invites != undefined &&
        invites.length != 0 &&
        invites[0].invites != null &&
        invites[0].invites.length != 0) {
          setGlobalInvites(invites[0].invites); 
        }
    }

    fetchInvites();
    //setUnreadInvites((globalInvites as IInvite[]).filter(i => i.read == false));
  }, [])

  useEffect(() => {
    if (!user) return;
  
    const unsubscribe = client.subscribe(
      `databases.${config.databaseId}.collections.${config.userInviteCollection}.documents.${user.$id}`,
      response => {
  
        const userInvite = response.payload as IUserInvite;
  
        setGlobalInvites(userInvite.invites);
        //setUnreadInvites(userInvite.invites.filter(i => i.read == false));
      }
    );
  
    return () => {
      unsubscribe();
    };
  }, [user]);


  return (
    <Tabs
      screenOptions={{
        lazy: false,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          color: useColorScheme() === 'dark' ? 'white' : 'black'
        },
        tabBarStyle: {
          backgroundColor: useColorScheme() === 'dark' ? '#2E4763' : 'white',
          borderTopColor: useColorScheme() === 'dark' ? '#2E4763' : 'white'
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={useColorScheme() === 'dark' ? 'white' : 'black'} />
          )
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add' : 'add-outline'} color={useColorScheme() === 'dark' ? 'white' : 'black'} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabBarIcon
                name={focused ? "notifications" : "notifications-outline"}
                color={useColorScheme() === 'dark' ? 'white' : 'black'}
              />
              {
                  (unreadInvites && unreadInvites.length && unreadInvites.length > 0) ?
                  <View className="right-0 bottom-0 mx-[-4] my-[-4] absolute bg-red rounded-full w-5 h-5 flex flex-row items-center justify-center">
                    <Text className="text-white bold text-center">{unreadInvites?.length > 0 ? unreadInvites.length : ""}</Text>
                  </View>

                  :

                  null
              }
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={useColorScheme() === 'dark' ? 'white' : 'black'} />
          ),
        }}
      />
    </Tabs>
  );
}
