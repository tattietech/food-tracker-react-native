import { View, Text, Keyboard, TouchableWithoutFeedback, TextInput, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import DividerLine from './DividerLine'
import { TouchableOpacity } from 'react-native'
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

export interface ItemFormProps {
    submit: (title: string, expiry: Date, quantity: string, foodSpaceId: string, foodSpaceName: string) => void
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

    const submit = async () => {
        console.log(props.form);

        let finalFoodSpaceId = props.form.foodSpaceId;
        let finalFoodSpaceName = props.form.foodSpaceName

        if (createFoodSpace) {
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

        props.submit(props.form.title,
            props.form.expiry,
            props.form.quantity,
            finalFoodSpaceId,
            finalFoodSpaceName);

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
                    value: fs.$id
                }))
            );

            setFoodSpacePickerItems(prev => [...prev, {
                label: "Create New Food Space",
                value: CREATE_FOOD_SPACE,
                labelStyle: { fontSize: 16, color: "white" },
                containerStyle: { borderTopWidth: 1, borderTopColor: "black", backgroundColor: "black" }
            }]);
        }

    }, [foodSpaces]);

    useEffect(() => {
        setFoodSpaces(globalFoodSpaces);
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
            <SafeAreaView className="h-full bg-white">
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
                            />
                            <TouchableOpacity
                                    onPress={() => { setScanningMode("code"); setScanning(true) }}
                                    activeOpacity={0.7}
                                    className="bg-primary flex-row space-x-2 px-2 h-12 w-28 rounded-xl justify-center items-center absolute right-1 mt-10"
                                >
                                    <Icon name="barcode" color="white" size={30} />
                                    <Text className="text-white">Scan</Text>
                                </TouchableOpacity>
                        </View>

                        <View>
                            <Text className="text-base font-pmedium ml-2">Expiry Date</Text>

                            <View className="flex flex-row items-center mt-2 border-2 rounded-xl h-16 px-4">
                                <TouchableOpacity className="h-full w-full flex-row items-center" onPress={() => { setEnterManually(!enterManually) }}>
                                    <Text className="text-base font-pmedium">{new Date(props.form.expiry).toLocaleDateString()}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => { setScanningMode("date"); setScanning(true) }}
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
                                    date={props.form.expiry}
                                    onChange={(e) => {
                                        if (!e.date) {
                                            return;
                                        }

                                        props.setForm({ ...props.form, expiry: e.date as Date })
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
                                    value={props.form.foodSpaceName}
                                    handleChangeText={(e) => props.setForm({ ...props.form, foodSpaceName: e })}
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
                                    style={{ height: 64, borderWidth: 2, borderRadius: 16 }}
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