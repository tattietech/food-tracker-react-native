import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { FlatList, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import PageHeader from '@/components/PageHeader';
import { useSwipe } from '@/lib/useSwipe';
import FoodSpaceList from '@/components/FoodSpaceList';
import CustomButton from '@/components/CustomButton';
import CustomFormModal from '@/components/CustomFormModal';
import useAppwrite from '@/lib/useAppwrite';
import { IFoodSpace } from '@/interfaces/IFoodSpace';
import { showSuccessToast } from '@/lib/toast';

export default function Settings() {
  const { setUser, setIsLoggedIn, user, setGlobalFoodSpaces, setGlobalItems } = useGlobalContext();
  const [manageFoodSpaces, setManageFoodSpaces] = useState(false);
  const [createSpaceModalVisible, setCreateSpaceModalVisible] = useState(false);
  const [updateSpaceValue, setUpdateSpaceValue] = useState("");
  const [updateSpaceId, setUpdateSpaceId] = useState("");
  const [spaceModalTitle, setSpaceModalTitle] = useState("");
  const [spaceModalButton, setSpaceModalButton] = useState("");
  const [updatingSpace, setUpdatingSpace] = useState(false);

  const logOut = async () => {
    await appwrite.signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/sign-in');
  }
  
  useFocusEffect(
    useCallback(() => {
      return () => {
        setManageFoodSpaces(false); // Reset state when navigating away
      };
    }, [])
  );

  const { onTouchStart, onTouchEnd } = useSwipe(onSwipeLeft, onSwipeRight, 6)

  function onSwipeLeft() {
  }

  function onSwipeRight() {
    if (manageFoodSpaces) {
      setManageFoodSpaces(false);
    }
  }

  const getAllFoodSpacesForHousehold = async (): Promise<IFoodSpace[]> => {
    return await appwrite.getAllFoodSpacesForHousehold(user.activeHouseholdId); // Replace with actual household ID
  }

  const { data: foodSpaceListData, refetch: foodSpaceListRefetch } = useAppwrite<IFoodSpace[]>(getAllFoodSpacesForHousehold);

  const closeFoodSpaceModal = async () => {
    await getAllFoodSpacesForHousehold();
    foodSpaceListRefetch();
    setCreateSpaceModalVisible(false);
    setSpaceModalTitle(`Create Food Space`);
    setSpaceModalButton("Create");
    setUpdatingSpace(false);
  };

  const createUpdateFoodSpace = async (name: string, householdId: string) => {
    if (updatingSpace && updateSpaceId) {
      const newSpace = await appwrite.updateFoodSpace(updateSpaceId, name, householdId);
      let items = await appwrite.getAllItems(householdId);

      setTimeout(() => {
        setGlobalItems(items);
      }, 0);

      setGlobalFoodSpaces((prevItems: IFoodSpace[] | null) => {
        if (prevItems) {
          prevItems = prevItems.filter(i => i.$id != updateSpaceId);
        }
        // If prevItems is null, initialize it as an empty array, then add the new item
  
        showSuccessToast("Success", `${name} updated`);

        return prevItems ? [...prevItems, newSpace] : [newSpace];
      });
    }
    else {
      const newSpace = await appwrite.createFoodSpace(name, householdId);
      setGlobalFoodSpaces((prevItems: IFoodSpace[] | null) => {
        // If prevItems is null, initialize it as an empty array, then add the new item
  
        showSuccessToast("Success", `${name} created`);
        return prevItems ? [...prevItems, newSpace] : [newSpace];
      });
    }
  }

  const updateFoodSpace = (id: string, name: string) => {
    setUpdatingSpace(true);
    setUpdateSpaceId(id);
    setSpaceModalTitle(`Update ${name}`);
    setSpaceModalButton("Update");
    setUpdateSpaceValue(name);
    setCreateSpaceModalVisible(true);
  }


  return (
    <SafeAreaView onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="h-full bg-white">
      {
        manageFoodSpaces ?
          (
            // <SafeAreaView onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            //   <PageHeader title="Food Spaces" backButton={() => { setManageFoodSpaces(false) }} />
            //   <FoodSpaceList />
            // </SafeAreaView>
            <>
              <PageHeader title="Food Spaces" backButton={() => { setManageFoodSpaces(false) }} />
              <FoodSpaceList refetch={foodSpaceListRefetch} edit={updateFoodSpace} data={foodSpaceListData ?? []} />
              <CustomFormModal
                formProps={user.activeHouseholdId}
                action={createUpdateFoodSpace}
                title={spaceModalTitle ?? "Create Food Space"}
                cancel={closeFoodSpaceModal}
                visible={createSpaceModalVisible}
                actionButtonText={spaceModalButton ?? "Create"}
                formValue={updateSpaceValue}
                setFormValue={setUpdateSpaceValue}
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