import { IAppWriteDocument } from "./IAppWriteDocument"
import { IItem } from "./IItem"

export interface IFoodSpace extends IAppWriteDocument {
    name : string
    householdId : string
    items: IItem[]
}