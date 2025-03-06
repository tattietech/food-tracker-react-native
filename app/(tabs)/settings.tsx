import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router'
import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { useSwipe } from '@/lib/useSwipe';
import FoodSpaceList from '@/components/FoodSpaceList';
import CustomButton from '@/components/CustomButton';
import CustomFormModal from '@/components/CustomFormModal';
import useAppwrite from '@/lib/useAppwrite';
import { IFoodSpace } from '@/interfaces/IFoodSpace';

export default function Settings() {
  const { setUser, setIsLoggedIn, user, globalFoodSpaces, setGlobalFoodSpaces } = useGlobalContext();
  const [manageFoodSpaces, setManageFoodSpaces] = useState(false);
  const [createSpaceModalVisible, setCreateSpaceModalVisible] = useState(false);

  const logOut = async () => {
    await appwrite.signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  }

  // const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6)

  // function onSwipeLeft() {
  // }

  // function onSwipeRight() {
  //   if (manageFoodSpaces) {
  //     setManageFoodSpaces(false);
  //   }
  // }

  const getAllFoodSpacesForHousehold = async (): Promise<IFoodSpace[]> => {
    return await appwrite.getAllFoodSpacesForHousehold(user.activeHouseholdId); // Replace with actual household ID
  }

  const { data: foodSpaceListData, refetch: foodSpaceListRefetch } = useAppwrite<IFoodSpace[]>(getAllFoodSpacesForHousehold);

  const closeFoodSpaceModal = async () => {
    await getAllFoodSpacesForHousehold();
    foodSpaceListRefetch();
    setCreateSpaceModalVisible(false);
  };

  const createFoodSpace = async (name: string, householdId: string) => {
    const newSpace = await appwrite.createFoodSpace(name, householdId);
    setGlobalFoodSpaces((prevItems: IFoodSpace[] | null) => {
      // If prevItems is null, initialize it as an empty array, then add the new item
      return prevItems ? [...prevItems, newSpace] : [newSpace];
    });
  }


  return (
    <SafeAreaView className="h-full bg-white">
      {
        manageFoodSpaces ?
          (
            // <SafeAreaView onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            //   <PageHeader title="Food Spaces" backButton={() => { setManageFoodSpaces(false) }} />
            //   <FoodSpaceList />
            // </SafeAreaView>
            <>
              <PageHeader title="Food Spaces" backButton={() => { setManageFoodSpaces(false) }} />
              <FoodSpaceList refetch={foodSpaceListRefetch} data={foodSpaceListData ?? []} />
              <CustomFormModal
                formProps={user.activeHouseholdId}
                action={createFoodSpace}
                title="Create Food Space"
                cancel={closeFoodSpaceModal}
                visible={createSpaceModalVisible} actionButtonText="Create"
              />
              <CustomButton
                title="Create Food Space"
                containerStyles='rounded-0'
                handlePress={() => { setCreateSpaceModalVisible(true) }
                } />
            </>
          )

          :

          (
            <>
              <PageHeader title="Settings" />
              <FlatList
                data={[
                  {
                    title: "Manage Food Spaces",
                    action: () => { setManageFoodSpaces(true) }
                  },
                  {
                    title: "Log Out",
                    action: logOut
                  }
                ]}
                renderItem={({ item }) => <MenuItem onPress={item.action} name={item.title} />}
                className="mt-5"
              />
            </>
          )
      }
    </SafeAreaView>
  );
}