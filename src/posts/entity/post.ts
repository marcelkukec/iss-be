import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '../../comments/entity/comment';
import { User } from '../../users/entity/user';
import { Group } from '../../groups/entity/group';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Group, (group) => group.posts, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: Group;
}