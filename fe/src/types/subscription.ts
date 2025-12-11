export enum SubscriptionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface Subscription {
  id: string;
  studentId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionPayload {
  studentId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  status?: SubscriptionStatus;
}

export interface UpdateSubscriptionPayload {
  packageName?: string;
  startDate?: string;
  endDate?: string;
  totalSessions?: number;
  status?: SubscriptionStatus;
}
