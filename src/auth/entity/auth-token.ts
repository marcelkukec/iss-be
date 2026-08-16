import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entity/user';

export type AuthTokenType = | 'EMAIL_VERIFY' | 'PASSWORD_RESET';

@Entity('auth_tokens')
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token_hash: string;

  @Column()
  type: AuthTokenType;

  @Column()
  expires_at: Date;

  @Column({ nullable: true })
  used_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}