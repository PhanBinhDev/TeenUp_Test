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
import { ClassStatus } from '../enum/class.enum';
import { ClassRegistrationEntity } from './class-registration.entity';
import { TeacherEntity } from './teacher.entity';

@Entity('classes')
@Index(['teacherId'])
@Index(['subject'])
@Index(['status'])
export class ClassEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'teacher_id' })
  teacherId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', array: true, name: 'days_of_week' })
  daysOfWeek: number[];

  @Column({ type: 'varchar', length: 50, name: 'time_slot' })
  timeSlot: string; // e.g., "08:00-09:30"

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'int', default: 20, name: 'max_students' })
  maxStudents: number;

  @Column({ type: 'int', default: 0, name: 'current_students' })
  currentStudents: number;

  @Column({
    type: 'enum',
    enum: ClassStatus,
    default: ClassStatus.ACTIVE,
  })
  status: ClassStatus;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.classes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'teacher_id' })
  teacher: WrapperType<TeacherEntity>;

  @OneToMany(
    () => ClassRegistrationEntity,
    (registration) => registration.class,
  )
  registrations?: ClassRegistrationEntity[];
}
