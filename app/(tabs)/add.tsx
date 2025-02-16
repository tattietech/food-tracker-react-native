import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react'
import Scanner from '../../components/Scanner'
import FormField from '@/components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import { createItem } from '@/lib/appwrite';
import NumberInput from '@/components/NumberInput';
import Icon from 'react-native-vector-icons/AntDesign';
import { IItem } from '@/interfaces/IItem';


export default function Add() {
  const { user, globalItems, setGlobalItems } = useGlobalContext();
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enterManually, setEnterManually] = useState(false);

  const [form, setForm] = useState({
    title: "",
    expiry: new Date(),
    quantity: "1",
  })

  const submit = async () => {
    if (!form.title || !form.expiry || !form.quantity) {
      Alert.alert("Please fill in all of the fields");
      return;
    }

    setSubmitting(true);

    try {
      let item = await createItem(form.title, form.expiry, form.quantity, user.$id);

      setGlobalItems((prevItems: IItem[] | null) => {
        // If prevItems is null, initialize it as an empty array, then add the new item
        let newList = prevItems ? [...prevItems, item] : [item];

        // sort items by expiry
        return newList.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
      });

      setForm({
        title: "",
        expiry: new Date(),
        quantity: "1"
      });
      Alert.alert("Item added");
    }
    catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
    finally {
      setSubmitting(false);
    }
  }


  return (
    <SafeAreaView className="h-screen bg-white">
      {scanning && <Scanner setScanning={setScanning} setForm={setForm} form={form} />}
      {!scanning && <View className="px-4 h-full">
        <Text className="text-2xl text-center font-psemibolds">
          Add New Item
        </Text>
        <View className="mt-6 flex flex-col space-y-8">
          <View>
            <FormField
              title="Title"
              value={form.title}
              placeholder="The items name"
              handleChangeText={(e) => setForm({ ...form, title: e })}
            />
          </View>

          <View>
            <Text className="text-base font-pmedium ml-2">Expiry Date</Text>

            <View className="flex flex-row items-center mt-2 border-2 rounded-xl h-16 px-4">
              <TouchableOpacity className="h-full w-full flex-row items-center" onPress={() => {setEnterManually(!enterManually)}}>
                <Text className="text-base font-pmedium">{new Date(form.expiry).toLocaleDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setScanning(true) }}
                activeOpacity={0.7}
                className="bg-primary flex-row space-x-2 px-2 h-12 w-28 rounded-xl justify-center items-center absolute right-1"
              >
                <Icon name="camera" color="white" size={30} />
                <Text className="text-white">Scan</Text>
              </TouchableOpacity>
            </View>

            {enterManually &&
              <DateTimePicker
                mode="single"
                date={form.expiry}
                onChange={(e) => {
                  if (!e.date) {
                    return;
                  }

                  setForm({ ...form, expiry: e.date as Date })
                  setEnterManually(false);
                }}
              />
            }
          </View>

          <View>
            <Text className="text-base font-pmedium ml-2">Quantity</Text>
            <NumberInput form={form} setForm={setForm} />
          </View>
        </View>

        <CustomButton
            title="Add Item"
            handlePress={submit}
            isLoading={submitting}
            containerStyles="mt-8 absolute bottom-20 w-full justify-center self-center"
          />
      </View>}
    </SafeAreaView>
  )
}
