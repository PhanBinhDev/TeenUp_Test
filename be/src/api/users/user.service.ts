import { Uuid } from '@/common/types/common.type';
import { UserEntity } from '@/database/entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmailWithRelations(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['teacher', 'parent'],
    });
  }

  async findOne(id: Uuid): Promise<{ data: UserEntity | null }> {
    try {
      const user = await this.userRepository.findOneBy({
        id,
      });
      return { data: user };
    } catch (error) {
      this.logger.error(`Failed to find user with ID ${id}`, error.stack);
      return { data: null };
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user with email ${email}`, error.stack);
      return null;
    }
  }
}
