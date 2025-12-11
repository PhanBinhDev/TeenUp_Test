import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Gender } from '../enum/user.enum';
import { ClassRegistrationEntity } from './class-registration.entity';
import { ParentEntity } from './parent.entity';
import { SubscriptionEntity } from './subscription.entity';

@Entity('students')
@Index(['parentId'])
export class StudentEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'parent_id' })
  parentId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    name: 'current_grade',
  })
  currentGrade: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Relations
  @ManyToOne(() => ParentEntity, (parent) => parent.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: ParentEntity;

  @OneToMany(
    () => ClassRegistrationEntity,
    (registration) => registration.student,
  )
  classRegistrations?: ClassRegistrationEntity[];

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.student)
  subscriptions?: SubscriptionEntity[];
}
