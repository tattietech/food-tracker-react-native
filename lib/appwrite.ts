
import { useGlobalContext } from '@/context/GlobalProvider';
import { IFoodSpace } from '@/interfaces/IFoodSpace';
import { IHousehold } from '@/interfaces/IHousehold';
import { IItem } from '@/interfaces/IItem';
import { IUser } from '@/interfaces/IUser';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite'

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.ab.food-tracker',
    projectId: '67058f95000e4e73c08c',
    databaseId: 'food-tracker-db',
    userCollectionId: '67b335ef0005007ac675',
    itemCollectionId: '67da8b4a00128755557d',
    foodSpaceCollectionId: '67b31600002018a89402',
    householdCollectionId: '67b336b9002d6f610161'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export const appwrite = {

    signIn: async (email: string, password: string) => {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            return session;
        } catch (error) {
            console.log("attempted to sign in");
            throw new Error((error as Error).message)
        }
    },

    createUser: async (email: string, password: string, name: string) => {

        try {
            const newAccount = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (!newAccount) throw Error;
            await appwrite.signIn(email, password);

            const household = await appwrite.createHousehold(`${name}'s house`, newAccount.$id);

            await appwrite.createFoodSpace("Fridge", household.$id);

            const avatarUrl = avatars.getInitials(name);


            const newUser = await databases.createDocument(
                config.databaseId,
                config.userCollectionId,
                ID.unique(),
                {
                    accountId: newAccount.$id,
                    email: email,
                    name: name,
                    avatar: avatarUrl,
                    activeHouseholdId: household.$id
                }
            );

            return newUser;

        } catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    getCurrentUser: async (): Promise<IUser> => {
        try {
            const currentAccount = await account.get();
            if (!currentAccount) throw Error;

            const currentUser = await databases.listDocuments<IUser>(
                config.databaseId,
                config.userCollectionId,
                [Query.equal("accountId", currentAccount.$id)]
            );

            if (!currentUser) throw Error;

            return currentUser.documents[0];
        } catch (error) {
            console.log("attempted get user");
            throw new Error((error as Error).message);
        }
    },

    signOut: async () => {
        try {
            const session = await account.deleteSession("current");

            return session;
        }
        catch (error) {
            throw new Error((error as Error).message)
        }
    },

    createFoodItem: async (name: string, expiry: Date, quantity: string, householdId: string, foodSpaceId: string): Promise<IItem> => {

        let quant = parseInt(quantity, 10) || 1;
        console.log("appwrite.ts : foodspaceID : " + foodSpaceId);
        try {
            const newItem = await databases.createDocument(
                config.databaseId,
                config.itemCollectionId,
                ID.unique(),
                {
                    name: name,
                    expiry: expiry,
                    quantity: quant,
                    householdId: householdId,
                    foodSpace: foodSpaceId
                }
            );

            return newItem as IItem;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    updateFoodItem: async (id: string, name: string, expiry: Date, quantity: string, householdId: string, foodSpaceId: string): Promise<IItem> => {

        let quant = parseInt(quantity, 10) || 1;
        console.log("appwrite.ts : foodspaceID : " + foodSpaceId);
        try {
            const updatedItem = await databases.updateDocument(
                config.databaseId,
                config.itemCollectionId,
                id,
                {
                    name: name,
                    expiry: expiry,
                    quantity: quant,
                    householdId: householdId,
                    foodSpace: foodSpaceId
                }
            );

            return updatedItem as IItem;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    createFoodSpace: async (name: string, householdId: string): Promise<IFoodSpace> => {
        try {
            console.log("creating food space" + name + " " + householdId);
            const newSpace = await databases.createDocument<IFoodSpace>(
                config.databaseId,
                config.foodSpaceCollectionId,
                ID.unique(),
                {
                    name: name,
                    householdId: householdId
                }
            );

            return newSpace;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    updateFoodSpace: async (id: string, name: string, householdId: string): Promise<IFoodSpace> => {
        try {
            console.log("creating food space" + name + " " + householdId);
            const updatedSpace = await databases.updateDocument<IFoodSpace>(
                config.databaseId,
                config.foodSpaceCollectionId,
                id,
                {
                    name: name,
                    householdId: householdId
                }
            );

            return updatedSpace;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    getAllItems: async (householdId: string): Promise<IItem[]> => {
        try {
            const posts = await databases.listDocuments<IItem>(
                config.databaseId,
                config.itemCollectionId,
                [Query.equal('householdId', householdId), Query.orderAsc('expiry')]
            )

            return posts.documents;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    getAllItemsForFoodSpace: async (foodSpaceId: string): Promise<IItem[]> => {
        try {
            const posts = await databases.listDocuments<IItem>(
                config.databaseId,
                config.itemCollectionId,
                [Query.equal('foodSpaceId', foodSpaceId), Query.orderAsc('expiry')]
            )

            return posts.documents;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    foodSpaceContainsItems: async (foodSpaceId: string): Promise<boolean> => {
        try {
            const item = await databases.listDocuments<IItem>(
                config.databaseId,
                config.itemCollectionId,
                [
                    Query.equal('foodSpaceId', foodSpaceId), Query.orderAsc('expiry'),
                    Query.limit(1)
                ]
            )

            if (item.documents.length > 0) {
                return true;
            }

            return false;
        }
        catch (error) {
            throw new Error((error as Error).message);
        }
    },

    getAllFoodSpacesAndItemsForHousehold: async (householdId: string): Promise<IFoodSpace[]> => {
        try {
            const foodSpaces = await databases.listDocuments<IFoodSpace>(
                config.databaseId,
                config.foodSpaceCollectionId,
                [Query.equal('householdId', householdId)]
            )

            for (const foodSpace of foodSpaces.documents) {
                foodSpace.items = await appwrite.getAllItemsForFoodSpace(foodSpace.$id);
            }

            return foodSpaces.documents;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    getAllFoodSpacesForHousehold: async (householdId: string): Promise<IFoodSpace[]> => {
        try {
            const foodSpaces = await databases.listDocuments<IFoodSpace>(
                config.databaseId,
                config.foodSpaceCollectionId,
                [Query.equal('householdId', householdId)]
            )

            return foodSpaces.documents;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },

    deleteItem: async (itemId: string): Promise<void> => {
        try {
            await databases.deleteDocument(config.databaseId, config.itemCollectionId, itemId);
        }
        catch (error) {
            throw new Error((error as Error).message);
        }
    },
    deleteFoodSpace: async (spaceId: string): Promise<void> => {
        try {

            const items = await appwrite.getAllItemsForFoodSpace(spaceId);

            items.forEach(async item => {
                await databases.deleteDocument(config.databaseId, config.itemCollectionId, item.$id);
            });

            await databases.deleteDocument(config.databaseId, config.foodSpaceCollectionId, spaceId);
        }
        catch (error) {
            throw new Error((error as Error).message);
        }
    },
    createHousehold: async (name: string, userId: string): Promise<IHousehold> => {
        try {
            const newHouse = await databases.createDocument(
                config.databaseId,
                config.householdCollectionId,
                ID.unique(),
                {
                    name: name,
                    users: [userId]
                }
            );

            return newHouse as IHousehold;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },

    setCurrentUserHousehold: async (userId: string, houseId: string): Promise<void> => {
        try {
            await databases.updateDocument(config.databaseId, config.userCollectionId, userId,)
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    }
}

// export const getLatestPosts = async () => {
//     try {
//         const posts = await databases.listDocuments(
//             config.databaseId,
//             config.videoCollectionId,
//             [Query.orderDesc('$createdAt', Query.limit(7))]
//         )

//         return posts.documents;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// export const searchPosts = async (query) => {
//     try {
//         const posts = await databases.listDocuments(
//             config.databaseId,
//             config.videoCollectionId,
//             [Query.contains('title', query), Query.orderDesc('$createdAt')]
//         )

//         return posts.documents;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// export const getUserPosts = async (userId) => {
//     try {
//         const posts = await databases.listDocuments(
//             config.databaseId,
//             config.videoCollectionId,
//             [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
//         )

//         return posts.documents;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// export const getFilePreview = async (fileId, type) => {
//     let fileUrl;

//     try {
//         if (type === "video"){
//             fileUrl = storage.getFileView(config.storageId, fileId);
//         }
//         else if (type === "image") {
//             fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, "top", 100);
//         }
//         else {
//             throw new Error("Invalid file type")
//         }

//         if (!fileUrl) throw new Error;

//         return fileUrl;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

// export const uploadFile = async (file, type) => {
//     if (!file) return;

//     const asset = {
//         name: file.fileName,
//         type: file.mimeType,
//         size: file.fileSize,
//         uri: file.uri,
//     }

//     try {
//         const uploadedFile = await storage.createFile(config.storageId, ID.unique(), asset);

//         const fileUrl = await getFilePreview(uploadedFile.$id, type);

//         return fileUrl;
//     } catch (error) {
//         throw new Error(error)
//     }
// }

// export const createVideo = async (form) => {
//     try {
//         const [thumbnail, videoUrl] = await Promise.all(
//             [
//                 uploadFile(form.thumbnail, "image"),
//                 uploadFile(form.video, "video")
//             ]
//         )

//         const newPost = await databases.createDocument(
//             config.databaseId,
//             config.videoCollectionId,
//             ID.unique(),
//             {
//                 title: form.title,
//                 thumbnail: thumbnail,
//                 video: videoUrl,
//                 prompt: form.prompt,
//                 creator: form.userId
//             }
//         )

//         return newPost;
//     }
//     catch(error) {
//         throw new Error(error);
//     }
// }