import { Alert, Button } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useGlobalContext } from '@/context/GlobalProvider';
import { appwrite } from '@/lib/appwrite';
import { IItem } from '@/interfaces/IItem';
import ItemForm from '@/components/ItemForm';
import { IItemForm } from '@/interfaces/IItemForm';
import Toast from 'react-native-toast-message';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

export interface IAddParams {
  title: string
}


export default function Add() {
  const { user, setGlobalItems, globalFoodSpaces } = useGlobalContext();

  const [form, setForm] = useState<IItemForm>({
    title: "",
    expiry: new Date(),
    quantity: "1",
    foodSpaceId: "",
    foodSpaceName: "",
    updatingItem: false
  })


  const submit = async (title: string, quantity: string, foodSpaceId: string, foodSpaceName: string, expiry?: Date) => {
    if (!title || !quantity || !foodSpaceName || !foodSpaceId) {
      showErrorToast("Error", `Please fill in all fields`);
      return;
    }

    try {
      console.log("trying to create food item");
      let item = await appwrite.createFoodItem(title, quantity.toString(), user.activeHouseholdId,
        foodSpaceId, expiry);

      setGlobalItems((prevItems: IItem[] | null) => {
        // If prevItems is null, initialize it as an empty array, then add the new item
        let newList = prevItems ? [...prevItems, item] : [item];

        // sort items by expiry
        return newList.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
      });

      const getInitialFoodspaceId = () => {
        if (form.foodSpaceId =="") {
          return globalFoodSpaces[0].$id;
        }

        return form.foodSpaceId;
      }

      const updatingItem = false;
      setForm({
        title: "",
        expiry: new Date(),
        quantity: "1",
        foodSpaceId: form.foodSpaceId ?? "",
        foodSpaceName: globalFoodSpaces.find((fs: { $id: string; }) => fs.$id == getInitialFoodspaceId())?.name ?? "",
        updatingItem
      });

      showSuccessToast("Success", `${title} added`);
    }
    catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  }


  return (
    <>
    <ItemForm
    title="Add New Item"
    submitButtonTitle="Add Item"
    submit={submit} form={form}
    setForm={setForm} />
    </>
  )
}
