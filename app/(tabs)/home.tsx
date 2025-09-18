import { Alert, FlatList, Pressable, SafeAreaView, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider'
import useAppwrite from '@/lib/useAppwrite';
import { appwrite } from '@/lib/appwrite';
import { useEffect, useRef, useState } from 'react';
import Item from '@/components/Item';
import { IItem } from '@/interfaces/IItem';
import { RefreshControl, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Section } from '@/interfaces/ISection';
import PageHeader from '@/components/PageHeader';
import { Icon } from '@/components/Icon';
import {
  useNavigation,
} from '@react-navigation/native';
import UpdateItemModal from '@/components/UpdateItemModal';
import { IItemForm } from '@/interfaces/IItemForm';
import Toast from 'react-native-toast-message';
import { showSuccessToast } from '@/lib/toast';
import { IInvite } from '@/interfaces/IInvite';

export default function Home() {
  const { globalItems, setGlobalItems, user, globalCurrentHouse, setGlobalCurrentHouse } = useGlobalContext();
  const [groupedItems, setGroupedItems] = useState<Section[]>([]);
  const swipeableRefs = useRef(new Map<string, any>());
  const [updateItem, setUpdateItem] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState("");

  // form for updating item
  const [form, setForm] = useState<IItemForm>({
          title: "",
          expiry: new Date(),
          quantity: "1",
          foodSpaceId: "",
          foodSpaceName: "",
          updatingItem: true
      }
      )

  const refetch = async (): Promise<void> => {
      const items = await appwrite.getAllItems(user.activeHouseholdId);
      setGlobalItems(items);
  }

  const deleteItem = async (itemId: string): Promise<void> => {
    await appwrite.deleteItem(itemId);
    setGlobalItems((globalItems as IItem[])?.filter(d => d.$id !== itemId));

    refetch();
  }

  //const { data: data, refetch } = useAppwrite<IItem[]>(getAllItems);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setGroupedItems(mapItemsToSections());
  }, [globalItems]);

  const [expandedSections, setExpandedSections] = useState(new Set());

  const handleToggle = (title : string) => {
    setExpandedSections((expandedSections) => {
      // Using Set here but you can use an array too
      const next = new Set(expandedSections);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const sectionExpanded = (title : string) => {
      if (expandedSections.has(title)) {
        return true;
      }

      return false;
  };

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
      if (!groupedItems[item.foodSpace.name]) {
        groupedItems[item.foodSpace.name] = [];
      }
      groupedItems[item.foodSpace.name].push(item);
      expandedSections.add(item.foodSpace.name);
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

  useEffect(() =>  {
    const fetchData = async () => {
      const house = await appwrite.getHouseholdById(user.activeHouseholdId);
      setGlobalCurrentHouse(house.name);
    }

    fetchData();
    console.log(`home userid - ${user.$id}`);
    onRefresh();
  }, []);

  const swipeableRef = useRef<any>(null);

const closeAllSwipeables = () => {
  swipeableRefs.current.forEach(ref => ref?.close());
};

const closeUpdateItem = () => {
  setUpdateItem(false);
}


  const rightAction = (itemId: string, title: string, quantity: string, foodSpaceId: string, foodSpaceName: string, expiry?: Date) =>
    (prog: SharedValue<number>, drag: SharedValue<number>) => {
      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: drag.value + 0 }],
        };
      });

      const updatingItem = true;
      return (
        <View className="flex flex-row w-[35%]">
          <TouchableOpacity onPress={() => {closeAllSwipeables(); setUpdatingItemId(itemId); setForm({
            title,
            expiry,
            quantity,
            foodSpaceId,
            foodSpaceName,
            updatingItem
          }), setUpdateItem(true) }} className="w-1/2">
          <Reanimated.View className="bg-blue h-24 px-4 items-center justify-center">
            <Text className="text-white">Edit</Text>
            <Icon name="pencil-outline" color={'white'} size={25}></Icon>
          </Reanimated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {closeAllSwipeables(); deleteItem(itemId)}} className="w-1/2">
          <Reanimated.View className="bg-red h-24 px-4 items-center justify-center">
            <Text className="text-white">Delete</Text>
            <Icon name="trash-outline" color={'white'} size={25}></Icon>
          </Reanimated.View>
        </TouchableOpacity>
      </View>
      );
    }
  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title={globalCurrentHouse} />

      <UpdateItemModal id={updatingItemId} form={form} setForm={setForm} visible={updateItem} cancel={closeUpdateItem}/> 

      {
        globalItems != null && globalItems != undefined && (globalItems as IItem[]).length > 0 ?

        <SectionList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        sections={groupedItems}
        extraData={expandedSections}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ section: { title }, item }) => {
          const isExpanded = expandedSections.has(title);
          if (!isExpanded) return null;
  
          return <GestureHandlerRootView>
              <ReanimatedSwipeable
                ref={(ref) => ref && swipeableRefs.current.set(item.$id, ref)}
                friction={2}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                renderRightActions={rightAction(item.$id, item.name, item.quantity.toString(), item.foodSpace.$id, item.foodSpace.$id, item.expiry)}>
                <Item name={item.name} quantity={item.quantity} expiry={item.expiry} />
              </ReanimatedSwipeable>
            </GestureHandlerRootView>
        }}
        renderSectionHeader={({ section: { title } }) => (
          <Pressable onPress={() => handleToggle(title)}>
            <View className="flex flex-row bg-gray-200 p-2 justify-between items-center">
              <Text className="text-lg font-bold">{title}</Text>
  
              {
                sectionExpanded(title) ? (<Icon name="chevron-down-sharp" size={20}></Icon>)
                : (<Icon name="chevron-forward-sharp" size={20}></Icon>)
              }
            </View>
            </Pressable>
        )}
      />

      :

      <View className="my-auto">
        <Image className="w-[70%] h-[60%] mx-auto" source={require('../../assets/images/fridge.png')} />
        <Text className="text-3xl text-center">You have no items yet</Text>
        <Text className="mx-auto text-center mt-3 text-lg w-[70%]">Go to the Add Item tab to add some items to your food spaces</Text>
      </View>
      }
     
    </SafeAreaView>
  );
}