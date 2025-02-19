import { IAppWriteDocument } from "./IAppWriteDocument"

export interface IUser extends IAppWriteDocument {
    name : string
    activeHouseholdId: string
}