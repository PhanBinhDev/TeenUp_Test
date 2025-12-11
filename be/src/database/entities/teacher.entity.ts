import { WrapperType } from '@/common/types/types';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ClassEntity } from './class.entity';
import { UserEntity } from './user.entity';

@Entity('teachers')
@Index(['userId'], { unique: true })
export class TeacherEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialization: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'int', nullable: true, name: 'years_of_experience' })
  yearsOfExperience: number | null;

  // Relations
  @OneToOne(() => UserEntity, (user) => user.teacher)
  @JoinColumn({ name: 'user_id' })
  user: WrapperType<UserEntity>;

  @OneToMany(() => ClassEntity, (classEntity) => classEntity.teacher)
  classes?: ClassEntity[];
}
