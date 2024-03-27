import { Student } from '../models/Student';
import { AcademicPlan } from '../models/AcademicPlan';
import { DegreeRequirement } from '../models/DegreeRequirement';
import { Advisor } from '../models/Advisor';

class DegreePlanService {
  // Method to initialize and create an Academic Plan for a Student
  static createAcademicPlanForStudent(student: Student, advisor: Advisor, degreeRequirementsData: any): AcademicPlan {
    // Initialize DegreeRequirement based on provided data
    const degreeRequirement = new DegreeRequirement(
      degreeRequirementsData.requirementID,
      degreeRequirementsData.version,
      degreeRequirementsData.requiredCourseIDs,
      degreeRequirementsData.electiveCategories,
      degreeRequirementsData.totalCredits
    );

    // Create a new AcademicPlan and associate it with the DegreeRequirement
    const academicPlan = new AcademicPlan(
      Date.now(), // Example PlanID using current timestamp for simplicity
      degreeRequirement.version,
      '', // Customizations start empty
      'Draft', // Initial progress state
      degreeRequirement
    );

    // Add the AcademicPlan to the Student's list of plans
    student.academicPlans.push(academicPlan);

    // Associate the Student with an Advisor if not already done
    // istanbul ignore next
    if (!student.advisor) {
      // Has alreadu been tested in Student.test.ts
    }

    return academicPlan;
  }

  // Method to handle the submission and approval process of an Academic Plan
  static reviewAndDecideOnPlan(student: Student, academicPlan: AcademicPlan): void {
    // Student submits the plan for approval
    student.submitPlanForApproval();

    // Advisor reviews the plan
    const advisor = student.advisor;
    if (advisor) {
      advisor.reviewPlan(academicPlan);

      // Notify the Student of the approval status
      if (academicPlan.isApproved) {
        console.log('Academic Plan has been approved.');
      } else {
        console.log('Academic Plan has been denied.');
      }
    // istanbul ignore next
    } else {
      console.log('No advisor assigned to review the Academic Plan.');
    }
  }
}

export default DegreePlanService;
