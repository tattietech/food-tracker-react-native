
import { IItem } from '@/interfaces/IItem';
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite'

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'com.ab.food-tracker',
    projectId: '67058f95000e4e73c08c',
    databaseId: 'food-tracker-db',
    userCollectionId: '67059541002ed2bc3832',
    itemCollectionId: '670596010025f0b9a6ce'
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
// const storage = new Storage(client);

export const createUser = async (email:string, password:string, name:string) => {
    
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(name);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                name: name,
                avatar: avatarUrl
            }
        );

        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error((error as Error).message);
    }
}

export const signIn = async (email:string, password:string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error((error as Error).message)
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    }
    catch (error) {
        throw new Error((error as Error).message)
    }
}

export const createItem = async (name:string, expiry:Date, quantity:string, userId:string): Promise<IItem> => {

    let quant = parseInt(quantity, 10) || 1;

    try {
        const newItem = await databases.createDocument(
            config.databaseId,
            config.itemCollectionId,
            ID.unique(),
            {
                name: name,
                expiry: expiry,
                quantity: quant,
                userId: userId
            }
        );
        
    return newItem as IItem;
    }
    catch (error) {
        console.log(error);
        throw new Error((error as Error).message);
    }
}

export const getAllItems = async (): Promise<IItem[]> => {
    try {
        const posts = await databases.listDocuments<IItem>(
            config.databaseId,
            config.itemCollectionId,
            [Query.orderAsc('expiry')]
        )

        return posts.documents;
    } catch (error) {
        throw new Error((error as Error).message);
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