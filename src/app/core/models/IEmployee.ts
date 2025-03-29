export interface Employee {
  employees: Employee;
  id?: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
}