import { TouchableOpacity, Text, Modal, View, Pressable, Alert } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import ItemForm from './ItemForm'
import { IItemForm } from '@/interfaces/IItemForm'
import { Icon } from './Icon'
import { appwrite } from '@/lib/appwrite'
import { useGlobalContext } from '@/context/GlobalProvider'
import { IItem } from '@/interfaces/IItem'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

interface IUpdateItemModalProps {
    id: string
    visible: boolean
    cancel: () => void
    form: IItemForm
    setForm: Dispatch<SetStateAction<IItemForm>>
}

const UpdateItemModal = (props: IUpdateItemModalProps) => {
    const { user, setGlobalItems } = useGlobalContext();

    const submit = async () => {
        if (!props.form.title || !props.form.expiry || !props.form.quantity || !props.form.foodSpaceName || !props.form.foodSpaceId) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            let item = await appwrite.updateFoodItem(props.id, props.form.title, props.form.expiry, props.form.quantity.toString(), user.activeHouseholdId,
            props.form.foodSpaceId);

            setGlobalItems((prevItems: IItem[] | null) => {
                if (prevItems) {
                    prevItems = prevItems.filter(i => i.$id != props.id);
                }
                // If prevItems is null, initialize it as an empty array, then add the new item
                let newList = prevItems ? [...prevItems, item] : [item];

                // sort items by expiry
                return newList.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
            });
            
            showSuccessToast("Success", `${item.name} updated`);
        }
        catch (error) {
            Alert.alert("Error", (error as Error).message);
        }
        finally {
            props.cancel();
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            onRequestClose={() => { props.cancel() }}>
            <View style={{ flex: 1 }}>
                {/* Close Button at the Top */}
                <TouchableOpacity
                    onPress={() => {
                        props.cancel();  // Close modal
                    }}
                    activeOpacity={0.7}
                    style={{
                        position: 'absolute',
                        top: 30,        // Distance from the top of the modal
                        left: 20,      // Distance from the right of the modal
                        padding: 10,    // Space around the icon
                        zIndex: 1,      // Ensure the button is above other elements
                    }}
                >
                    <Icon name="close-circle-outline" color="black" size={30} />
                </TouchableOpacity>

                {/* Modal Content */}
                <ItemForm title={"Update Item"} submitButtonTitle="Update" submit={submit} form={props.form} setForm={props.setForm} />
            </View>
        </Modal>
    )
}

export default UpdateItemModal;