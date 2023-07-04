import AsyncStorage from "@react-native-async-storage/async-storage";

import { GROUP_COLLECTION } from "@storage/storageConfig";
import { groupsGetAll } from "./groupsGetAll";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";

export async function groupCreate(newGroup:string) {
    try {
        const storedGroups = await groupsGetAll();

        const groupAlreadyExists = storedGroups.includes(newGroup)

        if (groupAlreadyExists){
            throw new AppError('A group with this name already exists')
        }

        const storage = JSON.stringify([...storedGroups, newGroup])
        await AsyncStorage.setItem(GROUP_COLLECTION, storage);

    } catch (error) {
        if (error instanceof AppError){
            Alert.alert('New Group', error.message)
        } else {
            Alert.alert('New group', 'It was not possible to create a new group')
            console.log(error)
        }
    }
}