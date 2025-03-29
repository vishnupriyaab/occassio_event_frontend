export interface Employee {
  _id?: string;
  employees: Employee;
  name: string;
  email: string;
  phone: string;
  status?: string;
}

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked?: boolean;
}