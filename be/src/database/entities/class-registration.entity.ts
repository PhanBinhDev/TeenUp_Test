import { Uuid } from '@/common/types/common.type';
import { WrapperType } from '@/common/types/types';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RegistrationStatus } from '../enum/class.enum';
import { AttendanceEntity } from './attendance.entity';
import { ClassEntity } from './class.entity';
import { StudentEntity } from './student.entity';

@Entity('class_registrations')
@Index(['classId', 'studentId'], { unique: true })
@Index(['classId'])
@Index(['studentId'])
@Index(['status'])
export class ClassRegistrationEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'class_id' })
  classId: Uuid;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId: Uuid;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'registration_date',
  })
  registrationDate: Date;

  @Column({
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.ACTIVE,
  })
  status: RegistrationStatus;

  // Relations
  @ManyToOne(() => ClassEntity, (classEntity) => classEntity.registrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'class_id' })
  class: ClassEntity;

  @ManyToOne(() => StudentEntity, (student) => student.classRegistrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' })
  student: WrapperType<StudentEntity>;

  @OneToMany(
    () => AttendanceEntity,
    (attendance) => attendance.classRegistration,
  )
  attendances?: AttendanceEntity[];
}
