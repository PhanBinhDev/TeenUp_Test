import { Class } from './class';
import { Student } from './student';

export interface ClassRegistration {
  id: string;
  classId: string;
  studentId: string;
  registeredAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  class?: Class;
  student?: Student;
}

export interface RegisterClassPayload {
  studentId: string;
}
