import { IAppWriteDocument } from "./IAppWriteDocument"

export interface IHousehold extends IAppWriteDocument {
    name : string
    users : Array<string>
}