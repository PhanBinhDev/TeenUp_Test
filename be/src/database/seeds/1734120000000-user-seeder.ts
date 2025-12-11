import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { ClassEntity } from '../entities/class.entity';
import { ParentEntity } from '../entities/parent.entity';
import { StudentEntity } from '../entities/student.entity';
import { TeacherEntity } from '../entities/teacher.entity';
import { UserEntity } from '../entities/user.entity';
import { ClassStatus } from '../enum/class.enum';
import { Gender, UserRole } from '../enum/user.enum';

export class UserSeeder1734120000000 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);
    const teacherRepository = dataSource.getRepository(TeacherEntity);
    const parentRepository = dataSource.getRepository(ParentEntity);
    const studentRepository = dataSource.getRepository(StudentEntity);
    const classRepository = dataSource.getRepository(ClassEntity);

    const hashedPassword = await hash('123456', 10);

    const teachers: TeacherEntity[] = [];

    for (let i = 1; i <= 2; i++) {
      const teacherUser = userRepository.create({
        email: `teacher${i}@teenup.com`,
        passwordHash: hashedPassword,
        fullName: `Giáo viên ${i}`,
        phone: `090000000${i}`,
        role: UserRole.TEACHER,
        isActive: true,
      });
      const savedTeacherUser = await userRepository.save(teacherUser);

      const teacher = teacherRepository.create({
        userId: savedTeacherUser.id,
        specialization: i === 1 ? 'Toán học' : 'Tiếng Anh',
        yearsOfExperience: 5 + i,
        bio: `Giáo viên ${i === 1 ? 'Toán học' : 'Tiếng Anh'} với ${5 + i} năm kinh nghiệm`,
      });
      const savedTeacher = await teacherRepository.save(teacher);
      teachers.push(savedTeacher);
    }

    // Create classes for teachers
    const classTemplates = [
      {
        name: 'Toán Nâng Cao 6',
        subject: 'Toán học',
        daysOfWeek: [1, 3, 5],
        timeSlot: '08:00-09:30',
        maxStudents: 15,
      },
      {
        name: 'Toán Cơ Bản 7',
        subject: 'Toán học',
        daysOfWeek: [2, 4],
        timeSlot: '14:00-15:30',
        maxStudents: 20,
      },
      {
        name: 'Toán Tư Duy 8',
        subject: 'Toán học',
        daysOfWeek: [1, 3],
        timeSlot: '16:00-17:30',
        maxStudents: 18,
      },
      {
        name: 'English Communication A1',
        subject: 'Tiếng Anh',
        daysOfWeek: [2, 4, 6],
        timeSlot: '09:00-10:30',
        maxStudents: 12,
      },
      {
        name: 'English Grammar B1',
        subject: 'Tiếng Anh',
        daysOfWeek: [1, 3, 5],
        timeSlot: '15:00-16:30',
        maxStudents: 15,
      },
      {
        name: 'IELTS Foundation',
        subject: 'Tiếng Anh',
        daysOfWeek: [2, 4],
        timeSlot: '18:00-19:30',
        maxStudents: 10,
      },
    ];

    let classCount = 0;
    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      const numClasses = i === 0 ? 3 : 3;
      const startIdx = i * 3;

      for (let j = 0; j < numClasses; j++) {
        const template = classTemplates[startIdx + j];
        const classEntity = classRepository.create({
          teacherId: teacher.id,
          name: template.name,
          subject: template.subject,
          description: `Lớp ${template.name} - Học ${template.daysOfWeek.length} buổi/tuần`,
          daysOfWeek: template.daysOfWeek,
          timeSlot: template.timeSlot,
          startTime: template.timeSlot.split('-')[0] + ':00',
          endTime: template.timeSlot.split('-')[1] + ':00',
          maxStudents: template.maxStudents,
          currentStudents: 0,
          status: ClassStatus.ACTIVE,
        });
        await classRepository.save(classEntity);
        classCount++;
      }
    }

    for (let i = 1; i <= 2; i++) {
      const parentUser = userRepository.create({
        email: `parent${i}@teenup.com`,
        passwordHash: hashedPassword,
        fullName: `Phụ huynh ${i}`,
        phone: `091000000${i}`,
        role: UserRole.PARENT,
        isActive: true,
      });
      const savedParentUser = await userRepository.save(parentUser);

      const parent = parentRepository.create({
        userId: savedParentUser.id,
        occupation: i === 1 ? 'Kỹ sư' : 'Giáo viên',
        notes: `Phụ huynh ${i}`,
      });
      const savedParent = await parentRepository.save(parent);

      for (let j = 1; j <= 2; j++) {
        const studentNumber = (i - 1) * 2 + j;
        const student = studentRepository.create({
          parentId: savedParent.id,
          name: `Học sinh ${studentNumber}`,
          dob: new Date(2010 + studentNumber, 0, 1),
          gender: studentNumber % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          currentGrade: `${6 + (studentNumber % 3)}`,
          notes: `Con ${j} của phụ huynh ${i}`,
        });
        await studentRepository.save(student);
      }
    }

    console.log('✅ Seed data created successfully!');
    console.log('');
    console.log('Teachers:');
    console.log('  - teacher1@teenup.com / 123456 (Toán học - 3 lớp)');
    console.log('  - teacher2@teenup.com / 123456 (Tiếng Anh - 3 lớp)');
    console.log('');
    console.log('Parents (each with 2 children):');
    console.log('  - parent1@teenup.com / 123456 (2 học sinh)');
    console.log('  - parent2@teenup.com / 123456 (2 học sinh)');
    console.log('');
    console.log(`Total: ${classCount} classes created`);
  }
}
