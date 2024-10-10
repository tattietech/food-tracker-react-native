import { IAppWriteDocument } from "./IAppWriteDocument"

export interface IItem extends IAppWriteDocument {
    name : string
    expiry : Date
    quantity: number
}