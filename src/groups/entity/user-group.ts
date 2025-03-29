import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entity/user';
import { Group } from './group';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({ name: 'group_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  @JoinColumn({ name: 'user_id' })
  group: Group;
}