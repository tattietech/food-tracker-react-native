import { IAppWriteDocument } from "./IAppWriteDocument"
import { IInvite } from "./IInvite"

export interface IUser extends IAppWriteDocument {
    name : string
    activeHouseholdId: string
    pushTargetId: string
    invites: IInvite[]
    email: string
}