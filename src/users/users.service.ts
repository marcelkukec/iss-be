import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../auth/user-register.dto';
import { UpdateUserDto } from './entity/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly  userRepository: Repository<User>,
  ) {}

  create(user: UserRegisterDto): Promise<User> {
    const newUser = this.userRepository.create({...user})
    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log('Looking up email:', JSON.stringify(email));

    const users = await this.userRepository.find({
      select: ['id', 'email'],
    });

    console.log('Known emails:', users.map(u => JSON.stringify(u.email)));

    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })

    if (!user){
      throw new NotFoundException(`User with id ${id} doesn't exist`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (!updateUserDto.current_password) {
      throw new ForbiddenException('Current password is required');
    }

    const isMatch = await bcrypt.compare(updateUserDto.current_password, user.password);
    if (!isMatch) throw new ForbiddenException('Current password is incorrect');

    if (updateUserDto.password?.trim() === '') {
      delete updateUserDto.password;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    delete (updateUserDto as any).current_password;

    // Update user
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateAvatar(id: number, avatar: string, currentPassword: string): Promise<User> {
    const user = await this.findById(id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Current password is incorrect');

    user.avatar = avatar;
    return this.userRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const user = await this.findById(id);

    await this.userRepository.remove(user);
  }

  async setActive(userId: number, isActive: boolean) {
    await this.userRepository.update({ id: userId }, { isActive });
    return { ok: true };
  }

}
