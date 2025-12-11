import { WrapperType } from '@/common/types/types';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { UserRole } from '@/database/enum/user.enum';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { AttendanceEntity } from './attendance.entity';
import { ParentEntity } from './parent.entity';
import { TeacherEntity } from './teacher.entity';

@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PARENT,
  })
  role: UserRole;

  @Column({ type: 'varchar', length: 255, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'avatar_url' })
  avatarUrl: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified: boolean;

  // Relations
  @OneToOne(() => ParentEntity, (parent) => parent.user)
  parent?: WrapperType<ParentEntity>;

  @OneToOne(() => TeacherEntity, (teacher) => teacher.user)
  teacher?: WrapperType<TeacherEntity>;

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.markedBy)
  markedAttendances?: AttendanceEntity[];
}
