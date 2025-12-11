import { IBase } from './base';
import { UserRole } from './enum';

export interface IUser extends IBase {
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: UserRole;
  teacher?: ITeacher;
  parent?: IParent;
}

export interface ITeacher extends IBase {
  specialization?: string;
  bio?: string;
  yearsOfExperience?: number;
  user: IUser;
}

export interface IParent extends IUser {
  address?: string;
  occupation?: string;
}
