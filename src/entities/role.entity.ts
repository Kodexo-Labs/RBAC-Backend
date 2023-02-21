import { Column, Entity, OneToMany } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('Role')
export class Role extends Model {
    @Column({
        unique: true
    })
    name: string;

    @Column('text', {array: true})
    permissions: string[];

    @Column('text', {array: true, nullable: true})
    inherits: string[];

    @OneToMany(() => User, users => users.role, {
        eager: true,
    })
    users: User[]
}
