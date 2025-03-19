import { IAppWriteDocument } from "./IAppWriteDocument"
import { IFoodSpace } from "./IFoodSpace"

export interface IItem extends IAppWriteDocument {
    name : string
    expiry : Date
    quantity: number
    household: string
    foodSpace: IFoodSpace
}