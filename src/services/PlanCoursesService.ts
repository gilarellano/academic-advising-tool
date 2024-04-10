// PlanCoursesService.ts

import { PlanCourses } from '../models/PlanCourses';

export class PlanCoursesService {
    private planCourses: PlanCourses[] = [];

    public addCourseToPlan(planID: number, courseID: number): PlanCourses {
        const newPlanCourse = new PlanCourses(planID, courseID);
        this.planCourses.push(newPlanCourse);
        return newPlanCourse;
    }

    public removeCourseFromPlan(planID: number, courseID: number): boolean {
        const index = this.planCourses.findIndex(pc => pc.planID === planID && pc.courseID === courseID);
        if (index !== -1) {
            this.planCourses.splice(index, 1);
            return true;
        }
        return false; // Indicate that the course was not found in the plan
    }

    public getCoursesForPlan(planID: number): number[] {
        return this.planCourses
            .filter(pc => pc.planID === planID)
            .map(pc => pc.courseID);
    }
}
