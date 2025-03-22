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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, setGlobalInvites, globalInvites } = useGlobalContext();
  const [unreadInvites, setUnreadInvites] = useState<IInvite[]>([]);

  useEffect(() => {
    client.subscribe(`databases.${config.databaseId}.collections.${config.userCollectionId}.documents.${user.$id}`, response => {
      let user = response.payload as IUser
      setGlobalInvites(user.invites);

      setUnreadInvites((globalInvites as IInvite[]).filter(i => i.read == false));
    });
  }, []);

  useEffect(() => {
    setUnreadInvites((globalInvites as IInvite[]).filter(i => i.read == false));
  }, [globalInvites]);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          color: 'primary'
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={'primary'} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Item',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add' : 'add-outline'} color={'primary'} />
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
                color={"primary"}
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
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={'primary'} />
          ),
        }}
      />
    </Tabs>
  );
}
