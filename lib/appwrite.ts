
import { useGlobalContext } from '@/context/GlobalProvider';
import { IFoodSpace } from '@/interfaces/IFoodSpace';
import { IHousehold } from '@/interfaces/IHousehold';
import { IItem } from '@/interfaces/IItem';
import { IUser } from '@/interfaces/IUser';
import { Alert } from 'react-native';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite'
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { IInvite } from '@/interfaces/IInvite';
import { IUserInvite } from '@/interfaces/IUserInvite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.ab.food-tracker',
    projectId: '67058f95000e4e73c08c',
    databaseId: 'food-tracker-db',
    userCollectionId: '67b335ef0005007ac675',
    itemCollectionId: '67da8b4a00128755557d',
    foodSpaceCollectionId: '67b31600002018a89402',
    householdCollectionId: '67b336b9002d6f610161',
    applePushNotificationProviderId: '67daecc2003189b72b14',
    inviteCollectionId: '67dd8571002f44d2a250',
    userInviteCollection: '68330a150004a25e5c4f'
}

// Init your React Native SDK
export const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export const appwrite = {

    registerDeviceToken: async (token: string) => {
        try {
            await account.createPushTarget(ID.unique(), token);
            console.log('Device registered with Appwrite');
        } catch (error) {
            console.log('Error registering device:', error);
        }
    },

    setupNotifications: async () => {
        // Request APNS permissions
        PushNotificationIOS.requestPermissions().then((permissions) => {
            if (permissions?.alert || permissions?.badge || permissions?.sound) {
                console.log('APNS Permissions granted:', permissions);
            } else {
                Alert.alert('Push Notification Permission', 'You need to enable notifications in settings.');
            }
        });

        // Listen for the APNS token
        const onRegister = (token: string) => {
            console.log('APNS Token:', token);
            appwrite.registerDeviceToken(token);
        };

        // Handle incoming notifications
        const onNotification = (notification: any) => {
            console.log("notification");
            Alert.alert(notification.getTitle(), notification.getMessage());
        };

        // Add event listeners
        PushNotificationIOS.addEventListener('register', onRegister);
        PushNotificationIOS.addEventListener('notification', onNotification);

        // return () => {
        //     // Clean up event listeners
        //     PushNotificationIOS.removeEventListener('register');
        //     PushNotificationIOS.removeEventListener('notification');
        // };
    },

    // subscribeToInvites: async (userId: string) => {
    //     console.log("subscribing...");
    //     // Subscribe to files channel
    //     client.subscribe(`databases.${config.databaseId}.collections.${config.userCollectionId}.documents.${userId}`, response => {
    //         // if (response.events.includes('buckets.*.files.*.create')) {
    //         //     // Log when a new file is uploaded
    //         //     console.log(response.payload);
    //         // }

    //         console.log(response.payload);

    //         //console.log("invite update " + JSON.stringify(response));
    //     });
    // },

    signIn: async (email: string, password: string) => {
        try {
            const session = await account.createEmailPasswordSession(email, password);
            await appwrite.setupNotifications();

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

    getUserIdByEmail: async (email: string): Promise<string> => {
        try {
            const user = await databases.listDocuments<IUser>(
                config.databaseId,
                config.userCollectionId,
                [Query.equal("email", email)]
            );

            if (!user) throw Error;

            return user.documents[0].$id;
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

    createFoodItem: async (name: string, quantity: string, householdId: string, foodSpaceId: string, expiry?: Date,): Promise<IItem> => {
        console.log("creating food item in appwrite");
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
                [Query.equal('foodSpace', foodSpaceId), Query.orderAsc('expiry')]
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
                    Query.equal('foodSpace', foodSpaceId), Query.orderAsc('expiry'),
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
                [Query.equal('householdId', householdId), Query.select([""])]
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
    setCurrentUserHousehold: async (userId: string, accountId: string, activeHouseholdId: string): Promise<void> => {
        try {
            // const userHouseholds = await appwrite.getUsersHouseholds(accountId);
            // const matchingHouseholds = userHouseholds.find(h => h.$id === activeHouseholdId);
            
            // if (matchingHouseholds == undefined) {
            //     console.log("User is not member of requested household");
            //     throw new Error("User is not member of requested household");
            // }
            
            await databases.updateDocument(
                config.databaseId,
                config.userCollectionId,
                userId,
                {
                    activeHouseholdId
                } 
            )
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },
    getUsersHouseholds: async (userId:string): Promise<IHousehold[]> => {
        try {
            console.log(`Getting households for ${userId}`);
            const households = await databases.listDocuments<IHousehold>(
                config.databaseId,
                config.householdCollectionId,
                [Query.contains("users", userId)]
            )

            return households.documents as IHousehold[]
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    getHouseholdById: async (householdId:string): Promise<IHousehold> => {
        try {
            const household = await databases.getDocument<IHousehold>(
                config.databaseId,
                config.householdCollectionId,
                householdId
            )

            return household;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    addUserToHousehold: async (userId:string, householdId:string): Promise<void> => {
        try {
            const household = await appwrite.getHouseholdById(householdId);
            household.users.push(userId);
            
            const updatedItem = await databases.updateDocument(
                config.databaseId,
                config.householdCollectionId,
                householdId,
                {
                    users: household.users
                }
            );
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    checkDuplicateInvite: async (sender: string, receiver: string, household: string): Promise<boolean> => {
        try {
            const foodSpaces = await databases.listDocuments<IFoodSpace>(
                config.databaseId,
                config.inviteCollectionId,
                [Query.equal('sender', sender), Query.equal('receiver', receiver), Query.equal('household', household), Query.equal('status', 'pending')]
            )

            return (foodSpaces.documents != null && foodSpaces.documents.length > 0);
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    createInvite: async (sender: string, receiver: string, household: string, status: string, senderName: string): Promise<IInvite> => {
        try {
            const duplicate = await appwrite.checkDuplicateInvite(sender, receiver, household);

            if (duplicate) {
                console.log("duplicate invite");
                throw new Error("duplicate invite")
            }
            const newInvite = await databases.createDocument(
                config.databaseId,
                config.inviteCollectionId,
                ID.unique(),
                {
                    sender,
                    receiver,
                    household,
                    status,
                    senderName
                }
            );

            return newInvite as IInvite;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },
    createUserInvite: async (userId: string, invites: string[]) : Promise<IUserInvite> => {
        try {
            const newUserInvite = await databases.createDocument(
                config.databaseId,
                config.userInviteCollection,
                userId,
                {
                    invites
                }
            )
    
            return newUserInvite as IUserInvite;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message)
        }
    },
    getUserInvite: async (id: string): Promise<IUserInvite[]> => {
        try {
            const userInvite = await databases.listDocuments<IUserInvite>(
                config.databaseId,
                config.userInviteCollection,
                [Query.equal('$id', id), Query.equal('status', 'pending')]
            )

            console.log(`Number of user invites found with id: ${userInvite.documents.length}`);

            return userInvite.documents;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    },
    addInviteToUserInvite: async (userId: string, invite: string) : Promise<IUserInvite> => {
        try {
            console.log("checking for existing user");
            const existingUserInvite = await appwrite.getUserInvite(userId);

            if (existingUserInvite == undefined || existingUserInvite == null || existingUserInvite.length == 0) {
                console.log("no user invite found, creating...");
                const newUserInvite = await appwrite.createUserInvite(userId, [invite]);

                console.log(`Created with id: ${newUserInvite.$id}`);
                return newUserInvite as IUserInvite;
            }

            console.log(`Existing user invite found with id ${existingUserInvite}`);

            const invites = [invite]
            existingUserInvite[0].invites.forEach(i => {
                if (i.$id != invite) {
                    invites.push(i.$id);
                }
            });

            const updatedUserInvite = await databases.updateDocument(
                config.databaseId,
                config.userInviteCollection,
                userId,
                {
                    invites
                }
            )
    
            return updatedUserInvite as IUserInvite;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message)
        }
    },
    removeInviteFromUserInvite: async (userId: string, invite: string) : Promise<IUserInvite> => {
        try {
            const existingUserInvite = await appwrite.getUserInvite(userId);

            if (existingUserInvite == undefined || existingUserInvite == null || existingUserInvite.length == 0) {
                throw new Error((`Error - user invite doesn't exist with id ${userId}`));
            }
            
            const invites : string[] = []
            existingUserInvite[0].invites.forEach(i => {
                if (i.$id != invite)
                {
                    invites.push(i.$id);
                }
            });

            const updatedUserInvite = await databases.updateDocument(
                config.databaseId,
                config.userInviteCollection,
                userId,
                {
                    invites
                }
            )
    
            return updatedUserInvite as IUserInvite;
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message)
        }
    },
    setInviteStatus: async (inviteId: string, status: string) => {
        try {
            await databases.updateDocument(
                config.databaseId,
                config.inviteCollectionId,
                inviteId,
                {
                    status
                }
            )
        }
        catch (error) {
            console.log(error);
            throw new Error((error as Error).message);
        }
    },
    updateHouseName: async (id: string, newName: string) => {
        try {
            await databases.updateDocument(
                config.databaseId,
                config.householdCollectionId,
                id,
                {
                    name: newName
                }
            )
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