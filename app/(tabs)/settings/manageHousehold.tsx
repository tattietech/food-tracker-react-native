import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import CustomButton from '@/components/CustomButton';
import { useCallback, useState } from 'react';
import CustomFormModal from '@/components/CustomFormModal';

export default function ManageHousehold() {
    const { setUser, setIsLoggedIn, user, setGlobalFoodSpaces, setGlobalItems } = useGlobalContext();
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [inviteeEmail, setInviteeEmail] = useState("");

    const sendInvite = async () => {
      // find invitee userid by email
      var invitee = await appwrite.getUserIdByEmail(inviteeEmail);

      // create invite in invite table
      var invite = await appwrite.createInvite(user.$id, invitee, user.activeHouseholdId, "Pending", user.name);

      // add invite to user invite, this creates if it doesn't exist already
      var userInvite = await appwrite.addInviteToUserInvite(invitee, invite.$id);
    }

    const closeModal = () => {
      setInviteModalVisible(false);
    }

  return (
    <SafeAreaView className="h-full bg-white">
              <PageHeader title="Manage Household" backButton={() => { router.back() }} />
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
              <CustomButton
                title="Invite to Household"
                containerStyles='rounded-0 absolute bottom-0 w-full'
                handlePress={() => { setInviteModalVisible(true) }
                } />
    </SafeAreaView>
  );
}