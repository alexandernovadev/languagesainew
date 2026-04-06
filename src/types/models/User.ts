import { ContentLanguage, Language, UserRole } from "../business";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  image?: string;
  language: ContentLanguage;
  explainsLanguage?: Language;
  isActive: boolean;
  address?: string;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
