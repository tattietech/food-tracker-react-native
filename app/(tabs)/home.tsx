import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import useAppwrite from '@/lib/useAppwrite';
import { getAllItems } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import Item from '@/components/Item';
import { IItem } from '@/interfaces/IItem';
import { RefreshControl } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import CustomButton from '@/components/CustomButton';

export default function Home() {
  const { globalItems, setGlobalItems, user } = useGlobalContext();
  
  const getItemsForUser = async (): Promise<IItem[]> => {
    return getAllItems(user.$id);
  };

  const { data: data, refetch } = useAppwrite<IItem[]>(getItemsForUser);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  
  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    if (data) {
      setGlobalItems(data);
    }
  }, [data]);


  return (
    <SafeAreaView className="h-full bg-white">
      <Text className="text-2xl text-center font-psemibolds">
          Items
        </Text>
      <FlatList
      className="mt-10"
        data={globalItems}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <Item name={item.name} quantity={item.quantity} expiry={item.expiry}/>
        )}
        // ListHeaderComponent={() => (
        //   <Text>Filter and seach bar</Text>
        // )}
        ListEmptyComponent={() => (
          <Text>Nae items yet pal</Text>
        )}
        refreshControl={<RefreshControl 
          refreshing={refreshing}
          onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
}
