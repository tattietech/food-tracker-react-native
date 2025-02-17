import { Alert, FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import useAppwrite from '@/lib/useAppwrite';
import { appwrite } from '@/lib/appwrite';
import { useEffect, useState } from 'react';
import Item from '@/components/Item';
import { IItem } from '@/interfaces/IItem';
import { RefreshControl } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

export default function Home() {
  const { globalItems, setGlobalItems, user } = useGlobalContext();
  
  const getAllItems = async (): Promise<IItem[]> => {
    return await appwrite.getAllItems(user.$id);
  };

  const deleteItem = async (itemId: string): Promise<void> => {
    await appwrite.deleteItem(itemId);
    refetch();
  }

  const { data: data, refetch } = useAppwrite<IItem[]>(getAllItems);

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

  
const rightAction = (itemId: string) =>
  (prog: SharedValue<number>, drag: SharedValue<number>) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: drag.value + 70 }],
    };
  });

  return (
    <TouchableOpacity onPress={() => deleteItem(itemId)}>
    <Reanimated.View className="bg-red h-24 px-4 items-center flex-row">
      <Text className="text-white">Delete</Text>
    </Reanimated.View>
    </TouchableOpacity>
  );
}

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
          <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={rightAction(item.$id)}>
        <Item name={item.name} quantity={item.quantity} expiry={item.expiry}/>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
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