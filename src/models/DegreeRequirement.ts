// DegreeRequirement.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Student } from "./Student";
import { RequirementCourses } from "./RequirementCourses";

@Entity()
export class DegreeRequirement {
    @PrimaryGeneratedColumn()
    degreeRequirementID!: number;

    @Column()
    name: string;
    
    @Column()
    version: string;

    @Column()
    totalCredits: number;

    @OneToMany(() => Student, student => student.degreeRequirement)
    students!: Student[];

    @OneToMany(() => RequirementCourses, requirementCourses => requirementCourses.degreeRequirement)
    requirementCourses!: RequirementCourses[];

    constructor(
        name: string,
        version: string,
        totalCredits: number
    ) {
        this.name = name;
        this.version = version;
        this.totalCredits = totalCredits;
    }
}