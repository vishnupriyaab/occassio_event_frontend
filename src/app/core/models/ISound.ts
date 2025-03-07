import { IEstimatedCost } from "./IVenue";

export interface ISoundCreate {
    _id: string
    name: string;
    description: string;
    startingPrice: number;
    endingPrice: number;
    blocked?: boolean;
  }

  export interface ISound{
    _id: string;
    name: string;
    description: string;
    estimatedCost: IEstimatedCost | string;
    blocked: boolean;
    list?:boolean
    createdAt: Date;
    updatedAt: Date;
}