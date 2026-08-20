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

    if (!user.password) {
      throw new ForbiddenException('This account does not have a password yet');
    }
    const isMatch = await bcrypt.compare(updateUserDto.current_password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('Current password is incorrect');
    }

    if (updateUserDto.password?.trim() === '') {
      delete updateUserDto.password;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    delete (updateUserDto as any).current_password;

    Object.assign(user, updateUserDto);
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

  async verifyEmail(userId: number): Promise<void> {
    await this.userRepository.update(
      { id: userId },
      { verified: true },
    );
  }

  async resetPassword(userId: number, password: string,): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.update(
      { id: userId },
      { password: hashedPassword },
    );
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { google_id: googleId },
    });
  }

  async linkGoogleAccount(userId: number, googleId: string): Promise<User> {
    const user = await this.findById(userId);

    user.google_id = googleId;
    user.verified = true;

    return this.userRepository.save(user);
  }

  async createGoogleUser(data: {
    email: string;
    google_id: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const username = await this.generateUsernameFromGoogle(data.first_name, data.last_name);

    const newUser = this.userRepository.create({
      email: data.email,
      google_id: data.google_id,
      username,
      first_name: data.first_name,
      last_name: data.last_name,
      password: null,
      verified: true,
    });

    return this.userRepository.save(newUser);
  }

  async generateUsernameFromGoogle(first_name: string, last_name: string): Promise<string> {
    const base = `${last_name.charAt(0)}${first_name}`.toLowerCase();
    let suffix = 1;
    let username = base;

    while (
      await this.userRepository.findOne({
        where: { username },
      })
      ) {
      username = `${base}${suffix}`;
      suffix++;
    }

    return username;
  }
}
