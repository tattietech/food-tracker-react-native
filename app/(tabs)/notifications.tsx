import Invite from "@/components/Invite";
import PageHeader from "@/components/PageHeader";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FlatList, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {

    const { user, setGlobalInvites, globalInvites } = useGlobalContext();

    return (
        <SafeAreaView className="bg-white h-full">
            <PageHeader title={"Notifications"}/>
            <FlatList
                            data={globalInvites}
                            renderItem={({ item }) => <Invite header={`${item.senderName} invited you to join their household!`} date={item.$createdAt} />}
                            className="mt-5"
                          />
        </SafeAreaView>
    )
}