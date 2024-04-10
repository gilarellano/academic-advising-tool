import { AcademicPlan } from '../models/AcademicPlan';
import { PlanCoursesService } from './PlanCoursesService';
import { CourseService } from './CourseService';

export class AcademicPlanService {
    private plans: AcademicPlan[] = [];
    private lastPlanID: number = 0;
    private planCoursesService: PlanCoursesService = new PlanCoursesService();
    private courseService: CourseService = new CourseService();

    constructor() {}

    // Generates a unique planID for a new AcademicPlan
    private generatePlanID(): number {
        this.lastPlanID += 1;
        return this.lastPlanID;
    }

    // Creates a new AcademicPlan with an optional degreeRequirementID
    public createPlan(degreeRequirementID?: number): AcademicPlan {
        const newPlanID = this.generatePlanID();
        const newPlan = new AcademicPlan(newPlanID, degreeRequirementID ?? -1, false);
        this.plans.push(newPlan);
        return newPlan;
    }

    // Retrieves an AcademicPlan by its planID
    public getPlanById(planID: number): AcademicPlan | undefined {
        return this.plans.find(plan => plan.planID === planID);
    }

    // Updates an existing AcademicPlan's degreeRequirementID and/or isApproved status
    public updatePlan(planID: number, degreeRequirementID?: number, isApproved?: boolean): AcademicPlan | undefined {
        const plan = this.getPlanById(planID);
        if (plan) {
            if (degreeRequirementID !== undefined) {
                plan.degreeRequirementID = degreeRequirementID;
            }
            if (isApproved !== undefined) {
                plan.isApproved = isApproved;
            }
        }
        return plan;
    }

    public deletePlan(planID: number): boolean {
        // First, remove all courses associated with this plan
        const courses = this.planCoursesService.getCoursesForPlan(planID);
        courses.forEach(courseID => {
            this.planCoursesService.removeCourseFromPlan(planID, courseID);
        });

        // Find the plan's index and remove it if found
        const planIndex = this.plans.findIndex(plan => plan.planID === planID);
        if (planIndex !== -1) {
            this.plans.splice(planIndex, 1);
            return true; // Successfully deleted
        }
        return false; // Plan not found
    }

    public async recalculateTotalCredits(planID: number): Promise<void> {
        // Find the academic plan with the given planID from the list of all plans
        const plan = this.plans.find(p => p.planID === planID);
        
        // If the plan is not found, log an error message and exit the function
        if (!plan) {
            console.error('Plan not found');
            return;
        }
    
        // Retrieve the list of course IDs associated with the plan
        const courseIDs = this.planCoursesService.getCoursesForPlan(planID);
        
        // Fetch the details for each course by its ID. This returns a promise for each course,
        // which are awaited in parallel using Promise.all. This results in an array of courses,
        // where each course could potentially be undefined if not found.
        const courses = await Promise.all(courseIDs.map(id => this.courseService.fetchCourse(id)));
    
        // Calculate the total number of credits for the plan by iterating over the array of courses.
        // The reduce function accumulates the total credits. For each course, if the course is defined
        // (i.e., not undefined), its credit value is added to the accumulator. If a course is undefined
        // (meaning it couldn't be fetched for some reason), 0 is added to the accumulator instead.
        const totalCredits = courses.reduce((acc, course) => acc + (course ? course.credits : 0), 0);
    
        // Update the total credits for the plan with the calculated value.
        plan.updateTotalCredits(totalCredits);
    }
    
}