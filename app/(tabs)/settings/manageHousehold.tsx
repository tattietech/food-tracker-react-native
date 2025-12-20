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
import { IHousehold } from '@/interfaces/IHousehold';
import { IUser } from '@/interfaces/IUser';

export default function ManageHousehold() {
  const { user, globalCurrentHouse, setGlobalCurrentHouse } = useGlobalContext();
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteeEmail, setInviteeEmail] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const newHouseNameRef = useRef<TextInput>(null);
  const [house, setHouse] = useState<IHousehold>();

  useEffect(() => {
    const fetchData = async () => {
      const house = await appwrite.getHouseholdById(user.activeHouseholdId);
      setHouse(house);
      setGlobalCurrentHouse(house.name);
      setNewName(house.name);
    };

    fetchData();
  }, []);

  const sendInvite = async () => {
    try {
      if ((user as IUser).email == inviteeEmail) {
        showErrorToast("Error", "Cannot invite yourself");
        return;
      }

      // find invitee userid by email
      var invitee = await appwrite.getUserIdByEmail(inviteeEmail);

      house?.users.forEach(element => {
        console.log(element);
      });

      console.log(`invitee ${invitee}`);

      if (house?.users.includes(invitee)) {
        showErrorToast("Error", "User is already a member of this household");
        return;
      }

      console.log("Got invitee");

      // create invite in invite table
      var invite = await appwrite.createInvite(user.$id, invitee, user.activeHouseholdId, "Pending", user.name);

      console.log("Got invite");

      // add invite to user invite, this creates if it doesn't exist already
      var userInvite = await appwrite.addInviteToUserInvite(invitee, invite.$id);

      console.log("Got user invite");

      showSuccessToast("Success", `${inviteeEmail} invited`);
    }
    catch (error) {
      if ((error as Error).message) {
        showErrorToast("Error", (error as Error).message);
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
    <SafeAreaView className="h-full bg-fieldLight dark:bg-fieldDark">
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