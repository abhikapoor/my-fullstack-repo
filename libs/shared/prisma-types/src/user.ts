export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  dob: Date;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
