import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import CustomButton from '@/components/CustomButton';
import { useCallback, useEffect, useState } from 'react';
import CustomFormModal from '@/components/CustomFormModal';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { IHousehold } from '@/interfaces/IHousehold';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable';
import Household from '@/components/Household';
import CustomModal from '@/components/CustomModal';
import RNRestart from 'react-native-restart';

export default function ManageMyHouseholds() {
  const { setUser, setIsLoggedIn, user, setGlobalFoodSpaces, setGlobalItems } = useGlobalContext();
  const [households, setHouseholds] = useState<IHousehold[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [selectedHouseholdName, setSelectedHouseholdName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await appwrite.getUsersHouseholds(user.accountId);
        console.log(`households: ${households.length}`);
        setHouseholds(response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const switchHousehold = async () => {
    await appwrite.setCurrentUserHousehold(user.$id, user.accountId, selectedHouseholdId);
    RNRestart.restart();
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const openModal = (id: string, name: string) => {
    if (id === user.activeHouseholdId) {
      showErrorToast("Error", "This household is already active");
      return;
    }

    setSelectedHouseholdId(id);
    setSelectedHouseholdName(name);
    setModalVisible(true);
  }

  return (
    <SafeAreaView className="h-full bg-fieldLight dark:bg-fieldDark">
      <PageHeader title="Manage My Houses" backButton={() => { router.back() }} />
      <CustomModal
        action={switchHousehold}
        cancel={closeModal}
        visible={modalVisible}
        title="Switch Household"
        body={`Would you like to switch to ${selectedHouseholdName}? This will restart the app`}
        positiveactionText="Switch"
        positiveActionColour="bg-green"
        negativeActionText="Cancel"
        negativeActionColour="bg-red"
      />
      <FlatList
        data={households}
        renderItem={({ item }) => (
          <Household active={item.$id === user.activeHouseholdId} name={item.name} onPress={() => {openModal(item.$id, item.name)}} />
        )}
      />
    </SafeAreaView>
  );
}