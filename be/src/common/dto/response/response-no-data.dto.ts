import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseNoDataDto {
  @ApiProperty()
  @Expose()
  statusCode: number;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  timestamp: Date;

  constructor({
    statusCode = 200,
    message = 'Success',
  }: {
    statusCode?: number;
    message?: string;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date();
  }
}
