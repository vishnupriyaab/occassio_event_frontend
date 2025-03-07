import { IEstimatedCost } from "./IVenue";

export interface IMiscellaneousCreate {
    _id: string
    name: string;
    description: string;
    startingPrice: number;
    endingPrice: number;
    blocked?: boolean;
  }

  export interface IMiscellaneous{
    _id: string;
    name: string;
    description: string;
    estimatedCost: IEstimatedCost | string;
    blocked: boolean;
    list?:boolean
    createdAt: Date;
    updatedAt: Date;
}