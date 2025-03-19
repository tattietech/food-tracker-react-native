import { createContext, useContext, useState, useEffect } from "react";
import { appwrite } from "../lib/appwrite";
import { IItem } from "../interfaces/IItem";
import { IUser } from "@/interfaces/IUser";
import { IFoodSpace } from "@/interfaces/IFoodSpace";
import useAppwrite from "@/lib/useAppwrite";

// default null context
export const def : any = null;
const GlobalContext = createContext(def);
export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: any
}
const GlobalProvider = (props: GlobalProviderProps) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState<IUser | null>(null)
const [isLoading, setIsLoading] = useState(true);
const [globalItems, setGlobalItems] = useState<IItem[] | null>(null);
const [globalFoodSpaces, setGlobalFoodSpaces] = useState<IFoodSpace[] | null>(null)

useEffect(() => {
    appwrite.getCurrentUser()
    .then((res) => {
        if (res) {
            setIsLoggedIn(true);
            setUser(res);
        }
        else {
            setIsLoggedIn(false);
            setUser(null);
        }
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        setIsLoading(false);
    })
}, []);


    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading,
                globalItems,
                setGlobalItems,
                globalFoodSpaces,
                setGlobalFoodSpaces
            }}
        >
            {props.children}
        </GlobalContext.Provider>

    )
}

export default GlobalProvider;