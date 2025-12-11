export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface Student {
  id: string;
  fullName: string;
  name?: string;
  dateOfBirth: string;
  dob?: Date;
  gender: Gender;
  currentGrade: string;
  parentId: string;
  avatarUrl?: string;
  notes?: string;
  user?: {
    id: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  parent?: {
    id: string;
    userId: string;
    name: string;
    phone: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentPayload {
  name: string;
  dob: string;
  gender: Gender;
  currentGrade: string;
}

export interface UpdateStudentPayload {
  name?: string;
  dob?: string;
  gender?: Gender;
  currentGrade?: string;
  parentId?: string;
}
