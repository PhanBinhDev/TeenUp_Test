import { WrapperType } from '@/common/types/types';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AttendanceStatus } from '../enum/class.enum';
import { ClassRegistrationEntity } from './class-registration.entity';
import { SubscriptionEntity } from './subscription.entity';
import { UserEntity } from './user.entity';

@Entity('attendances')
@Index(['classRegistrationId', 'attendanceDate'], { unique: true })
@Index(['classRegistrationId'])
@Index(['subscriptionId'])
@Index(['attendanceDate'])
export class AttendanceEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'class_registration_id' })
  classRegistrationId: string;

  @Column({ type: 'uuid', name: 'subscription_id' })
  subscriptionId: string;

  @Column({ type: 'date', name: 'attendance_date' })
  attendanceDate: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'marked_by' })
  markedById: string | null;

  // Relations
  @ManyToOne(
    () => ClassRegistrationEntity,
    (registration) => registration.attendances,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'class_registration_id' })
  classRegistration: ClassRegistrationEntity;

  @ManyToOne(
    () => SubscriptionEntity,
    (subscription) => subscription.attendances,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'subscription_id' })
  subscription: SubscriptionEntity;

  @ManyToOne(() => UserEntity, (user) => user.markedAttendances, {
    nullable: true,
  })
  @JoinColumn({ name: 'marked_by' })
  markedBy?: WrapperType<UserEntity>;
}
