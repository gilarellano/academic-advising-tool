// RequirementCourses.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Course } from './Course';
import { DegreeRequirement } from './DegreeRequirement';

@Entity()
export class RequirementCourses {
    @PrimaryGeneratedColumn()
    requirementCoursesID!: number; // A unique identifier for each RequirementCourses record

    @ManyToOne(() => DegreeRequirement, degreeRequirement => degreeRequirement.requirementCourses)
    @JoinColumn({ name: 'requirementID' })
    degreeRequirement: DegreeRequirement;

    @ManyToOne(() => Course, course => course.requirementCourses)
    @JoinColumn({ name: 'courseID' })
    course: Course;

    @Column()
    isElective: boolean; // Additional field to store whether the course is an elective

    constructor(
        degreeRequirement: DegreeRequirement,
        course: Course,
        isElective: boolean
    ) {
        this.degreeRequirement = degreeRequirement;
        this.course = course;
        this.isElective = isElective;
    }
}
