export default interface EntryRegFormData {
  name: string;
  email: string;
  phone: string;
  eventName: string;
  startDate: string;
  endDate: string;
  district: string;
  state: string;
  pincode: string;
  guestCount: number;
  venue: string;
  decoration: boolean;
  sound: boolean;
  seating: boolean;
  photography: boolean;
  foodOptions: {
    welcomeDrink: boolean;
    starters: boolean;
    mainCourse: boolean;
    dessert: boolean;
  };
}
