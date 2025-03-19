import { Text, FlatList, TouchableOpacity, RefreshControl, Modal, Pressable, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { appwrite } from '@/lib/appwrite';
import { IFoodSpace } from '@/interfaces/IFoodSpace';
import FoodSpace from './FoodSpace';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from './CustomModal';
import { useGlobalContext } from '@/context/GlobalProvider';
import { IItem } from '@/interfaces/IItem';
import Item from './Item';
import { showSuccessToast } from '@/lib/toast';
import { Icon } from './Icon';

export interface FoodSpaceListProps {
    refetch: () => void
    data: IFoodSpace[]
    edit: (id: string, title: string) => void
}

export default function FoodSpaceList(props: FoodSpaceListProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [spaceToDelete, setSpaceToDelete] = useState("");
    const [spaceToDeleteName, setSpaceToDeleteName] = useState("");
    const [itemWarningVisible, setItemWarningVisible] = useState(false);
    const { globalItems, setGlobalItems, globalFoodSpaces, setGlobalFoodSpaces } = useGlobalContext();
    const swipeableRefs = useRef(new Map<string, any>());

    const onRefresh = async () => {
        setRefreshing(true);
        props.refetch();
        setRefreshing(false);
    }

    const deleteSpace = async (spaceId: string, name: string): Promise<void> => {
        await appwrite.deleteFoodSpace(spaceId);
        await setGlobalItems((globalItems as IItem[]).filter(i => i.foodSpaceId != spaceId));
        await setGlobalFoodSpaces((globalFoodSpaces as IFoodSpace[]).filter(fs => fs.$id != spaceId))

        if (itemWarningVisible) {
            setItemWarningVisible(false);
        }
        props.refetch();
        showSuccessToast("Success", `${name} deleted`);
    }

    const checkSpaceForItems = async (spaceId: string, name: string): Promise<void> => {
        let foodSpaceContainsItems = await appwrite.foodSpaceContainsItems(spaceId);

        if (foodSpaceContainsItems) {
            setSpaceToDelete(spaceId);
            setSpaceToDeleteName(name);
            setItemWarningVisible(true);
        }
        else {
            deleteSpace(spaceId, name);
        }
    }

    const closeAllSwipeables = () => {
        swipeableRefs.current.forEach(ref => ref?.close());
    };


    const rightAction = (itemId: string, name: string) =>
        (prog: SharedValue<number>, drag: SharedValue<number>) => {
            const styleAnimation = useAnimatedStyle(() => {
                return {
                    transform: [{ translateX: drag.value + 70 }],
                };
            });

            return (
                // <TouchableOpacity onPress={() => { checkSpaceForItems(itemId, name) }}>
                //     <Reanimated.View className="bg-red h-24 px-4 items-center flex-row">
                //         <Text className="text-white">Delete</Text>
                //     </Reanimated.View>
                // </TouchableOpacity>
                <View className="flex flex-row w-[35%]">
                    <TouchableOpacity onPress={() => { closeAllSwipeables(); props.edit(itemId, name) }} className="w-1/2">
                        <Reanimated.View className="bg-blue h-24 px-4 items-center justify-center">
                            <Text className="text-white">Edit</Text>
                            <Icon name="pencil-outline" color={'white'} size={25}></Icon>
                        </Reanimated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { closeAllSwipeables(); checkSpaceForItems(itemId, name) }} className="w-1/2">
                        <Reanimated.View className="bg-red h-24 px-4 items-center justify-center">
                            <Text className="text-white">Delete</Text>
                            <Icon name="trash-outline" color={'white'} size={25}></Icon>
                        </Reanimated.View>
                    </TouchableOpacity>
                </View>
            );
        }

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <CustomModal
                title="Warning"
                body="Deleting this space will also remove all the items it contains."
                visible={itemWarningVisible}
                action={() => { deleteSpace(spaceToDelete, spaceToDeleteName) }}
                cancel={() => { setItemWarningVisible(false) }} />
            <FlatList
                data={props.data}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <GestureHandlerRootView>
                        <ReanimatedSwipeable
                            ref={(ref) => ref && swipeableRefs.current.set(item.$id, ref)}
                            friction={2}
                            enableTrackpadTwoFingerGesture
                            rightThreshold={40}
                            renderRightActions={rightAction(item.$id, item.name)}>
                            <Item name={item.name} />
                        </ReanimatedSwipeable>
                    </GestureHandlerRootView>
                )}
            />
        </SafeAreaView>
    )

}