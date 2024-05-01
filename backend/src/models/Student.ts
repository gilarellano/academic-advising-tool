// Student.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SystemUser } from './SystemUser';
import { Advisor } from './Advisor';
import { DegreeRequirement } from './DegreeRequirement';
import { AcademicPlan } from './AcademicPlan';

@Entity()
export class Student extends SystemUser {
    @PrimaryGeneratedColumn()
    studentID!: number;

    @Column({ default: 0 })
    currentCredits: number;

    @ManyToOne(() => Advisor, { nullable: true })
    @JoinColumn({ name: 'advisorID' })
    advisor: Advisor | null;  // Continuing to reference Advisor entity

    @ManyToOne(() => DegreeRequirement, degreeRequirement => degreeRequirement.students, { nullable: true })
    @JoinColumn({ name: 'degreeRequirementID' })
    degreeRequirement: DegreeRequirement | null;
    
    @OneToMany(() => AcademicPlan, academicPlan => academicPlan.student)
    academicPlans!: AcademicPlan[];

    readonly role: string = 'Student';

    constructor(
        name: string,
        email: string,
        password: string,
        currentCredits: number = 0,
        advisor: Advisor | null = null,
        degreeRequirement: DegreeRequirement | null = null
    ) {
        super(name, email, password, 'Student');
        this.currentCredits = currentCredits;
        this.advisor = advisor;
        this.degreeRequirement = degreeRequirement;
    }
}
