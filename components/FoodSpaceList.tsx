import { Text, FlatList, TouchableOpacity, RefreshControl, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
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

export interface FoodSpaceListProps {
    refetch: () => void
    data: IFoodSpace[]
}

export default function FoodSpaceList(props: FoodSpaceListProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [spaceToDelete, setSpaceToDelete] = useState("");
    const [itemWarningVisible, setItemWarningVisible] = useState(false);
    const { globalItems, setGlobalItems, globalFoodSpaces, setGlobalFoodSpaces } = useGlobalContext();

    const onRefresh = async () => {
        setRefreshing(true);
        props.refetch();
        setRefreshing(false);
    }

    const deleteSpace = async (spaceId: string): Promise<void> => {
        await appwrite.deleteFoodSpace(spaceId);
        await setGlobalItems((globalItems as IItem[]).filter(i => i.foodSpaceId != spaceId));
        await setGlobalFoodSpaces((globalFoodSpaces as IFoodSpace[]).filter(fs => fs.$id != spaceId))
        
        if (itemWarningVisible) {
            setItemWarningVisible(false);
        }
        props.refetch();
    }

    const checkSpaceForItems = async (spaceId: string): Promise<void> => {
        let foodSpaceContainsItems = await appwrite.foodSpaceContainsItems(spaceId);

        if (foodSpaceContainsItems) {
            setSpaceToDelete(spaceId);
            setItemWarningVisible(true);
        }
        else {
            deleteSpace(spaceId);
        }
    }

    const rightAction = (itemId: string) =>
        (prog: SharedValue<number>, drag: SharedValue<number>) => {
            const styleAnimation = useAnimatedStyle(() => {
                return {
                    transform: [{ translateX: drag.value + 70 }],
                };
            });

            return (
                <TouchableOpacity onPress={() => { checkSpaceForItems(itemId) }}>
                    <Reanimated.View className="bg-red h-24 px-4 items-center flex-row">
                        <Text className="text-white">Delete</Text>
                    </Reanimated.View>
                </TouchableOpacity>
            );
        }

    return (
        <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1 }}>
            <CustomModal title="Warning" body="Deleting this space will also remove all the items it contains." visible={itemWarningVisible} action={() => {deleteSpace(spaceToDelete)}} cancel={() => {setItemWarningVisible(false)}} />
            <FlatList
                data={props.data}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) => (
                    <GestureHandlerRootView>
                        <ReanimatedSwipeable
                            friction={2}
                            enableTrackpadTwoFingerGesture
                            rightThreshold={40}
                            renderRightActions={rightAction(item.$id)}>
                            <Item name={item.name} />
                        </ReanimatedSwipeable>
                    </GestureHandlerRootView>
                )}
            />
        </SafeAreaView>
    )

}