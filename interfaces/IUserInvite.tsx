import { IAppWriteDocument } from "./IAppWriteDocument"
import { IInvite } from "./IInvite"

export interface IUserInvite extends IAppWriteDocument {
    invites: IInvite[]
}