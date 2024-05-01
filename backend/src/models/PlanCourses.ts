import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { AcademicPlan } from './AcademicPlan';
import { Course } from './Course';

@Entity()
export class PlanCourses {
    @PrimaryGeneratedColumn()
    planCoursesID!: number;

    @ManyToOne(() => AcademicPlan, academicPlan => academicPlan.planCourses)
    @JoinColumn({ name: 'academicPlanID' })
    academicPlan: AcademicPlan;

    @ManyToOne(() => Course, course => course.planCourses)
    @JoinColumn({ name: 'courseID' })
    course: Course;

    constructor(academicPlan: AcademicPlan, course: Course) {
        this.academicPlan = academicPlan;
        this.course = course;
    }
}
