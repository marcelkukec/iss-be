import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/user-register.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly  userRepository: Repository<User>) {}

  create(user: UserRegisterDto): Promise<User> {
    const newUser = this.userRepository.create({...user})
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {email}})
  }
}
