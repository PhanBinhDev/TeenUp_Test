import { IUser } from './user';

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}
