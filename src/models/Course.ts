// Course.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import { PlanCourses } from "./PlanCourses";
import { RequirementCourses } from "./RequirementCourses";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    courseID!: number;

    @Column()
    name: string;

    @Column()
    credits: number;

    @Column()
    department: string;

    @Column()
    category: string;

    @OneToMany(() => PlanCourses, planCourses => planCourses.course)
    planCourses!: PlanCourses[];

    @OneToMany(() => RequirementCourses, requirementCourses => requirementCourses.course)
    requirementCourses!: RequirementCourses[];

    constructor(name: string, credits: number, department: string, category: string) {
        this.name = name;
        this.credits = credits;
        this.department = department;
        this.category = category;
    }
}
