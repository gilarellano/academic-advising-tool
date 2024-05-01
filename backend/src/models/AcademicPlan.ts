// AcademicPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from './Student';
import { DegreeRequirement } from './DegreeRequirement';
import { PlanCourses } from './PlanCourses';

@Entity()
export class AcademicPlan {
    @PrimaryGeneratedColumn()
    academicPlanID!: number;

    @Column({ default: 0 })
    totalCredits: number;

    @Column({ default: false })
    isApproved: boolean;

    // Relationships
    @ManyToOne(() => Student, student => student.academicPlans)
    @JoinColumn({ name: 'studentID' })
    student: Student;

    @ManyToOne(() => DegreeRequirement)
    @JoinColumn({ name: 'degreeRequirementID' })
    degreeRequirement: DegreeRequirement;

    @OneToMany(() => PlanCourses, planCourses => planCourses.academicPlan)
    planCourses!: PlanCourses[]

    constructor(
        student: Student,
        degreeRequirement: DegreeRequirement,
        totalCredits: number = 0,
        isApproved = false,
    ) {
        this.totalCredits = totalCredits;
        this.isApproved = isApproved;
        this.student = student;
        this.degreeRequirement = degreeRequirement;
    }

}
