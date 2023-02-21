import { AppDataSource } from './../utils/data-source';
import { Entity, Column, Index, BeforeInsert, OneToOne, EntityManager,JoinColumn, ManyToOne, AfterInsert, JoinTable } from 'typeorm';
import Model from './model.entity';
import bcrypt from 'bcryptjs';
import { Role } from './role.entity';

@Entity('users')
export class User extends Model {
  @Column()
  name: string;

  @Index('email_index')
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, role => role.users)
  @JoinTable()
  role: Role

  toJSON() {
    return { ...this, password: undefined};
  }

  // Hash password before saving to database
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  @BeforeInsert()
  async addRoleToUser() {
    const roleRepository = AppDataSource.getRepository(Role);
    const role = await roleRepository.findOne({ where: {id: this.role.id}, relations: {users: true} });
    if (role) {
      if(role.users === null) {
        role.users = [];
      }
      role.users.push(this);
      try {
        await roleRepository.save(role);
      } catch (error) {
        console.error("Error saving role:", error);
      }
    }
  }

  // Validate password
  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}