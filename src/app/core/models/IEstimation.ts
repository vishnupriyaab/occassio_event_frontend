export default interface IEstimation {
    _id?: string;
    userId?: string;
    employeeId?: string;
    venue: {
      details: string;
      noOf: number;
      cost: number;
    };
    seating: {
      details: string;
      noOf: number;
      cost: number;
    };
    food: {
      welcomeDrink: {
        details: string;
        noOf: number;
        cost: number;
      };
      mainCourse: {
        details: string;
        noOf: number;
        cost: number;
      };
      dessert: {
        details: string;
        noOf: number;
        cost: number;
      };
    };
    soundSystem: {
      details: string;
      noOf: number;
      cost: number;
    };
    PhotoAndVideo: {
      details: string;
      noOf: number;
      cost: number;
    };
    Decoration: {
      details: string;
      noOf: number;
      cost: number;
    };
    grandTotal: String;
    createdAt?: Date;
    updatedAt?: Date;
  }
  