import { Alert, FlatList, SafeAreaView, SectionList, Text, TouchableOpacity, View } from 'react-native';
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
import { Section } from '@/interfaces/ISection';
import PageHeader from '@/components/PageHeader';

export default function Home() {
  const { globalItems, setGlobalItems, user } = useGlobalContext();
  const [groupedItems, setGroupedItems] = useState<Section[]>([]);

  const getAllItems = async (): Promise<IItem[]> => {
    return await appwrite.getAllItems(user.activeHouseholdId);
  };

  const deleteItem = async (itemId: string): Promise<void> => {
    await appwrite.deleteItem(itemId);
    setGlobalItems((globalItems as IItem[])?.filter(d => d.$id !== itemId));

    refetch();
  }

  const { data: data, refetch } = useAppwrite<IItem[]>(getAllItems);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setGroupedItems(mapItemsToSections());
  }, [globalItems]);

  const mapItemsToSections = (): Section[] => {
    const groupedItems: Record<string, IItem[]> = {};

    if (globalItems == null) {
      return Object.keys(groupedItems).map((foodSpaceName) => ({
        title: foodSpaceName,
        data: groupedItems[foodSpaceName], // Sort by expiry
      }));
    }

    // Group items by `foodSpaceName`
    (globalItems as IItem[]).forEach((item) => {
      if (!groupedItems[item.foodSpaceName]) {
        groupedItems[item.foodSpaceName] = [];
      }
      groupedItems[item.foodSpaceName].push(item);
    });

    // Convert grouped object into SectionList format
    return Object.keys(groupedItems).map((foodSpaceName) => ({
      title: foodSpaceName,
      data: groupedItems[foodSpaceName], // Sort by expiry
    }));
  };

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
      <PageHeader title="Home" />

      <SectionList
        className="mt-10"
        sections={groupedItems}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <GestureHandlerRootView>
            <ReanimatedSwipeable
              friction={2}
              enableTrackpadTwoFingerGesture
              rightThreshold={40}
              renderRightActions={rightAction(item.$id)}>
              <Item name={item.name} quantity={item.quantity} expiry={item.expiry} />
            </ReanimatedSwipeable>
          </GestureHandlerRootView>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View className="bg-gray-200 p-2">
            <Text className="text-lg font-bold">{title}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>Nae items yet pal</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}