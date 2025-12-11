import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { WrapperType } from './../../common/types/types';
import { StudentEntity } from './student.entity';
import { UserEntity } from './user.entity';

@Entity('parents')
@Index(['userId'], { unique: true })
export class ParentEntity extends AbstractEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  occupation: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Relations
  @OneToOne(() => UserEntity, (user) => user.parent)
  @JoinColumn({ name: 'user_id' })
  user: WrapperType<UserEntity>;

  @OneToMany(() => StudentEntity, (student) => student.parent)
  students?: WrapperType<StudentEntity>[];
}
