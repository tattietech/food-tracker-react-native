import DividerLine from '@/components/DividerLine';
import MenuItem from '@/components/MenuItem';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { Alert, FlatList, SafeAreaView, Text, View } from 'react-native';
import { router } from 'expo-router'
import PageHeader from '@/components/PageHeader';
import CustomButton from '@/components/CustomButton';

export default function ManageHousehold() {
  const { setUser, setIsLoggedIn } = useGlobalContext();

  return (
    <SafeAreaView className="h-full bg-white">
      <PageHeader title={"Manage Household"} backButton={() => { router.back() }} />
      <CustomButton
                title="Invite to Household"
                containerStyles='rounded-0 absolute bottom-0 w-full'
                handlePress={() => { console.log(""); }
                } />
    </SafeAreaView>
  );
}