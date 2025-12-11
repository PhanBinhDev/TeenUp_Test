import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SubscriptionStatus } from '../enum/subscription.enum';
import { WrapperType } from './../../common/types/types';
import { AttendanceEntity } from './attendance.entity';
import { StudentEntity } from './student.entity';

@Entity('subscriptions')
@Index(['studentId'])
@Index(['status'])
@Index(['startDate', 'endDate'])
export class SubscriptionEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'student_id' })
  studentId: string;

  @Column({ type: 'varchar', length: 100, name: 'package_name' })
  packageName: string;

  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ type: 'int', name: 'total_sessions' })
  totalSessions: number;

  @Column({ type: 'int', default: 0, name: 'used_sessions' })
  usedSessions: number;

  // Computed column in PostgreSQL
  // remaining_sessions = total_sessions - used_sessions
  @Column({
    type: 'int',
    generatedType: 'STORED',
    asExpression: 'total_sessions - used_sessions',
    name: 'remaining_sessions',
  })
  remainingSessions: number;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Relations
  @ManyToOne(() => StudentEntity, (student) => student.subscriptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: WrapperType<StudentEntity>;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.subscription)
  attendances?: WrapperType<AttendanceEntity>[];
}
