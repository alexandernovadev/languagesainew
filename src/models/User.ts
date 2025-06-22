export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
