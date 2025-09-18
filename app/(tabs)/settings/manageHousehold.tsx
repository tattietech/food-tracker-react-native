import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import CustomButton from '@/components/CustomButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import CustomFormModal from '@/components/CustomFormModal';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { Icon } from '@/components/Icon';
import FormField from '@/components/FormField';

export default function ManageHousehold() {
  const { user, globalCurrentHouse, setGlobalCurrentHouse } = useGlobalContext();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const newHouseNameRef = useRef<TextInput>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const house = await appwrite.getHouseholdById(user.activeHouseholdId);
  //     setGlobalCurrentHouse(house.name);
  //   }

  //   fetchData();
  //   setNewName(globalCurrentHouse);
  // }, [globalCurrentHouse]);

  useEffect(() => {
    const fetchData = async () => {
      const house = await appwrite.getHouseholdById(user.activeHouseholdId);
      setGlobalCurrentHouse(house.name);
      setNewName(house.name);  // ✅ set newName based on latest house.name
    };

    fetchData();
  }, []); // ✅ empty array so it only runs once on mount

  const sendInvite = async () => {
    try {
      // find invitee userid by email
      var invitee = await appwrite.getUserIdByEmail(inviteeEmail);

      // create invite in invite table
      var invite = await appwrite.createInvite(user.$id, invitee, user.activeHouseholdId, "Pending", user.name);

      // add invite to user invite, this creates if it doesn't exist already
      var userInvite = await appwrite.addInviteToUserInvite(invitee, invite.$id);
    }
    catch (error) {
      if ((error as Error).message) {
        showErrorToast("Error", `You have already invited this user.`);
      }
    }
  }

  const updateHouseName = async () => {
    try {
      await appwrite.updateHouseName(user.activeHouseholdId, newName);
      setGlobalCurrentHouse(newName);
      setEditingName(false);
    }
    catch (error) {
      if ((error as Error).message) {
        showErrorToast("Error", `Problem renaming house`);
      }
    }
  }

  const closeModal = () => {
    setInviteModalVisible(false);
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title="Manage This House" backButton={() => { router.back() }} />
      <CustomFormModal
        formProps={user.activeHouseholdId}
        action={sendInvite}
        title={"Invite to Household"}
        cancel={closeModal}
        visible={inviteModalVisible}
        actionButtonText={"Invite"}
        formValue={inviteeEmail}
        setFormValue={setInviteeEmail}
      />
      <Text className="text-2xl ml-2 mb-2">House Name - </Text>
      <View className="flex-row">
        {
          editingName ?

            <View className="w-[75%] ml-2">
              <FormField ref={newHouseNameRef} value={newName} handleChangeText={(e) => setNewName(e)} />
              <TouchableOpacity
                onPress={() => {
                  newHouseNameRef.current?.clear();
                }}
                activeOpacity={0.7}
                className="bg-white flex-row self-center space-x-2 px-2 h-12 rounded-xl justify-center items-center absolute right-2 mt-2"
              >
                <Icon name="close-circle-outline" color="black" size={30} />
              </TouchableOpacity>
            </View>
            :

            <View className="border-b-0.5 w-[85%] ml-2">
              <Text className="mt-3 text-xl">{globalCurrentHouse}</Text>
            </View>
        }

        {
          editingName ?

            <View className="flex flex-row">
              <TouchableOpacity className="mt-3 ml-2">
                <Icon onPress={() => { updateHouseName() }} name="checkmark" color={'green'} size={40}></Icon>
              </TouchableOpacity>
              <TouchableOpacity className="mt-3 ml-1">
                <Icon onPress={() => { setEditingName(false) }} name="close" color={'grey'} size={40}></Icon>
              </TouchableOpacity>
            </View>

            :

            <TouchableOpacity className="mt-3 ml-4">
              <Icon onPress={() => { setEditingName(!editingName) }} name="pencil-outline" color={'black'} size={30}></Icon>
            </TouchableOpacity>

        }
      </View>
      <CustomButton
        title="Invite to Household"
        containerStyles='rounded-0 absolute bottom-0 w-full'
        handlePress={() => { setInviteModalVisible(true) }
        } />
    </SafeAreaView>
  );
}