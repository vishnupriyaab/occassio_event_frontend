import { IEstimatedCost } from "./IVenue";

export interface IDecorationCreate {
    _id: string
    name: string;
    description: string;
    startingPrice: number;
    endingPrice: number;
    blocked?: boolean;
  }

  export interface IDecoration{
    _id: string;
    name: string;
    description: string;
    estimatedCost: IEstimatedCost | string;
    blocked: boolean;
    list?:boolean
    createdAt: Date;
    updatedAt: Date;
}