import { Gender } from '@/database/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class ParentInfoDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class StudentResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  dob: Date;

  @ApiProperty({ enum: Gender })
  @Expose()
  gender: Gender;

  @ApiProperty()
  @Expose()
  currentGrade: string;

  @ApiProperty()
  @Expose()
  parentId: string;

  @ApiProperty({ type: ParentInfoDto })
  @Expose()
  @Type(() => ParentInfoDto)
  parent?: ParentInfoDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
