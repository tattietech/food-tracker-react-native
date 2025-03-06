import { Alert, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react'
import Scanner from '../../components/Scanner'
import FormField from '@/components/FormField';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from 'react-native-ui-datepicker';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import NumberInput from '@/components/NumberInput';
import { IItem } from '@/interfaces/IItem';
import { IFoodSpace } from '@/interfaces/IFoodSpace';
import DropDownPicker from 'react-native-dropdown-picker';
import PageHeader from '@/components/PageHeader';
import { Icon } from '@/components/Icon';
import { TextInput } from 'react-native-gesture-handler';


export default function Add() {
  const { user, setGlobalItems, globalFoodSpaces, setGlobalFoodSpaces } = useGlobalContext();
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enterManually, setEnterManually] = useState(false);
  const [createFoodSpace, setCreateFoodSpace] = useState(false);
  const [newFoodSpace, setNewFoodSpace] = useState("");
  const [foodSpaces, setFoodSpaces] = useState<IFoodSpace[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedFoodSpace, setSelectedFoodSpace] = useState("");
  const [foodSpacePickerItems, setFoodSpacePickerItems] = useState<{ label: string; value: string }[]>([]);
  const CREATE_FOOD_SPACE = "newFoodSpace";
  const newFoodSpaceTextBoxRef = useRef<TextInput>(null);

  const getFoodSpaces = async (): Promise<IFoodSpace[]> => {
    return await appwrite.getAllFoodSpacesForHousehold(user.activeHouseholdId);
  };

  useEffect(() => {
    const fetchFoodSpaces = async () => {
      try {
        const data = await getFoodSpaces();
        setFoodSpaces(data);
        setGlobalFoodSpaces(data);
      } catch (error) {
        console.error("Error fetching food spaces:", error);
      }
    };

    fetchFoodSpaces();

    console.log();
  }, []);

  useEffect(() => {
    if (foodSpaces) {
      setFoodSpacePickerItems(
        foodSpaces.map(fs => ({
          label: fs.name,
          value: fs.$id
        }))
      );

      setFoodSpacePickerItems(prev => [...prev, {
        label: "Create New Food Space",
        value: "newFoodSpace",
        labelStyle: { fontSize: 16, color: "white" },
        containerStyle: { borderTopWidth: 1, borderTopColor: "black", backgroundColor: "black" } 
      }]);
    }

  }, [foodSpaces]);

  useEffect(() => {
    setFoodSpaces(globalFoodSpaces);
  }, [globalFoodSpaces]);

  useEffect(() => {
    if (selectedFoodSpace == CREATE_FOOD_SPACE) {
      setCreateFoodSpace(true);
      setSelectedFoodSpace(foodSpaces[0].$id);
      if (newFoodSpaceTextBoxRef.current != null) {
        newFoodSpaceTextBoxRef.current.focus();
      }
      return;
    }
    var name = foodSpaces.find(fs => fs.$id == selectedFoodSpace)?.name;
    setForm({
      ...form,
      foodSpaceName: name ?? "",
      foodSpaceId: selectedFoodSpace ?? ""
    });
    
  }, [selectedFoodSpace]);


  const [form, setForm] = useState({
    title: "",
    expiry: new Date(),
    quantity: "1",
    foodSpaceId: "",
    foodSpaceName: ""
  }
  )

  const submit = async () => {
    if (!form.title || !form.expiry || !form.quantity) {
      Alert.alert("Please fill in all of the fields");
      return;
    }

    setSubmitting(true);

    try {
      let finalFoodSpaceId = selectedFoodSpace;
      let finalFoodSpaceName = foodSpaces.find(fs => fs.$id == selectedFoodSpace)?.name ?? "";

      if (createFoodSpace) {
        let nfs = await appwrite.createFoodSpace(newFoodSpace, user.activeHouseholdId);
        finalFoodSpaceId = nfs.$id;
        finalFoodSpaceName = newFoodSpace;

        // Add new food space to state
        setGlobalFoodSpaces((prevItems: IFoodSpace[] | null) => {
          // If prevItems is null, initialize it as an empty array, then add the new item
          return prevItems ? [...prevItems, nfs] : [nfs];
        });

        setFoodSpacePickerItems(prev => [...prev, { label: nfs.name, value: nfs.$id }]);
        setCreateFoodSpace(false);
        setSelectedFoodSpace(nfs.$id);
        setNewFoodSpace("");
      }

      let item = await appwrite.createFoodItem(form.title, form.expiry, form.quantity, user.activeHouseholdId,
        finalFoodSpaceId, finalFoodSpaceName);

      setGlobalItems((prevItems: IItem[] | null) => {
        // If prevItems is null, initialize it as an empty array, then add the new item
        let newList = prevItems ? [...prevItems, item] : [item];

        // sort items by expiry
        return newList.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
      });

      setForm({
        title: "",
        expiry: new Date(),
        quantity: "1",
        foodSpaceId: selectedFoodSpace ?? "",
        foodSpaceName: foodSpaces.find(fs => fs.$id == selectedFoodSpace)?.name ?? ""
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
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setEnterManually(false); setPickerOpen(false) }} accessible={false}>
      <SafeAreaView className="h-screen bg-white">
        {scanning && <Scanner setScanning={setScanning} setForm={setForm} form={form} />}
        {!scanning && <View className="h-full">
          <PageHeader title="Add New Item" />
          <View className="mt-6 flex flex-col space-y-8 px-3">
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
                <TouchableOpacity className="h-full w-full flex-row items-center" onPress={() => { setEnterManually(!enterManually) }}>
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

            <View className="z-10">
              <Text className="text-base font-pmedium ml-2">Food Space</Text>
              {/* Text box to enter food space manually */}
              <View className={`flex flex-row ${createFoodSpace ? 'block' : 'hidden'}`}>
                <FormField
                 ref={newFoodSpaceTextBoxRef}
                  value={newFoodSpace}
                  handleChangeText={(e) => setNewFoodSpace(e)}
                  otherStyles="w-full"
                />
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFoodSpace(foodSpaces[0].$id);
                    setCreateFoodSpace(false);
                    Keyboard.dismiss()
                  }}
                  activeOpacity={0.7}
                  className="bg-white flex-row self-center space-x-2 px-2 h-12 rounded-xl justify-center items-center absolute right-2"
                >
                  <Icon name="close-circle-outline" color="black" size={30} />
                </TouchableOpacity>
              </View>

              {/* DropDownPicker for Selecting Food Space */}
              <View className={`${createFoodSpace ? 'hidden' : 'block'}`}>
                <DropDownPicker
                  style={{height: 64, borderWidth: 2, borderRadius: 16}}
                  open={pickerOpen}
                  value={selectedFoodSpace}
                  items={foodSpacePickerItems}
                  setOpen={setPickerOpen}
                  setValue={setSelectedFoodSpace}
                  multiple={false}
                />
              </View>
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
            containerStyles="absolute bottom-10 w-full justify-center self-center"
          />
        </View>}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}
