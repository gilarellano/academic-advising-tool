// Course.ts

export class Course {
    courseID: number;
    name: string;
    credits: number;
    department: string;
    category: string;

    constructor(courseID: number, name: string, credits: number, department: string, category: string) {
        this.courseID = courseID;
        this.name = name;
        this.credits = credits;
        this.department = department;
        this.category = category;
    }
}
