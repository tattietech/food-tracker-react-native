import CustomModal from "@/components/CustomModal";
import Invite from "@/components/Invite";
import PageHeader from "@/components/PageHeader";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useState } from "react";
import { FlatList, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appwrite } from '@/lib/appwrite';
import RNRestart from 'react-native-restart';
import { IInvite } from "@/interfaces/IInvite";

export default function Notifications() {

    const { user, setGlobalInvites, globalInvites } = useGlobalContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalBody, setModalBody] = useState('');
    const [selectedInviteId, setSelectedInviteId] = useState("");
    const [newHouseholdId, setNewSelectedHouseholdId] = useState("");

    const acceptInvite = async () => {
        setModalVisible(false);

        console.log("adding to house hold");
        await appwrite.addUserToHousehold(user.$id, newHouseholdId);

        console.log("setting household");
        await appwrite.setCurrentUserHousehold(user.$id, user.accountId, newHouseholdId);

        console.log("setting invite status");
        await appwrite.setInviteStatus(selectedInviteId, "accepted");

        console.log("removing invite from userInvite");
        await appwrite.removeInviteFromUserInvite(user.$id, selectedInviteId);

        console.log("resetting");
        RNRestart.restart();
    }

    const declineInvite = async () => {
        await appwrite.removeInviteFromUserInvite(user.$id, selectedInviteId);
        setModalVisible(false);
        await appwrite.setInviteStatus(selectedInviteId, "declined");
        setGlobalInvites((globalInvites as IInvite[]).filter(i => i.$id !== selectedInviteId))
    }

    const openModal = (inviteId: string, name: string, household: string) => {
        setModalVisible(true);
        setModalBody(`${name} has invited you to join their household. Accepting will switch you to the new household and restart the app.`);
        setSelectedInviteId(inviteId);
        setNewSelectedHouseholdId(household);
    }

    return (
        <SafeAreaView className="bg-white h-full">
            <PageHeader title={"Notifications"}/>

            <CustomModal
                title="Warning"
                body={modalBody}
                visible={modalVisible}
                action={() => { acceptInvite() }}
                cancel={() => { declineInvite() }} 
                positiveactionText="Accept"
                negativeActionText="Decline"
                positiveActionColour="bg-green"
                negativeActionColour="bg-red"
                />

                {
                    globalInvites != null && globalInvites != undefined && globalInvites.length > 0 ?

                    <FlatList
                            data={globalInvites}
                            renderItem={({ item }) => <Invite header={`${item.senderName} invited you to join their household!`} date={item.$createdAt} onPress={() => openModal(`${item.$id}`, `${item.senderName}`, `${item.household}`)} />}
                            className="mt-5"
                          />

                          :

                          <View className="my-auto">
                                  <Image className="w-[40%] h-[40%] mx-auto" source={require('../../assets/images/bell.png')} />
                                  <Text className="mt-5 text-3xl text-center">No notifications</Text>
                                  <Text className="mx-auto text-center mt-3 text-lg w-[70%]">If someone invites you to join their household, it will appear here</Text>
                                </View>
                }
        </SafeAreaView>
    )
}