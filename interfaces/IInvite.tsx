import { IAppWriteDocument } from "./IAppWriteDocument"

export interface IInvite extends IAppWriteDocument {
    sender: string
    receiver: string
    household: string
    status: string
    read: boolean
    senderName: string
}