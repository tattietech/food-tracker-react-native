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


export default function Add() {
  const { user } = useGlobalContext();
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enterManually, setEnterManually] = useState(false);
  const [dateString, setDateString] = useState((new Date()).toLocaleDateString())

  const [form, setForm] = useState({
    title: "",
    expiry: new Date(),
    quantity: "",
  })

  const submit = async () => {
    if (!form.title || !form.expiry || !form.quantity) {
      Alert.alert("Please fill in all of the fields");
      return;
    }

    setSubmitting(true);

    try {
      createItem(form.title, form.expiry, form.quantity, user.$id);
      setForm({
        title: "",
        expiry: new Date(),
        quantity: ""
      })
    }
    catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
    finally {
      setSubmitting(false);
    }
  }


  return (
    <SafeAreaView className="h-screen">
      {scanning && <Scanner setScanning={setScanning} setForm={setForm} form={form} />}
      {!scanning && <View className="px-4 my-6">
        <Text className="text-2xl text-center font-psemibolds">
          Add New Item
        </Text>
        <View className="mt-20 flex flex-col space-y-16">
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

            <View className="flex space-x-10 flex-row items-center mt-2 ml-2">
              <Text className="text-xl font-pmedium">{new Date(form.expiry).toLocaleDateString()}</Text>

              <View className="flex flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => { setScanning(true) }}
                  activeOpacity={0.7}
                  className="bg-primary flex-row space-x-2 px-2 h-10 w-28 rounded-xl justify-center items-center"
                >
                  <Icon name="camera" color="white" size={30} />
                  <Text className="text-white">Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setEnterManually(!enterManually) }}
                  activeOpacity={0.7}
                  className="bg-primary px-2 h-10 w-28 rounded-xl justify-center items-center"
                >
                  <Text className="text-white">{enterManually ? "Close" : "Manual"}</Text>
                </TouchableOpacity>
              </View>
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
            <NumberInput />
          </View>

          <CustomButton
            title="Add Item"
            handlePress={submit}
            isLoading={submitting}
            containerStyles="mt-8"
          />
        </View>
      </View>}
    </SafeAreaView>
  )
}
