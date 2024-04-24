import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SystemUser } from './SystemUser';
import { Student } from './Student';

@Entity()
export class Advisor extends SystemUser {
    @PrimaryGeneratedColumn()
    advisorID!: number;

    @Column()
    department: string;

    @OneToMany(() => Student, student => student.advisor)
    listOfStudents!: Student[];

    readonly role: string = 'Advisor';

    constructor(
        name: string,
        email: string,
        password: string,
        department: string
    ) {
        super(name, email, password, 'Advisor');
        this.department = department;
    }
}
