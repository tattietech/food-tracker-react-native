import { View, Text, Keyboard, TouchableWithoutFeedback, TextInput, SafeAreaView, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DividerLine from './DividerLine'
import Home from '@/app/(tabs)/home'
import { Icon } from './Icon'
import { IFoodSpace } from '@/interfaces/IFoodSpace'
import { useGlobalContext } from '@/context/GlobalProvider'
import Scanner from './Scanner'
import PageHeader from './PageHeader'
import FormField from './FormField'
import DateTimePicker from 'react-native-ui-datepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import NumberInput from './NumberInput'
import CustomButton from './CustomButton'
import { appwrite } from '@/lib/appwrite'
import { IItemForm } from '@/interfaces/IItemForm'
import Checkbox from 'expo-checkbox';


export interface ItemFormProps {
    submit: (title: string, quantity: string, foodSpaceId: string, foodSpaceName: string, expiry?: Date) => void
    form: IItemForm
    setForm: (form: IItemForm) => void
    title: string
    submitButtonTitle: string
}

export default function ItemForm(props: ItemFormProps) {
    const { user, setGlobalItems, globalFoodSpaces, setGlobalFoodSpaces } = useGlobalContext();
    const [scanning, setScanning] = useState(false);
    const [scanningCode, setScanningCode] = useState(false);
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
    const [quantity, setQuantity] = useState(1);
    const [scanningMode, setScanningMode] = useState("code");
    const [canExpire, setCanExpire] = useState(props.form.expiry != null);

    const systemColorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        setIsDarkMode(systemColorScheme === 'dark');
    }, [systemColorScheme]);


    const saveFoodSpace = async () => {
        let finalFoodSpaceId = props.form.foodSpaceId;

        let nfs = await appwrite.createFoodSpace(props.form.foodSpaceName, user.activeHouseholdId);
        finalFoodSpaceId = nfs.$id;

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

    const submit = async () => {
        let finalFoodSpaceId = props.form.foodSpaceId;
        let finalFoodSpaceName = props.form.foodSpaceName;

        if (canExpire) {
            props.submit(props.form.title,
                props.form.quantity,
                finalFoodSpaceId,
                finalFoodSpaceName,
                props.form.expiry);
        }
        else {
            props.submit(props.form.title,
                props.form.quantity,
                finalFoodSpaceId,
                finalFoodSpaceName);
        }

        setQuantity(1);
    }

    useEffect(() => {
        const fetchFoodSpaces = async () => {
            try {
                const data = await appwrite.getAllFoodSpacesForHousehold(user.activeHouseholdId);
                setFoodSpaces(data);
                setGlobalFoodSpaces(data);
                setSelectedFoodSpace(props.form.foodSpaceId);
            } catch (error) {
                console.error("Error fetching food spaces:", error);
            }
        };

        fetchFoodSpaces();

        if (props.form.quantity) {
            const num = parseInt(props.form.quantity, 10);

            if (isNaN(num)) return;

            if (num > 1) {
                setQuantity(num);
            }
        }
    }, []);

    useEffect(() => {
        if (foodSpaces) {
            setFoodSpacePickerItems(
                foodSpaces.map(fs => ({
                    label: fs.name,
                    value: fs.$id,
                    labelStyle: { color: isDarkMode ? 'white' : 'black' }
                }))
            );

            setFoodSpacePickerItems(prev => [...prev, {
                label: "Create New Food Space",
                value: CREATE_FOOD_SPACE,
                labelStyle: { fontSize: 16, color: "white" },
                containerStyle: { borderTopWidth: 1, borderTopColor: "black", backgroundColor: "#1E7DA9" }
            }]);
        }

    }, [foodSpaces, isDarkMode]);

    useEffect(() => {
        setFoodSpaces(globalFoodSpaces);

        if (foodSpaces[0] != undefined && !props.form.updatingItem) {
            setSelectedFoodSpace(foodSpaces[0].$id);
        }
    }, [globalFoodSpaces]);

    useEffect(() => {
        if (!foodSpaces) return;

        if (selectedFoodSpace == CREATE_FOOD_SPACE) {
            setCreateFoodSpace(true);
            //setSelectedFoodSpace(foodSpaces[0].$id);
            if (newFoodSpaceTextBoxRef.current != null) {
                newFoodSpaceTextBoxRef.current.focus();
            }
            return;
        }
        var name = foodSpaces.find(fs => fs.$id == selectedFoodSpace)?.name;
        props.setForm({
            ...props.form,
            foodSpaceName: name ?? "",
            foodSpaceId: selectedFoodSpace ?? ""
        });

    }, [selectedFoodSpace]);


    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setEnterManually(false); setPickerOpen(false) }} accessible={false}>
            <SafeAreaView className="h-full bg-bgLight dark:bg-bgDark">
                {scanning && <Scanner setMode={setScanningMode} mode={scanningMode} setScanning={setScanning} setForm={props.setForm} form={props.form} />}
                {/* {scanningCode && <BarCodeScanner setScanningCode={setScanningCode} setScanningDate={setScanning} setForm={props.setForm} form={props.form} />} */}
                {(!scanning && !scanningCode) && <View className="h-full">
                    <PageHeader title={props.title} />
                    <View className="mt-6 flex flex-col space-y-8 px-3">
                        <View className="flex flex-row">
                            <FormField
                                title="Title"
                                value={props.form.title}
                                placeholder="The items name"
                                handleChangeText={(e) => props.setForm({ ...props.form, title: e })}
                                otherStyles='w-full'
                                isDarkMode={isDarkMode}
                            />
                            <TouchableOpacity
                                onPress={() => { setScanningMode("code"); setScanning(true) }}
                                activeOpacity={0.7}
                                className="bg-secondary flex-row space-x-2 px-2 h-12 w-28 rounded-xl justify-center items-center absolute right-1 mt-10"
                            >
                                <Icon name="barcode" color="white" size={30} />
                                <Text className="text-white">Scan</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            <View className="flex flex-row">
                                <Text className="text-base font-pmedium ml-2 text-textLight dark:text-textDark">Expiry Date</Text>
                                <Checkbox
                                    value={canExpire}
                                    onValueChange={setCanExpire}
                                    className="ml-2 mt-0.5"
                                    color={"#1E7DA9"}
                                />
                            </View>

                            <View pointerEvents={!canExpire ? 'none' : 'auto'} style={{ opacity: canExpire ? 1 : 0.2 }} className="flex flex-row items-center mt-2 border-2 rounded-xl h-16 px-4 bg-fieldLight dark:bg-fieldDark">
                                <TouchableOpacity className="h-full w-full flex-row items-center" onPress={() => { setEnterManually(!enterManually) }}>
                                    <Text className="text-base font-pmedium text-textLight dark:text-textDark">{props.form.expiry ? new Date(props.form.expiry).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { setScanningMode("date"); setScanning(true) }}
                                    activeOpacity={0.7}
                                    className="bg-secondary flex-row space-x-2 px-2 h-12 w-28 rounded-xl justify-center items-center absolute right-1"
                                >
                                    <Icon name="camera" color="white" size={30} />
                                    <Text className="text-white">Scan</Text>
                                </TouchableOpacity>
                            </View>

                            {enterManually &&
                                <DateTimePicker
                                    mode="single"
                                    date={props.form.expiry}
                                    onChange={(e) => {
                                        if (!e.date) {
                                            return;
                                        }

                                        props.setForm({ ...props.form, expiry: e.date as Date })
                                        setEnterManually(false);
                                    }}
                                    headerTextStyle={{color: useColorScheme() === 'dark' ? 'white' : 'black'}}
                                    calendarTextStyle={{color: useColorScheme() === 'dark' ? 'white' : 'black'}}
                                    weekDaysTextStyle={{color: useColorScheme() === 'dark' ? 'white' : 'black'}}
                                    selectedItemColor='#1E7DA9'
                                />
                            }
                        </View>

                        <View className="z-10">
                            <Text className="text-base font-pmedium ml-2 text-textLight dark:text-textDark">Food Space</Text>
                            {/* Text box to enter food space manually */}
                            <View className={`flex flex-row ${createFoodSpace ? 'block' : 'hidden'}`}>
                                <FormField
                                    ref={newFoodSpaceTextBoxRef}
                                    value={props.form.foodSpaceName}
                                    handleChangeText={(e) => props.setForm({ ...props.form, foodSpaceName: e })}
                                    otherStyles="w-[70%]"
                                    isDarkMode={isDarkMode}
                                />

                                {/* Cancel button for manually entering new food space */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedFoodSpace(foodSpaces[0].$id);
                                        setCreateFoodSpace(false);
                                        Keyboard.dismiss()
                                    }}
                                    className="w-[15%] h-12 rounded-xl ml-1 bg-secondary min-h-[62px] justify-center items-center"
                                >
                                    <Icon name="close-circle-outline" color="white" size={30} />
                                </TouchableOpacity>

                                {/* Save button for new food space */}
                                <TouchableOpacity
                                    onPress={() => {
                                        saveFoodSpace();
                                        Keyboard.dismiss()
                                    }}
                                    className="w-[15%] h-12 rounded-xl ml-1 bg-secondary min-h-[62px] justify-center items-center"
                                >
                                    <Icon name="checkmark-circle-outline" color="white" size={30} />
                                </TouchableOpacity>
                                <View className="flex flex-row">

                                </View>
                            </View>

                            {/* DropDownPicker for Selecting Food Space */}
                            <View className={`${createFoodSpace ? 'hidden' : 'block'}`}>
                                <DropDownPicker
                                    style={{ height: 64, borderWidth: 2, borderRadius: 16, backgroundColor: useColorScheme() === 'dark' ? '#2E4763' : '#FFFFFF' }}
                                    open={pickerOpen}
                                    value={selectedFoodSpace}
                                    items={foodSpacePickerItems}
                                    setOpen={setPickerOpen}
                                    setValue={setSelectedFoodSpace}
                                    multiple={false}
                                    dropDownContainerStyle={{ backgroundColor: useColorScheme() === 'dark' ? '#2E4763' : '#FFFFFF' }}
                                    textStyle={{ color: useColorScheme() === 'dark' ? 'white' : 'black' }}
                                    arrowIconStyle={{ tintColor: useColorScheme() === 'dark' ? 'white' : 'black'}}
                                    tickIconStyle={{ tintColor: useColorScheme() === 'dark' ? 'white' : 'black' }}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-base font-pmedium ml-2 text-textLight dark:text-textDark">Quantity</Text>
                            <NumberInput quantity={quantity} setQuantity={setQuantity} form={props.form} setForm={props.setForm} />
                        </View>
                    </View>

                    <CustomButton
                        title={props.submitButtonTitle}
                        handlePress={submit}
                        isLoading={submitting}
                        containerStyles="absolute bottom-0 w-full justify-center self-center"
                    />
                </View>}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}